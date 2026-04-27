import "./styles.css";
import { mountHero } from "./animations/hero";
import { mountCalendly } from "./calendly";
import { mountAnalytics, observeScrollDepth } from "./analytics";

function ready(fn: () => void): void {
  if (document.readyState !== "loading") fn();
  else document.addEventListener("DOMContentLoaded", fn, { once: true });
}

ready(() => {
  mountAnalytics();

  const hero = document.getElementById("hero-svg") as SVGSVGElement | null;
  if (hero) mountHero(hero);

  const calendly = document.getElementById("calendly");
  const calendlyFallback = document.getElementById("calendly-fallback");
  if (calendly) mountCalendly(calendly, calendlyFallback);

  observeScrollDepth([
    { selector: ".premise", event: "scroll_premise" },
    { selector: ".block--audit", event: "scroll_audit" },
    { selector: ".block--memo", event: "scroll_memo" },
    { selector: ".block--wedge", event: "scroll_wedge" },
    { selector: ".waitlist", event: "scroll_waitlist" },
  ]);

  mountScrollProgress();
});

function mountScrollProgress(): void {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  let queued = false;
  function update(): void {
    queued = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar!.style.width = `${ratio * 100}%`;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();
}
