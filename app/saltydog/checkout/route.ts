import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../_lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Accept both GET (from the landing-page form and from the bot's URL button)
// and POST (in case someone wires a POST flow later). The handler is the
// same either way: create a Checkout Session with a 14-day trial and 303
// redirect to the Stripe-hosted checkout URL.
async function createAndRedirect(request: NextRequest): Promise<NextResponse> {
  const url = request.nextUrl;
  const planRaw = url.searchParams.get("plan") || "monthly";
  const refRaw = url.searchParams.get("ref");

  const plan = planRaw === "annual" ? "annual" : "monthly";
  const priceId =
    plan === "annual"
      ? process.env.STRIPE_PRICE_ANNUAL
      : process.env.STRIPE_PRICE_MONTHLY;
  if (!priceId) {
    return new NextResponse(
      `STRIPE_PRICE_${plan.toUpperCase()} is not configured`,
      { status: 503 },
    );
  }

  const origin = url.origin;
  const successUrl = `${origin}/saltydog/welcome?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/saltydog`;

  const metadata: Record<string, string> = { plan };
  if (refRaw && /^\d+$/.test(refRaw)) {
    metadata.saltydog_user_id = refRaw;
  }

  try {
    const session = await stripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
        metadata,
      },
      metadata,
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });
    if (!session.url) {
      return new NextResponse("Stripe returned no checkout URL", { status: 500 });
    }
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error("checkout: Stripe session create failed", err);
    return new NextResponse("Checkout is temporarily unavailable", { status: 503 });
  }
}

export async function GET(request: NextRequest) {
  return createAndRedirect(request);
}

export async function POST(request: NextRequest) {
  return createAndRedirect(request);
}
