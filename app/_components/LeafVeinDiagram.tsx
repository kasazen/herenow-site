"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useInView } from "./useInView";
import styles from "./LeafVeinDiagram.module.css";

// LeafVeinDiagram — the signature animation. Per section 8.3:
//   midrib + five lateral veins + 3–6 secondary veinlets per lateral
//   + three information particles. 2.4s entry timeline; subtle pulse
//   loops afterward. Reduced-motion renders the final static state.
//
// Two geometries: desktop (viewBox 1200×600) and mobile (700×800).
// CSS display swap at the 768px breakpoint.

type Lateral = {
  // Path of the lateral vein itself (drawn in stage 2, ms 600–1400).
  d: string;
  // Tip coordinate, used for the label and the particle terminus.
  tip: [number, number];
  // Veinlets that branch off this lateral (3–6 per spec).
  veinlets: string[];
};

const DESKTOP: { midrib: string; midribTip: [number, number]; laterals: Lateral[] } = {
  midrib: "M 60 540 C 280 480, 540 380, 760 280 S 1080 120, 1140 80",
  midribTip: [1140, 80],
  laterals: [
    {
      d: "M 200 492 C 196 432, 188 372, 180 332",
      tip: [180, 332],
      veinlets: [
        "M 196 460 C 178 456, 158 458, 144 466",
        "M 188 410 C 168 408, 150 412, 138 422",
        "M 184 372 C 166 374, 150 380, 140 390",
        "M 182 350 C 196 348, 210 348, 222 350",
      ],
    },
    {
      d: "M 380 408 C 374 340, 358 282, 348 232",
      tip: [348, 232],
      veinlets: [
        "M 374 376 C 354 372, 336 376, 322 384",
        "M 366 332 C 386 332, 404 336, 418 344",
        "M 358 286 C 338 284, 320 286, 306 292",
        "M 352 248 C 372 248, 388 252, 402 258",
      ],
    },
    {
      d: "M 560 336 C 558 256, 558 188, 560 142",
      tip: [560, 142],
      veinlets: [
        "M 558 296 C 538 290, 520 290, 506 296",
        "M 560 244 C 580 240, 600 240, 616 246",
        "M 560 196 C 540 192, 524 192, 510 198",
        "M 560 152 C 580 154, 596 158, 608 164",
      ],
    },
    {
      d: "M 740 268 C 754 196, 776 134, 802 92",
      tip: [802, 92],
      veinlets: [
        "M 750 230 C 730 226, 712 228, 700 234",
        "M 762 184 C 782 184, 800 186, 812 190",
        "M 778 138 C 758 134, 742 134, 730 138",
        "M 794 102 C 814 102, 830 102, 842 104",
        "M 770 156 C 750 154, 736 154, 724 158",
      ],
    },
    {
      d: "M 920 198 C 944 142, 980 92, 1018 60",
      tip: [1018, 60],
      veinlets: [
        "M 932 168 C 914 164, 900 162, 890 166",
        "M 952 130 C 970 128, 986 128, 996 130",
        "M 982 88 C 962 86, 948 86, 938 90",
        "M 1004 70 C 1020 70, 1034 70, 1044 72",
      ],
    },
  ],
};

const MOBILE: { midrib: string; midribTip: [number, number]; laterals: Lateral[] } = {
  midrib: "M 350 740 C 322 600, 384 460, 348 320 S 318 140, 358 60",
  midribTip: [358, 60],
  laterals: [
    {
      d: "M 340 660 C 408 644, 470 614, 510 580",
      tip: [510, 580],
      veinlets: [
        "M 374 654 C 376 666, 374 678, 366 686",
        "M 408 644 C 410 656, 410 666, 406 676",
        "M 440 632 C 444 644, 444 656, 442 666",
        "M 478 610 C 480 622, 484 632, 488 642",
      ],
    },
    {
      d: "M 364 540 C 296 526, 240 502, 200 480",
      tip: [200, 480],
      veinlets: [
        "M 332 530 C 326 540, 322 552, 322 562",
        "M 290 514 C 286 524, 282 532, 280 540",
        "M 244 504 C 240 514, 236 522, 232 528",
        "M 218 492 C 216 502, 212 510, 208 516",
      ],
    },
    {
      d: "M 348 400 C 410 386, 466 358, 510 320",
      tip: [510, 320],
      veinlets: [
        "M 388 390 C 388 402, 386 412, 380 420",
        "M 422 380 C 424 392, 424 402, 422 410",
        "M 460 364 C 464 374, 466 384, 466 392",
        "M 490 340 C 494 350, 498 358, 502 364",
      ],
    },
    {
      d: "M 358 280 C 296 264, 244 234, 200 200",
      tip: [200, 200],
      veinlets: [
        "M 326 270 C 322 280, 318 288, 316 294",
        "M 290 254 C 284 262, 280 270, 278 276",
        "M 252 230 C 246 238, 240 246, 238 252",
        "M 220 210 C 216 218, 212 224, 210 230",
      ],
    },
    {
      d: "M 350 160 C 396 130, 432 110, 470 92",
      tip: [470, 92],
      veinlets: [
        "M 374 144 C 374 156, 372 166, 368 172",
        "M 400 128 C 402 138, 402 146, 400 154",
        "M 432 112 C 434 122, 436 130, 436 136",
        "M 458 98 C 460 108, 462 116, 462 122",
      ],
    },
  ],
};

