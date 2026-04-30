// Modal-based "First Read" lead magnet.
//
// Flow: intake → generating (streaming observations) → teaser (Section 01
// + redacted previews + email gate) → unlocking → sent. The "sent"
// state hides the memo entirely; the email is the only path to the rest.

import { track } from "./analytics";

type State = "intake" | "generating" | "teaser" | "unlocking" | "sent" | "soft-launch";

type Section = {
  index: number;
  title: string;
  body: string;
  locked?: boolean;
};

type CompletePayload = {
  id: string;
  cover: { echo: string; date: string; domain: string };
  sections: Section[];
};

type UnlockResponse = { ok: boolean; sentTo?: string; message?: string };

const IS_DEV = import.meta.env.DEV;
const API_OVERRIDE = (import.meta.env.VITE_API_URL as string | undefined)?.trim() ?? "";
const API_URL = API_OVERRIDE || (IS_DEV ? "" : "/api");
const API_OK = API_URL.length > 0 || IS_DEV;

let memoId: string | null = null;
let lastFocused: HTMLElement | null = null;
let activeAbort: AbortController | null = null;

export function mountLeadMagnet(): void {
  const modal = document.getElementById("lead-magnet-modal");
  if (!modal) return;

  document.querySelectorAll<HTMLElement>("[data-lm-open]").forEach((el) => {
    el.addEventListener("click", openModal);
  });
  modal.querySelectorAll<HTMLElement>("[data-lm-close]").forEach((el) => {
    el.addEventListener("click", () => closeModal());
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  document.getElementById("lm-intake-form")?.addEventListener("submit", onIntakeSubmit);
  document.getElementById("lm-gate-form")?.addEventListener("submit", onGateSubmit);
}

// ── Modal show/hide ─────────────────────────────────────────────────────

function openModal(): void {
  const modal = document.getElementById("lead-magnet-modal");
  if (!modal) return;
  lastFocused = (document.activeElement as HTMLElement) ?? null;
  modal.hidden = false;
  document.body.classList.add("lm-open");
  setState(API_OK ? "intake" : "soft-launch");
  track("lm_opened");
  requestAnimationFrame(() => {
    const t = modal.querySelector<HTMLElement>(
      'input[type="text"], input[type="email"], button[data-lm-close], button[type="submit"]',
    );
    t?.focus();
  });
}

function closeModal(): void {
  const modal = document.getElementById("lead-magnet-modal");
  if (!modal) return;
  if (activeAbort) {
    activeAbort.abort();
    activeAbort = null;
  }
  modal.hidden = true;
  document.body.classList.remove("lm-open");
  resetModal();
  if (lastFocused) lastFocused.focus();
}

function resetModal(): void {
  memoId = null;
  (document.getElementById("lm-intake-form") as HTMLFormElement | null)?.reset();
  (document.getElementById("lm-gate-form") as HTMLFormElement | null)?.reset();
  hideError("lm-intake-error");
  hideError("lm-gate-error");
  document.getElementById("lm-body")?.replaceChildren();
  document.getElementById("lm-stream")?.replaceChildren();
}

// ── State machine ───────────────────────────────────────────────────────

function setState(state: State): void {
  const inner = document.querySelector<HTMLElement>(".lm__inner");
  if (!inner) return;
  inner.dataset.lmState = state;
  inner.querySelectorAll<HTMLElement>("[data-lm-step]").forEach((el) => {
    el.hidden = !shouldShow(el.dataset.lmStep!, state);
  });
}

function shouldShow(step: string, state: State): boolean {
  switch (step) {
    case "intake":
      return state === "intake";
    case "generating":
      return state === "generating";
    case "memo":
      return state === "teaser" || state === "unlocking";
    case "gate":
      return state === "teaser" || state === "unlocking";
    case "sent":
      return state === "sent";
    case "soft-launch":
      return state === "soft-launch";
    default:
      return false;
  }
}

// ── Intake → streaming generate ─────────────────────────────────────────

async function onIntakeSubmit(ev: SubmitEvent): Promise<void> {
  ev.preventDefault();
  const form = ev.currentTarget as HTMLFormElement;
  hideError("lm-intake-error");

  const data = new FormData(form);
  const url = (data.get("url") as string | null)?.trim() ?? "";
  const prompting = (data.get("prompting") as string | null)?.trim() ?? "";

  if (!url) {
    showError("lm-intake-error", "Add the URL of your business.");
    return;
  }

  setState("generating");
  document.getElementById("lm-stream")?.replaceChildren();
  // Seed an immediate "reading" line so the modal has motion at t=0,
  // before the server's first progress event arrives.
  appendStreamLine(seedHostFromUrl(url) ?? "reading the site", true);
  track("lm_started");

  try {
    const response = await streamGenerate({ url, prompting });
    memoId = response.id;
    renderTeaser(response);
    setState("teaser");
    track("lm_teaser_shown");
  } catch (err) {
    const message = err instanceof Error ? err.message : "We had trouble reading that URL. Try again.";
    setState("intake");
    showError("lm-intake-error", message);
  }
}

// ── Streaming generate with SSE ─────────────────────────────────────────

async function streamGenerate(payload: { url: string; prompting: string }): Promise<CompletePayload> {
  if (!API_URL) {
    if (IS_DEV) return mockStream(payload);
    throw new Error("The tool isn't quite live yet — try again shortly.");
  }

  if (activeAbort) activeAbort.abort();
  activeAbort = new AbortController();

  const res = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "text/event-stream" },
    body: JSON.stringify(payload),
    signal: activeAbort.signal,
  });

  if (!res.ok) {
    const data = await safeJson(res);
    if (data?.message) throw new Error(data.message);
    if (res.status >= 500) throw new Error("Something went wrong on our end. Try again in a moment.");
    throw new Error("We had trouble reading that URL. Try again.");
  }
  if (!res.body) throw new Error("No response from the server.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  let complete: CompletePayload | null = null;
  let errorMsg: string | null = null;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let nl: number;
    while ((nl = buffer.indexOf("\n\n")) !== -1) {
      const block = buffer.slice(0, nl);
      buffer = buffer.slice(nl + 2);
      const eventLine = block.split("\n").find((l) => l.startsWith("event:"));
      const dataLine = block.split("\n").find((l) => l.startsWith("data:"));
      if (!eventLine || !dataLine) continue;
      const event = eventLine.slice(6).trim();
      const dataStr = dataLine.slice(5).trim();
      if (!dataStr) continue;
      let data: { text?: string; index?: number; title?: string; message?: string; code?: string } & CompletePayload;
      try {
        data = JSON.parse(dataStr);
      } catch {
        continue;
      }

      if (event === "observation" && data.text) {
        appendStreamLine(data.text);
      } else if (event === "progress" && data.text) {
        appendStreamLine(data.text, true);
      } else if (event === "section_start" && typeof data.index === "number" && data.title) {
        appendStreamLine(`${String(data.index).padStart(2, "0")} · ${data.title}`, true);
      } else if (event === "complete") {
        complete = { id: data.id, cover: data.cover, sections: data.sections };
      } else if (event === "error") {
        errorMsg = data.message ?? "We had trouble reading that URL. Try again.";
      }
    }
  }

  activeAbort = null;
  if (errorMsg) throw new Error(errorMsg);
  if (!complete) throw new Error("The read didn't finish. Try again.");
  return complete;
}

