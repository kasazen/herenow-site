import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { sql } from "../../_lib/db";
import { stripe } from "../../_lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Mirror of the original saltydog/api/web.py logic. The handler verifies the
// Stripe signature, dispatches the event to a small per-type function, and
// writes both a users-row update and an events-row append (idempotent via
// stripe_event:<event_id>, enforced by the partial unique index on
// events.idempotency_key).

const HANDLED = new Set<string>([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
]);

type UserRow = { id: number; state: string };

async function findUser(obj: {
  metadata?: Stripe.Metadata | null;
  customer?: string | Stripe.Customer | Stripe.DeletedCustomer | null;
}): Promise<UserRow | null> {
  const db = sql();
  const metaId = obj.metadata?.saltydog_user_id;
  if (metaId && /^\d+$/.test(metaId)) {
    const id = Number(metaId);
    const rows = (await db`
      select id::int as id, state from users where id = ${id} limit 1
    `) as unknown as UserRow[];
    if (rows.length > 0) return rows[0];
  }
  const customerId =
    typeof obj.customer === "string" ? obj.customer : obj.customer?.id || null;
  if (customerId) {
    const rows = (await db`
      select id::int as id, state from users where stripe_customer_id = ${customerId} limit 1
    `) as unknown as UserRow[];
    if (rows.length > 0) return rows[0];
  }
  return null;
}

async function appendEvent(args: {
  userId: number;
  eventType: string;
  payload: Record<string, unknown>;
  idempotencyKey: string;
}): Promise<void> {
  const db = sql();
  await db`
    insert into events (user_id, event_type, payload, idempotency_key)
    values (
      ${args.userId},
      ${args.eventType},
      ${db.json(args.payload as never)},
      ${args.idempotencyKey}
    )
    on conflict (idempotency_key) do nothing
  `;
}

function statusToState(status: string | null | undefined, current: string): string {
  if (status === "trialing") return "trial";
  if (status === "active") return "active";
  if (status === "past_due" || status === "unpaid") return "payment_grace";
  if (status === "canceled" || status === "incomplete_expired") return "cancelled";
  return current;
}

function subscriptionPeriodEnd(sub: Stripe.Subscription): Date | null {
  // Stripe moved current_period_end onto subscription items per-line; for a
  // single-item subscription (our case) read it from items.data[0].
  const ts = sub.items?.data?.[0]?.current_period_end;
  return ts ? new Date(ts * 1000) : null;
}

async function onCheckoutCompleted(
  eventId: string,
  obj: Stripe.Checkout.Session,
): Promise<void> {
  const customer = typeof obj.customer === "string"
    ? obj.customer
    : obj.customer?.id || null;
  const subscription = typeof obj.subscription === "string"
    ? obj.subscription
    : obj.subscription?.id || null;
  if (!customer) return;

  const user = await findUser({ metadata: obj.metadata, customer });
  if (!user) {
    console.info(
      `stripe checkout.session.completed for unbound customer ${customer}; ` +
      `waiting for Telegram deep-link claim`,
    );
    return;
  }

  const db = sql();
  await db`
    update users set
      stripe_customer_id = ${customer},
      stripe_subscription_id = ${subscription},
      subscription_provider = 'stripe'
    where id = ${user.id}
  `;
  await appendEvent({
    userId: user.id,
    eventType: "payment_succeeded",
    payload: { provider: "stripe", customer_id: customer, subscription_id: subscription },
    idempotencyKey: `stripe_event:${eventId}`,
  });
}

async function onSubscriptionUpsert(
  eventId: string,
  obj: Stripe.Subscription,
): Promise<void> {
  const customer = typeof obj.customer === "string" ? obj.customer : obj.customer.id;
  const subId = obj.id;
  const status = obj.status;
  const periodEnd = subscriptionPeriodEnd(obj);

  const user = await findUser({ metadata: obj.metadata, customer });
  if (!user) return;

  const newState = statusToState(status, user.state);
  const db = sql();
  await db`
    update users set
      stripe_subscription_id = ${subId},
      subscription_status = ${status},
      subscription_provider = 'stripe',
      state = ${newState},
      trial_ends_at = ${periodEnd}
    where id = ${user.id}
  `;
  await appendEvent({
    userId: user.id,
    eventType: "subscription_activated",
    payload: {
      provider: "stripe",
      status,
      subscription_id: subId,
      current_period_end: periodEnd ? periodEnd.toISOString() : null,
    },
    idempotencyKey: `stripe_event:${eventId}`,
  });
}

async function onSubscriptionDeleted(
  eventId: string,
  obj: Stripe.Subscription,
): Promise<void> {
  const customer = typeof obj.customer === "string" ? obj.customer : obj.customer.id;
  const user = await findUser({ metadata: obj.metadata, customer });
  if (!user) return;
  const db = sql();
  await db`
    update users set state = 'cancelled', subscription_status = 'canceled'
    where id = ${user.id}
  `;
  await appendEvent({
    userId: user.id,
    eventType: "subscription_cancelled",
    payload: { provider: "stripe" },
    idempotencyKey: `stripe_event:${eventId}`,
  });
}

async function onInvoicePaid(
  eventId: string,
  obj: Stripe.Invoice,
): Promise<void> {
  const customer = typeof obj.customer === "string"
    ? obj.customer
    : obj.customer?.id || null;
  if (!customer) return;
  const user = await findUser({ customer });
  if (!user) return;

  const periodEndTs = obj.lines?.data?.[0]?.period?.end || null;
  const newEnd = periodEndTs
    ? new Date(periodEndTs * 1000)
    : new Date(Date.now() + 30 * 24 * 3600 * 1000);

  const db = sql();
  await db`
    update users set
      state = 'active',
      subscription_status = 'active',
      trial_ends_at = ${newEnd}
    where id = ${user.id}
  `;
  await appendEvent({
    userId: user.id,
    eventType: "subscription_renewed",
    payload: {
      provider: "stripe",
      amount_paid: obj.amount_paid,
      currency: obj.currency,
      subscription_expires_at: newEnd.toISOString(),
    },
    idempotencyKey: `stripe_event:${eventId}`,
  });
}

async function onInvoiceFailed(
  eventId: string,
  obj: Stripe.Invoice,
): Promise<void> {
  const customer = typeof obj.customer === "string"
    ? obj.customer
    : obj.customer?.id || null;
  if (!customer) return;
  const user = await findUser({ customer });
  if (!user) return;
  await appendEvent({
    userId: user.id,
    eventType: "payment_failed",
    payload: { provider: "stripe", attempt: obj.attempt_count },
    idempotencyKey: `stripe_event:${eventId}`,
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const raw = await request.text();
  const sig = request.headers.get("stripe-signature") || "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("stripe webhook: STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ received: false }, { status: 503 });
  }

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.warn("stripe webhook: bad signature", err);
    return NextResponse.json({ received: false }, { status: 400 });
  }

  if (!HANDLED.has(event.type)) {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await onCheckoutCompleted(event.id, event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await onSubscriptionUpsert(event.id, event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await onSubscriptionDeleted(event.id, event.data.object as Stripe.Subscription);
        break;
      case "invoice.paid":
        await onInvoicePaid(event.id, event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await onInvoiceFailed(event.id, event.data.object as Stripe.Invoice);
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`stripe webhook: handler error for ${event.type}`, err);
    // 500 so Stripe retries; idempotency key prevents double-processing.
    return NextResponse.json({ received: false }, { status: 500 });
  }
}
