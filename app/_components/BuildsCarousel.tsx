"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import ForwardArrow from "./Arrow";
import styles from "./BuildsCarousel.module.css";

type Slide = {
  id: string;
  /** A short label for screen readers + dot indicator (e.g., "AI software"). */
  label: string;
  content: ReactNode;
};

type Props = {
  slides: Slide[];
  /** Auto-advance interval in ms. 0 disables. Default 6000. */
  autoplayMs?: number;
  /** ARIA label for the carousel region. */
  ariaLabel?: string;
};

/**
 * BuildsCarousel — a horizontal carousel for parallel-content cards
 * (e.g., the three "After the Plan" builds: software, agent, advisory).
 *
 * Powered by embla-carousel-react with the autoplay plugin. Built-in
 * a11y posture:
 *   - Auto-rotate pauses on hover and on focus-within (Autoplay plugin)
 *   - Auto-rotate pauses when the tab is hidden
 *   - Manual prev/next buttons + dot indicators
 *   - Visible pause/play toggle (WCAG 2.2.2)
 *   - prefers-reduced-motion disables autoplay entirely
 */
export default function BuildsCarousel({
  slides,
  autoplayMs = 6000,
  ariaLabel,
}: Props) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const autoplayEnabled = autoplayMs > 0 && !prefersReducedMotion;

  const autoplayRef = useRef(
    Autoplay({ delay: autoplayMs, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    autoplayEnabled ? [autoplayRef.current] : [],
  );

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // Track selected slide for dot indicators.
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIdx(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Pause autoplay when the document is hidden.
  useEffect(() => {
    if (!autoplayEnabled) return;
    const onVis = () => {
      const ap = autoplayRef.current;
      if (document.visibilityState === "hidden") ap.stop();
      else if (!paused) ap.play();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [autoplayEnabled, paused]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const togglePaused = useCallback(() => {
    const ap = autoplayRef.current;
    setPaused((prev) => {
      const next = !prev;
      if (next) ap.stop();
      else ap.play();
      return next;
    });
  }, []);

  return (
    <div
      className={styles.carousel}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.track}>
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}: ${slide.label}`}
            >
              {slide.content}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={scrollPrev}
          aria-label="Previous slide"
        >
          <span className={styles.prevIcon} aria-hidden="true">
            <ForwardArrow size="sm" />
          </span>
        </button>

        <div className={styles.dots} role="tablist" aria-label="Select slide">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === selectedIdx}
              aria-label={`Go to slide ${i + 1}: ${slide.label}`}
              tabIndex={i === selectedIdx ? 0 : -1}
              onClick={() => scrollTo(i)}
              className={`${styles.dot} ${i === selectedIdx ? styles.dotActive : ""}`}
            />
          ))}
        </div>

        <button
          type="button"
          className={styles.navBtn}
          onClick={scrollNext}
          aria-label="Next slide"
        >
          <span aria-hidden="true">
            <ForwardArrow size="sm" />
          </span>
        </button>

        {autoplayEnabled ? (
          <button
            type="button"
            className={styles.pauseBtn}
            onClick={togglePaused}
            aria-label={paused ? "Resume auto-advance" : "Pause auto-advance"}
            aria-pressed={paused}
          >
            {paused ? "Play" : "Pause"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduced(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}