// ── Stream-line UI ──────────────────────────────────────────────────────

function seedHostFromUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const host = new URL(withScheme).host.replace(/^www\./, "");
    return host ? `reading ${host}` : null;
  } catch {
    return null;
  }
}

function appendStreamLine(text: string, isHeader = false): void {
  const stream = document.getElementById("lm-stream");
  if (!stream) return;
  const li = document.createElement("li");
  li.className = "lm-stream__line" + (isHeader ? " lm-stream__line--header" : "");
  li.textContent = text;
  // Newest at top, fades up into view.
  stream.prepend(li);
  // Cap visible items so the modal doesn't grow without bound.
  const items = stream.querySelectorAll<HTMLLIElement>(".lm-stream__line");
  if (items.length > 6) {
    for (let i = 6; i < items.length; i++) items[i].classList.add("lm-stream__line--fading");
  }
  if (items.length > 10) {
    for (let i = 10; i < items.length; i++) items[i].remove();
  }
}

// ── Teaser render (unchanged behavior) ──────────────────────────────────

function renderTeaser(response: CompletePayload): void {
  const echo = document.getElementById("lm-echo");
  const date = document.getElementById("lm-date");
  const domain = document.getElementById("lm-domain");
  const body = document.getElementById("lm-body");
  if (!echo || !date || !domain || !body) return;

  echo.textContent = response.cover.echo;
  date.textContent = response.cover.date;
  domain.textContent = response.cover.domain;

  body.replaceChildren();
  for (const section of response.sections) {
    body.appendChild(sectionEl(section));
  }
}

