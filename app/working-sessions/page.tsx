import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Working sessions",
  description:
    "What a working session with Here Now Labs actually looks like — who is in the room, how long, what is on the table, and what you walk out with each time.",
};

type Session = {
  number: string;
  title: string;
  inTheRoom: { label: string; value: string }[];
  walkOutWith: string;
  body: string[];
};

const SESSIONS: Session[] = [
  {
    number: "i",
    title: "The intro call",
    inTheRoom: [
      { label: "Who", value: "You and one of our partners" },
      { label: "Length", value: "Thirty minutes" },
      { label: "Format", value: "Video call · no deck" },
      { label: "Cost", value: "No fee" },
    ],
    walkOutWith:
      "A direct answer to whether we are the right people for what you are looking for, and the rough shape of an engagement if we are.",
    body: [
      "The intro call is a working conversation, not a pitch. We use the time to understand the operation as you see it, what is on your mind, and what you have already tried. We tell you, plainly, what we would and would not do for a company like yours and what comparable engagements have produced.",
      "If the fit is wrong we will say so and where possible suggest a sharper place to look. About a third of intro calls end this way and are still useful — the introductions we make tend to land.",
    ],
  },
  {
    number: "ii",
    title: "Executive alignment",
    inTheRoom: [
      { label: "Who", value: "You, one or two senior leaders, both of our partners" },
      { label: "Length", value: "Two hours" },
      { label: "Format", value: "In person where possible · printed agenda" },
      { label: "When", value: "Day 1 of the engagement, after NDA and engagement letter" },
    ],
    walkOutWith:
      "A signed success criterion document — the single page we will measure the memo against when we deliver it. Plus the list of source materials and the two or three short calls we will need.",
    body: [
      "The alignment session is the most important two hours of the engagement. It is not a kickoff deck. It is a structured conversation about the operation as you see it: where the margin lives, what is annoying, what would matter if it changed, what you have already tried, and what success would look like ten business days from now.",
      "We come in with a printed agenda and leave with three things written down: the access we need, the people we will need a single short call with, and the success criterion you sign off on. The success criterion is the part that makes the rest of the engagement honest. If the memo does not address what we agreed to here, the engagement has not done its job.",
    ],
  },
  {
    number: "iii",
    title: "Mid-discovery check-in",
    inTheRoom: [
      { label: "Who", value: "You, one of our partners" },
      { label: "Length", value: "Forty-five minutes" },
      { label: "Format", value: "Video call · informal" },
      { label: "When", value: "Around day 5–6, midway through the read" },
    ],
    walkOutWith:
      "A flagged-findings list — what we are seeing so far, what we are still digging on, and any access we still need. No surprises in the final memo.",
    body: [
      "Halfway through the reading we sit with you for a short check-in. The purpose is calibration: we share what is starting to surface, and you tell us which threads are worth pulling on harder and which are already known and being addressed. The check-in often re-routes the second half of the discovery in useful ways.",
      "This is also when small, fast-moving issues get raised early. If we see something that ought to be acted on this week rather than waiting for the memo, we say so here.",
    ],
  },
  {
    number: "iv",
    title: "Memo handoff",
    inTheRoom: [
      { label: "Who", value: "You, one of our partners" },
      { label: "Length", value: "Email + a short read" },
      { label: "Format", value: "PDF + printed copies sent in advance" },
      { label: "When", value: "Day 9, the morning of the walkthrough" },
    ],
    walkOutWith:
      "The strategic memo. Five sections, eight to ten pages, every recommendation tied to a dollar figure. Yours to read once before we sit down to walk it.",
    body: [
      "The memo arrives as a PDF and as printed copies — three is typical, more on request. We send it early on the day of the walkthrough so you have an hour or two with it on your own before we sit down. Most clients spend that hour with a pen.",
      "A fully de-identified sample of how this memo reads is on the sample-memo page. If it does not look like something you would actually use inside the executive team, the engagement has failed at the most important step.",
    ],
  },
  {
    number: "v",
    title: "The live walkthrough",
    inTheRoom: [
      { label: "Who", value: "Executive team, both of our partners" },
      { label: "Length", value: "Ninety minutes" },
      { label: "Format", value: "In person · printed memo on the table" },
      { label: "When", value: "Day 9 or day 10, end of the engagement" },
    ],
    walkOutWith:
      "Every finding walked, every question answered, and a clear next step — either the engagement closes, or we scope a continuation (advisory retainer or a custom build) separately.",
    body: [
      "We sit with the executive team and walk every finding. Questions land in the room, not in a follow-up thread. The room runs on whoever has the sharpest pushback; we do not defend the memo, we explain it. By the end of ninety minutes, every recommendation has either been agreed with, sharpened, or struck.",
      "From there the work either stops or continues. The natural continuations are an advisory retainer (we stay close, we do not run the work) or a custom build (we ship the AI tool the memo identified). Either is scoped and priced separately, after the walkthrough, with no commitment.",
    ],
  },
];

export default function WorkingSessionsPage() {
  return (
    <article className={`article ${styles.page}`}>
      <header className={styles.header}>
        <p className="eyebrow">Working sessions</p>
        <h1 className={styles.title}>
          What a working session actually looks like.
        </h1>
        <p className="lead" style={{ marginTop: "1rem" }}>
          Most consulting engagements run on meetings that don&rsquo;t describe themselves: nobody tells you who&rsquo;s in the room, how long it&rsquo;s going to be, what to bring, or what you&rsquo;ll walk out holding. We treat each session as an artifact in its own right. Below: every working session in a standard engagement, what it costs you in time, and what you take away from it.
        </p>
      </header>

      <hr />

      <ol className={styles.sessions}>
        {SESSIONS.map((s) => (
          <li key={s.number} className={styles.session}>
            <header className={styles.sessionHeader}>
              <span className={styles.sessionNum}>
                <em>{s.number}.</em>
              </span>
              <h2>{s.title}</h2>
            </header>

            <div className={styles.sessionBody}>
              <div className={styles.sessionProse}>
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <aside className={styles.sessionAside}>
                <div className={styles.asideBlock}>
                  <h3 className={styles.asideHead}>In the room</h3>
                  <dl className={styles.asideList}>
                    {s.inTheRoom.map((row) => (
                      <div key={row.label}>
                        <dt>{row.label}</dt>
                        <dd>{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className={styles.asideBlock}>
                  <h3 className={styles.asideHead}>Walk out with</h3>
                  <p className={styles.asideOutcome}>{s.walkOutWith}</p>
                </div>
              </aside>
            </div>
          </li>
        ))}
      </ol>

      <hr />

      <section className={styles.cta}>
        <h2>The first session is the intro call.</h2>
        <p>
          Thirty minutes, no fee, no deck. The fastest way to find out whether the rest of these are sessions you want on the calendar.
        </p>
        <div className={styles.ctaRow}>
          <a href="https://cal.com/herenowlabs/intro" className="btn">
            Book the intro call
          </a>
          <Link href="/contact" className="btn btn--ghost">
            Or write first
          </Link>
        </div>
      </section>
    </article>
  );
}
