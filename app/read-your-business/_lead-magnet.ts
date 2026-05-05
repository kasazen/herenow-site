// Modal-based "First Read" lead magnet.
//
// Flow: intake → generating (streaming observations) → teaser (Section 01
// + redacted previews + email gate) → unlocking → sent. The "sent"
// state hides the memo entirely; the email is the only path to the rest.

import { track } from "./_analytics";

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

const IS_DEV = typeof process !== "undefined" && process.env.NODE_ENV === "development";
const API_OVERRIDE =
  typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_API_URL ?? "").trim() : "";
const API_URL = API_OVERRIDE || "/api";
const API_OK = true;

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
  document.getElementById("lm-dialog-form")?.addEventListener("submit", onDialogSubmit);

  // Mirror email between top gate and bottom dialog so the user only has
  // to type it once if they've engaged with both.
  const topEmail = document.getElementById("lm-email") as HTMLInputElement | null;
  const bottomEmail = document.getElementById("lm-dialog-email") as HTMLInputElement | null;
  if (topEmail && bottomEmail) {
    topEmail.addEventListener("input", () => {
      if (!bottomEmail.value || bottomEmail.dataset.fromTop === "1") {
        bottomEmail.value = topEmail.value;
        bottomEmail.dataset.fromTop = "1";
      }
    });
    bottomEmail.addEventListener("input", () => {
      bottomEmail.dataset.fromTop = "";
      if (!topEmail.value) topEmail.value = bottomEmail.value;
    });
  }
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
    case "gate":
    case "dialog":
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
  resetStage();
  // Seed an immediate action line so the modal has motion at t=0,
  // before the server's first event arrives.
  setStageAction(seedHostFromUrl(url) ?? "Reading the site");
  setStagePhase("opening the door");
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
        enqueueLearning(data.text);
      } else if (event === "business_name" && data.text) {
        // The model has named the business. Swap the action headline so
        // the modal shows the company by name instead of the domain.
        setStageAction(`Reading ${data.text}`);
      } else if (event === "progress" && data.text) {
        applyProgress(data.text);
      } else if (event === "section_start" && typeof data.index === "number" && data.title) {
        setStagePhase(`writing ${String(data.index).padStart(2, "0")} · ${data.title}`);
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

// ── Generating-state stage ──────────────────────────────────────────────
//
// The generating modal has three zones:
//   - action header (mono accent, persistent — what we're doing)
//   - phase indicator (mono faint, updates per page/section — where we are)
//   - learning line (italic serif, rotates — what we just noticed)
//
// Learnings arrive faster than they can be read, so they go through a
// queue. The current learning displays for at least MIN_HOLD_MS before the
// next one crossfades in. If the queue is empty, the last learning holds.

const MIN_HOLD_MS = 1200;
const FAST_HOLD_MS = 800;

const learningQueue: string[] = [];
let learningTimer: number | null = null;

function seedHostFromUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const host = new URL(withScheme).host.replace(/^www\./, "");
    return host ? `Reading ${host}` : null;
  } catch {
    return null;
  }
}

function resetStage(): void {
  learningQueue.length = 0;
  if (learningTimer !== null) {
    window.clearTimeout(learningTimer);
    learningTimer = null;
  }
  const learning = document.getElementById("lm-stage-learning");
  if (learning) {
    learning.textContent = "";
    learning.classList.remove("is-visible");
  }
  const phase = document.getElementById("lm-stage-phase");
  if (phase) phase.textContent = "";
}

function setStageAction(text: string): void {
  const el = document.getElementById("lm-stage-action");
  if (!el || el.textContent === text) return;
  el.textContent = text;
}

function setStagePhase(text: string): void {
  const el = document.getElementById("lm-stage-phase");
  if (!el) return;
  if (el.textContent === text) return;
  el.classList.remove("is-visible");
  // Reflow then re-add, gives a soft fade for phase changes.
  void el.offsetWidth;
  el.textContent = text;
  el.classList.add("is-visible");
}