function sectionEl(section: Section): HTMLElement {
  const el = document.createElement("section");
  el.className = "lm-section";
  el.dataset.index = String(section.index);
  if (section.locked) el.classList.add("lm-section--locked");

  const label = document.createElement("p");
  label.className = "lm-section__label";
  label.textContent = String(section.index).padStart(2, "0");

  const title = document.createElement("h4");
  title.className = "lm-section__title";
  title.textContent = section.title;

  el.appendChild(label);
  el.appendChild(title);

  if (section.locked) {
    el.appendChild(paragraphsEl([extractFirstSentence(section.body)]));
    el.appendChild(redactedEl());
  } else {
    el.appendChild(paragraphsEl(splitParagraphs(section.body)));
  }
  return el;
}

function paragraphsEl(paragraphs: string[]): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "lm-section__body";
  for (const p of paragraphs) {
    const para = document.createElement("p");
    para.textContent = p;
    wrap.appendChild(para);
  }
  return wrap;
}

function redactedEl(): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "lm-section__redacted";
  // Five lines of varying widths — reads as a redacted paragraph, with the
  // last line shorter (paragraph end). Widths are deterministic-feeling
  // rather than uniform skeleton bars.
  const widths = [96, 88, 92, 80, 54];
  for (const w of widths) {
    const line = document.createElement("span");
    line.className = "lm-redact-line";
    line.style.width = `${w + (Math.random() * 4 - 2)}%`;
    wrap.appendChild(line);
  }
  return wrap;
}

function splitParagraphs(body: string): string[] {
  return body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
}

function extractFirstSentence(body: string): string {
  const flat = body.replace(/\s+/g, " ").trim();
  const m = flat.match(/^(.+?[.!?])(\s|$)/);
  return m ? m[1] : flat.slice(0, 140) + "…";
}

// ── Email gate → unlock → sent ──────────────────────────────────────────

async function onGateSubmit(ev: SubmitEvent): Promise<void> {
  ev.preventDefault();
  const form = ev.currentTarget as HTMLFormElement;
  hideError("lm-gate-error");

  const data = new FormData(form);
  const email = (data.get("email") as string | null)?.trim() ?? "";
  const firstName = (data.get("firstName") as string | null)?.trim() ?? "";

  if (!isEmail(email)) {
    showError("lm-gate-error", "That doesn't look like an email address.");
    return;
  }
  if (!memoId) {
    showError("lm-gate-error", "Something went wrong. Try again.");
    return;
  }

  setState("unlocking");

  try {
    const response = await callUnlock({ id: memoId, email, firstName });
    if (!response.ok) {
      throw new Error(response.message ?? "We couldn't deliver the email. Try again in a moment.");
    }
    const headline = document.getElementById("lm-sent-headline");
    if (headline) headline.textContent = `Your read is on its way to ${response.sentTo ?? email}.`;
    setState("sent");
    track("lm_unlocked");
  } catch (err) {
    const message = err instanceof Error ? err.message : "We had trouble sending that. Try again.";
    setState("teaser");
    showError("lm-gate-error", message);
  }
}

