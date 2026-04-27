import "./styles.css";
import { mountHero } from "./animations/hero";
import { mountAudit } from "./animations/audit";
import { mountMemo } from "./animations/memo";
import { mountWedge } from "./animations/wedge";
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

  const audit = document.getElementById("audit-canvas") as HTMLCanvasElement | null;
  if (audit) mountAudit(audit);

  const memo = document.getElementById("memo-canvas") as HTMLCanvasElement | null;
  if (memo) mountMemo(memo);

  const wedge = document.getElementById("wedge-canvas") as HTMLCanvasElement | null;
  if (wedge) mountWedge(wedge);

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
