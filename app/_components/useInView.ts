"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type Options = {
  /** 0..1 fraction of element visible before triggering. */
  threshold?: number;
  /** Margin around root in px (CSS-style). */
  rootMargin?: string;
  /** If true, sets visible once and stops observing. */
  once?: boolean;
};

/**
 * Track viewport visibility of a single element. Returns a ref to attach
 * and a boolean. Defaults: threshold 0.25, rootMargin "0px 0px -10% 0px",
 * once-only. Falls back to immediate-visible when IntersectionObserver
 * isn't available (SSR-safe — runs only in effect).
 */
export function useInView<T extends Element = HTMLDivElement>(
  options?: Options,
): [RefObject<T | null>, boolean] {
  const { threshold = 0.25, rootMargin = "0px 0px -10% 0px", once = true } = options ?? {};
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, visible];
}
