// Modal-based "First Read" lead magnet.
// One module. URL intake → generate → teaser + email gate → unlock + email.

import { track } from "./analytics";

type State = "intake" | "generating" | "teaser" | "unlocking" | "full" | "soft-launch";

type Section = {
  index: number;
  title: string;
  body: string;
  locked?: boolean;
};

type GenerateResponse = {
  id: string;
  cover: { echo: string; date: string; domain: string };
  sections: Section[];
};

type UnlockResponse = {
  sections: Section[];
};

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.trim() ?? "";
const IS_DEV = import.meta.env.DEV;
const API_OK = API_URL.length > 0 || IS_DEV;

let memoId: string | null = null;
let lastFocused: HTMLElement | null = null;

export function mountLeadMagnet(): void {
  const modal = document.getElementById("lead-magnet-modal");
  if (!modal) return;

  // Triggers
  document.querySelectorAll<HTMLElement>("[data-lm-open]").forEach((el) => {
    el.addEventListener("click", openModal);
  });

  // Closers (backdrop, X, post-CTA)
  modal.querySelectorAll<HTMLElement>("[data-lm-close]").forEach((el) => {
    el.addEventListener("click", () => closeModal());
  });

  // ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  // Forms
  const intakeForm = document.getElementById("lm-intake-form") as HTMLFormElement | null;
  const gateForm = document.getElementById("lm-gate-form") as HTMLFormElement | null;
  if (intakeForm) intakeForm.addEventListener("submit", onIntakeSubmit);
  if (gateForm) gateForm.addEventListener("submit", onGateSubmit);
}

function openModal(): void {
  const modal = document.getElementById("lead-magnet-modal");
  if (!modal) return;
  lastFocused = (document.activeElement as HTMLElement) ?? null;
  modal.hidden = false;
  document.body.classList.add("lm-open");
  setState(API_OK ? "intake" : "soft-launch");
  track("lm_opened");
  // Focus the URL field after the open animation settles.
  requestAnimationFrame(() => {
    const focusTarget = modal.querySelector<HTMLElement>(
      'input[type="text"], input[type="email"], button[data-lm-close], button[type="submit"]',
    );
    focusTarget?.focus();
  });
}

function closeModal(): void {
  const modal = document.getElementById("lead-magnet-modal");
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("lm-open");
  resetModal();
  if (lastFocused) lastFocused.focus();
}

function resetModal(): void {
  memoId = null;
  const intakeForm = document.getElementById("lm-intake-form") as HTMLFormElement | null;
  const gateForm = document.getElementById("lm-gate-form") as HTMLFormElement | null;
  intakeForm?.reset();
  gateForm?.reset();
  hideError("lm-intake-error");
  hideError("lm-gate-error");
  const body = document.getElementById("lm-body");
  if (body) body.replaceChildren();
}

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
      return state === "teaser" || state === "unlocking" || state === "full";
    case "gate":
      return state === "teaser" || state === "unlocking";
    case "post":
      return state === "full";
    case "soft-launch":
      return state === "soft-launch";
    default:
      return false;
  }
}

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
  setStatus("Reading your homepage…");
  track("lm_started");

  // Cycle through reassuring status updates while we wait.
  const statusTimer = window.setInterval(() => {
    const status = document.getElementById("lm-status");
    if (!status) return;
    const cycle = ["Reading your homepage…", "Looking for the seams…", "Drafting your read…"];
    const current = status.textContent ?? "";
    const idx = cycle.indexOf(current);
    status.textContent = cycle[(idx + 1) % cycle.length];
  }, 4500);

  try {
    const response = await callGenerate({ url, prompting });
    memoId = response.id;
    renderTeaser(response);
    setState("teaser");
    track("lm_teaser_shown");
  } catch (err) {
    const message = err instanceof Error ? err.message : "We had trouble reading that URL. Try again.";
    setState("intake");
    showError("lm-intake-error", message);
  } finally {
    window.clearInterval(statusTimer);
  }
}

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
    renderFull(response.sections);
    const confirm = document.getElementById("lm-post-confirm");
    if (confirm) confirm.textContent = `Sent to ${email}. The full version is in your inbox.`;
    setState("full");
    track("lm_unlocked");
  } catch (err) {
    const message = err instanceof Error ? err.message : "We had trouble sending that. Try again.";
    setState("teaser");
    showError("lm-gate-error", message);
  }
}

// ─── Rendering ──────────────────────────────────────────────────

function renderTeaser(response: GenerateResponse): void {
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
    const isClosing = section.index === response.sections.length;
    body.appendChild(sectionEl(section, isClosing));
  }
}