// progress events feed BOTH the action line ("Reading mainelygrass.com") and
// the phase indicator ("1 of 4 pages" / "drafting"). Heuristics: lines
// starting with "reading <host>" become the action; pathnames or "read N
// pages" / "drafting" become phase.
function applyProgress(text: string): void {
  const t = text.trim();
  if (/^reading\s+[a-z0-9.-]+\.[a-z]{2,}$/i.test(t)) {
    // primary domain → headline action
    setStageAction(capitalize(t));
    return;
  }
  if (/^reading\s+\//i.test(t)) {
    // "reading /services" → phase indicator
    setStagePhase(t);
    return;
  }
  if (/^read\s+\d+\s+pages?/i.test(t)) {
    setStagePhase("drafting the read");
    return;
  }
  // Fallback: drop into phase.
  setStagePhase(t);
}

function enqueueLearning(text: string): void {
  const trimmed = text.trim();
  if (!trimmed) return;
  // Dedupe against the most-recent enqueued/shown line.
  const tail = learningQueue[learningQueue.length - 1];
  const stage = document.getElementById("lm-stage-learning");
  if (tail === trimmed) return;
  if (!tail && stage?.textContent === trimmed) return;
  learningQueue.push(trimmed);
  if (learningTimer === null) tickLearning();
}

function tickLearning(): void {
  const next = learningQueue.shift();
  if (!next) {
    learningTimer = null;
    return;
  }
  const el = document.getElementById("lm-stage-learning");
  if (!el) {
    learningTimer = null;
    return;
  }
  // Crossfade out, swap text, fade in.
  el.classList.remove("is-visible");
  window.setTimeout(() => {
    el.textContent = next;
    void el.offsetWidth;
    el.classList.add("is-visible");
    // Speed up if backlog is large.
    const hold = learningQueue.length > 2 ? FAST_HOLD_MS : MIN_HOLD_MS;
    learningTimer = window.setTimeout(tickLearning, hold);
  }, 180);
}

