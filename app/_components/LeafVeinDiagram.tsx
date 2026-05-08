"use client";

import { type CSSProperties } from "react";
import { useInView } from "./useInView";
import styles from "./LeafVeinDiagram.module.css";

// LeafVeinDiagram — structural diagram. Midrib + 5 lateral veins. No
// secondary veinlets, no particles, no glow, no pulse loop. The whole
// reveal lands in 800ms via cubic-bezier(0.22, 1, 0.36, 1) so the
// gesture settles rather than "blooming."
//
// Two geometries: desktop (1200×600) and mobile (700×800), CSS display
// swap at 768px. Optional `labels` prop drops italic Fraunces text at
// each lateral tip — used on /how-we-work.

type Lateral = {
  d: string;
  tip: [number, number];
};

const DESKTOP: { midrib: string; laterals: Lateral[] } = {
  midrib: "M 60 540 C 280 480, 540 380, 760 280 S 1080 120, 1140 80",
  laterals: [
    { d: "M 200 492 C 196 432, 188 372, 180 332", tip: [180, 332] },
    { d: "M 380 408 C 374 340, 358 282, 348 232", tip: [348, 232] },
    { d: "M 560 336 C 558 256, 558 188, 560 142", tip: [560, 142] },
    { d: "M 740 268 C 754 196, 776 134, 802 92", tip: [802, 92] },
    { d: "M 920 198 C 944 142, 980 92, 1018 60", tip: [1018, 60] },
  ],
};

const MOBILE: { midrib: string; laterals: Lateral[] } = {
  midrib: "M 350 740 C 322 600, 384 460, 348 320 S 318 140, 358 60",
  laterals: [
    { d: "M 340 660 C 408 644, 470 614, 510 580", tip: [510, 580] },
    { d: "M 364 540 C 296 526, 240 502, 200 480", tip: [200, 480] },
    { d: "M 348 400 C 410 386, 466 358, 510 320", tip: [510, 320] },
    { d: "M 358 280 C 296 264, 244 234, 200 200", tip: [200, 200] },
    { d: "M 350 160 C 396 130, 432 110, 470 92", tip: [470, 92] },
  ],
};

type Props = {
  /** When provided, italic Fraunces labels render at each lateral tip.
   *  Length must be 5. Used on /how-we-work. */
  labels?: [string, string, string, string, string];
};

export default function LeafVeinDiagram({ labels }: Props) {
  const [ref, visible] = useInView<HTMLDivElement>({ threshold: 0.25 });

  const renderSvg = (
    geometry: typeof DESKTOP,
    variant: "desktop" | "mobile",
    viewBox: string,
  ) => (
    <svg
      className={`${styles.svg} ${variant === "desktop" ? styles.svgDesktop : styles.svgMobile}`}
      viewBox={viewBox}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        className={styles.midrib}
        d={geometry.midrib}
        stroke="var(--ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
        pathLength={100}
      />
      {geometry.laterals.map((lat, i) => (
        <path
          key={`lat-${variant}-${i}`}
          className={styles.lateral}
          style={{ "--i": i } as CSSProperties}
          d={lat.d}
          stroke="var(--ink)"
          strokeWidth="1.2"
          strokeLinecap="round"
          pathLength={100}
        />
      ))}
      {labels?.map((label, i) => (
        <text
          key={`label-${variant}-${i}`}
          className={styles.label}
          style={{ "--i": i } as CSSProperties}
          x={geometry.laterals[i].tip[0]}
          y={geometry.laterals[i].tip[1]}
          dy="-10"
          textAnchor={
            variant === "mobile" && geometry.laterals[i].tip[0] < 350 ? "end" : "start"
          }
          dx={
            variant === "mobile" && geometry.laterals[i].tip[0] < 350 ? "-8" : "8"
          }
        >
          {label}
        </text>
      ))}
    </svg>
  );

  return (
    <div
      ref={ref}
      className={styles.wrap}
      data-visible={visible ? "true" : undefined}
      aria-hidden="true"
    >
      {renderSvg(DESKTOP, "desktop", "0 0 1200 600")}
      {renderSvg(MOBILE, "mobile", "0 0 700 800")}
    </div>
  );
}
