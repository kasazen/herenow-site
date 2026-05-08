import type { Metadata } from "next";
import Link from "next/link";
import HowWeWorkDiagram from "../_components/HowWeWorkDiagram";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "How we work",
  description:
    "Inside the work. AI handles the volume. We bring the judgment. The Analysis is what comes out the other side.",
};

const TIERS = [
  {
    name: "Starter",
    body: "A single high-impact automation. The obvious play, scoped tightly. Fast to ship; immediate return.",
  },
  {
    name: "Builder",
    body: "Multi-system work across departments. Foundational AI infrastructure. Value compounds outward as more of the operation runs through it.",
  },
  {
    name: "Compound",
    body: "Autonomous AI agents operating continuously. Iterating on their own work. The operation runs differently than it did before.",
  },
];

export default function HowWeWorkPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className="eyebrow">How we work</p>
          <h1 className={styles.heroTitle}>
            Inside <em>the work</em>.
          </h1>
          <p className={styles.heroLead}>
            AI handles the volume. We bring the judgment. The Analysis is what comes out the other side.
          </p>
        </div>
      </section>

      <section className={styles.diagram}>
        <div className="container">
          <HowWeWorkDiagram />
        </div>
      </section>

      <section className={`section section--alt rule-top ${styles.method}`}>
        <div className={`container ${styles.methodInner}`}>
          <p className="eyebrow">How the work runs</p>
          <h2 className={styles.methodTitle}>
            We start in the room. <em>Then in the data.</em>
          </h2>
          <div className={styles.methodProse}>
            <p>
              A short series of stakeholder conversations to understand the operation, the questions worth asking, and the judgment calls already in flight. Then access &mdash; operational, financial, strategic. AI parses everything: contracts, dispatch logs, vendor agreements, the chats and documents nobody has time to read.
            </p>
            <p>
              Senior partners weigh what matters. Patterns turn into recommendations. Recommendations turn into a decision document the executive team can act on. That document is The Analysis.
            </p>
          </div>
        </div>
      </section>

      <section className={`section rule-top ${styles.analysis}`}>
        <div className={`container ${styles.analysisInner}`}>
          <p className="eyebrow">The Analysis</p>
          <h2 className={styles.analysisTitle}>
            What you walk away with.
          </h2>
          <div className={styles.methodProse}>
            <p>
              A working document. Findings ranked by impact. Recommendations scoped to what&rsquo;s possible &mdash; and what&rsquo;s worth doing first. Each one tied back to where in the operation it lands and what it changes.
            </p>
            <p>
              The page senior teams take into the room and act on. Not the deck that gets filed and forgotten.
            </p>
          </div>
        </div>
      </section>

      <section className={`section section--alt rule-top ${styles.tiers}`}>
        <div className="container">
          <p className="eyebrow">Three ranges of scope</p>
          <p className={styles.tiersLead}>
            Three shapes the work takes after The Analysis. A company runs whichever fits &mdash; in any order, more than one in parallel.
          </p>
          <ul className={styles.tiersList}>
            {TIERS.map((t) => (
              <li key={t.name} className={styles.tierCard}>
                <h3 className={styles.tierName}>{t.name}.</h3>
                <p className={styles.tierBody}>{t.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`section section--paper rule-top ${styles.cta}`}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Start with a conversation.</h2>
          <p className={styles.ctaSub}>
            No deck. No fee. We&rsquo;ll know quickly if there&rsquo;s a fit.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/contact" className="btn">
              Book the intro
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
