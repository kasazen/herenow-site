import Link from "next/link";
import ExampleCallout from "./_components/ExampleCallout";
import HeroImage from "./_components/HeroImage";
import LeafVeinDiagram from "./_components/LeafVeinDiagram";
import TierCard from "./_components/TierCard";
import styles from "./page.module.css";
import heroLeaf from "../public/photos/hero-leaf.jpg";
import exampleHvac from "../public/photos/example-hvac.jpg";
import exampleLogistics from "../public/photos/example-logistics.jpg";
import exampleServices from "../public/photos/example-services.jpg";

export default function HomePage() {
  return (
    <>
      {/* ─── 1. Hero ───────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <p className="eyebrow">Two-week sprint. Paid. A working deliverable.</p>
            <h1 className={styles.heroTitle}>
              AI you haven&rsquo;t built yet, <em>hiding in your operation.</em>
            </h1>
            <p className={`lead ${styles.heroLede}`}>
              Your contracts, processes, and financials are sitting in folders. We come in for two weeks, find what AI can do with them, and ship it.
            </p>
            <div className={styles.heroCtaRow}>
              <Link href="/contact" className="btn">
                Book the intro
              </Link>
            </div>
            <p className={styles.heroSubCta}>
              Thirty minutes. No deck. No fee.
            </p>
          </div>
          <div className={styles.heroImage}>
            <HeroImage src={heroLeaf} alt="" priority />
          </div>
        </div>
      </section>

      {/* ─── 2. Primary insight ────────────────────────────────────── */}
      <section className={`section ${styles.insight}`}>
        <div className="container">
          <div className={styles.insightHead}>
            <p className="eyebrow">The miss</p>
            <h2 className={styles.insightTitle}>
              Most operators see one or two obvious wins. <em>They&rsquo;re missing the system.</em>
            </h2>
            <p className={styles.insightBody}>
              A proposal generator. A document parser. A faster handoff. The wins you can name from a single conversation. That&rsquo;s where most AI consulting stops. We start there &mdash; and then we map the next ten, sequenced and priced. Operations compound.
            </p>
          </div>
          <div className={styles.diagramWrap}>
            <LeafVeinDiagram />
            <p className={styles.diagramCaption}>The five domains we look at first</p>
          </div>
        </div>
      </section>

      {/* ─── 3. How we work (overview) ─────────────────────────────── */}
      <section className={`section ${styles.arc}`}>
        <div className="container">
          <div className={styles.arcHead}>
            <p className="eyebrow">The arc</p>
            <h2 className={styles.arcTitle}>
              Two weeks paid. <em>Then we build.</em>
            </h2>
          </div>
          <ol className={styles.arcGrid}>
            <li className={styles.arcCol}>
              <span className={styles.arcNum}>01</span>
              <h3 className={styles.arcName}><em>Sprint.</em></h3>
              <p className={styles.arcBody}>
                Two weeks, paid. Stakeholder interviews, document analysis, working deliverable.
              </p>
            </li>
            <li className={styles.arcCol}>
              <span className={styles.arcNum}>02</span>
              <h3 className={styles.arcName}><em>Build.</em></h3>
              <p className={styles.arcBody}>
                The first move worth shipping. We ship it. Usually a Starter.
              </p>
            </li>
            <li className={styles.arcCol}>
              <span className={styles.arcNum}>03</span>
              <h3 className={styles.arcName}><em>Compound.</em></h3>
              <p className={styles.arcBody}>
                Builder and Compound work, on retainer or per-project.
              </p>
            </li>
          </ol>
          <p className={styles.arcLink}>
            <Link href="/how-we-work">See the full method &rarr;</Link>
          </p>
        </div>
      </section>

      {/* ─── 4. The three tiers ────────────────────────────────────── */}
      <section className={`section section--paper ${styles.tiers}`}>
        <div className="container">
          <div className={styles.tiersHead}>
            <p className="eyebrow">What we build</p>
            <h2 className={styles.tiersTitle}>
              Starter, Builder, Compound. <em>You may run all three at once.</em>
            </h2>
            <p className={styles.tiersLede}>
              These are not stages of a journey. They&rsquo;re the shape of the work. A single operation might run a Starter, a Builder, and a Compound at the same time, on different fronts.
            </p>
          </div>
          <div className={styles.tiersGrid}>
            <TierCard
              tier="Starter"
              headline="One process, automated."
              body="A single high-friction workflow becomes an AI deployment that runs on its own. Quick to ship. Obvious return."
              examples={[
                "Proposal generation from CRM and project data",
                "First-draft contract review with risk flags",
                "Weekly status report compilation across systems",
              ]}
              timeline="2–6 weeks"
            />
            <TierCard
              tier="Builder"
              headline="Multiple systems, integrated."
              body="Cross-functional infrastructure that compounds value across departments. Heavier lift. Foundational."
              examples={[
                "CRM-to-finance pipeline with anomaly detection",
                "Multi-source operational dashboard with AI commentary",
                "Integrated service-delivery workflow across ops and support",
              ]}
              timeline="2–4 months"
            />
            <TierCard
              tier="Compound"
              headline={<em>Workers that don&rsquo;t sleep.</em>}
              body="Autonomous agents operating continuously inside your operation. They learn, they iterate, they take real action. Operational shift."
              examples={[
                "Autonomous customer-service agent with human escalation",
                "AI procurement watching contracts and renewals",
                "Continuous strategic monitoring across markets and competitors",
              ]}
              timeline="Ongoing retainer"
            />
          </div>
        </div>
      </section>

      {/* ─── 5. Examples ───────────────────────────────────────────── */}
      <section className={`section ${styles.examples}`}>
        <div className="container">
          <div className={styles.examplesHead}>
            <p className="eyebrow">What this looks like</p>
            <h2 className={styles.examplesTitle}>
              Three examples from operators we&rsquo;ve spoken with.
            </h2>
            <p className={styles.examplesLede}>
              Names redacted. Problems are real. Each one becomes a different tier of build.
            </p>
          </div>
          <div className={styles.calloutStack}>
            <ExampleCallout
              industry="HVAC Services"
              quote="Our ops lead spends three days a week building proposals in Word from PDF screenshots."
              build="An AI agent that reads the source data and writes a fully formatted proposal directly into the email drafts folder. The ops lead reviews and sends."
              tier="Starter"
              outcome="~12 hrs/week saved"
              image={exampleHvac}
            />
            <ExampleCallout
              industry="Logistics"
              quote="We have ten years of shipping manifests no one reads."
              build="A document ingestion pipeline that surfaces cost anomalies, lane optimization, and renegotiation candidates. Plugs into the existing ops dashboard."
              tier="Builder"
              outcome="6-figure annual recovery typical"
              image={exampleLogistics}
            />
            <ExampleCallout
              industry="Professional Services"
              quote="Our partners spend partner-rate hours on first-draft contract review."
              build="A continuous AI agent that reviews incoming contracts, flags deviations from templates, drafts redlines, and routes only the genuinely ambiguous cases to a human partner."
              tier="Compound"
              outcome="60–80% partner hours redirected"
              image={exampleServices}
            />
          </div>
        </div>
      </section>

      {/* ─── 6. Closing CTA ────────────────────────────────────────── */}
      <section className={`section section--accent ${styles.closingCta}`}>
        <div className={`article ${styles.closingInner}`}>
          <p className="eyebrow">The intro</p>
          <h2 className={styles.closingTitle}>
            Thirty minutes. No deck. <em>No fee.</em>
          </h2>
          <p className={styles.closingBody}>
            We&rsquo;ll talk through your operation &mdash; what&rsquo;s annoying, what&rsquo;s compounding, what would matter changed. Half the calls end without a next step. That&rsquo;s the point. We don&rsquo;t take a build engagement we don&rsquo;t believe in.
          </p>
          <div className={styles.closingButtons}>
            <Link href="/contact" className="btn">
              Book the intro
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
