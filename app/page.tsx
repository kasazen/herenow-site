import Link from "next/link";
import HeroImage from "./_components/HeroImage";
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
            Ten days to find yours. Months to build it.
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
          <p className={styles.diagramCaption}>
            <em>Operators set the bets. AI gives them reach.</em>
          </p>
        </div>
      </section>

      <section className={`section section--alt rule-top ${styles.method}`}>
        <div className="container">
          <div className={styles.methodHead}>
            <p className="eyebrow">The Here Now Method</p>
            <h2>Five stages. Ten days.</h2>
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
          <p className="eyebrow">The deliverable</p>
          <h2 className={styles.deliverableHeadline}>The AI Action Plan.</h2>
          <p className={styles.deliverableLead}>
            Five sections. One sitting. Every line tied to a dollar.
          </p>
          <p className={styles.deliverableCta}>
            <Link href="/ai-action-plan" className="btn btn--ghost">
              Read a sample Plan →
            </Link>
          </p>
        </div>
      </section>

      <BranchingMark />

      <section className={`section section--alt rule-top ${styles.longgame}`}>
        <div className="container">
          <div className={styles.longgameHead}>
            <p className="eyebrow">After the Plan</p>
            <h2>The work that compounds.</h2>
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
                    <h3>Tools your team uses</h3>
                    <p className={styles.buildOutcome}>
                      Built for a specific role.
                    </p>
                    <div className={styles.buildExampleBlock}>
                      <p className={styles.buildExampleHead}>Recent build</p>
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
                    <h3>Autonomous workers</h3>
                    <p className={styles.buildOutcome}>
                      No one invokes them. They watch; act when conditions fire.
                    </p>
                    <div className={styles.buildExampleBlock}>
                      <p className={styles.buildExampleHead}>Recent build</p>
                      <p className={styles.buildExample}>
                        <strong>Anniversary review agent.</strong> Drafts the renewal letter at each contract anniversary.
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
                    <h3>Quarterly working group</h3>
                    <p className={styles.buildOutcome}>
                      Two partners with the executive team.
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

        </div>
      </section>

      <section className={`section rule-top ${styles.late}`}>
        <div className="container">
          <p className={styles.lateLine}>
            <em>The operators who move on AI this year</em>{" "}
            <span className={styles.lateAccent}>compound for the next ten.</span>
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
