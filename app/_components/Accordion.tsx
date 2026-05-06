"use client";

import { useId, useState, type ReactNode } from "react";
import styles from "./Accordion.module.css";

type Props = {
  /** The trigger label shown on the button when collapsed. */
  label?: string;
  /** Label shown when expanded (defaults to a "Hide" version of label). */
  expandedLabel?: string;
  /** Whether to start expanded. */
  defaultOpen?: boolean;
  /** Body content shown when expanded. */
  children: ReactNode;
};

/**
 * Accordion — animated reveal for non-essential prose. Click to expand.
 *
 * Implementation note: avoids <details>/<summary> because Safari and
 * Firefox don't yet support animated ::details-content. Uses a CSS grid
 * row trick (0fr → 1fr) for height transition, which works everywhere
 * without measuring DOM. Respects prefers-reduced-motion.
 */
export default function Accordion({
  label = "Continue reading",
  expandedLabel = "Show less",
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const panelId = `accordion-panel-${id}`;
  const triggerId = `accordion-trigger-${id}`;

  return (
    <div className={styles.accordion}>
      <button
        type="button"
        id={triggerId}
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{open ? expandedLabel : label}</span>
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
        <div className={styles.panelInner}>{children}</div>
      </div>
    </div>
  );
}
