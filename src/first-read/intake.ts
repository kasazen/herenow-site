import type { IntakePayload } from "./api";

export function readIntake(form: HTMLFormElement): IntakePayload | { error: string } {
  const data = new FormData(form);
  const business = (data.get("business") as string | null)?.trim() ?? "";
  const size = (data.get("size") as string | null)?.trim() ?? "";
  const revenue = (data.get("revenue") as string | null)?.trim() ?? "";
  const prompting = (data.get("prompting") as string | null)?.trim() ?? "";
  const firstName = (data.get("firstName") as string | null)?.trim() ?? "";

  if (business.length < 20) return { error: "Tell us a bit more about the business." };
  if (!size) return { error: "Pick a headcount range." };
  if (prompting.length < 15) return { error: "A few honest sentences on what's prompting this." };

  return {
    business,
    size,
    revenue,
    prompting,
    firstName: firstName || undefined,
  };
}

export function showIntakeError(form: HTMLFormElement, message: string): void {
  let banner = form.querySelector<HTMLParagraphElement>(".first-read__form-error");
  if (!banner) {
    banner = document.createElement("p");
    banner.className = "first-read__form-error";
    form.insertBefore(banner, form.querySelector(".first-read__submit"));
  }
  banner.textContent = message;
}

export function clearIntakeError(form: HTMLFormElement): void {
  const banner = form.querySelector<HTMLParagraphElement>(".first-read__form-error");
  if (banner) banner.remove();
}
