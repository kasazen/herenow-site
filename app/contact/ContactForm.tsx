"use client";

import { useState } from "react";
import styles from "./page.module.css";

type Status = "idle" | "submitting" | "ok" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      revenue: String(data.get("revenue") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      website: String(data.get("website") ?? "").trim(),
    };

    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await r.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null;
      if (!r.ok || !body?.ok) {
        setStatus("error");
        setErrorMessage(
          body?.message ??
            "We couldn't deliver your note. Email team@herenowlabs.xyz directly.",
        );
        return;
      }
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Try again, or email team@herenowlabs.xyz directly.");
    }
  }

  if (status === "ok") {
    return (
      <div className="form-success" role="status">
        Got it — thanks for writing. Someone on the team will reply within a business day, usually faster. If you do not hear back, your note may have hit a filter; the backup inbox is{" "}
        <a href="mailto:team@herenowlabs.xyz">team@herenowlabs.xyz</a>.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={styles.form} noValidate>
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-10000px", top: "auto", height: 0, overflow: "hidden" }}
      >
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.formGrid}>
        <div className="form-row">
          <label htmlFor="contact-name">Your name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="contact-company">Company</label>
          <input
            id="contact-company"
            name="company"
            type="text"
            autoComplete="organization"
          />
        </div>
        <div className="form-row">
          <label htmlFor="contact-revenue">Approximate annual revenue</label>
          <select id="contact-revenue" name="revenue" defaultValue="">
            <option value="" disabled>
              Choose a band (optional)
            </option>
            <option>Under $10M</option>
            <option>$10M – $25M</option>
            <option>$25M – $50M</option>
            <option>$50M – $100M</option>
            <option>$100M – $250M</option>
            <option>$250M+</option>
            <option>Prefer not to say</option>
          </select>
          <span className="form-help">
            We typically engage with operations between $10M and $250M in revenue.
          </span>
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="contact-message">What brings you here?</label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          placeholder="A line or two on the operation and what you are weighing. We will read it carefully."
        />
      </div>

      {status === "error" && errorMessage ? (
        <p className="form-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className={styles.submitRow}>
        <button type="submit" className="btn" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send note"}
        </button>
        <span className="form-help">
          Goes to <a href="mailto:team@herenowlabs.xyz">team@herenowlabs.xyz</a>.
        </span>
      </div>
    </form>
  );
}
