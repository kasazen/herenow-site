import type { UnlockPayload } from "./api";

export function readGate(form: HTMLFormElement): UnlockPayload | { error: string } {
  const data = new FormData(form);
  const email = (data.get("email") as string | null)?.trim() ?? "";
  const firstName = (data.get("firstName") as string | null)?.trim() ?? "";

  if (!isEmail(email)) return { error: "That doesn't look like an email address." };

  return { id: "", email, firstName: firstName || undefined };
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function showGateError(message: string): void {
  const el = document.getElementById("gate-error") as HTMLParagraphElement | null;
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
}

export function clearGateError(): void {
  const el = document.getElementById("gate-error") as HTMLParagraphElement | null;
  if (!el) return;
  el.hidden = true;
  el.textContent = "";
}
