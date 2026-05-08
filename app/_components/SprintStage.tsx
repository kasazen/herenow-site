"use client";

import { useId, useState } from "react";
import styles from "./SprintStage.module.css";

// SprintStage — five-stage accordion used on /how-we-work, section 2.
// Per section 8.7 of the brief. Single-open behavior using the same
// grid-template-rows reveal as the Accordion primitive.

export type Stage = {
  number: string; // "01"..."05"
  name: string; // "Listen" | "Ingest" | "Weigh" | "Deliver" | "Build"
  tagline: string;
  body: string;
};

type Props = {
  stages: Stage[];
  /** Zero-based index of the stage to start open. Defaults to 0. Pass -1 for all closed. */
  defaultOpen?: number;
};

export default function SprintStage({ stages, defaultOpen = 0 }: Props) {
  const [openIdx, setOpenIdx] = useState<number>(defaultOpen);
  const groupId = useId();

  const toggle = (idx: number) => {
    setOpenIdx((curr) => (curr === idx ? -1 : idx));
  };

  return (
    <ol className={styles.list}>
      {stages.map((stage, i) => {
        const open = openIdx === i;
        const triggerId = `${groupId}-trigger-${i}`;
        const panelId = `${groupId}-panel-${i}`;
        return (
          <li key={stage.number} className={styles.row}>
            <button
              type="button"
              id={triggerId}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => toggle(i)}
              className={`${styles.trigger} ${open ? styles.triggerOpen : ""}`}
            >
              <span className={styles.number}>{stage.number}</span>
              <span className={styles.name}>{stage.name}</span>
              <span className={styles.tagline}>{stage.tagline}</span>
              <span className={styles.chevron} aria-hidden="true">
                {open ? "−" : "+"}
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
            >
              <div className={styles.panelInner}>
                <p>{stage.body}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
