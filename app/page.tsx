import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className="eyebrow">Here Now Labs</p>
          <h1 className={styles.heroLine}>
            <em>We read your operation.</em>
            <br />
            We find the next{" "}
            <span className={styles.heroAccent}>million dollars</span>.
          </h1>
          <p className={styles.heroLead}>
            AI compresses the read. We bring the judgment.
          </p>
          <div className={styles.heroCtaRow}>
            <Link href="/ai-action-plan" className="btn">
              See an AI Action Plan
            </Link>
            <Link href="/how-we-work" className="btn btn--ghost">
              How we work
            </Link>
          </div>
        </div>
      </section>

      <section className={`section section--paper rule-top ${styles.diff}`}>
        <div className="container">
          <p className="eyebrow">Why us</p>
          <div className={styles.diffGrid}>
            <div className={styles.diffCell}>
              <p className={styles.diffOld}>Three months</p>
              <p className={styles.diffArrow}>→</p>
              <p className={styles.diffNew}>Ten days</p>
              <p className={styles.diffNote}>
                AI reads the entire contract, vendor, and dispatch corpus in volume. The judgment stays with us.
              </p>
            </div>
            <div className={styles.diffCell}>
              <p className={styles.diffOld}>A 60-page deck</p>
              <p className={styles.diffArrow}>→</p>
              <p className={styles.diffNew}>A 9-page Action Plan</p>
              <p className={styles.diffNote}>
                Five sections. Every recommendation tied to a dollar figure. Read in one sitting.
              </p>
            </div>
            <div className={styles.diffCell}>
              <p className={styles.diffOld}>An AI chatbot</p>
              <p className={styles.diffArrow}>→</p>
              <p className={styles.diffNew}>Judgment, compressed by AI</p>
              <p className={styles.diffNote}>
                We are not a tool vendor. AI is the engine; the work product is human.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${styles.what} rule-top`}>
        <div className="container">
          <div className={styles.whatGrid}>
            <div>
              <p className="eyebrow">What we do</p>
              <h2 className={styles.whatHeadline}>
                Where the margin is leaking — and how to stop it this quarter.
              </h2>
            </div>
            <div className={styles.whatBody}>
              <p>
                Most mid-market operations are leaking margin in places nobody has time to look. Vendor contracts that auto-renewed at last year&rsquo;s terms. Software seats paying for last quarter&rsquo;s headcount. Process steps that exist because someone left two years ago.
              </p>
              <p>
                We use AI to read everything — the contracts, the vendor records, the dispatch logs, the renewals calendar — and surface what matters. You get an{" "}
                <Link href="/ai-action-plan">AI Action Plan</Link>: five sections, ranked moves, every line tied to a dollar.
              </p>
              <p className={styles.whatBig}>
                <strong>Days, not months. One document, not a deck.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`section section--alt ${styles.proof} rule-top`}>
        <div className="container">
          <div className={styles.proofGrid}>
            <div>
              <p className="eyebrow">Proof of work</p>
              <h2>The deliverable, not the pitch.</h2>
            </div>
            <div className={styles.proofBody}>
              <p>
                A fully de-identified AI Action Plan is published in full. If it doesn&rsquo;t read like something you would actually use inside the executive team, the rest of this site is selling a promise we haven&rsquo;t earned.
              </p>
              <p>
                <Link href="/ai-action-plan" className="btn btn--ghost">
                  Read the sample →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${styles.late} rule-top`}>
        <div className="container">
          <p className={styles.lateLine}>
            <em>Operators don&rsquo;t fear AI.</em>{" "}
            <span className={styles.lateAccent}>They fear being late.</span>
          </p>
          <p className={styles.lateBody}>
            What AI changes about an operation is small, specific, and unglamorous — and it changes every quarter. The cost of waiting until the picture is settled is paid in margin to whoever moved first.
          </p>
        </div>
      </section>

      <section className={`section section--paper rule-top ${styles.cta}`}>
        <div className="container">
          <h2 className={styles.ctaHeadline}>If now is the moment.</h2>
          <p className={styles.ctaBody}>
            Thirty minutes. No deck.
          </p>
          <div className={styles.heroCtaRow}>
            <a href="https://cal.com/herenowlabs/intro" className="btn">
              Book a 30-minute intro
            </a>
            <Link href="/contact" className="btn btn--ghost">
              Use the contact form
            </Link>
          </div>
          <p className={styles.ctaTry}>
            Or try a smaller version —{" "}
            <Link href="/read-your-business">read your business</Link> from the URL.
          </p>
        </div>
      </section>
    </>
  );
}
