"use client";

import { type CSSProperties } from "react";
import { useInView } from "./useInView";
import styles from "./LeafVeinAccent.module.css";

// LeafVeinAccent — smaller decorative variant of LeafVeinDiagram.
// Per section 8.4: ~120px square, no particles, 1.2s draw-in on viewport
// entry via IntersectionObserver. Static after.
//
// Per section 8.5 (TierCard usage): variant geometry suggests complexity:
//   starter  — a single vein with two branches
//   builder  — spine with three laterals
//   compound — full leaf network
//
// Default `section` variant is a generic decorative motif.

type Variant = "starter" | "builder" | "compound" | "section";

const GEOMETRY: Record<Variant, string[]> = {
  starter: [
    // single vein from bottom-left to top-right + 2 small branches
    "M 18 98 C 50 70, 80 36, 102 18",
    "M 50 70 C 38 56, 30 44, 28 36",
    "M 80 36 C 76 24, 72 16, 70 10",
  ],
  builder: [
    // spine + 3 laterals
    "M 16 102 C 48 78, 78 48, 104 22",
    "M 38 88 C 30 70, 24 54, 24 46",
    "M 60 70 C 60 52, 60 36, 64 28",
    "M 84 50 C 86 38, 90 26, 94 20",
  ],
  compound: [
    // spine + 4 laterals + secondary veinlets — denser network
    "M 14 104 C 44 80, 74 50, 102 22",
    "M 32 92 C 24 76, 18 60, 18 52",
    "M 50 76 C 48 60, 48 44, 50 36",
    "M 70 58 C 72 44, 74 30, 78 22",
    "M 88 42 C 92 32, 96 22, 100 16",
    // veinlets off the laterals
    "M 26 84 C 18 84, 12 86, 8 88",
    "M 50 70 C 42 70, 36 72, 32 74",
    "M 72 52 C 64 52, 58 54, 54 56",
    "M 92 36 C 88 38, 84 40, 80 44",
  ],
  section: [
    // a quiet branching motif
    "M 18 100 C 48 78, 78 50, 104 24",
    "M 38 90 C 32 76, 28 64, 28 58",
    "M 64 68 C 64 54, 66 40, 68 32",
    "M 86 48 C 90 38, 94 28, 98 22",
  ],
};

const TIPS: Record<Variant, [number, number][]> = {
  starter: [[102, 18], [28, 36], [70, 10]],
  builder: [[104, 22], [24, 46], [64, 28], [94, 20]],
  compound: [[102, 22], [18, 52], [50, 36], [78, 22], [100, 16]],
  section: [[104, 24], [28, 58], [68, 32], [98, 22]],
};

type Props = {
  variant?: Variant;
  /** Optional accessible label. Defaults to aria-hidden. */
  ariaLabel?: string;
};

export default function LeafVeinAccent({ variant = "section", ariaLabel }: Props) {
  const [ref, visible] = useInView<HTMLDivElement>({ threshold: 0.4 });
  const paths = GEOMETRY[variant];
  const tips = TIPS[variant];

  return (
    <div
      ref={ref}
      className={styles.wrap}
      data-visible={visible ? "true" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : "true"}
      role={ariaLabel ? "img" : undefined}
    >
      <svg
        className={styles.svg}
        viewBox="0 0 120 120"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        {paths.map((d, i) => (
          <path
            key={i}
            className={i === 0 ? styles.spine : styles.branch}
            style={{ "--i": i } as CSSProperties}
            d={d}
            stroke="var(--vein-base)"
            strokeWidth={i === 0 ? 1.8 : 1.2}
            strokeLinecap="round"
            pathLength={100}
          />
        ))}
        {tips.map(([cx, cy], i) => (
          <circle
            key={`tip-${i}`}
            className={styles.tipNode}
            style={{ "--i": i } as CSSProperties}
            cx={cx}
            cy={cy}
            r="1.6"
            fill="var(--vein-base)"
          />
        ))}
      </svg>
    </div>
  );
}
