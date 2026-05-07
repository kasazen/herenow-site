import type { Metadata } from "next";
import Link from "next/link";
import HeroImage from "../_components/HeroImage";
import RisingMark from "../_components/RisingMark";
import EngagementArc from "./EngagementArc";
import RedactedDoc from "./RedactedDoc";
import MethodologyGrid from "./MethodologyGrid";
import styles from "./page.module.css";
import translucentLeaf from "../../public/images/sections/translucent-leaf.jpg";
import gridEnergy from "../../public/images/sections/grid-energy.jpg";
import leafDroplet from "../../public/images/sections/leaf-droplet.jpg";

export const metadata: Metadata = {
  title: "AI Action Plan",
  description:
    "What an engagement becomes — a working document, the AI we build into your operation after, and a relationship that compounds.",
};

const ACTION_PLAN_SECTIONS = [
  { n: "i", title: "Where the margin actually lives", desc: "The bet. One falsifiable hypothesis about your operation." },
  { n: "ii", title: "Where the margin's been waiting", desc: "Specific cost recovery. Ranked, named, dollar-tagged." },
  { n: "iii", title: "Where growth is waiting", desc: "Revenue lanes we'd pursue first. Each tied to the operation." },
  { n: "iv", title: "What to build first", desc: "Software, agents, workflow changes — scoped, priced, ranked." },
  { n: "v", title: "Two questions for next quarter", desc: "The kind a board member would ask. We propose ours." },
];

const BUILD_CATEGORIES = [
  {
    label: "AI software",
    headline: "Custom tools for a specific role.",
    body: "Used by one person, every day. An estimator's proposal generator. A controller's renewal scanner. A dispatcher's routing helper. Built for the role, measurable in hours and dollars.",
  },
  {
    label: "AI agents",
    headline: "Autonomous workers, on a schedule or trigger.",
    body: "Nobody invokes them. They watch the calendar, the inbox, the document folder — and act when conditions fire. Anniversary review, anomaly scanning, renewal drafting. Human review is sign-off, not effort.",
  },
  {
    label: "Workflow shifts",
    headline: "What changes about how the work flows.",
    body: "Procurement consolidation. Dispatch sequencing. Parts staging. The non-AI moves a Plan often surfaces alongside the builds — quieter, often higher-leverage.",
  },
];

const ADVISORY_OUTCOMES = [
  { label: "What to build next", desc: "New software, new agents, new workflow shifts. Each scoped to a known dollar target." },
  { label: "What to retire", desc: "Tools and agents that aren't pulling weight. Killed before they accrue maintenance debt." },
  { label: "What to revisit", desc: "The slow-burn questions. The ones a board member would ask, returned to next quarter." },
];

