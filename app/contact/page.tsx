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
          We take a small number of engagements at a time, so we read everything that comes through these channels carefully. The fastest path is a thirty-minute intro on a video call. If you would rather write first, the form below goes to the same inbox.
        </p>
      </header>

      <section className={styles.intro}>
        <h2>Book a thirty-minute intro</h2>
        <p>
          A working call. No deck, no pitch. We use the time to understand the operation as you see it and tell you, plainly, whether we are the right people for what you are looking for.
        </p>
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
          A note via the form is read inside one business day, usually faster. If your situation has any sensitivity to email — confidential search, a contested vendor relationship, anything that should not land in a normal inbox — write to{" "}
          <a href="mailto:team@herenowlabs.xyz">team@herenowlabs.xyz</a> and we will move the conversation to a more appropriate channel.
        </p>
        <ContactForm />
      </section>
    </article>
  );
}
