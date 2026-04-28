import "../styles.css";
import { mountAnalytics, track } from "../analytics";
import { generate, unlock, isApiConfigured, type GenerateResponse, type IntakePayload } from "./api";
import { readIntake, showIntakeError, clearIntakeError } from "./intake";
import { readGate, showGateError, clearGateError } from "./unlock";
import { mountTeaser, mountFull } from "./render-memo";

type State = "intake" | "generating" | "teaser" | "unlocking" | "full" | "soft-launch";

const root = document.getElementById("first-read-root") as HTMLElement | null;
const intakeForm = document.getElementById("intake-form") as HTMLFormElement | null;
const gateForm = document.getElementById("gate-form") as HTMLFormElement | null;
const gateNameField = document.getElementById("gate-name-field") as HTMLElement | null;

let memoId: string | null = null;
let intakeFirstName: string | undefined;

function setState(state: State): void {
  if (!root) return;
  root.dataset.state = state;
  // ARIA hide non-active steps
  root.querySelectorAll<HTMLElement>("[data-step]").forEach((el) => {
    el.hidden = !shouldShow(el.dataset.step!, state);
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
  if (!intakeForm) return;
  clearIntakeError(intakeForm);

  const result = readIntake(intakeForm);
  if ("error" in result) {
    showIntakeError(intakeForm, result.error);
    return;
  }

  intakeFirstName = result.firstName;
  if (intakeFirstName && gateNameField) {
    // We already asked for name on intake; hide it on the gate form.
    gateNameField.hidden = true;
  }

  setState("generating");
  track("first_read_started");

  try {
    const response = await generate(result as IntakePayload);
    memoId = response.id;
    mountTeaser(response);
    setState("teaser");
    track("first_read_teaser_shown");
    // Scroll the teaser into view, but gently.
    document.querySelector(".first-read__memo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    setState("intake");
    showIntakeError(intakeForm, "We had trouble generating your read. Try again in a moment.");
    console.error(err);
  }
}

async function onGateSubmit(ev: SubmitEvent): Promise<void> {
  ev.preventDefault();
  if (!gateForm || !memoId) return;
  clearGateError();

  const result = readGate(gateForm);
  if ("error" in result) {
    showGateError(result.error);
    return;
  }

  const firstName = result.firstName ?? intakeFirstName;
  setState("unlocking");

  try {
    const response = await unlock({ id: memoId, email: result.email, firstName });
    mountFull(response.sections);
    track("first_read_unlocked");

    // Set the post-confirm line with the email
    const postConfirm = document.getElementById("post-confirm");
    if (postConfirm) {
      postConfirm.textContent = `Sent to ${result.email}. The full version is in your inbox.`;
    }

    setState("full");
    document.querySelector(".first-read__post")?.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    setState("teaser");
    showGateError("We had trouble sending the rest. Try again in a moment.");
    console.error(err);
  }
}

function ready(fn: () => void): void {
  if (document.readyState !== "loading") fn();
  else document.addEventListener("DOMContentLoaded", fn, { once: true });
}

ready(() => {
  mountAnalytics();

  if (!isApiConfigured()) {
    setState("soft-launch");
    return;
  }

  setState("intake");

  if (intakeForm) intakeForm.addEventListener("submit", onIntakeSubmit);
  if (gateForm) gateForm.addEventListener("submit", onGateSubmit);

  // Track Calendly CTA click via tagged-events convention; no JS needed.
});
