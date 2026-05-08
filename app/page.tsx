import Link from "next/link";
import HomeInsight from "./_components/HomeInsight";
import styles from "./page.module.css";

const ANXIETIES = [
  "Our CFO suspects margin is leaking. We can’t prove it.",
  "Every AI demo is impressive. Nobody tells us where to start.",
  "We automated the proposal. What else?",
  "Ten years of data. No idea how to use it.",
];

const TIERS = [
  {
    name: "Starter",
    body: "A single high-impact automation. Fast to ship; immediate return.",
  },
  {
    name: "Builder",
    body: "Multi-system work. Cross-functional. Value compounds across departments.",
  },
  {
    name: "Compound",
    body: "Autonomous AI agents. Operating continuously across the operation.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className="eyebrow">AI inside your operation</p>
          <h1 className={styles.heroTitle}>
            <em>Action,</em> not discussion.
          </h1>
          <p className={styles.heroLead}>
            We use AI to find what&rsquo;s possible inside an established operation &mdash; then build it.
          </p>
        </div>
      </section>

      <section className={styles.insight}>
        <div className="container">
          <HomeInsight />
        </div>
      </section>

      <section className={`section section--alt rule-top ${styles.heard}`}>
        <div className="container">
          <p className="eyebrow">What we hear in the room</p>
          <ul className={styles.heardList}>
            {ANXIETIES.map((q, i) => (
              <li key={i} className={styles.heardItem}>
                <span aria-hidden="true" className={styles.heardMark}>&mdash;</span>
                <p>{q}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`section rule-top ${styles.tiers}`}>
        <div className="container">
          <p className="eyebrow">Three ranges of scope</p>
          <p className={styles.tiersLead}>
            A company runs whichever fits &mdash; in any order, more than one at once.
          </p>
          <ul className={styles.tiersList}>
            {TIERS.map((t) => (
              <li key={t.name} className={styles.tierCard}>
                <h2 className={styles.tierName}>{t.name}.</h2>
                <p className={styles.tierBody}>{t.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`section section--paper rule-top ${styles.cta}`}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Start with a conversation.</h2>
          <p className={styles.ctaSub}>No deck. No fee.</p>
          <div className={styles.ctaButtons}>
            <Link href="/contact" className="btn">
              Book the intro
            </Link>
            <Link href="/how-we-work" className="btn btn--ghost">
              How we work
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
