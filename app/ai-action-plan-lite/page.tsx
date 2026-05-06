import type { Metadata } from "next";
import Link from "next/link";
import LiteTool from "./LiteTool";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "AI Action Plan (Lite)",
  description:
    "A short version of an AI Action Plan, generated from your URL. Find the AI advantage waiting in your operation. The first section unlocks here.",
};

export default function AIActionPlanLitePage() {
  return (
    <article className={`article ${styles.page}`}>
      <header className={styles.header}>
        <p className="eyebrow">AI Action Plan · Lite</p>
        <h1 className={styles.title}>
          A short version, from your URL.
        </h1>
        <p className="lead" style={{ marginTop: "1rem" }}>
          AI parses what your site shows. You get a short Plan by email — same shape as the real engagement, scoped to what is public.
        </p>
      </header>

      <LiteTool />

      <hr />

      <section className={styles.aside}>
        <h2>What this catches and what it cannot.</h2>
        <p>
          The Lite tool sees what is publicly available. The full engagement sees what is not — your contracts, your vendor records, your renewals calendar, the documents nobody has opened in two years. Lite is a wedge, not the whole.
        </p>
        <p>
          To skip ahead,{" "}
          <Link href="/contact">use the contact form</Link> or{" "}
          <a href="https://cal.com/herenowlabs/intro">book a thirty-minute intro</a>.
        </p>
      </section>
    </article>
  );
}
