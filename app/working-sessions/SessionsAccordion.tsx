"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import styles from "./SessionsAccordion.module.css";

type Item = {
  id: string;
  number: string;
  title: string;
  caption: string;
  content: ReactNode;
};

type Props = {
  items: Item[];
  /** Id of the item to start open. Defaults to the first item. Pass null to start fully collapsed. */
  defaultOpenId?: string | null;
  /** ARIA label for the list. */
  ariaLabel?: string;
};

export default function SessionsAccordion({ items, defaultOpenId, ariaLabel }: Props) {
  const initial = defaultOpenId === null ? null : (defaultOpenId ?? items[0]?.id ?? null);
  const [openId, setOpenId] = useState<string | null>(initial);
  const groupId = useId();
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const toggle = (id: string) => {
    const isOpening = openId !== id;
    setOpenId((curr) => (curr === id ? null : id));
    if (isOpening) {
      requestAnimationFrame(() => {
        const node = triggerRefs.current.get(id);
        if (!node) return;
        const rect = node.getBoundingClientRect();
        // Only nudge into view if the trigger is above the viewport or
        // very close to the top edge — avoids jumping when the user
        // tapped a trigger that's already comfortably on screen.
        if (rect.top < 80) {
          node.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  };

  return (
    <ul className={styles.list} aria-label={ariaLabel}>
      {items.map((item) => {
        const open = openId === item.id;
        const triggerId = `${groupId}-trigger-${item.id}`;
        const panelId = `${groupId}-panel-${item.id}`;
        return (
          <li key={item.id} className={styles.item}>
            <h3 className={styles.headingRow}>
              <button
                type="button"
                ref={(el) => {
                  if (el) triggerRefs.current.set(item.id, el);
                  else triggerRefs.current.delete(item.id);
                }}
                id={triggerId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className={`${styles.trigger} ${open ? styles.triggerOpen : ""}`}
              >
                <span className={styles.num}>{item.number}.</span>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.caption}>{item.caption}</span>
                <span className={styles.chevron} aria-hidden="true">
                  {open ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
            >
              <div className={styles.panelInner}>{item.content}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
