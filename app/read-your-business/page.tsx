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
          A short read, from your URL.
        </h1>
        <p className="lead" style={{ marginTop: "1rem" }}>
          AI reads your site the way we read engagements — in volume. You get a short Plan by email. First section unlocks here.
        </p>
      </header>

      <ReadTool />

      <hr />

      <section className={styles.aside}>
        <h2>What this is and is not.</h2>
        <p>
          This tool reads what is publicly available. The full engagement reads what is not — contracts, vendor records, the renewals calendar, the documents nobody has opened in two years. The web read is a wedge, not the whole.
        </p>
        <p>
          To skip the email step,{" "}
          <Link href="/contact">use the contact form</Link> or{" "}
          <a href="https://cal.com/herenowlabs/intro">book a thirty-minute intro</a>.
        </p>
      </section>
    </article>
  );
}
