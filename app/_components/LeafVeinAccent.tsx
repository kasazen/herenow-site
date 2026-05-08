"use client";

import { useInView } from "./useInView";
import styles from "./LeafVeinAccent.module.css";

// LeafVeinAccent — small (120px) decorative variant. Per-tier geometry
// suggests complexity. Single-group reveal in 600ms with cubic-bezier
// (0.22, 1, 0.36, 1). No tip nodes, no per-branch staggers.

type Variant = "starter" | "builder" | "compound" | "section";

const GEOMETRY: Record<Variant, string[]> = {
  starter: [
    "M 18 98 C 50 70, 80 36, 102 18",
    "M 50 70 C 38 56, 30 44, 28 36",
    "M 80 36 C 76 24, 72 16, 70 10",
  ],
  builder: [
    "M 16 102 C 48 78, 78 48, 104 22",
    "M 38 88 C 30 70, 24 54, 24 46",
    "M 60 70 C 60 52, 60 36, 64 28",
    "M 84 50 C 86 38, 90 26, 94 20",
  ],
  compound: [
    "M 14 104 C 44 80, 74 50, 102 22",
    "M 32 92 C 24 76, 18 60, 18 52",
    "M 50 76 C 48 60, 48 44, 50 36",
    "M 70 58 C 72 44, 74 30, 78 22",
    "M 88 42 C 92 32, 96 22, 100 16",
  ],
  section: [
    "M 18 100 C 48 78, 78 50, 104 24",
    "M 38 90 C 32 76, 28 64, 28 58",
    "M 64 68 C 64 54, 66 40, 68 32",
    "M 86 48 C 90 38, 94 28, 98 22",
  ],
};

type Props = {
  variant?: Variant;
  ariaLabel?: string;
};

export default function LeafVeinAccent({ variant = "section", ariaLabel }: Props) {
  const [ref, visible] = useInView<HTMLDivElement>({ threshold: 0.4 });
  const paths = GEOMETRY[variant];

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
            className={styles.path}
            d={d}
            stroke="var(--ink)"
            strokeWidth={i === 0 ? 1.4 : 1}
            strokeLinecap="round"
            pathLength={100}
          />
        ))}
      </svg>
    </div>
  );
}
