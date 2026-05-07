"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useInView } from "../_components/useInView";
import styles from "./ActionPlanShape.module.css";

// Four rows. `input` is DOM order; `rank` is the final priority position
// the rows snap into during the "sequenced" beat.
const ROWS = [
  { id: "a", input: 0, rank: 1, rankLabel: "ii" },
  { id: "b", input: 1, rank: 3, rankLabel: "iv" },
  { id: "c", input: 2, rank: 0, rankLabel: "i" },
  { id: "d", input: 3, rank: 2, rankLabel: "iii" },
];

export default function ActionPlanShape() {
  const [ref, visible] = useInView<HTMLDivElement>({ threshold: 0.35 });
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setSorted(true), 2100);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div
      ref={ref}
      className={styles.shape}
      data-visible={visible ? "true" : undefined}
      data-sorted={sorted ? "true" : undefined}
      aria-hidden="true"
    >
      <figure className={styles.doc}>
        <div className={styles.docHeader}>
          <span className={styles.docMark} />
          <span className={styles.docTitle} />
        </div>
        <ul className={styles.rows}>
          {ROWS.map((r) => (
            <li
              key={r.id}
              className={styles.row}
              style={
                {
                  "--input": r.input,
                  "--rank": r.rank,
                } as CSSProperties
              }
            >
              <span className={styles.rank}>{r.rankLabel}.</span>
              <span className={styles.label} />
              <span className={styles.price}>$</span>
            </li>
          ))}
        </ul>
      </figure>
      <p className={styles.legend}>
        <span>Named</span>
        <span className={styles.dot} aria-hidden="true">·</span>
        <span>Ranked</span>
        <span className={styles.dot} aria-hidden="true">·</span>
        <span>Priced</span>
        <span className={styles.dot} aria-hidden="true">·</span>
        <span>Sequenced</span>
      </p>
    </div>
  );
}