export default function AIActionPlanPage() {
  return (
    <article className={`article ${styles.page}`}>
      {/* Hero */}
      <header className={styles.hero}>
        <p className="eyebrow">What an engagement becomes</p>
        <h1 className={styles.heroTitle}>
          Ten days. <em>Then the work compounds.</em>
        </h1>
        <p className={styles.heroLead}>
          A short engagement, a working document, and the AI that gets built into your operation after. One arc, three stages.
        </p>
        <div className={styles.arcWrap}>
          <EngagementArc />
        </div>
      </header>

      <hr className={styles.rule} />

      {/* §1. The Action Plan */}
      <section className={styles.stage}>
        <div className={styles.stageHead}>
          <p className={styles.stageEyebrow}>Stage one · the deliverable</p>
          <h2 className={styles.stageTitle}>
            A document that <em>earns the room</em>.
          </h2>
        </div>

        <div className={styles.stageGrid}>
          <div className={styles.stageProse}>
            <p>
              Five sections. Read in one sitting. Every line tied to a dollar. The Plan is what a senior team takes into the room, marks up with a pen, and leaves with — agreed, sharpened, or struck.
            </p>
            <p>
              Not a deck. Not a slide show. A working document that holds up under board-level pushback because every recommendation is named, ranked, and priced.
            </p>

            <ol className={styles.sectionsList}>
              {ACTION_PLAN_SECTIONS.map((s) => (
                <li key={s.n} className={styles.sectionItem}>
                  <span className={styles.sectionNum}><em>{s.n}.</em></span>
                  <div>
                    <h3 className={styles.sectionTitle}>{s.title}</h3>
                    <p className={styles.sectionDesc}>{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.stageVisual}>
            <RedactedDoc />
            <HeroImage
              src={translucentLeaf}
              alt=""
              className={styles.stageImage}
              priority={false}
            />
          </div>
        </div>

        <div className={styles.methodologyBlock}>
          <p className="eyebrow">Methodology</p>
          <h3 className={styles.methodologyHead}>
            What we read in ten days.
          </h3>
          <p className={styles.methodologyLead}>
            AI handles the volume. Our partners weigh which patterns matter.
          </p>
          <div className={styles.methodologyChart}>
            <MethodologyGrid />
          </div>
        </div>
      </section>

      <hr className={styles.rule} />

      {/* §2. AI software & agents */}
      <section className={styles.stage}>
        <div className={styles.stageHead}>
          <p className={styles.stageEyebrow}>Stage two · what we ship after</p>
          <h2 className={styles.stageTitle}>
            Tools your team uses. <em>Workers that don&rsquo;t sleep</em>.
          </h2>
        </div>

        <div className={styles.stageGrid}>
          <div className={styles.stageVisual}>
            <HeroImage
              src={gridEnergy}
              alt=""
              className={styles.stageImage}
              priority={false}
            />
          </div>

          <div className={styles.stageProse}>
            <p>
              Once the Plan identifies what would compound, we ship it. AI software for the role. AI agents for the work that happens at speed. The non-AI workflow shifts that earn their keep alongside.
            </p>
            <p>
              Built around what your operation actually produces. Run cost low enough that a tool earns out in weeks, not quarters.
            </p>
            <ul className={styles.buildList}>
              {BUILD_CATEGORIES.map((b) => (
                <li key={b.label} className={styles.buildItem}>
                  <p className={styles.buildPill}>{b.label}</p>
                  <h4 className={styles.buildHeadline}>{b.headline}</h4>
                  <p className={styles.buildBody}>{b.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <hr className={styles.rule} />

      {/* §3. Ongoing advisory */}
      <section className={styles.stage}>
        <div className={styles.stageHead}>
          <p className={styles.stageEyebrow}>Stage three · the relationship</p>
          <h2 className={styles.stageTitle}>
            <em>A quarterly working group</em>, on a calendar.
          </h2>
        </div>

        <div className={styles.stageGrid}>
          <div className={styles.stageProse}>
            <p>
              Two of our partners sit with the executive team once a quarter. Not monthly — that&rsquo;s a vendor cadence. Quarterly, with a printed agenda, in the room.
            </p>
            <p>
              We review what shipped and what it&rsquo;s producing. Rank what to build next. Retire what isn&rsquo;t pulling weight before it accrues maintenance debt. The relationship deepens as more of the work happens automatically.
            </p>
            <ul className={styles.advisoryList}>
              {ADVISORY_OUTCOMES.map((o) => (
                <li key={o.label} className={styles.advisoryItem}>
                  <h4 className={styles.advisoryHead}>{o.label}</h4>
                  <p className={styles.advisoryBody}>{o.desc}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.stageVisual}>
            <HeroImage
              src={leafDroplet}
              alt=""
              className={styles.stageImage}
              priority={false}
            />
          </div>
        </div>
      </section>

      <hr className={styles.rule} />

      {/* What an intro looks like */}
      <section className={styles.intro}>
        <div className={styles.introHead}>
          <p className="eyebrow">The first conversation</p>
          <h2 className={styles.introTitle}>
            Thirty minutes. <em>No deck</em>. No fee.
          </h2>
          <p className={styles.introLead}>
            The intro call exists because we won&rsquo;t take an engagement we don&rsquo;t believe in. Half of these end without a next step — that&rsquo;s the point.
          </p>
        </div>

        <ol className={styles.introSteps}>
          <li className={styles.introStep}>
            <span className={styles.introStepNum}><em>i.</em></span>
            <div>
              <h3 className={styles.introStepTitle}>Before the call</h3>
              <p className={styles.introStepBody}>
                AI parses your public site. We come in with two or three patterns we want to ask about — saves you the recap.
              </p>
            </div>
          </li>
          <li className={styles.introStep}>
            <span className={styles.introStepNum}><em>ii.</em></span>
            <div>
              <h3 className={styles.introStepTitle}>In the call</h3>
              <p className={styles.introStepBody}>
                A working conversation. Not a pitch. We listen the way operators listen — for what&rsquo;s annoying, what&rsquo;s compounding, what would matter changed.
              </p>
            </div>
          </li>
          <li className={styles.introStep}>
            <span className={styles.introStepNum}><em>iii.</em></span>
            <div>
              <h3 className={styles.introStepTitle}>After the call</h3>
              <p className={styles.introStepBody}>
                A direct answer on whether we&rsquo;re a fit. The introductions we make tend to land.
              </p>
            </div>
          </li>
        </ol>

        <div className={styles.introCtas}>
          <a href="https://cal.com/herenowlabs/intro" className="btn">
            Book a 30-minute intro
          </a>
          <Link href="/ai-action-plan-lite" className="btn btn--ghost">
            Try AI Action Plan (Lite)
          </Link>
        </div>
      </section>

      <div className={styles.footMark} aria-hidden="true">
        <RisingMark variant="wide" />
      </div>
    </article>
  );
}