function capitalize(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
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

async function onDialogSubmit(ev: SubmitEvent): Promise<void> {
  ev.preventDefault();
  const form = ev.currentTarget as HTMLFormElement;
  hideError("lm-dialog-error");

  const data = new FormData(form);
  const email = (data.get("email") as string | null)?.trim() ?? "";
  const note = (data.get("note") as string | null)?.trim() ?? "";

  if (!isEmail(email)) {
    showError("lm-dialog-error", "Add your email so we know where to write back.");
    return;
  }
  if (!note) {
    showError("lm-dialog-error", "Add a line or two so we know what to look at.");
    return;
  }
  if (!memoId) {
    showError("lm-dialog-error", "Something went wrong. Try again.");
    return;
  }

  // Pull firstName from the top-gate field if the user filled it earlier;
  // bottom dialog deliberately doesn't ask for it again.
  const topName = (document.getElementById("lm-name") as HTMLInputElement | null)?.value.trim() ?? "";

  setState("unlocking");

  try {
    const response = await callUnlock({ id: memoId, email, firstName: topName, note });
    if (!response.ok) {
      throw new Error(response.message ?? "We couldn't send that. Try again in a moment.");
    }
    const headline = document.getElementById("lm-sent-headline");
    if (headline) {
      headline.textContent = `Your read is on its way to ${response.sentTo ?? email} — and we got your note.`;
    }
    setState("sent");
    track("lm_unlocked_with_note");
  } catch (err) {
    const message = err instanceof Error ? err.message : "We had trouble sending that. Try again.";
    setState("teaser");
    showError("lm-dialog-error", message);
  }
}

async function callUnlock(payload: {
  id: string;
  email: string;
  firstName: string;
  note?: string;
}): Promise<UnlockResponse> {
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
  // Dev-only mock. Stays category-neutral on purpose: the goal here is to
  // demo the shape and motion of the experience, not to pretend the model
  // knows the operator's category. Real backend produces specifics.
  await delay(260);
  setStageAction(`Reading ${domain}`);
  setStagePhase("1 of 4 pages");
  await delay(900);
  enqueueLearning(`reading the front door of ${domain}`);
  await delay(700);
  setStagePhase("2 of 4 pages");
  await delay(900);
  enqueueLearning("how they describe what they sell, in their own words");
  await delay(700);
  setStagePhase("3 of 4 pages");
  await delay(900);
  enqueueLearning("the team page tells you which roles they thought were worth a face");
  await delay(700);
  setStagePhase("looking outside the site");
  await delay(900);
  enqueueLearning("checking peer-category benchmarks the site won't tell us");
  await delay(700);
  setStagePhase("drafting the read");
  await delay(800);
  enqueueLearning(`a first-pass operator's read of ${domain} — taking a position, not a summary`);
  await delay(1300);
  setStagePhase("writing 01 · What we'd bet on");
  await delay(900);
  enqueueLearning("the margin lives one layer below where the team's attention is right now");
  await delay(900);
  setStagePhase("writing 02 · Where the leverage tends to live");
  await delay(800);
  enqueueLearning("watch the second-touch — the work that happens between yes and showing up");
  await delay(700);

  const sections: Section[] = [
    {
      index: 1,
      title: "What we'd bet on",
      body:
        `The leverage at ${domain} probably lives one layer below where the team's attention is right now. The work that pays the bills tends to be the most procedural, and the most procedural work is what's getting the fastest cost delta from the current generation of tools — in your category and in every category we look inside.\n\n` +
        "We'd bet there's one workflow the team would describe as boring that, if it ran 3x faster, would change what the week looks like by Friday. The fact that it's boring is the reason nobody on staff has repriced it yet.",
    },
    {
      index: 2,
      title: "Where the leverage tends to live",
      body:
        "Watch the second-touch. A prospect reaches out, somebody on your team takes the call, the work gets quoted, the prospect says \"send me something in writing\" — and then nothing happens for several days because that person is on the next call. The prospect either buys from somebody else or forgets. The window between yes-in-principle and yes-on-paper is where most of this category leaves money on the table.\n\nThe other place is the handoff between the person who books the work and the team that delivers it. The customer is most willing to add scope in that window — and almost nobody is talking to them in it.",
    },
    {
      index: 3,
      title: "Where AI is shifting your numbers",
      body:
        "The seat that intakes a request, qualifies the buyer, and quotes the work is being repriced — by operators in your category who set this up well — to a fraction of what it cost a year ago. That's not a labor-cost story. That's a top-of-funnel story: you stop losing the buyers who don't want to call you back tomorrow.\n\nThe proposal-writing that takes your senior person several hours per bid is being done in minutes by people doing it well — and the faster version is often sharper, because it pulls from the last forty proposals instead of the bidder's memory of the last four.",
    },
    {
      index: 4,
      title: "Two questions we'd ask first",
      body:
        "If your top three accounts all canceled in the same quarter, how long does the company survive on what's left? Most operators we talk to discover the answer is shorter than they'd guess, and they hadn't run the math.\n\nWhich of your offerings would you stop selling tomorrow if you could? The answer usually points at the lowest-margin, most-emotional thing on the book — and the reason it's still on the book is almost always one specific customer.",
    },
    {
      index: 5,
      title: "A note on what this can't see",
      body:
        "We didn't read your contracts. We didn't read the customer who keeps you up at night. We didn't read the handshake with the vendor who's quietly doing more than the contract says, the one person on the team who really runs the operation, or the conversation you had with your accountant last quarter. The numbers we'd care about — gross margin by line, customer concentration, the real seasonality — aren't on the site, because they shouldn't be.\n\nWhat a workshop day inside surfaces that this memo can't: all of it.",
    },
  ];

  const teaserSections: Section[] = sections.map((s) => ({
    index: s.index,
    title: s.title,
    body: s.index === 1 ? s.body : extractFirstSentence(s.body),
    locked: s.index !== 1,
  }));

  return {
    id: "mock-" + Math.random().toString(36).slice(2, 10),
    cover: {
      echo: `A first-pass read of ${domain} from the outside. The margin probably lives one layer below where the team's attention is right now — and the procedural layer is the layer that's been repriced.`,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      domain,
    },
    sections: teaserSections,
  };
}
