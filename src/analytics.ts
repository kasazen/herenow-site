/**
 * Lightweight Plausible wrapper. The script is injected by main.ts only
 * if VITE_PLAUSIBLE_DOMAIN is set, so dev runs stay clean.
 */

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, unknown> }) => void;
  }
}

export function mountAnalytics(): void {
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
  if (!domain) return;

  const s = document.createElement("script");
  s.defer = true;
  s.dataset.domain = domain;
  s.src = "https://plausible.io/js/script.tagged-events.js";
  document.head.appendChild(s);
}

export function track(event: string, props?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (typeof window.plausible === "function") {
    window.plausible(event, props ? { props } : undefined);
  }
}

export function observeScrollDepth(targets: Array<{ selector: string; event: string }>): void {
  for (const t of targets) {
    const el = document.querySelector(t.selector);
    if (!el) continue;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            track(t.event);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
  }
}
