"use client";

import { useInView } from "../_components/useInView";
import styles from "./RedactedDoc.module.css";

/**
 * RedactedDoc — signature animation for the Action Plan section.
 *
 * Stylized portrait page showing the SHAPE of an Action Plan without
 * its substance: section headings, redacted text bars, two highlight
 * marks. Each line draws/reveals on viewport entry via staggered
 * animation. Communicates "we make a real artifact" while protecting
 * the reveal of what one says.
 *
 * No specific figures, no actual content — pure formal language.
 */
export default function RedactedDoc() {
  const [ref, visible] = useInView<HTMLDivElement>({ threshold: 0.35 });

  return (
    <div
      ref={ref}
      className={`${styles.wrap} ${visible ? styles.visible : ""}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 320 440" preserveAspectRatio="xMidYMid meet" className={styles.svg}>
        {/* Page background */}
        <rect x="0" y="0" width="320" height="440" rx="3" fill="#faf9f5" stroke="#d4d1c4" strokeWidth="1" />

        {/* Top brand mark — small green grid */}
        <g transform="translate(28, 28)">
          <rect width="3.5" height="3.5" fill="#15803d" className={styles.brandMark} />
          <rect x="4.5" width="3.5" height="3.5" fill="#15803d" className={styles.brandMark} />
          <rect x="9" width="3.5" height="3.5" fill="#15803d" className={styles.brandMark} />
          <rect y="4.5" width="3.5" height="3.5" fill="#15803d" className={styles.brandMark} />
          <rect x="4.5" y="4.5" width="3.5" height="3.5" fill="#15803d" className={styles.brandMark} />
          <rect x="9" y="4.5" width="3.5" height="3.5" fill="#15803d" className={styles.brandMark} />
        </g>

        {/* Eyebrow text bar */}
        <rect x="28" y="50" width="120" height="3" rx="1" fill="#8e8e95" className={styles.eyebrow} />

        {/* Title bar */}
        <rect x="28" y="64" width="220" height="10" rx="1" fill="#14141a" className={styles.title} />
        <rect x="28" y="80" width="160" height="10" rx="1" fill="#14141a" className={styles.title2} />

        {/* Section i */}
        <g className={styles.section1}>
          <text x="28" y="130" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="11" fill="#15803d">i.</text>
          <rect x="42" y="123" width="180" height="6" rx="1" fill="#14141a" />
          <rect x="28" y="140" width="262" height="3" rx="1" fill="#d4d1c4" />
          <rect x="28" y="148" width="262" height="3" rx="1" fill="#d4d1c4" />
          <rect x="28" y="156" width="180" height="3" rx="1" fill="#d4d1c4" />
        </g>

        {/* Section ii — with highlight */}
        <g className={styles.section2}>
          <text x="28" y="190" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="11" fill="#15803d">ii.</text>
          <rect x="42" y="183" width="220" height="6" rx="1" fill="#14141a" />
          <rect x="28" y="200" width="262" height="3" rx="1" fill="#d4d1c4" />
          {/* Highlight bar */}
          <rect x="28" y="208" width="200" height="6" rx="1" fill="#d8ecdf" className={styles.highlight1} />
          <rect x="28" y="220" width="262" height="3" rx="1" fill="#d4d1c4" />
        </g>

        {/* Section iii */}
        <g className={styles.section3}>
          <text x="28" y="252" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="11" fill="#15803d">iii.</text>
          <rect x="44" y="245" width="170" height="6" rx="1" fill="#14141a" />
          <rect x="28" y="262" width="262" height="3" rx="1" fill="#d4d1c4" />
          <rect x="28" y="270" width="220" height="3" rx="1" fill="#d4d1c4" />
        </g>

        {/* Section iv — with second highlight */}
        <g className={styles.section4}>
          <text x="28" y="304" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="11" fill="#15803d">iv.</text>
          <rect x="44" y="297" width="160" height="6" rx="1" fill="#14141a" />
          <rect x="28" y="314" width="262" height="3" rx="1" fill="#d4d1c4" />
          <rect x="28" y="322" width="240" height="3" rx="1" fill="#d4d1c4" />
          {/* Highlight bar */}
          <rect x="28" y="332" width="180" height="6" rx="1" fill="#d8ecdf" className={styles.highlight2} />
        </g>

        {/* Section v */}
        <g className={styles.section5}>
          <text x="28" y="370" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="11" fill="#15803d">v.</text>
          <rect x="42" y="363" width="200" height="6" rx="1" fill="#14141a" />
          <rect x="28" y="380" width="262" height="3" rx="1" fill="#d4d1c4" />
        </g>

        {/* Footer page mark */}
        <text x="28" y="420" fontFamily="Inter, sans-serif" fontSize="8" fill="#8e8e95" letterSpacing="1.5" className={styles.footerMark}>
          AI ACTION PLAN · CONFIDENTIAL
        </text>
        <text x="292" y="420" textAnchor="end" fontFamily="Inter, sans-serif" fontSize="8" fill="#8e8e95" letterSpacing="1.5" className={styles.footerMark}>
          01 / 11
        </text>
      </svg>
    </div>
  );
}
