import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Two ways in. Send the note or pick a time. Both end up in the same place.",
};

export default function ContactPage() {
  return (
    <article className={styles.page}>
      <header className={`article ${styles.header}`}>
        <p className="eyebrow">The intro</p>
        <h1 className={styles.title}>Two ways in.</h1>
        <p className={`lead ${styles.lede}`}>
          Pick whichever is easier. Both end up in the same place.
        </p>
      </header>

      <div className={`container ${styles.columns}`}>
        <section className={styles.formColumn}>
          <ContactForm />
        </section>

        <section className={styles.bookColumn}>
          <p className="eyebrow">Or just book</p>
          <a
            href="https://cal.com/herenowlabs/intro"
            className={`btn ${styles.bookCta}`}
          >
            Pick a time
          </a>
          <p className={styles.bookNote}>Thirty minutes. No deck. No fee.</p>
        </section>
      </div>
    </article>
  );
}