async function callUnlock(payload: { id: string; email: string; firstName: string }): Promise<UnlockResponse> {
  if (!API_URL) {
    if (IS_DEV) {
      await delay(900);
      return { ok: true, sentTo: payload.email };
    }
    throw new Error("The tool isn't quite live yet.");
  }
  const res = await fetch(`${API_URL}/unlock`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await safeJson(res)) as UnlockResponse | null;
  if (!res.ok) {
    return { ok: false, message: data?.message ?? "We had trouble sending that. Try again." };
  }
  return data ?? { ok: true, sentTo: payload.email };
}

// ── Helpers ─────────────────────────────────────────────────────────────

async function safeJson(res: Response): Promise<{ message?: string; [k: string]: unknown } | null> {
  try {
    return (await res.clone().json()) as { message?: string };
  } catch {
    return null;
  }
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function showError(id: string, message: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
}

function hideError(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = "";
  el.hidden = true;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Dev mock (only fires when no API URL set in dev) ────────────────────

async function mockStream(payload: { url: string }): Promise<CompletePayload> {
  let domain = "your-business.com";
  try {
    const u = payload.url.startsWith("http") ? payload.url : "https://" + payload.url;
    domain = new URL(u).host.replace(/^www\./, "");
  } catch {
    /* keep default */
  }
  // Mirror the real backend's scrape-progress events.
  await delay(300);
  appendStreamLine(`reading ${domain}`, true);
  await delay(500);
  appendStreamLine("reading /services", true);
  await delay(400);
  appendStreamLine("reading /about", true);
  await delay(900);
  appendStreamLine("read 3 pages · drafting", true);
  await delay(500);
  appendStreamLine("A focused operating company in a category where execution discipline still beats hype.");
  await delay(800);
  appendStreamLine("01 · What we see in your operation", true);
  await delay(700);
  appendStreamLine("What's foregrounded is the work itself — the offer is concrete and the proof points are operational.");
  await delay(600);
  appendStreamLine("02 · Where the leverage tends to live", true);
  await delay(700);
  appendStreamLine("In operations like this, leverage sits in the seams between teams.");
  await delay(800);
  appendStreamLine("03 · Where AI is shifting your numbers", true);
  await delay(900);
  return {
    id: "mock-" + Math.random().toString(36).slice(2, 10),
    cover: {
      echo: "A focused operating company in a category where execution discipline still beats hype.",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      domain,
    },
    sections: [
      {
        index: 1,
        title: "What we see in your operation",
        body:
          "What's foregrounded is the work itself — the offer is concrete and the proof points are operational. The voice is steady; you're not reaching for adjectives.\n\nWhat's notably absent is the usual marketing apparatus: no resource center, no gated whitepapers, no promotional banner. That choice tells us something about how the business is run.",
      },
      {
        index: 2,
        title: "Where the leverage tends to live",
        body:
          "In operations like this, leverage sits in two places. The first is the seam between sales and delivery. The second is the judgment-heavy repetitive work that a senior person redoes because the junior version isn't reliable enough.",
      },
      {
        index: 3,
        title: "Where AI is shifting your numbers",
        body:
          "Two shifts are real for businesses of this kind. On the cost side, the work currently being paid for at full price is being repriced fast. On the revenue side, the unit economics of acquisition bend where AI helps a small team punch above its weight.",
      },
      {
        index: 4,
        title: "Two questions we'd ask first",
        body:
          "Where in your operation does a senior person re-do the work of a junior person?\n\nWhich of your customers, if you could serve them twice as quickly, would buy more from you?",
      },
      {
        index: 5,
        title: "A note on what this can't see",
        body:
          "We read what's public. We didn't read your numbers. This memo is patterns, not your specifics. What Here Now does in two weeks is what we can only read in person.",
      },
    ],
  };
}
