import "./styles.css";
import { mountHero } from "./animations/hero";
import { mountCalendly } from "./calendly";
import { mountAnalytics, observeScrollDepth, track } from "./analytics";

function ready(fn: () => void): void {
  if (document.readyState !== "loading") fn();
  else document.addEventListener("DOMContentLoaded", fn, { once: true });
}

ready(() => {
  mountAnalytics();

  const canvas = document.getElementById("hero-canvas") as HTMLCanvasElement | null;
  const heroLine = document.getElementById("hero-line");
  if (canvas) {
    mountHero(canvas, () => {
      heroLine?.classList.add("is-visible");
      track("hero_complete");
    });
  } else {
    heroLine?.classList.add("is-visible");
  }

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
});