type Props = {
  /** When provided, labels appear at the tip of each lateral vein.
   *  Length must be 5 — one per lateral. Used on /how-we-work. */
  labels?: [string, string, string, string, string];
};

export default function LeafVeinDiagram({ labels }: Props) {
  const [ref, visible] = useInView<HTMLDivElement>({ threshold: 0.25 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const showParticles = visible && !reducedMotion;

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
      <defs>
        <filter id={`lvd-glow-${variant}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Midrib */}
      <path
        id={`lvd-midrib-${variant}`}
        className={styles.midrib}
        d={geometry.midrib}
        stroke="var(--vein-base)"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={100}
      />

      {/* Lateral veins */}
      {geometry.laterals.map((lat, i) => (
        <path
          key={`lat-${variant}-${i}`}
          id={`lvd-lat-${variant}-${i}`}
          className={styles.lateral}
          style={{ "--i": i } as CSSProperties}
          d={lat.d}
          stroke="var(--vein-base)"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength={100}
        />
      ))}

      {/* Secondary veinlets */}
      {geometry.laterals.flatMap((lat, latIdx) =>
        lat.veinlets.map((veinlet, vIdx) => {
          // Stagger across all veinlets in document order for a natural wash.
          const flatIdx = geometry.laterals.slice(0, latIdx).reduce((s, l) => s + l.veinlets.length, 0) + vIdx;
          return (
            <path
              key={`vl-${variant}-${latIdx}-${vIdx}`}
              className={styles.veinlet}
              style={{ "--i": flatIdx } as CSSProperties}
              d={veinlet}
              stroke="var(--vein-base)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        }),
      )}

      {/* Tip nodes — small dots at each lateral tip */}
      {geometry.laterals.map((lat, i) => (
        <circle
          key={`tip-${variant}-${i}`}
          className={styles.tipNode}
          style={{ "--i": i } as CSSProperties}
          cx={lat.tip[0]}
          cy={lat.tip[1]}
          r="3"
          fill="var(--vein-base)"
        />
      ))}

      {/* Optional labels at lateral tips */}
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

      {/* Information particles — three of them, traveling from base to varying tips.
          Only mounted when visible AND reduced-motion is OFF. */}
      {showParticles && (
        <g>
          <circle
            r="4"
            fill="var(--vein-particle)"
            filter={`url(#lvd-glow-${variant})`}
          >
            <animateMotion
              dur="2.4s"
              begin="1.9s; 7.9s"
              fill="freeze"
              keyPoints="0;1"
              keyTimes="0;1"
            >
              <mpath href={`#lvd-midrib-${variant}`} />
            </animateMotion>
          </circle>
          <circle
            r="3.5"
            fill="var(--vein-particle)"
            filter={`url(#lvd-glow-${variant})`}
          >
            <animateMotion
              dur="2.4s"
              begin="2.0s; 9.5s"
              fill="freeze"
              keyPoints="0;1"
              keyTimes="0;1"
            >
              <mpath href={`#lvd-lat-${variant}-2`} />
            </animateMotion>
          </circle>
          <circle
            r="3.5"
            fill="var(--vein-particle)"
            filter={`url(#lvd-glow-${variant})`}
          >
            <animateMotion
              dur="2.4s"
              begin="2.1s; 11.0s"
              fill="freeze"
              keyPoints="0;1"
              keyTimes="0;1"
            >
              <mpath href={`#lvd-lat-${variant}-4`} />
            </animateMotion>
          </circle>
        </g>
      )}
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
