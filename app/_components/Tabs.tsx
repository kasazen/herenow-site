"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "./Tabs.module.css";

type Tab = {
  id: string;
  label: string;
  /** Optional small caption shown under the label (e.g., a duration). */
  caption?: string;
  panel: ReactNode;
};

type Props = {
  tabs: Tab[];
  /** id of the tab to start on. Defaults to first. */
  defaultTabId?: string;
  /** ARIA label for the tablist. */
  ariaLabel?: string;
};

/**
 * Tabs — show one panel at a time with arrow-key navigation.
 * Roving tabindex pattern: only the active tab is in the tab order;
 * arrow keys move focus and selection between tabs.
 */
export default function Tabs({ tabs, defaultTabId, ariaLabel }: Props) {
  const initial = defaultTabId ?? tabs[0]?.id;
  const [activeId, setActiveId] = useState<string | undefined>(initial);
  const groupId = useId();
  const tabsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  if (tabs.length === 0) return null;

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!activeId) return;
    const idx = tabs.findIndex((t) => t.id === activeId);
    if (idx < 0) return;

    let nextIdx = idx;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIdx = (idx + 1) % tabs.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIdx = (idx - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      nextIdx = 0;
    } else if (e.key === "End") {
      nextIdx = tabs.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    const next = tabs[nextIdx];
    setActiveId(next.id);
    tabsRef.current.get(next.id)?.focus();
  };

  return (
    <div className={styles.wrap}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={styles.tablist}
        onKeyDown={onKeyDown}
      >
        {tabs.map((t) => {
          const selected = t.id === activeId;
          return (
            <button
              key={t.id}
              ref={(el) => {
                if (el) tabsRef.current.set(t.id, el);
                else tabsRef.current.delete(t.id);
              }}
              role="tab"
              type="button"
              id={`${groupId}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${groupId}-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              className={`${styles.tab} ${selected ? styles.tabSelected : ""}`}
              onClick={() => setActiveId(t.id)}
            >
              <span className={styles.tabLabel}>{t.label}</span>
              {t.caption ? <span className={styles.tabCaption}>{t.caption}</span> : null}
            </button>
          );
        })}
      </div>

      {tabs.map((t) => {
        const selected = t.id === activeId;
        return (
          <div
            key={t.id}
            role="tabpanel"
            id={`${groupId}-panel-${t.id}`}
            aria-labelledby={`${groupId}-tab-${t.id}`}
            hidden={!selected}
            className={styles.panel}
          >
            {selected ? t.panel : null}
          </div>
        );
      })}
    </div>
  );
}
