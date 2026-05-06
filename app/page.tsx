import Link from "next/link";
import HeroImage from "./_components/HeroImage";
import ForwardArrow from "./_components/Arrow";
import OperationsDiagram from "./_components/OperationsDiagram";
import BranchingMark from "./_components/BranchingMark";
import BuildsCarousel from "./_components/BuildsCarousel";
import SectionImage from "./_components/SectionImage";
import styles from "./page.module.css";
import homeHero from "../public/images/hero/home.jpg";
import radialHubSection from "../public/images/sections/radial-hub.jpg";

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className={`eyebrow ${styles.heroEyebrow}`}>AI Action Planning</p>
          <h1 className={styles.heroLine}>
            Find the AI in your operation.
            <em>Build what compounds.</em>
          </h1>
          <p className={styles.heroLead}>
            Ten days to find yours. Months to build what compounds for years.
          </p>
          <div className={styles.heroCtaRow}>
            <Link href="/ai-action-plan" className="btn">
              See an AI Action Plan
            </Link>
            <Link href="/how-we-work" className="btn btn--ghost">
              How we work
            </Link>
          </div>
          <HeroImage src={homeHero} alt="" className={styles.heroImage} />
        </div>
        <div className={`container ${styles.heroDiagramWrap}`}>
          <OperationsDiagram />
        </div>
      </section>

      <section className={`section section--paper rule-top ${styles.opening}`}>
        <div className="container">
          <div className={styles.openingGrid}>
            <div>
              <p className="eyebrow">Where it begins</p>
              <h2 className={styles.openingHeadline}>
                A conversation. Then ten days.
              </h2>
            </div>
            <div className={styles.openingBody}>
              <p>
                Our partners sit with you before anything is signed. We listen the way operators listen — for what&rsquo;s annoying, what&rsquo;s compounding, what would matter changed.
              </p>
              <p className={styles.openingPunch}>
                <strong>Operators set the bets. AI gives them reach.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`section rule-top ${styles.diff}`}>
        <div className="container">
          <p className="eyebrow">Why us</p>
          <h2 className={styles.diffHeadline}>
            Most consulting compresses your calendar. We compound your operation.
          </h2>
          <div className={styles.diffGrid}>
            <article className={styles.diffCell}>
              <p className={styles.diffOldLabel}>The old way</p>
              <p className={styles.diffOld}>Three months of consultants</p>
              <p className={styles.diffArrow} aria-hidden="true"><ForwardArrow /></p>
              <p className={styles.diffNewLabel}>What we do</p>
              <p className={styles.diffNew}>Ten business days</p>
              <p className={styles.diffNote}>
                AI reads the whole corpus at speed. We weigh the bets.
              </p>
            </article>
            <article className={styles.diffCell}>
              <p className={styles.diffOldLabel}>The old way</p>
              <p className={styles.diffOld}>A 60-page deck</p>
              <p className={styles.diffArrow} aria-hidden="true"><ForwardArrow /></p>
              <p className={styles.diffNewLabel}>What we do</p>
              <p className={styles.diffNew}>An AI Action Plan</p>
              <p className={styles.diffNote}>
                Five sections. Every line tied to a dollar. Read in one sitting.
              </p>
            </article>
            <article className={styles.diffCell}>
              <p className={styles.diffOldLabel}>The old way</p>
              <p className={styles.diffOld}>Generic AI advice</p>
              <p className={styles.diffArrow} aria-hidden="true"><ForwardArrow /></p>
              <p className={styles.diffNewLabel}>What we do</p>
              <p className={styles.diffNew}>AI built into the work</p>
              <p className={styles.diffNote}>
                We ship the AI the Plan identified. Tools and agents that run.
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
              Five stages, every engagement. AI tooling tuned to mid-market operations — not what SaaS tools wish they were.
            </p>
          </div>

          <ol className={styles.methodList}>
            <li className={styles.methodCard}>
              <span className={styles.methodNum}><em>i.</em></span>
              <h3>Listen</h3>
              <p>Two hours. Signed criterion by lunch.</p>
            </li>
            <li className={styles.methodCard}>
              <span className={styles.methodNum}><em>ii.</em></span>
              <h3>Ingest</h3>
              <p>Six days. Every contract, vendor, and dispatch log.</p>
            </li>
            <li className={styles.methodCard}>
              <span className={styles.methodNum}><em>iii.</em></span>
              <h3>Weigh</h3>
              <p>AI surfaces. Partners decide what matters.</p>
            </li>
            <li className={styles.methodCard}>
              <span className={styles.methodNum}><em>iv.</em></span>
              <h3>Deliver</h3>
              <p>Ten pages. Every line tied to a dollar.</p>
            </li>
            <li className={styles.methodCard}>
              <span className={styles.methodNum}><em>v.</em></span>
              <h3>Build</h3>
              <p>Software, agents, advisory. Most engagements continue.</p>
            </li>
          </ol>

          <p className={styles.methodFoot}>
            <Link href="/how-we-work">Read the full method →</Link>
            {"  ·  "}
            <Link href="/working-sessions">See what each session looks like →</Link>
          </p>
        </div>
      </section>

      <SectionImage src={radialHubSection} />

      <section className={`section ${styles.deliverable}`}>
        <div className="container">
          <div className={styles.deliverableGrid}>
            <div>
              <p className="eyebrow">The deliverable</p>
              <h2>The AI Action Plan.</h2>
              <p className={styles.deliverableLead}>
                Five sections. One sitting. Every line tagged with a dollar.
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
                    <h4>Where the margin&rsquo;s been waiting</h4>
                    <p>Specific margin you weren&rsquo;t reaching. Ranked, named, sourced.</p>
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

      <BranchingMark />

      <section className={`section section--alt rule-top ${styles.longgame}`}>
        <div className="container">
          <div className={styles.longgameHead}>
            <p className="eyebrow">After the Plan</p>
            <h2>The work that compounds.</h2>
            <p className={styles.longgameLead}>
              Most engagements continue. Custom software, autonomous agents, ongoing advisory.
            </p>
          </div>

          <BuildsCarousel
            ariaLabel="After the Plan: three shapes the work takes"
            slides={[
              {
                id: "software",
                label: "AI software",
                content: (
                  <article className={styles.buildCard}>
                    <p className={styles.buildLabel}>AI software · 4–6 weeks</p>
                    <h3>Tools your team uses every day</h3>
                    <p className={styles.buildOutcome}>
                      Built for a specific role. Measurable in hours and dollars.
                    </p>
                    <div className={styles.buildExampleBlock}>
                      <p className={styles.buildExampleHead}>From a recent engagement</p>
                      <p className={styles.buildExample}>
                        <strong>AI proposal generator.</strong> Drafts from a prospect&rsquo;s scope; pulls labor and parts from past wins.
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
                    </div>
                  </article>
                ),
              },
              {
                id: "agent",
                label: "AI agent",
                content: (
                  <article className={styles.buildCard}>
                    <p className={styles.buildLabel}>AI agent · 2–4 weeks</p>
                    <h3>Autonomous, on a schedule or trigger</h3>
                    <p className={styles.buildOutcome}>
                      No one invokes them. They watch the calendar; act when conditions fire. Human review is sign-off.
                    </p>
                    <div className={styles.buildExampleBlock}>
                      <p className={styles.buildExampleHead}>From a recent engagement</p>
                      <p className={styles.buildExample}>
                        <strong>Anniversary review agent.</strong> At each maintenance anniversary, reviews escalator clauses and drafts the renewal letter.
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
                    </div>
                  </article>
                ),
              },
              {
                id: "advisory",
                label: "Advisory",
                content: (
                  <article className={styles.buildCard}>
                    <p className={styles.buildLabel}>Advisory · ongoing</p>
                    <h3>Quarterly AI working group</h3>
                    <p className={styles.buildOutcome}>
                      Two partners with the executive team. Review what shipped. Rank what to build next. Retire what isn&rsquo;t pulling weight.
                    </p>
                    <div className={styles.buildExampleBlock}>
                      <p className={styles.buildExampleHead}>How it runs</p>
                      <p className={styles.buildExample}>
                        Two hours, quarterly. A short list of next builds, each scoped to a dollar.
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
                    </div>
                  </article>
                ),
              },
            ]}
          />

          <p className={styles.longgameFoot}>
            Representative builds. Specifics depend on the diagnostic.
          </p>
        </div>
      </section>

      <section className={`section rule-top ${styles.late}`}>
        <div className="container">
          <p className={styles.lateLine}>
            <em>The operators who move on AI this year</em>{" "}
            <span className={styles.lateAccent}>compound for the next ten.</span>
          </p>
          <p className={styles.lateBody}>
            Small, specific, quiet — and it stacks every quarter.
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
        </div>
      </section>
    </>
  );
}