function renderFull(sections: Section[]): void {
  const body = document.getElementById("lm-body");
  if (!body) return;
  body.classList.add("lm-body--unlocking");
  body.replaceChildren();
  for (const section of sections) {
    const isClosing = section.index === sections.length;
    body.appendChild(sectionEl(section, isClosing));
  }
  requestAnimationFrame(() => body.classList.remove("lm-body--unlocking"));
}

function sectionEl(section: Section, isClosing: boolean): HTMLElement {
  const el = document.createElement("section");
  el.className = "lm-section";
  el.dataset.index = String(section.index);
  if (section.locked) el.classList.add("lm-section--locked");
  if (isClosing) el.classList.add("lm-section--closing");

  const label = document.createElement("p");
  label.className = "lm-section__label";
  label.textContent = String(section.index).padStart(2, "0");

  const title = document.createElement("h4");
  title.className = "lm-section__title";
  title.textContent = section.title;

  el.appendChild(label);
  el.appendChild(title);

  if (section.locked) {
    const teaser = paragraphsEl([extractFirstSentence(section.body)]);
    el.appendChild(teaser);
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
  for (let i = 0; i < 3; i++) {
    const line = document.createElement("span");
    line.className = "lm-redact-line";
    line.style.width = `${68 + Math.random() * 24}%`;
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

// ─── API ─────────────────────────────────────────────────────────

async function callGenerate(payload: { url: string; prompting: string }): Promise<GenerateResponse> {
  if (!API_URL) {
    if (IS_DEV) return mockGenerate(payload);
    throw new Error("The tool isn't quite live yet — try again shortly.");
  }
  const res = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.message || "We had trouble reading that URL. Try again.");
  }
  return (await res.json()) as GenerateResponse;
}

async function callUnlock(payload: { id: string; email: string; firstName: string }): Promise<UnlockResponse> {
  if (!API_URL) {
    if (IS_DEV) return mockUnlock();
    throw new Error("The tool isn't quite live yet.");
  }
  const res = await fetch(`${API_URL}/unlock`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await safeJson(res);
    throw new Error(data?.message || "We had trouble sending that.");
  }
  return (await res.json()) as UnlockResponse;
}

async function safeJson(res: Response): Promise<{ message?: string } | null> {
  try {
    return (await res.json()) as { message?: string };
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

function setStatus(text: string): void {
  const el = document.getElementById("lm-status");
  if (el) el.textContent = text;
}

// ─── Dev mock ────────────────────────────────────────────────────

async function mockGenerate(payload: { url: string }): Promise<GenerateResponse> {
  await delay(2200);
  let domain = "your-business.com";
  try {
    const u = payload.url.startsWith("http") ? payload.url : "https://" + payload.url;
    domain = new URL(u).host.replace(/^www\./, "");
  } catch {
    /* keep default */
  }
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
        title: "What we read on your homepage",
        body:
          "What's foregrounded on the page is the work itself — the offer is concrete and the proof points are operational. The voice is steady; you're not reaching for adjectives. The site assumes the reader already knows the category.\n\nWhat's notably absent is the usual marketing apparatus: no resource center, no gated whitepapers, no promotional banner. That choice tells us something about how the business is run.",
      },
      {
        index: 2,
        title: "Where the leverage tends to live",
        body:
          "In operations like the one we just read, leverage sits in two places. The first is the seam between sales and delivery — the place where promises are translated into work and information is rewritten on the way through. The second is the judgment-heavy repetitive work that a senior person redoes because the junior version isn't reliable enough.",
      },
      {
        index: 3,
        title: "Where AI is shifting your numbers",
        body:
          "Two shifts are real for businesses of this kind. On the cost side, the work currently being paid for at full price — research, drafting, first-pass classification — is being repriced fast. On the revenue side, the unit economics of acquisition bend where AI helps a small team punch above its weight on personalization and response time.",
      },
      {
        index: 4,
        title: "Two questions we'd ask first",
        body:
          "First: where in your operation does a senior person re-do the work of a junior person because the junior person's output isn't reliable enough? That's where AI sits in the middle.\n\nSecond: which of your customers, if you could serve them twice as quickly, would be willing to buy more from you?",
      },
      {
        index: 5,
        title: "A note on what this can't see",
        body:
          "We read your homepage. We didn't read your numbers. This memo is patterns, not your specifics. What Here Now does in two weeks is what we can only read in person — your contracts, your team, your customers, the actual systems, the actual numbers. The recommendations from that have dollar figures attached. This memo doesn't.",
      },
    ],
  };
}

async function mockUnlock(): Promise<UnlockResponse> {
  await delay(900);
  const generated = await mockGenerate({ url: "" });
  return { sections: generated.sections.map((s) => ({ ...s, locked: false })) };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
