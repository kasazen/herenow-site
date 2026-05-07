import type { Metadata } from "next";
import Link from "next/link";
import MethodologyGrid from "./MethodologyGrid";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "AI Action Plan",
  description:
    "What an AI Action Plan is, what it surfaces, and how we make one. The actual deliverable goes to one executive team. To see what one would say about your operation, try a Lite version or book a thirty-minute intro.",
};

const SECTIONS = [
  {
    n: "i",
    title: "Where the margin actually lives",
    desc: "The bet. One falsifiable hypothesis about your operation.",
  },
  {
    n: "ii",
    title: "Where the margin's been waiting",
    desc: "Specific cost recovery. Ranked, named, dollar-tagged.",
  },
  {
    n: "iii",
    title: "Where growth is waiting",
    desc: "Revenue lanes we'd pursue first. Each tied to the operation.",
  },
  {
    n: "iv",
    title: "What to build first",
    desc: "Software, agents, workflow changes — scoped, priced, ranked.",
  },
  {
    n: "v",
    title: "Two questions for next quarter",
    desc: "The kind a board member would ask. We propose ours.",
  },
];

const PATTERNS = [
  {
    figure: "$1.4M – $1.8M",
    label: "Recovered from frozen escalator clauses",
    tag: "Mid-market services",
  },
  {
    figure: "$520K – $740K",
    label: "From parts-purchasing consolidation",
    tag: "Multi-distributor operations",
  },
  {
    figure: "+8–12%",
    label: "Revenue lift from AI-drafted proposals",
    tag: "Estimator-led businesses",
  },
  {
    figure: "58% → 81%",
    label: "Field-labor utilization, small jobs",
    tag: "Dispatch + parts staging",
  },
  {
    figure: "93 in 90 min",
    label: "Contracts reviewed by an autonomous agent",
    tag: "vs. three weeks by hand",
  },
  {
    figure: "~14 hrs/wk",
    label: "Senior-estimator time recovered",
    tag: "Per role, per week",
  },
];

export default function AIActionPlanPage() {
  return (
    <article className={`article ${styles.page}`}>
      <header className={styles.header}>
        <p className="eyebrow">The deliverable</p>
        <h1 className={styles.title}>The AI Action Plan.</h1>
        <p className={styles.lead}>
          Five sections. Read in one sitting. Every line tied to a dollar.
        </p>
      </header>

      <hr />

      <section className={styles.sectionsBlock}>
        <p className="eyebrow">What&rsquo;s in it</p>
        <h2 className={styles.h2}>Five sections, every engagement.</h2>
        <ol className={styles.sections}>
          {SECTIONS.map((s) => (
            <li key={s.n} className={styles.section}>
              <span className={styles.sectionNum}>
                <em>{s.n}.</em>
              </span>
              <div>
                <h3 className={styles.sectionTitle}>{s.title}</h3>
                <p className={styles.sectionDesc}>{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <hr />

      <section className={styles.patternsBlock}>
        <p className="eyebrow">Patterns we look for</p>
        <h2 className={styles.h2}>What an Action Plan typically surfaces.</h2>
        <p className={styles.patternsLead}>
          Pattern ranges from comparable mid-market engagements. Specifics depend on the diagnostic.
        </p>
        <ul className={styles.patterns}>
          {PATTERNS.map((p) => (
            <li key={p.label} className={styles.pattern}>
              <p className={styles.patternFigure}>{p.figure}</p>
              <p className={styles.patternLabel}>{p.label}</p>
              <p className={styles.patternTag}>{p.tag}</p>
            </li>
          ))}
        </ul>
      </section>

      <hr />

      <section className={styles.methodologyBlock}>
        <p className="eyebrow">Methodology</p>
        <h2 className={styles.h2}>What we read in ten days.</h2>
        <div className={styles.methodologyChart}>
          <MethodologyGrid />
        </div>
      </section>

      <hr />

      <section className={styles.cta}>
        <p className="eyebrow">See one for your operation</p>
        <h2 className={styles.h2}>The actual deliverable goes to one executive team.</h2>
        <p className={styles.ctaBody}>
          To see what an Action Plan would say about your business — generate a Lite version from your URL, or book a thirty-minute intro.
        </p>
        <div className={styles.ctaRow}>
          <a href="https://cal.com/herenowlabs/intro" className="btn">
            Book a 30-minute intro
          </a>
          <Link href="/ai-action-plan-lite" className="btn btn--ghost">
            Try AI Action Plan (Lite)
          </Link>
        </div>
      </section>
    </article>
  );
}
