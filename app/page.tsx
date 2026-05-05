import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className="eyebrow">Here Now Labs</p>
          <h1 className={styles.heroLine}>
            <em>
              We read your contracts, your vendors, your renewals — and tell you where
              the next million dollars is hiding.
            </em>
          </h1>
          <p className={styles.heroLead}>
            For operators of established mid-market companies — roughly $20M to $200M in revenue — we run a structured read of the operation. Days, not months. One memo, read in one sitting. Every recommendation tied to a dollar figure.
          </p>
          <div className={styles.heroCtaRow}>
            <Link href="/how-we-work" className="btn">
              How we work
            </Link>
            <Link href="/sample-memo" className="btn btn--ghost">
              See a sample memo
            </Link>
          </div>
        </div>
      </section>

      <section className={`section section--paper rule-top ${styles.what}`}>
        <div className="container">
          <div className={styles.whatGrid}>
            <div>
              <p className="eyebrow">What we do</p>
              <h2 className={styles.whatHeadline}>
                A read of the operation, in days — not a deck of theories, in months.
              </h2>
            </div>
            <div className={styles.whatBody}>
              <p>
                Most mid-market operations are leaking margin in places nobody has time to look. Vendor contracts that auto-renewed at last year's terms. Process steps that exist because someone left two years ago. Software seats paying for last quarter's headcount. The dollars are real, the patterns are familiar, and the problem is almost always attention — not capability.
              </p>
              <p>
                We use AI to read everything: the contracts, the org chart, the procurement history, the website, the renewals calendar. We talk to two or three of your senior people. Then we give you back a strategic memo — five sections, read in one sitting — that names the dollar figures, the ranking, and the order to address them.
              </p>
              <p>
                It is not a transformation program. It is a read. Most teams keep us close after the first one.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${styles.steps} rule-top`}>
        <div className="container">
          <p className="eyebrow">How a session works</p>
          <ol className={styles.stepsList}>
            <li>
              <span className={styles.stepNum}>
                <em>i.</em>
              </span>
              <div>
                <h3>NDA, then alignment with the executive team</h3>
                <p>
                  Mutual NDA. A working session with you and one or two senior leaders to agree on scope, access, and what good looks like. Two hours. No deck.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.stepNum}>
                <em>ii.</em>
              </span>
              <div>
                <h3>Discovery — across contracts, vendors, processes</h3>
                <p>
                  We read what you give us. Contracts, renewals, procurement records, org charts, the public site, the policies, the playbooks. AI accelerates the reading; the judgment stays with us.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.stepNum}>
                <em>iii.</em>
              </span>
              <div>
                <h3>The strategic memo</h3>
                <p>
                  Five sections. Specific dollar figures. Ranked by impact. Delivered as a document you can read on a plane, not a deck you sit through.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.stepNum}>
                <em>iv.</em>
              </span>
              <div>
                <h3>A live walkthrough</h3>
                <p>
                  We sit with the executive team and walk every finding. Questions land in the room, not in a follow-up thread. From there, the work either stops or continues — your call.
                </p>
              </div>
            </li>
          </ol>
          <p className={styles.stepsFooter}>
            <Link href="/how-we-work">Read the full method →</Link>
            {"  ·  "}
            <Link href="/working-sessions">See what each session looks like →</Link>
          </p>
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
                The work product is a strategic memo: five sections, eight to ten pages, every recommendation tied to a dollar figure. It looks the way it reads — like a document an operator would write, not a slide an analyst would build.
              </p>
              <p>
                A fully de-identified sample is published below. If it doesn't read like something you would actually use, the rest of this site is selling a promise we haven't earned.
              </p>
              <p>
                <Link href="/sample-memo" className="btn btn--ghost">
                  Read the sample memo →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${styles.late} rule-top`}>
        <div className="container">
          <p className={styles.lateLine}>
            <em>Operators don&rsquo;t fear AI.</em> They fear being late.
          </p>
          <p className={styles.lateBody}>
            That fear is rational. Most of what AI changes about an operation is small, specific, and unglamorous — and it changes every quarter. The cost of waiting until the picture is settled is paid in margin to whoever moved first. We work with operators who would rather know now.
          </p>
        </div>
      </section>

      <section className={`section section--paper rule-top ${styles.cta}`}>
        <div className="container">
          <h2 className={styles.ctaHeadline}>If now is the moment.</h2>
          <p className={styles.ctaBody}>
            We take a small number of engagements at a time. The fastest way to find out if there&rsquo;s a fit is a thirty-minute call — no deck, no pitch, just a conversation about your operation.
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
            Or try a free shorter version of what we do —{" "}
            <Link href="/read-your-business">read your business</Link> from the URL.
          </p>
        </div>
      </section>
    </>
  );
}
