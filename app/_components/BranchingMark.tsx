"use client";

import { useInView } from "./useInView";
import styles from "./BranchingMark.module.css";

/**
 * BranchingMark — a self-drawing branching SVG. Echoes the leaf-vein /
 * neural-network photographic theme algorithmically, without literalism.
 *
 * On viewport entry, paths draw themselves from origin outward via
 * stroke-dasharray + stroke-dashoffset animation. Trunk first, then
 * primary branches, then secondary tendrils — staggered so the gesture
 * reads as growth completing, not all-at-once. Rests on its end-state.
 *
 * Used as a single signature moment (not deployed everywhere).
 * Respects prefers-reduced-motion (renders in completed end-state).
 */
export default function BranchingMark() {
  const [ref, visible] = useInView<HTMLDivElement>({ threshold: 0.4 });

  return (
    <div
      ref={ref}
      className={`${styles.wrap} ${visible ? styles.visible : ""}`}
      aria-hidden="true"
    >
      <svg
        className={styles.svg}
        viewBox="0 0 600 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Trunk — gentle rising curve through center */}
        <path className={styles.p1} d="M40 130 C 140 130, 220 110, 300 90 S 460 70, 560 60" />

        {/* Primary upper branches */}
        <path className={styles.p2} d="M180 122 C 200 100, 215 75, 230 50" />
        <path className={styles.p3} d="M300 90 C 310 70, 318 50, 320 30" />
        <path className={styles.p4} d="M420 75 C 430 55, 438 40, 442 22" />

        {/* Primary lower branches */}
        <path className={styles.p5} d="M120 128 C 130 145, 138 160, 142 178" />
        <path className={styles.p6} d="M240 110 C 245 130, 250 148, 252 168" />
        <path className={styles.p7} d="M360 82 C 365 100, 370 118, 372 140" />
        <path className={styles.p8} d="M500 65 C 504 80, 506 95, 508 112" />

        {/* Secondary tendrils — branches off branches */}
        <path className={styles.p9}  d="M218 70 C 228 65, 240 60, 252 58" />
        <path className={styles.p10} d="M316 50 C 326 45, 338 42, 350 42" />
        <path className={styles.p11} d="M141 165 C 130 168, 118 168, 108 167" />
        <path className={styles.p12} d="M251 158 C 264 162, 278 164, 290 164" />
        <path className={styles.p13} d="M371 130 C 384 132, 398 132, 410 130" />
        <path className={styles.p14} d="M508 102 C 520 102, 532 100, 542 98" />

        {/* Tip nodes — small dots at terminus */}
        <circle className={styles.node} cx="230" cy="50" r="2.2" />
        <circle className={styles.node} cx="320" cy="30" r="2.2" />
        <circle className={styles.node} cx="442" cy="22" r="2.2" />
        <circle className={styles.node} cx="142" cy="178" r="2.2" />
        <circle className={styles.node} cx="252" cy="168" r="2.2" />
        <circle className={styles.node} cx="372" cy="140" r="2.2" />
        <circle className={styles.node} cx="508" cy="112" r="2.2" />
        <circle className={styles.node} cx="560" cy="60" r="2.5" />
      </svg>
    </div>
  );
}
