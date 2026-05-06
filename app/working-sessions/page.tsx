import type { Metadata } from "next";
import Link from "next/link";
import HeroImage from "../_components/HeroImage";
import Tabs from "../_components/Tabs";
import styles from "./page.module.css";
import workingSessionsHero from "../../public/images/hero/working-sessions.jpg";

export const metadata: Metadata = {
  title: "Working sessions",
  description:
    "Every session in a Here Now Labs engagement, what is in the room, what you walk out with, and where AI is doing the work.",
};

type Session = {
  number: string;
  title: string;
  inTheRoom: { label: string; value: string }[];
  walkOutWith: string;
  aiRole: string;
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
      "A direct answer on whether we are the right people for what you are looking for.",
    aiRole:
      "Before the call, AI parses your public site and flags two or three patterns we want to ask about. Saves you the recap.",
    body: [
      "A working conversation. Not a pitch. We tell you, plainly, whether we’re a fit. About a third end without a next step — still useful.",
    ],
  },
  {
    number: "ii",
    title: "Executive alignment",
    inTheRoom: [
      { label: "Who", value: "You, one or two senior leaders, both partners" },
      { label: "Length", value: "Two hours" },
      { label: "Format", value: "In person where possible · printed agenda" },
      { label: "When", value: "Day 1, after NDA" },
    ],
    walkOutWith:
      "A signed success criterion. The single page the Action Plan will be measured against.",
    aiRole:
      "AI does not run this session. The criterion gets written by humans, in a room, by lunch. AI takes over the next morning.",
    body: [
      "The most important two hours of the engagement. Where the margin lives, where growth is waiting, what’s annoying, what success looks like in ten days. We leave with three things on paper: the access we need, the calls we’ll need, and the success criterion you sign off on.",
    ],
  },
  {
    number: "iii",
    title: "Mid-discovery check-in",
    inTheRoom: [
      { label: "Who", value: "You, one of our partners" },
      { label: "Length", value: "Forty-five minutes" },
      { label: "Format", value: "Video call · informal" },
      { label: "When", value: "Day 5–6" },
    ],
    walkOutWith:
      "A flagged-findings list. No surprises in the final Action Plan.",
    aiRole:
      "By day 5, AI has parsed the corpus and surfaced ~40 anomalies. We weigh them with you and re-route the second half of discovery.",
    body: [
      "Halfway through, we sit with you. We share what’s surfacing; you tell us what to pull on harder. The check-in often re-routes the second half. Anything that should be acted on this week gets raised here.",
    ],
  },
  {
    number: "iv",
    title: "Action Plan handoff",
    inTheRoom: [
      { label: "Who", value: "You, one of our partners" },
      { label: "Length", value: "Email + a short scan" },
      { label: "Format", value: "PDF + printed copies sent in advance" },
      { label: "When", value: "Day 9, morning of the walkthrough" },
    ],
    walkOutWith:
      "The AI Action Plan. Five sections, eight to ten pages, every recommendation tied to a dollar figure.",
    aiRole:
      "AI parsed nine days of ingestion into the document you are now holding. The voice, the ranking, and the questions are ours.",
    body: [
      "PDF + printed copies, sent the morning of the walkthrough. Most clients spend that hour with a pen. A de-identified sample lives on the AI Action Plan page.",
    ],
  },
  {
    number: "v",
    title: "The walkthrough",
    inTheRoom: [
      { label: "Who", value: "Executive team, both partners" },
      { label: "Length", value: "Ninety minutes" },
      { label: "Format", value: "In person · printed Plan on the table" },
      { label: "When", value: "Day 9 or 10, end of the engagement" },
    ],
    walkOutWith:
      "Every finding walked, every question answered, and a clear next step.",
    aiRole:
      "AI is not in the room. The walkthrough is human pushback against human judgment, on paper. Every line gets defended or struck.",
    body: [
      "We walk every finding with the executive team. Questions land in the room. The room runs on whoever has the sharpest pushback. By the end every recommendation has been agreed, sharpened, or struck. From there, the work either stops or compounds.",
    ],
  },
  {
    number: "vi",
    title: "Quarterly AI working group",
    inTheRoom: [
      { label: "Who", value: "Executive team, both partners" },
      { label: "Length", value: "Two hours" },
      { label: "Format", value: "In person or video · printed agenda" },
      { label: "When", value: "Quarterly · ongoing under retainer" },
    ],
    walkOutWith:
      "A reviewed pipeline of AI tools — what to build next, what to retire, what to revisit at the next quarterly.",
    aiRole:
      "AI is the subject of the meeting. We review what shipped, what it is producing, and what is on the bench. The judgment about what to build next is the work.",
    body: [
      "Two partners with the executive team for two hours, every quarter. We review what shipped, what’s producing, what should be retired. Output: a short list of next builds, each scoped to a dollar target.",
    ],
  },
];

export default function WorkingSessionsPage() {
  return (
    <article className={`article ${styles.page}`}>
      <header className={styles.header}>
        <p className="eyebrow">Working sessions</p>
        <h1 className={styles.title}>
          What every session <em>actually</em> looks like.
        </h1>
        <p className="lead" style={{ marginTop: "1rem" }}>
          Who is in the room. How long. What you walk out with. Where AI is doing the work — and where it is not.
        </p>
        <HeroImage
          src={workingSessionsHero}
          alt=""
          className={styles.heroImage}
        />
      </header>

      <hr />

      <Tabs
        ariaLabel="Working session details"
        tabs={SESSIONS.map((s) => ({
          id: s.number,
          label: `${s.number}. ${s.title}`,
          caption: s.inTheRoom.find((r) => r.label === "Length")?.value ?? "",
          panel: (
            <div className={styles.session}>
              <div className={styles.sessionBody}>
                <div className={styles.sessionProse}>
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  <div className={styles.aiBlock} aria-label="Where AI does the work">
                    <span className={styles.aiLabel}>What AI does here</span>
                    <p>{s.aiRole}</p>
                  </div>
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
            </div>
          ),
        }))}
      />

      <hr />

      <section className={styles.cta}>
        <h2>The first session is the intro call.</h2>
        <p>Thirty minutes. No fee. No deck.</p>
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
