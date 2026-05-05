import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Here Now Labs. Either book a thirty-minute intro or use the contact form below — both go to the same place.",
};

export default function ContactPage() {
  return (
    <article className={`article ${styles.page}`}>
      <header className={styles.header}>
        <p className="eyebrow">Contact</p>
        <h1 className={styles.title}>Two ways in.</h1>
        <p className="lead" style={{ marginTop: "1rem" }}>
          We take a small number of engagements at a time. Everything coming through these channels is read carefully.
        </p>
      </header>

      <section className={styles.intro}>
        <h2>Book a thirty-minute intro</h2>
        <p>A working call. No deck, no pitch.</p>
        <p>
          <a className="btn" href="https://cal.com/herenowlabs/intro">
            Open the calendar
          </a>
        </p>
      </section>

      <hr />

      <section>
        <h2>Or write first.</h2>
        <p>
          Read inside one business day. For anything sensitive — confidential search, a contested vendor — write{" "}
          <a href="mailto:team@herenowlabs.xyz">team@herenowlabs.xyz</a> and we will move it to a more appropriate channel.
        </p>
        <ContactForm />
      </section>
    </article>
  );
}
