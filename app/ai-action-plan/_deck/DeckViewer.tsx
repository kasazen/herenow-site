"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import ForwardArrow from "../../_components/Arrow";
import styles from "./DeckViewer.module.css";

export type SlideKind =
  | "cover"
  | "snapshot"
  | "metric"
  | "chart"
  | "content"
  | "finding"
  | "build"
  | "roadmap"
  | "typography"
  | "infographic"
  | "closing";

export type Slide = {
  id: string;
  kind: SlideKind;
  /** Section chapter mark, e.g. "§ii" */
  chapter?: string;
  /** Title shown via SlideFrame */
  title?: string;
  /** Slide body — content owns its own layout */
  body: ReactNode;
  /** Aria description for screen readers (announced on slide change). */
  ariaLabel?: string;
};

type Props = {
  slides: Slide[];
  /** Filename used for the Download PDF link. Default: ai-action-plan.pdf */
  pdfHref?: string;
};

function clampIndex(n: number, max: number) {
  if (Number.isNaN(n) || n < 0) return 0;
  if (n >= max) return max - 1;
  return n;
}

/**
 * DeckViewer — slide-by-slide presentation experience. Renders one slide
 * at a time on screen with prev/next navigation and keyboard arrows.
 * Syncs slide index to URL `?slide=N` via `router.replace` so the back
 * button exits the deck cleanly. Touch swipe supported.
 *
 * In print mode (`@media print`), all slides are rendered stacked with
 * `break-after: page` so Chrome `--print-to-pdf` produces one landscape
 * Letter page per slide.
 */
export default function DeckViewer({ slides, pdfHref = "/ai-action-plan.pdf" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = clampIndex(parseInt(searchParams?.get("slide") ?? "1", 10) - 1, slides.length);
  const [index, setIndex] = useState<number>(initial);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const total = slides.length;

  const stageRef = useRef<HTMLDivElement>(null);
  const titleRegionRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number) => {
      const clamped = clampIndex(next, total);
      setIndex(clamped);
      const params = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
      params.set("slide", String(clamped + 1));
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, total],
  );

  const next = useCallback(() => goTo(Math.min(index + 1, total - 1)), [goTo, index, total]);
  const prev = useCallback(() => goTo(Math.max(index - 1, 0)), [goTo, index]);

  // Keyboard navigation — global window listener; arrow keys, Home, End, F for fullscreen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(total - 1);
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo, total]);

  // Touch swipe — simple horizontal threshold detection.
  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const onStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0]?.clientX ?? null;
    };
    const onEnd = (e: TouchEvent) => {
      if (touchStartX.current == null) return;
      const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(dx) < 50) return;
      if (dx < 0) next();
      else prev();
    };
    node.addEventListener("touchstart", onStart, { passive: true });
    node.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      node.removeEventListener("touchstart", onStart);
      node.removeEventListener("touchend", onEnd);
    };
  }, [next, prev]);

  // Fullscreen toggling — uses Fullscreen API on the stage element.
  const toggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    const node = stageRef.current;
    if (!node) return;
    if (!document.fullscreenElement) {
      node.requestFullscreen?.().catch(() => undefined);
    } else {
      document.exitFullscreen?.().catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // When index changes, briefly focus the title region for screen readers.
  useEffect(() => {
    titleRegionRef.current?.focus({ preventScroll: true });
  }, [index]);

  const current = slides[index];

  return (
    <div className={styles.viewer}>
      {/* Print-only stack — Chrome --print-to-pdf walks this list */}
      <div className={styles.printStack} aria-hidden="true">
        {slides.map((s) => (
          <div key={s.id} className={styles.printPage}>
            <div className={styles.slideCanvas}>{s.body}</div>
          </div>
        ))}
      </div>

      {/* Screen-only deck UI */}
      <div
        ref={stageRef}
        className={`${styles.stage} ${isFullscreen ? styles.stageFullscreen : ""}`}
        data-print-hide="true"
      >
        <div className={styles.canvasWrap}>
          <div
            ref={titleRegionRef}
            className={styles.slideCanvas}
            role="region"
            aria-roledescription="slide"
            aria-label={current?.ariaLabel ?? current?.title ?? `Slide ${index + 1} of ${total}`}
            tabIndex={-1}
          >
            <div aria-live="polite" className={styles.srOnly}>
              {`Slide ${index + 1} of ${total}: ${current?.title ?? ""}`}
            </div>
            {current?.body}
          </div>
        </div>

        <div className={styles.controls} role="toolbar" aria-label="Deck navigation">
          <button
            type="button"
            className={styles.navBtn}
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous slide"
          >
            <span className={styles.prevIcon} aria-hidden="true">
              <ForwardArrow size="sm" />
            </span>
          </button>

          <div className={styles.counter} aria-live="off">
            <span className={styles.counterCurrent}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.counterTotal}> / {String(total).padStart(2, "0")}</span>
          </div>

          <button
            type="button"
            className={styles.navBtn}
            onClick={next}
            disabled={index === total - 1}
            aria-label="Next slide"
          >
            <span aria-hidden="true">
              <ForwardArrow size="sm" />
            </span>
          </button>

          <div className={styles.controlSpacer} />

          <a href={pdfHref} download className={`btn btn--ghost ${styles.downloadBtn}`}>
            Download PDF
          </a>

          <button
            type="button"
            className={styles.iconBtn}
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            aria-pressed={isFullscreen}
          >
            {isFullscreen ? "Exit" : "Fullscreen"}
          </button>
        </div>
      </div>
    </div>
  );
}
