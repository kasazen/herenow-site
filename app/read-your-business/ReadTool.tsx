"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

type Phase = "idle" | "reading" | "teaser" | "unlocking" | "sent" | "error";

type Section = {
  index: number;
  title: string;
  body: string;
  locked?: boolean;
};

type CompletePayload = {
  id: string;
  cover: { echo: string; date: string; domain: string; businessName: string };
  sections: Section[];
};

type Stream = {
  progress?: string;
  observations: string[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.trim() || "/api";

export default function ReadTool() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [stream, setStream] = useState<Stream>({ observations: [] });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [memo, setMemo] = useState<CompletePayload | null>(null);
  const [unlockEmail, setUnlockEmail] = useState("");
  const [unlockName, setUnlockName] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  async function onIntake(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setStream({ observations: [] });
    setMemo(null);

    const data = new FormData(event.currentTarget);
    const url = String(data.get("url") ?? "").trim();
    const prompting = String(data.get("prompting") ?? "").trim();
    if (!url) {
      setErrorMessage("Add the URL of your business.");
      return;
    }

    setPhase("reading");
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "text/event-stream" },
        body: JSON.stringify({ url, prompting }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        const json = await res.json().catch(() => null);
        throw new Error(
          (json as { message?: string } | null)?.message ??
            "We had trouble reading that URL. Try again.",
        );
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let result: CompletePayload | null = null;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let blockEnd: number;
        while ((blockEnd = buffer.indexOf("\n\n")) !== -1) {
          const block = buffer.slice(0, blockEnd);
          buffer = buffer.slice(blockEnd + 2);
          const lines = block.split("\n");
          const eventLine = lines.find((l) => l.startsWith("event:"))?.slice(6).trim();
          const dataLine = lines.find((l) => l.startsWith("data:"))?.slice(5).trim();
          if (!eventLine || !dataLine) continue;
          let data: Record<string, unknown>;
          try {
            data = JSON.parse(dataLine) as Record<string, unknown>;
          } catch {
            continue;
          }

          if (eventLine === "progress" && typeof data.text === "string") {
            const text = data.text;
            setStream((s) => ({ ...s, progress: text }));
          } else if (eventLine === "observation" && typeof data.text === "string") {
            const text = data.text;
            setStream((s) => ({
              progress: s.progress,
              observations: [...s.observations, text].slice(-12),
            }));
          } else if (eventLine === "complete") {
            result = data as unknown as CompletePayload;
          } else if (eventLine === "error") {
            throw new Error(
              (data.message as string | undefined) ??
                "We had trouble reading that URL. Try again.",
            );
          }
        }
      }

      if (!result) {
        throw new Error("The read finished without producing a memo. Try again.");
      }

      setMemo(result);
      setPhase("teaser");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setErrorMessage(
        err instanceof Error ? err.message : "We had trouble reading that URL. Try again.",
      );
      setPhase("error");
    }
  }

  async function onUnlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!memo) return;

    const email = unlockEmail.trim().toLowerCase();
    if (!isEmail(email)) {
      setErrorMessage("That doesn't look like an email address.");
      return;
    }

    setPhase("unlocking");
    setErrorMessage(null);
    try {
      const res = await fetch(`${API_BASE}/unlock`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: memo.id, email, firstName: unlockName.trim() || undefined }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; message?: string; sentTo?: string }
        | null;
      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.message ??
            "We couldn't deliver the email. Try again, or write team@herenowlabs.xyz directly.",
        );
      }
      setSentTo(data.sentTo ?? email);
      setPhase("sent");
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "We couldn't deliver the email. Try again, or write team@herenowlabs.xyz directly.",
      );
      setPhase("teaser");
    }
  }

  function reset() {
    abortRef.current?.abort();
    setPhase("idle");
    setStream({ observations: [] });
    setMemo(null);
    setUnlockEmail("");
    setUnlockName("");
    setSentTo(null);
    setErrorMessage(null);
  }

  return (
    <section className={styles.tool}>
      {phase === "idle" || phase === "error" ? (
        <form onSubmit={onIntake} className={styles.intakeForm}>
          <div className="form-row">
            <label htmlFor="rt-url">Your business URL</label>
            <input
              id="rt-url"
              name="url"
              type="url"
              placeholder="https://"
              required
              autoComplete="url"
            />
          </div>
          <div className="form-row">
            <label htmlFor="rt-prompting">
              What should we know? <span style={{ color: "var(--faint)" }}>(optional)</span>
            </label>
            <textarea
              id="rt-prompting"
              name="prompting"
              rows={4}
              maxLength={600}
              placeholder="A line on what is on your mind. We read this before we read the site."
            />
          </div>
          {errorMessage ? (
            <p className="form-error" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <button type="submit" className="btn">
            Read my business
          </button>
        </form>
      ) : null}

      {phase === "reading" ? (
        <div className={styles.reading} role="status" aria-live="polite">
          <p className={styles.readingHead}>
            <em>Reading.</em>{" "}
            <span style={{ color: "var(--muted)" }}>
              {stream.progress ?? "Opening the door"}
            </span>
          </p>
          <ul className={styles.observations}>
            {stream.observations.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {phase === "teaser" || phase === "unlocking" ? memo ? (
        <div className={styles.teaser}>
          <header className={styles.teaserHeader}>
            <p className="eyebrow">A short read on your business</p>
            <h2 className={styles.teaserTitle}>
              {memo.cover.businessName || memo.cover.domain}
            </h2>
            <p className={styles.teaserDate}>{memo.cover.date}</p>
          </header>

          <div className={styles.teaserSections}>
            {memo.sections.map((s) => (
              <section key={s.index} className={s.locked ? styles.locked : styles.unlocked}>
                <h3>
                  <span className={styles.teaserNum}>
                    <em>{romanLower(s.index)}.</em>
                  </span>
                  {s.title}
                </h3>
                <p>{s.body}</p>
                {s.locked ? <p className={styles.lockedTag}>continues in your inbox</p> : null}
              </section>
            ))}
          </div>

          <form onSubmit={onUnlock} className={styles.unlockForm}>
            <p className={styles.unlockHead}>
              The remaining four sections arrive by email. We send it once, by hand.
            </p>
            <div className={styles.unlockGrid}>
              <div className="form-row">
                <label htmlFor="rt-name">First name</label>
                <input
                  id="rt-name"
                  type="text"
                  value={unlockName}
                  onChange={(e) => setUnlockName(e.target.value)}
                  autoComplete="given-name"
                />
              </div>
              <div className="form-row">
                <label htmlFor="rt-email">Email</label>
                <input
                  id="rt-email"
                  type="email"
                  required
                  value={unlockEmail}
                  onChange={(e) => setUnlockEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>
            {errorMessage ? (
              <p className="form-error" role="alert">
                {errorMessage}
              </p>
            ) : null}
            <button type="submit" className="btn" disabled={phase === "unlocking"}>
              {phase === "unlocking" ? "Sending…" : "Send the rest to my inbox"}
            </button>
          </form>
        </div>
      ) : null : null}

      {phase === "sent" ? (
        <div className="form-success" role="status">
          <p style={{ margin: 0 }}>
            <strong>Sent to {sentTo}.</strong> If it does not show up in a minute or two, check the promotions folder. The reply-to is a real human inbox.
          </p>
          <p style={{ marginTop: "0.75rem", marginBottom: 0 }}>
            <button onClick={reset} className="btn btn--ghost">
              Read another
            </button>
          </p>
        </div>
      ) : null}
    </section>
  );
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function romanLower(n: number): string {
  const map: Record<number, string> = { 1: "i", 2: "ii", 3: "iii", 4: "iv", 5: "v" };
  return map[n] ?? String(n);
}
