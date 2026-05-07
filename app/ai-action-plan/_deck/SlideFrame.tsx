import type { ReactNode } from "react";
import styles from "./SlideFrame.module.css";

type Props = {
  /** Section chapter mark, e.g. "§ii" — sits as a small label above the title. */
  chapter?: string;
  /** Slide title. Shown in Fraunces serif. */
  title?: string;
  /** Slide body content. */
  children: ReactNode;
  /** Optional override class to swap the body grid layout. */
  layoutClassName?: string;
  /** Slide number (1-indexed). Rendered as a quiet footer mark. */
  pageNumber?: number;
  /** Total slides. Pairs with pageNumber to render "07 / 18". */
  totalPages?: number;
  /** When true, hides the chapter/title scaffold (for cover or typography slides). */
  bare?: boolean;
};

/**
 * SlideFrame — shared scaffold for every slide in the deck.
 * Renders a consistent chapter mark, title, body region, and footer
 * page-number across all slide kinds. The body region is layout-flexible
 * via `layoutClassName` so each slide kind can drop in its own grid.
 */
export default function SlideFrame({
  chapter,
  title,
  children,
  layoutClassName,
  pageNumber,
  totalPages,
  bare = false,
}: Props) {
  return (
    <div className={styles.frame}>
      {!bare && (chapter || title) ? (
        <header className={styles.header}>
          {chapter ? <p className={styles.chapter}>{chapter}</p> : null}
          {title ? <h2 className={styles.title}>{title}</h2> : null}
        </header>
      ) : null}

      <div className={`${styles.body} ${layoutClassName ?? ""}`}>{children}</div>

      {pageNumber && totalPages ? (
        <footer className={styles.footer} aria-hidden="true">
          <span className={styles.pageNum}>
            {String(pageNumber).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
          </span>
          <span className={styles.brandFoot}>Here Now Labs · AI Action Plan · Confidential sample</span>
        </footer>
      ) : null}
    </div>
  );
}
