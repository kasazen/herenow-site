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
      company: String(data.get("company") ?? "").trim(),
      role: String(data.get("role") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
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
        Got it &mdash; thanks for writing. Someone on the team will reply within one business day. If you do not hear back, your note may have hit a filter; the backup inbox is{" "}
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

      <div className="form-row">
        <label htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
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
        <label htmlFor="contact-role">Role</label>
        <input
          id="contact-role"
          name="role"
          type="text"
          autoComplete="organization-title"
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
        <label htmlFor="contact-message">What&rsquo;s annoying right now?</label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
        />
      </div>

      {status === "error" && errorMessage ? (
        <p className="form-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className={styles.submitRow}>
        <button type="submit" className="btn" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send the note"}
        </button>
      </div>

      <p className={styles.formNote}>We reply within one business day.</p>
    </form>
  );
}
