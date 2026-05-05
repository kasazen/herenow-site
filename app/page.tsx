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
            Built by people who have run one.
          </h1>
          <p className={styles.heroLead}>
            We start with a conversation. Then we aim AI at the work that has been waiting for someone&rsquo;s attention.
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

      <section className={`section section--paper rule-top ${styles.opening}`}>
        <div className="container">
          <div className={styles.openingGrid}>
            <div>
              <p className="eyebrow">Where engagements begin</p>
              <h2 className={styles.openingHeadline}>
                A conversation about your operation.
              </h2>
            </div>
            <div className={styles.openingBody}>
              <p>
                Before any contract is signed, before any data is touched, our partners sit with you. We understand businesses the way operators do — by listening to what is annoying, what is compounding, what would matter if it changed. The conversation is the work; the AI is what we aim at it.
              </p>
              <p className={styles.openingPunch}>
                <strong>Business judgment first. AI second. In that order, by design.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`section rule-top ${styles.diff}`}>
        <div className="container">
          <p className="eyebrow">Why us</p>
          <h2 className={styles.diffHeadline}>
            Most consulting compresses your calendar. We compress the work.
          </h2>
          <div className={styles.diffGrid}>
            <article className={styles.diffCell}>
              <p className={styles.diffOld}>Three months of consultants</p>
              <p className={styles.diffArrow} aria-hidden="true">→</p>
              <p className={styles.diffNew}>Ten business days</p>
              <p className={styles.diffNote}>
                AI parses the entire contract, vendor, and dispatch corpus at speed. The judgment stays human.
              </p>
            </article>
            <article className={styles.diffCell}>
              <p className={styles.diffOld}>A 60-page deck</p>
              <p className={styles.diffArrow} aria-hidden="true">→</p>
              <p className={styles.diffNew}>An AI Action Plan</p>
              <p className={styles.diffNote}>
                Five sections, every recommendation tied to a dollar. Scanned in one sitting. Defensible at the board.
              </p>
            </article>
            <article className={styles.diffCell}>
              <p className={styles.diffOld}>Generic AI advice</p>
              <p className={styles.diffArrow} aria-hidden="true">→</p>
              <p className={styles.diffNew}>AI built into the work</p>
              <p className={styles.diffNote}>
                After the Plan, we ship the AI it identified — software you can use, agents that run themselves.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className={`section section--alt rule-top ${styles.method}`}>
        <div className="container">
          <div className={styles.methodHead}>
            <p className="eyebrow">The Here Now Method</p>
            <h2>What makes the work proprietary.</h2>
            <p className={styles.methodLead}>
              The same five-stage workflow runs every engagement. The patterns we look for are drawn from comparable operations we have worked through. The AI tooling is ours — built and tuned to read what mid-market operations actually produce, not what a SaaS tool wishes they did.
            </p>
          </div>

          <ol className={styles.methodList}>
            <li>
              <span className={styles.methodNum}><em>i.</em></span>
              <div>
                <h3>Listen, in person</h3>
                <p>
                  A two-hour working session with the executive team. We come in with a printed agenda and leave with a signed success criterion the Plan will be measured against.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.methodNum}><em>ii.</em></span>
              <div>
                <h3>Ingest, with our tooling</h3>
                <p>
                  Six business days of work. Every contract, vendor record, dispatch log, renewal calendar, and policy document goes through our parsing stack — tuned to the patterns we have seen across mid-market operations.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.methodNum}><em>iii.</em></span>
              <div>
                <h3>Weigh, with judgment</h3>
                <p>
                  The anomalies AI surfaces are not the answer. The judgment about which ones matter — and why — is the work. That is where our partners spend their time.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.methodNum}><em>iv.</em></span>
              <div>
                <h3>Deliver the AI Action Plan</h3>
                <p>
                  Five sections, eight to ten pages, every recommendation tied to a dollar figure. Cost savings, growth lanes, software builds, agent builds — all named, ranked, and tagged.
                </p>
              </div>
            </li>
            <li>
              <span className={styles.methodNum}><em>v.</em></span>
              <div>
                <h3>Build what compounds</h3>
                <p>
                  The Plan is the wedge. Most engagements continue — quarterly advisory, custom AI software, autonomous agents. The relationship deepens as more of the work happens automatically.
                </p>
              </div>
            </li>
          </ol>

          <p className={styles.methodFoot}>
            <Link href="/how-we-work">Read the full method →</Link>
            {"  ·  "}
            <Link href="/working-sessions">See what each session looks like →</Link>
          </p>
        </div>
      </section>

      <div className="mark-divider" aria-hidden="true" />

      <section className={`section ${styles.deliverable}`}>
        <div className="container">
          <div className={styles.deliverableGrid}>
            <div>
              <p className="eyebrow">The deliverable</p>
              <h2>The AI Action Plan.</h2>
              <p className={styles.deliverableLead}>
                Five sections. Read in one sitting. Every line tied to a dollar figure — and tagged for what we would build.
              </p>
            </div>
            <div className={styles.deliverableBody}>
              <ul className={styles.deliverableSections}>
                <li>
                  <span className={styles.deliverableNum}><em>i.</em></span>
                  <div>
                    <h4>Where the margin actually lives</h4>
                    <p>The bet. One falsifiable hypothesis about the operation.</p>
                  </div>
                </li>
                <li>
                  <span className={styles.deliverableNum}><em>ii.</em></span>
                  <div>
                    <h4>Where the leak is</h4>
                    <p>Specific cost savings. Ranked by size, named by source.</p>
                  </div>
                </li>
                <li>
                  <span className={styles.deliverableNum}><em>iii.</em></span>
                  <div>
                    <h4>Where growth is waiting</h4>
                    <p>Revenue we would pursue first. Each tied to the operation.</p>
                  </div>
                </li>
                <li>
                  <span className={styles.deliverableNum}><em>iv.</em></span>
                  <div>
                    <h4>What to build first</h4>
                    <p>Software. Agents. Workflow changes. Each tagged, scoped, priced.</p>
                  </div>
                </li>
                <li>
                  <span className={styles.deliverableNum}><em>v.</em></span>
                  <div>
                    <h4>Two questions for next quarter</h4>
                    <p>The kind a board member would ask. We propose ours.</p>
                  </div>
                </li>
              </ul>
              <p className={styles.deliverableCta}>
                <Link href="/ai-action-plan" className="btn btn--ghost">
                  Read the sample Plan →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`section section--alt rule-top ${styles.longgame}`}>
        <div className="container">
          <div className={styles.longgameHead}>
            <p className="eyebrow">After the Plan</p>
            <h2>The work that compounds.</h2>
            <p className={styles.longgameLead}>
              Most engagements continue. We ship custom AI software your team uses, autonomous agents that run themselves, and we stay close as the operation gets sharper.
            </p>
          </div>

          <div className={styles.longgameGrid}>
            <article className={styles.buildCard}>
              <p className={styles.buildLabel}>AI software · 4–6 weeks</p>
              <h3>Custom tools your team uses every day</h3>
              <p className={styles.buildOutcome}>
                Built around a specific role. Used by a specific person. Measurable in hours and dollars.
              </p>
              <p className={styles.buildExampleHead}>Recent example</p>
              <p className={styles.buildExample}>
                <strong>AI proposal generator</strong> for a senior estimator. Drafts from a prospect&rsquo;s scope document, pre-populates labor and parts from the last forty winning bids.
              </p>
              <ul className={styles.buildMetrics}>
                <li>
                  <span>Estimator time recovered</span>
                  <strong>~14 hrs / week</strong>
                </li>
                <li>
                  <span>Quote cycle</span>
                  <strong>3 days → 4 hours</strong>
                </li>
                <li>
                  <span>Revenue lift</span>
                  <strong>+8–12%</strong>
                </li>
              </ul>
            </article>

            <article className={styles.buildCard}>
              <p className={styles.buildLabelAgent}>AI agent · 2–4 weeks</p>
              <h3>Autonomous workers, on a schedule or trigger</h3>
              <p className={styles.buildOutcome}>
                No one invokes them. They watch the calendar, the inbox, the document folder — and act when their conditions fire.
              </p>
              <p className={styles.buildExampleHead}>Recent example</p>
              <p className={styles.buildExample}>
                <strong>Anniversary review agent.</strong> Watches the contract calendar. At each maintenance-agreement anniversary, reviews the rate-card escalator clauses and drafts the renewal letter for human sign-off.
              </p>
              <ul className={styles.buildMetrics}>
                <li>
                  <span>Contracts reviewed</span>
                  <strong>93 in 90 minutes</strong>
                </li>
                <li>
                  <span>Captured margin</span>
                  <strong>$1.4M – $1.8M / yr</strong>
                </li>
                <li>
                  <span>Human time</span>
                  <strong>Sign-off only</strong>
                </li>
              </ul>
            </article>

            <article className={styles.buildCard}>
              <p className={styles.buildLabelRetainer}>Advisory · ongoing</p>
              <h3>The quarterly AI working group</h3>
              <p className={styles.buildOutcome}>
                Two of our partners sit with the executive team once a quarter. Review what shipped. Rank what to build next. Retire what is not pulling its weight.
              </p>
              <p className={styles.buildExampleHead}>Cadence</p>
              <p className={styles.buildExample}>
                Two hours, quarterly. Printed agenda. Output is a short list of next AI builds, each scoped to a dollar target. Build work is scoped separately.
              </p>
              <ul className={styles.buildMetrics}>
                <li>
                  <span>Cadence</span>
                  <strong>Quarterly · 2 hrs</strong>
                </li>
                <li>
                  <span>Scope</span>
                  <strong>What to build, what to retire</strong>
                </li>
                <li>
                  <span>Continues from</span>
                  <strong>The Action Plan</strong>
                </li>
              </ul>
            </article>
          </div>

          <p className={styles.longgameFoot}>
            Examples are representative builds drawn from the patterns we see across mid-market engagements. The specific software and agents we recommend depend on the diagnostic.
          </p>
        </div>
      </section>

      <section className={`section rule-top ${styles.late}`}>
        <div className="container">
          <p className={styles.lateLine}>
            <em>Operators don&rsquo;t fear AI.</em>{" "}
            <span className={styles.lateAccent}>They fear being late to it.</span>
          </p>
          <p className={styles.lateBody}>
            What AI changes about an operation is small, specific, and unglamorous — and it changes every quarter. The cost of waiting is paid in margin to whoever moved first, and in growth lanes to whoever wired the agents in this year instead of next.
          </p>
        </div>
      </section>

      <section className={`section section--paper rule-top ${styles.cta}`}>
        <div className="container">
          <h2 className={styles.ctaHeadline}>If now is the moment.</h2>
          <p className={styles.ctaBody}>Thirty minutes. No deck. A conversation.</p>
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
