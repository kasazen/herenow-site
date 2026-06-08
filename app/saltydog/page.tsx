import { topN } from "./_lib/leaderboard";

export const revalidate = 60; // ISR: leaderboard rerenders at most once a minute

export default async function SaltydogLanding() {
  const botUsername = process.env.TELEGRAM_BOT_USERNAME || "saltydogbot";
  let crew: Awaited<ReturnType<typeof topN>> = [];
  try {
    crew = await topN(10);
  } catch (err) {
    console.error("saltydog landing: leaderboard query failed", err);
  }

  return (
    <div className="saltydog-wrap">
      <svg className="saltydog-flag" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="2" y="6" width="60" height="44" fill="#1a1208" stroke="#000" strokeWidth="1.5" />
        <circle cx="32" cy="24" r="8" fill="#f5ecd7" />
        <ellipse cx="28" cy="23" rx="1.5" ry="2" fill="#1a1208" />
        <ellipse cx="36" cy="23" rx="1.5" ry="2" fill="#1a1208" />
        <path d="M28 28 Q32 30 36 28" stroke="#1a1208" strokeWidth="1.2" fill="none" />
        <path
          d="M20 40 L44 40 M22 38 L42 42 M22 42 L42 38"
          stroke="#f5ecd7"
          strokeWidth="1.8"
          fill="none"
        />
        <path d="M2 6 L2 58 L6 56 L4 50 Z" fill="#5d1414" />
      </svg>

      <h1>The Salty Dog</h1>
      <p className="saltydog-tagline">The captain hunts jobs for ye. Ye drink coffee.</p>

      <div className="saltydog-pitch">
        <p>
          <b>One scroll a mornin&rsquo;.</b> A pirate captain in yer Telegram hunts
          new openings across the seas overnight and hands ye the top eight by
          7 AM, scored against yer manifest.
        </p>
        <p>
          <b>14 days free.</b> Then $4.99 a month, or earn yer keep with{" "}
          <span className="saltydog-doubloon">doubloons</span> (200 = one month
          free) by recruitin&rsquo; crew.
        </p>
        <p>
          <b>No fluff, no spam, no LinkedIn.</b> Cut sail whenever the winds
          change.
        </p>
      </div>

      <form className="saltydog-cta" action="/saltydog/checkout" method="get">
        <input type="hidden" name="plan" value="monthly" />
        <button type="submit">Sign the Articles &nbsp;&rarr;</button>
      </form>

      <p className="saltydog-secondary">
        Already aboard?{" "}
        <a href={`https://t.me/${botUsername}`}>Open the captain&rsquo;s quarters &rarr;</a>
      </p>

      <h2>Top Crew on the Seas</h2>
      <p className="saltydog-leader-note">Doubloons earned this voyage</p>
      <div className="saltydog-scroll">
        {crew.length > 0 ? (
          crew.map((c, i) => (
            <div key={`${i}-${c.display_name}`} className="saltydog-row">
              <span className="saltydog-rank">#{i + 1}</span>
              <span className="saltydog-name">{c.display_name}</span>
              <span className="saltydog-balance">
                <span className="saltydog-doubloon">&#9863;</span>{" "}
                {c.balance.toLocaleString("en-US")}
              </span>
            </div>
          ))
        ) : (
          <p className="saltydog-empty">
            No crew on the board yet. First to recruit fills the scroll.
          </p>
        )}
      </div>

      <div className="saltydog-footer">
        <p>
          The Salty Dog is a HereNow Labs ship.{" "}
          <a href={`https://t.me/${botUsername}`}>@{botUsername}</a>
        </p>
      </div>
    </div>
  );
}
