"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useInView } from "./useInView";
import styles from "./HomeInsight.module.css";

// Home page primary-insight visualization. Two layers tell the story:
//
//   PRIMARY  — a trunk + three prominent branches, each ending in a glowing
//              terminal node. These are the "obvious AI plays" operators
//              already see (proposal automation, contract scanning, etc.).
//
//   SECONDARY — a dense network of finer tendrils branching off the trunk
//              and primary branches, with many small terminal nodes. This
//              is the structural network AI reveals — the part operators
//              miss without hands-on AI experience.
//
// After both layers establish, dots flow along the primary veins, suggesting
// active intelligence. SMIL <animateMotion> drives the dots; reduced motion
// suppresses them entirely.

const SECONDARY_PATHS = [
  "M180 348 C 175 380, 168 408, 160 432",
  "M260 308 C 268 340, 268 374, 256 402",
  "M340 285 C 350 318, 358 350, 358 384",
  "M420 252 C 432 285, 440 320, 432 358",
  "M510 222 C 528 252, 538 286, 532 322",
  "M610 195 C 632 224, 644 256, 642 292",
  "M700 175 C 720 202, 730 232, 730 268",
  "M210 220 C 198 215, 184 212, 168 212",
  "M198 165 C 180 162, 162 162, 148 168",
  "M438 130 C 422 124, 405 120, 388 120",
  "M440 95 C 458 92, 478 90, 498 90",
  "M698 130 C 682 122, 666 118, 650 120",
  "M712 105 C 728 100, 744 96, 760 94",
  "M698 165 C 714 168, 728 172, 742 178",
];

const SECONDARY_NODES: [number, number][] = [
  [160, 432],
  [256, 402],
  [358, 384],
  [432, 358],
  [532, 322],
  [642, 292],
  [730, 268],
  [168, 212],
  [148, 168],
  [388, 120],
  [498, 90],
  [650, 120],
  [760, 94],
  [742, 178],
];

export default function HomeInsight() {
  const [ref, visible] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const showDots = visible && !reducedMotion;

  return (
    <div
      ref={ref}
      className={styles.wrap}
      data-visible={visible ? "true" : undefined}
      aria-hidden="true"
    >
      <svg
        className={styles.svg}
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        <defs>
          <filter id="hi-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="hi-dot-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* SECONDARY NETWORK — drawn first so it sits visually under the primary */}
        <g
          className={styles.secondary}
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
        >
          {SECONDARY_PATHS.map((d, i) => (
            <path
              key={`s-${i}`}
              className={styles.s}
              style={{ "--i": i } as CSSProperties}
              d={d}
              pathLength={100}
            />
          ))}
          {SECONDARY_NODES.map(([cx, cy], i) => (
            <circle
              key={`sn-${i}`}
              className={styles.tinyNode}
              style={{ "--i": SECONDARY_PATHS.length + i } as CSSProperties}
              cx={cx}
              cy={cy}
              r="1.6"
            />
          ))}
        </g>

        {/* PRIMARY — trunk + three prominent branches with glowing nodes */}
        <g
          stroke="currentColor"
          strokeLinecap="round"
          fill="none"
        >
          <path
            id="hi-trunk"
            className={styles.trunk}
            d="M80 360 C 220 332, 360 292, 500 236 S 700 180, 750 160"
            strokeWidth="1.6"
            pathLength={100}
          />
          <path
            id="hi-b1"
            className={styles.branch}
            style={{ "--i": 0 } as CSSProperties}
            d="M220 332 C 215 282, 205 222, 200 140"
            strokeWidth="1.4"
            pathLength={100}
          />
          <path
            id="hi-b2"
            className={styles.branch}
            style={{ "--i": 1 } as CSSProperties}
            d="M440 252 C 438 198, 435 138, 432 80"
            strokeWidth="1.4"
            pathLength={100}
          />
          <path
            id="hi-b3"
            className={styles.branch}
            style={{ "--i": 2 } as CSSProperties}
            d="M650 195 C 668 162, 692 128, 720 85"
            strokeWidth="1.4"
            pathLength={100}
          />

          <circle
            className={styles.node}
            cx="200"
            cy="140"
            r="4"
            fill="currentColor"
            stroke="none"
            filter="url(#hi-glow)"
          />
          <circle
            className={styles.node}
            cx="432"
            cy="80"
            r="4"
            fill="currentColor"
            stroke="none"
            filter="url(#hi-glow)"
          />
          <circle
            className={styles.node}
            cx="720"
            cy="85"
            r="4"
            fill="currentColor"
            stroke="none"
            filter="url(#hi-glow)"
          />
        </g>

        {/* FLOWING DOTS — only when visible and reduced motion is OFF.
            Each dot is mounted only after its vein has drawn in. */}
        {showDots && (
          <g fill="currentColor" filter="url(#hi-dot-glow)">
            <circle r="2.2">
              <animateMotion dur="7s" repeatCount="indefinite" begin="2.6s" rotate="auto">
                <mpath href="#hi-trunk" />
              </animateMotion>
            </circle>
            <circle r="2.2">
              <animateMotion dur="7s" repeatCount="indefinite" begin="5.1s" rotate="auto">
                <mpath href="#hi-trunk" />
              </animateMotion>
            </circle>
            <circle r="2">
              <animateMotion dur="3.8s" repeatCount="indefinite" begin="3.2s" rotate="auto">
                <mpath href="#hi-b1" />
              </animateMotion>
            </circle>
            <circle r="2">
              <animateMotion dur="3.8s" repeatCount="indefinite" begin="3.9s" rotate="auto">
                <mpath href="#hi-b2" />
              </animateMotion>
            </circle>
            <circle r="2">
              <animateMotion dur="3.8s" repeatCount="indefinite" begin="4.6s" rotate="auto">
                <mpath href="#hi-b3" />
              </animateMotion>
            </circle>
          </g>
        )}
      </svg>
    </div>
  );
}
