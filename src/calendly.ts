import { track } from "./analytics";

const CALENDLY_SCRIPT = "https://assets.calendly.com/assets/external/widget.js";
const CALENDLY_CSS = "https://assets.calendly.com/assets/external/widget.css";

/**
 * Append theming params so the embedded widget matches the page palette.
 * Calendly accepts these on the inline embed URL.
 */
function themedUrl(base: string): string {
  const url = new URL(base);
  if (!url.searchParams.has("background_color")) url.searchParams.set("background_color", "ffffff");
  if (!url.searchParams.has("text_color")) url.searchParams.set("text_color", "14141a");
  if (!url.searchParams.has("primary_color")) url.searchParams.set("primary_color", "15803d");
  if (!url.searchParams.has("hide_landing_page_details")) url.searchParams.set("hide_landing_page_details", "1");
  if (!url.searchParams.has("hide_gdpr_banner")) url.searchParams.set("hide_gdpr_banner", "1");
  return url.toString();
}

export function mountCalendly(container: HTMLElement, fallback: HTMLElement | null): void {
  const raw = (import.meta.env.VITE_CALENDLY_URL as string | undefined)?.trim();

  if (!raw) {
    container.hidden = true;
    if (fallback) fallback.hidden = false;
    return;
  }

  container.setAttribute("data-url", themedUrl(raw));

  const load = (): void => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = CALENDLY_CSS;
    document.head.appendChild(css);

    const script = document.createElement("script");
    script.src = CALENDLY_SCRIPT;
    script.async = true;
    document.body.appendChild(script);

    // Calendly emits postMessage events for lifecycle. Track booking confirmation
    // so we can measure the hypothesis end-to-end.
    window.addEventListener("message", (e) => {
      if (typeof e.data !== "object" || e.data == null) return;
      const ev = (e.data as { event?: string }).event;
      if (typeof ev !== "string" || !ev.startsWith("calendly.")) return;
      if (ev === "calendly.event_scheduled") track("calendly_booked");
      else if (ev === "calendly.event_type_viewed") track("calendly_viewed");
    });
  };

  // Defer the Calendly bundle until the booking section is near the viewport.
  // Saves ~40 KB and two third-party requests for users who never scroll to #book.
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          obs.disconnect();
          load();
        }
      },
      { rootMargin: "400px 0px" },
    );
    obs.observe(container);
  } else {
    load();
  }
}
