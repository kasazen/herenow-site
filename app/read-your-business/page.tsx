import type { Metadata } from "next";
import Link from "next/link";
import ReadTool from "./ReadTool";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Read your business",
  description:
    "A short read on your business — where the leverage tends to live, where AI is shifting the numbers, and the questions we would ask first.",
};

export default function ReadYourBusinessPage() {
  return (
    <article className={`article ${styles.page}`}>
      <header className={styles.header}>
        <p className="eyebrow">Read your business</p>
        <h1 className={styles.title}>
          A short version of what we do, from your URL.
        </h1>
        <p className="lead" style={{ marginTop: "1rem" }}>
          Tell us where to look and we will read your site the way we read engagements: in volume. You will get a short memo by email — the same five-section structure as the real thing, sized for a single sitting. The first section unlocks here; the rest arrives in your inbox.
        </p>
      </header>

      <ReadTool />

      <hr />

      <section className={styles.aside}>
        <h2>What this is and is not.</h2>
        <p>
          This tool reads what is publicly available. The full engagement reads what is not — your contracts, your vendor records, your renewal calendar, the documents on the shared drive that nobody has opened in two years. The web read is sharper than most operators expect, but it is a wedge, not the whole.
        </p>
        <p>
          If the memo lands and you would rather skip the email step and talk to a person —{" "}
          <Link href="/contact">use the contact form</Link>, or{" "}
          <a href="https://cal.com/herenowlabs/intro">book a thirty-minute intro</a>.
        </p>
      </section>
    </article>
  );
}
