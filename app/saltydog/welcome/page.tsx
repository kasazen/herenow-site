import { stripe } from "../_lib/stripe";

type Search = { [k: string]: string | string[] | undefined };

export const dynamic = "force-dynamic";

export default async function SaltydogWelcome({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const raw = params.session_id;
  const sessionId = Array.isArray(raw) ? raw[0] : raw;
  const botUsername = process.env.TELEGRAM_BOT_USERNAME || "saltydogbot";

  let deepLink: string | null = null;
  let error: string | null = null;

  if (!sessionId) {
    error = "Missing session_id";
  } else {
    try {
      const session = await stripe().checkout.sessions.retrieve(sessionId);
      const customer = typeof session.customer === "string"
        ? session.customer
        : session.customer?.id || null;
      if (!customer) {
        error = "Session has no customer yet";
      } else {
        deepLink = `https://t.me/${botUsername}?start=stripe_${customer}`;
      }
    } catch (err) {
      console.error("welcome: session lookup failed", err);
      error = "Could not retrieve session";
    }
  }

  return (
    <div className="saltydog-welcome">
      {error ? (
        <>
          <h1>Hmm.</h1>
          <p>{error}.</p>
          <p>
            If ye paid and never made it back, ping{" "}
            <a href="mailto:team@herenowlabs.xyz">team@herenowlabs.xyz</a> and
            the captain will sort ye out.
          </p>
        </>
      ) : (
        <>
          <h1>Aboard, shipmate.</h1>
          <p>Yer 14 days free begin the moment ye step into the captain&rsquo;s quarters.</p>
          <p>Tap below to meet the captain in Telegram and sign the manifest.</p>
          <a className="saltydog-next" href={deepLink!}>
            Open Telegram &nbsp;&rarr;
          </a>
          <p className="saltydog-hint">
            If the button does not open, search <b>@{botUsername}</b> in
            Telegram and tap /start.
          </p>
        </>
      )}
    </div>
  );
}
