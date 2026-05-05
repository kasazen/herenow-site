import Link from "next/link";
import HeroImage from "./_components/HeroImage";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className="eyebrow">Here Now Labs</p>
          <h1 className={styles.heroLine}>
            <em>AI inside your operation.</em>
            <br />
            We find the next{" "}
            <span className={styles.heroAccent}>million dollars</span>{" "}
            — and build the AI to keep it.
          </h1>
          <p className={styles.heroLead}>
            Find what is leaking. See where growth is waiting. Build the AI to act on both.
          </p>
          <div className={styles.heroCtaRow}>
            <Link href="/ai-action-plan" className="btn">
              See an AI Action Plan
            </Link>
            <Link href="/how-we-work" className="btn btn--ghost">
              How we work
            </Link>
          </div>
          <HeroImage src="/images/hero/home.jpg" alt="" className={styles.heroImage} />
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
                AI parses the entire contract, vendor, and dispatch corpus at speed. The judgment stays with us.
              </p>
            </div>
            <div className={styles.diffCell}>
              <p className={styles.diffOld}>A 60-page deck</p>
              <p className={styles.diffArrow}>→</p>
              <p className={styles.diffNew}>An AI Action Plan</p>
              <p className={styles.diffNote}>
                Five sections. Every recommendation tied to a dollar figure. Scanned in one sitting.
              </p>
            </div>
            <div className={styles.diffCell}>
              <p className={styles.diffOld}>An AI chatbot</p>
              <p className={styles.diffArrow}>→</p>
              <p className={styles.diffNew}>AI built into the work</p>
              <p className={styles.diffNote}>
                We are not a tool vendor. After the Plan, we ship the AI it identified — agents, generators, reviewers — that compound.
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
                Where margin is leaking. Where growth is waiting. What AI changes about both.
              </h2>
            </div>
            <div className={styles.whatBody}>
              <p>
                Mid-market operations are leaking margin in places nobody has time to look — vendor terms that auto-renewed, software seats that out-grew the team, escalator clauses that expired unexercised. They are also leaving growth on the table — accounts that would buy more, faster quoting cycles that would close more, capabilities a competitor will offer first.
              </p>
              <p>
                We use AI to surface both. You receive an{" "}
                <Link href="/ai-action-plan">AI Action Plan</Link> — five sections, ranked moves, every line tied to a dollar figure. From there, the work either stops or compounds. Most engagements continue.
              </p>
              <p className={styles.whatBig}>
                <strong>Days, not months. One document, not a deck.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`section section--alt ${styles.longgame} rule-top`}>
        <div className="container">
          <div className={styles.longgameHead}>
            <p className="eyebrow">After the Plan</p>
            <h2>The work that compounds.</h2>
            <p className={styles.longgameLead}>
              The Plan is the wedge. The relationship that follows is where AI starts to operate inside the business.
            </p>
          </div>

          <div className={styles.longgameGrid}>
            <article className={styles.buildCard}>
              <p className={styles.buildLabel}>Agent build · 4–6 weeks</p>
              <h3>AI proposal generator for a senior estimator</h3>
              <p className={styles.buildOutcome}>
                Drafts a proposal from the prospect&rsquo;s scope document — labor, parts, terms — pre-populated from the last forty winning bids.
              </p>
              <ul className={styles.buildMetrics}>
                <li>
                  <span>Senior estimator time recovered</span>
                  <strong>~14 hrs / week</strong>
                </li>
                <li>
                  <span>Proposal-to-quote cycle</span>
                  <strong>3 days → 4 hours</strong>
                </li>
                <li>
                  <span>Estimated revenue lift</span>
                  <strong>+8–12% from faster turnaround</strong>
                </li>
              </ul>
            </article>

            <article className={styles.buildCard}>
              <p className={styles.buildLabel}>Workflow build · 2–3 weeks</p>
              <h3>Anniversary review agent for service contracts</h3>
              <p className={styles.buildOutcome}>
                Reviews every maintenance agreement at anniversary, flags unexercised escalators, drafts the renewal letter for human sign-off.
              </p>
              <ul className={styles.buildMetrics}>
                <li>
                  <span>Contracts reviewed per cycle</span>
                  <strong>93 in 90 minutes</strong>
                </li>
                <li>
                  <span>Captured margin (annual)</span>
                  <strong>$1.4M – $1.8M</strong>
                </li>
                <li>
                  <span>Coordinator time recovered</span>
                  <strong>~30 hrs / quarter</strong>
                </li>
              </ul>
            </article>

            <article className={styles.buildCard}>
              <p className={styles.buildLabel}>Advisory retainer · ongoing</p>
              <h3>Quarterly AI working group</h3>
              <p className={styles.buildOutcome}>
                Two of our partners sit with the executive team once a quarter. New AI tooling is reviewed, scoped, and ranked against current priorities.
              </p>
              <ul className={styles.buildMetrics}>
                <li>
                  <span>Cadence</span>
                  <strong>Quarterly · 2 hrs</strong>
                </li>
                <li>
                  <span>Scope</span>
                  <strong>What to build next, what to retire</strong>
                </li>
                <li>
                  <span>Continues from</span>
                  <strong>The Action Plan</strong>
                </li>
              </ul>
            </article>
          </div>

          <p className={styles.longgameFoot}>
            Examples shown here are representative builds based on the patterns we see across mid-market engagements. The specific tools we recommend depend on the diagnostic.
          </p>
        </div>
      </section>

      <section className={`section ${styles.proof} rule-top`}>
        <div className="container">
          <div className={styles.proofGrid}>
            <div>
              <p className="eyebrow">Proof of work</p>
              <h2>The deliverable, not the pitch.</h2>
            </div>
            <div className={styles.proofBody}>
              <p>
                A fully de-identified AI Action Plan is published in full. If it doesn&rsquo;t look like something you would actually use inside the executive team, the rest of this site is selling a promise we haven&rsquo;t earned.
              </p>
              <p>
                <Link href="/ai-action-plan" className="btn btn--ghost">
                  See the sample Plan →
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
            <span className={styles.lateAccent}>They fear being late to it.</span>
          </p>
          <p className={styles.lateBody}>
            What AI changes about an operation is small, specific, and unglamorous — and it changes every quarter. The cost of waiting until the picture is settled is paid in margin to whoever moved first, and in growth lanes to whoever wired the agents in this year instead of next.
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
            <Link href="/ai-action-plan-lite">an AI Action Plan (Lite)</Link> generated from your URL.
          </p>
        </div>
      </section>
    </>
  );
}
