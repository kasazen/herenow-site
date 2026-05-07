"use client";

import ForwardArrow from "../_components/Arrow";
import { useInView } from "../_components/useInView";
import styles from "./EngagementArc.module.css";

const PLAN_ITEMS = ["Listen", "Ingest", "Weigh", "Deliver", "Walk through"];
const BUILD_ITEMS = ["AI software", "AI agents", "Workflow shifts"];
const COMPOUND_ITEMS = ["Quarterly review", "Build next", "Retire what isn't pulling weight"];

/**
 * EngagementArc — the page's signature arc visualization.
 *
 * Three stages of the engagement, displayed as three columns:
 * Plan → Build → Compound. Items in each column fade up in sequence
 * on viewport entry. Echoes OperationsDiagram's vocabulary — same
 * register, different content for the Action Plan page.
 */
export default function EngagementArc() {
  const [ref, visible] = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`${styles.diagram} ${visible ? styles.visible : ""}`}
      role="img"
      aria-label="The arc of an engagement: a Plan, then what we build, then the relationship that compounds."
    >
      <div className={`${styles.column} ${styles.planColumn}`}>
        <p className={styles.columnLabel}>The Plan</p>
        <ul className={styles.functionList}>
          {PLAN_ITEMS.map((fn, i) => (
            <li
              key={fn}
              className={styles.planItem}
              style={{ ["--index" as string]: i } as React.CSSProperties}
            >
              {fn}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.connector} aria-hidden="true">
        <ForwardArrow size="md" />
      </div>

      <div className={`${styles.column} ${styles.buildColumn}`}>
        <p className={styles.columnLabel}>What we build</p>
        <ul className={styles.functionList}>
          {BUILD_ITEMS.map((it, i) => (
            <li
              key={it}
              className={styles.buildItem}
              style={{ ["--index" as string]: PLAN_ITEMS.length + i } as React.CSSProperties}
            >
              {it}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.connector} aria-hidden="true">
        <ForwardArrow size="md" />
      </div>

      <div className={`${styles.column} ${styles.compoundColumn}`}>
        <p className={styles.columnLabel}>What compounds</p>
        <ul className={styles.functionList}>
          {COMPOUND_ITEMS.map((it, i) => (
            <li
              key={it}
              className={styles.compoundItem}
              style={{ ["--index" as string]: PLAN_ITEMS.length + BUILD_ITEMS.length + i } as React.CSSProperties}
            >
              {it}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
