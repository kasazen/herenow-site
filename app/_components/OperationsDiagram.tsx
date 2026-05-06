"use client";

import { useEffect, useRef, useState } from "react";
import ForwardArrow from "./Arrow";
import styles from "./OperationsDiagram.module.css";

const OPERATION_FUNCTIONS = ["Contracts", "Vendors", "Dispatch", "Service", "Renewals"];
const AI_VERBS = ["Parse", "Surface", "Weigh"];
const COMPOUND_OUTPUTS = ["Agents firing", "Software in use", "Margin captured", "Time recovered"];

/**
 * Operations-as-systems diagram — the brand's primary visual signature.
 *
 * Three-column flow: your operation today (functions you already run) →
 * + AI inside it (what AI does to each function) → what compounds (the
 * outputs that accumulate). On viewport entry, list items fade in
 * sequentially so the reveal matches the argument's narrative shape.
 */
export default function OperationsDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.diagram} ${visible ? styles.visible : ""}`}
      role="img"
      aria-label="Your operation today, plus AI inside it, equals what compounds."
    >
      <div className={`${styles.column} ${styles.todayColumn}`}>
        <p className={styles.columnLabel}>Your operation today</p>
        <ul className={styles.functionList}>
          {OPERATION_FUNCTIONS.map((fn, i) => (
            <li
              key={fn}
              className={styles.todayItem}
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

      <div className={`${styles.column} ${styles.aiColumn}`}>
        <p className={styles.columnLabel}>+ AI inside it</p>
        <ul className={styles.functionList}>
          {AI_VERBS.map((verb, i) => (
            <li
              key={verb}
              className={styles.aiItem}
              style={{ ["--index" as string]: OPERATION_FUNCTIONS.length + i } as React.CSSProperties}
            >
              {verb}
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
          {COMPOUND_OUTPUTS.map((output, i) => (
            <li
              key={output}
              className={styles.compoundItem}
              style={{ ["--index" as string]: OPERATION_FUNCTIONS.length + AI_VERBS.length + i } as React.CSSProperties}
            >
              {output}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
