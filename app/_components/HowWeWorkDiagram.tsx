"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useInView } from "./useInView";
import styles from "./HowWeWorkDiagram.module.css";

// How We Work signature animation. Mirror image of HomeInsight in spirit:
//
//   Eight primary veins flow INWARD from the edges of the canvas, converging
//   at a central glowing nexus. Each vein begins at a small input node (a
//   stakeholder, a document, an operational signal — left abstract). Flowing
//   dots travel along each vein toward the center, suggesting many inputs
//   funneling into one decision document. The nexus = The Analysis.
//
// Reduced motion: end-state only, no flow.

// Each path's `d` attribute starts at the OUTER endpoint and ends at the
// nexus. That way stroke-dasharray reveal draws from edge → center, and
// SMIL <animateMotion> dots travel inward in the natural direction.
const INFLOW_PATHS = [
  // [id, d, outer-x, outer-y]
  ["hw-i1", "M60 50 C 180 110, 300 180, 400 250",   60,  50],
  ["hw-i2", "M300 30 C 350 110, 380 180, 400 250",  300, 30],
  ["hw-i3", "M740 60 C 600 130, 480 200, 400 250",  740, 60],
  ["hw-i4", "M770 250 C 620 250, 500 250, 400 250", 770, 250],
  ["hw-i5", "M740 440 C 620 380, 480 320, 400 250", 740, 440],
  ["hw-i6", "M400 470 C 400 380, 400 310, 400 250", 400, 470],
  ["hw-i7", "M60 440 C 200 380, 320 320, 400 250",  60,  440],
  ["hw-i8", "M30 250 C 180 250, 320 250, 400 250",  30,  250],
] as const;

export default function HowWeWorkDiagram() {
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
          <filter id="hw-nexus-glow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="hw-input-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="hw-dot-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* INFLOW VEINS — draw in from outer endpoints toward the nexus */}
        <g
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        >
          {INFLOW_PATHS.map(([id, d], i) => (
            <path
              key={id}
              id={id as string}
              className={styles.vein}
              style={{ "--i": i } as CSSProperties}
              d={d as string}
              pathLength={100}
            />
          ))}
        </g>

        {/* INPUT NODES — small dots at the outer endpoint of each vein */}
        <g>
          {INFLOW_PATHS.map(([id, , cx, cy], i) => (
            <circle
              key={`${id}-in`}
              className={styles.inputNode}
              style={{ "--i": i } as CSSProperties}
              cx={cx as number}
              cy={cy as number}
              r="2.4"
              fill="currentColor"
              filter="url(#hw-input-glow)"
            />
          ))}
        </g>

        {/* CENTRAL NEXUS — The Analysis */}
        <circle
          className={styles.nexus}
          cx="400"
          cy="250"
          r="9"
          fill="currentColor"
          filter="url(#hw-nexus-glow)"
        />
        {/* Outer halo ring around the nexus, fades up after all veins land */}
        <circle
          className={styles.nexusHalo}
          cx="400"
          cy="250"
          r="22"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
        />

        {/* FLOWING DOTS — travel inward along each vein toward the nexus.
            Multiple dots per vein, staggered in time, give the steady-stream feel. */}
        {showDots && (
          <g fill="currentColor" filter="url(#hw-dot-glow)">
            {INFLOW_PATHS.map(([id], i) => (
              <g key={`${id}-dots`}>
                <circle r="1.8">
                  <animateMotion
                    dur="4.5s"
                    repeatCount="indefinite"
                    begin={`${2.4 + i * 0.18}s`}
                    rotate="auto"
                  >
                    <mpath href={`#${id}`} />
                  </animateMotion>
                </circle>
                <circle r="1.8">
                  <animateMotion
                    dur="4.5s"
                    repeatCount="indefinite"
                    begin={`${4.0 + i * 0.18}s`}
                    rotate="auto"
                  >
                    <mpath href={`#${id}`} />
                  </animateMotion>
                </circle>
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
