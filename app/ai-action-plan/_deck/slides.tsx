import Link from "next/link";
import type { Slide } from "./DeckViewer";
import SlideFrame from "./SlideFrame";
import s from "./slides.module.css";
import DonutMargin from "./charts/DonutMargin";
import StackedBarFindings from "./charts/StackedBarFindings";
import EscalatorBar from "./charts/EscalatorBar";
import DistributorSpread from "./charts/DistributorSpread";
import UtilizationCompare from "./charts/UtilizationCompare";
import SoftwareSeatsTimeline from "./charts/SoftwareSeatsTimeline";
import Timeline from "./charts/Timeline";
import RoadmapTable from "./charts/RoadmapTable";
import MethodologyGrid from "./charts/MethodologyGrid";

/**
 * Inline system diagrams for the two build slides. Three-node flow:
 * input → AI step → output. Kept here because each is unique and small.
 */
function ProposalSystemDiagram() {
  return (
    <svg viewBox="0 0 320 220" role="img" aria-labelledby="ps-t" preserveAspectRatio="xMidYMid meet">
      <title id="ps-t">Proposal generator system</title>
      {/* Input node */}
      <g transform="translate(20, 30)">
        <rect x="0" y="0" width="100" height="46" rx="4" fill="#faf9f5" stroke="#d4d1c4" strokeWidth="1" />
        <text x="50" y="20" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fill="#8e8e95" letterSpacing="1.5">PROSPECT INPUT</text>
        <text x="50" y="36" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="13" fill="#14141a">Scope document</text>
      </g>
      {/* Arrow */}
      <path d="M 130 53 L 175 53" stroke="#15803d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 168 49 L 175 53 L 168 57" stroke="#15803d" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* AI step */}
      <g transform="translate(180, 20)">
        <rect x="0" y="0" width="120" height="66" rx="4" fill="#d8ecdf" stroke="#15803d" strokeWidth="1" strokeDasharray="3 3" />
        <text x="60" y="16" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fill="#15803d" letterSpacing="1.5" fontWeight="600">AI</text>
        <text x="60" y="34" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="12" fill="#14141a">Pulls labor + parts</text>
        <text x="60" y="50" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="12" fill="#14141a">from past wins</text>
        <text x="60" y="62" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="8" fill="#4f4f57">~40 winning bids</text>
      </g>

      {/* Down arrow */}
      <path d="M 240 96 L 240 130" stroke="#15803d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 236 123 L 240 130 L 244 123" stroke="#15803d" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Output */}
      <g transform="translate(180, 135)">
        <rect x="0" y="0" width="120" height="46" rx="4" fill="#15803d" />
        <text x="60" y="20" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fill="#faf9f5" letterSpacing="1.5">DRAFT</text>
        <text x="60" y="36" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="13" fill="#faf9f5">Senior estimator reviews</text>
      </g>

      {/* Time annotation */}
      <g transform="translate(20, 170)">
        <text x="0" y="0" fontFamily="Inter, sans-serif" fontSize="9" fill="#8e8e95" letterSpacing="1.5">CYCLE</text>
        <text x="0" y="16" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="13" fill="#15803d">3 days → 4 hours</text>
      </g>
    </svg>
  );
}

function AgentSystemDiagram() {
  return (
    <svg viewBox="0 0 320 220" role="img" aria-labelledby="as-t" preserveAspectRatio="xMidYMid meet">
      <title id="as-t">Anniversary review agent system</title>
      {/* Watcher / trigger */}
      <g transform="translate(20, 20)">
        <rect x="0" y="0" width="140" height="46" rx="4" fill="#faf9f5" stroke="#d4d1c4" strokeWidth="1" />
        <text x="70" y="16" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fill="#8e8e95" letterSpacing="1.5">TRIGGER</text>
        <text x="70" y="34" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="13" fill="#14141a">Contract anniversary</text>
      </g>

      {/* Cyclic arrow indicating "watches" */}
      <path d="M 90 75 C 70 80 70 95 90 100 C 110 105 110 90 90 95" stroke="#8e8e95" strokeWidth="1" fill="none" strokeDasharray="2 2" />
      <text x="40" y="92" fontFamily="Inter, sans-serif" fontStyle="italic" fontSize="9" fill="#8e8e95">watches</text>

      {/* Arrow down */}
      <path d="M 90 110 L 90 135" stroke="#15803d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 86 128 L 90 135 L 94 128" stroke="#15803d" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* AI agent */}
      <g transform="translate(20, 140)">
        <rect x="0" y="0" width="140" height="62" rx="4" fill="#d8ecdf" stroke="#15803d" strokeWidth="1" strokeDasharray="3 3" />
        <text x="70" y="16" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fill="#15803d" letterSpacing="1.5" fontWeight="600">AI AGENT</text>
        <text x="70" y="34" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="12" fill="#14141a">Parses escalator</text>
        <text x="70" y="50" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="12" fill="#14141a">clauses · drafts letter</text>
      </g>

      {/* Right arrow to output */}
      <path d="M 170 65 L 215 65" stroke="#15803d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 208 61 L 215 65 L 208 69" stroke="#15803d" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Output: human sign-off */}
      <g transform="translate(220, 42)">
        <rect x="0" y="0" width="86" height="46" rx="4" fill="#15803d" />
        <text x="43" y="20" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fill="#faf9f5" letterSpacing="1.5">SIGN-OFF</text>
        <text x="43" y="36" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="12" fill="#faf9f5">Human</text>
      </g>

      {/* Volume annotation */}
      <g transform="translate(180, 165)">
        <text x="0" y="0" fontFamily="Inter, sans-serif" fontSize="9" fill="#8e8e95" letterSpacing="1.5">VOLUME</text>
        <text x="0" y="16" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="13" fill="#15803d">93 in 90 minutes</text>
      </g>
    </svg>
  );
}

const TOTAL = 18;
const today = new Date();
const dateLine = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });

export const ACTION_PLAN_SLIDES: Slide[] = [
  // ─── 1. Cover ──────────────────────────────────────────────────
  {
    id: "cover",
    kind: "cover",
    body: (
      <SlideFrame bare>
        <div className={s.coverLayout}>
          <p className={s.coverEyebrow}>
            <span className={s.coverEyebrowMark} aria-hidden="true" />
            <span>AI Action Plan · sample</span>
          </p>
          <div>
            <h1 className={s.coverTitle}>
              Northshore Mechanical <em>Services</em>
            </h1>
            <p className={s.coverSubtitle}>
              Ten business days · audit only · fully de-identified
            </p>
          </div>
          <div className={s.coverFooter}>
            <span>Here Now Labs</span>
            <span>{dateLine}</span>
          </div>
        </div>
      </SlideFrame>
    ),
  },

  // ─── 2. Subject snapshot ───────────────────────────────────────
  {
    id: "subject",
    kind: "snapshot",
    title: "The subject",
    body: (
      <SlideFrame title="The subject" pageNumber={2} totalPages={TOTAL}>
        <div className={s.snapshotLayout}>
          <p className={s.snapshotLead}>
            A founder-led mechanical contractor in eastern Massachusetts and southern New Hampshire. Second generation. Profitable. Quietly mid-market.
          </p>
          <dl className={s.snapshotFacts}>
            <div className={s.snapshotFact}>
              <dt>Revenue</dt>
              <dd>$24.8M trailing twelve months</dd>
            </div>
            <div className={s.snapshotFact}>
              <dt>Region</dt>
              <dd>Eastern MA · southern NH</dd>
            </div>
            <div className={s.snapshotFact}>
              <dt>Lines</dt>
              <dd>Install · retrofit · service · controls</dd>
            </div>
            <div className={s.snapshotFact}>
              <dt>Staff</dt>
              <dd>108 (was 134 in 2022)</dd>
            </div>
            <div className={s.snapshotFact}>
              <dt>Generation</dt>
              <dd>Founder-led, second generation</dd>
            </div>
          </dl>
        </div>
      </SlideFrame>
    ),
  },

  // ─── 3. What AI did ────────────────────────────────────────────
  {
    id: "what-ai-did",
    kind: "metric",
    title: "What AI did to produce this",
    body: (
      <SlideFrame title="What AI did to produce this" pageNumber={3} totalPages={TOTAL}>
        <div className={s.metricLayout}>
          <p className={s.metricLead}>
            Nine business days of ingestion. Every contract, vendor record, dispatch log, and policy parsed at speed. Forty anomalies surfaced. We weighed which ones mattered.
          </p>
          <div className={s.metricGrid}>
            <div className={s.metricCell}>
              <span className={s.metricNum}>93</span>
              <span className={s.metricLabel}>Active maintenance contracts parsed</span>
            </div>
            <div className={s.metricCell}>
              <span className={s.metricNum}>18 <em>mo</em></span>
              <span className={s.metricLabel}>Vendor invoices reviewed</span>
            </div>
            <div className={s.metricCell}>
              <span className={s.metricNum}>12 <em>mo</em></span>
              <span className={s.metricLabel}>Dispatch logs analyzed</span>
            </div>
            <div className={s.metricCell}>
              <span className={s.metricNum}>~40</span>
              <span className={s.metricLabel}>Anomalies surfaced for human judgment</span>
            </div>
          </div>
        </div>
      </SlideFrame>
    ),
  },

  // ─── 4. §i. Margin — chart ────────────────────────────────────
  {
    id: "margin-bet",
    kind: "chart",
    chapter: "§i. Where the margin actually lives",
    title: "Service is what compounds.",
    body: (
      <SlideFrame chapter="§i. Where the margin actually lives" title="Service is what compounds." pageNumber={4} totalPages={TOTAL}>
        <div className={s.chartLayout}>
          <div className={s.chartArea}>
            <DonutMargin />
          </div>
          <div className={s.chartTakeaway}>
            <p className={s.chartTakeawayHead}>
              The bet — written in plain English.
            </p>
            <p className={s.chartTakeawayBody}>
              Northshore is sold internally as a full-service mechanical contractor with install at the front of the marketing, the comp plan, and the calendar. The financials describe a different company.
            </p>
            <p className={s.chartTakeawayBody}>
              <mark>Roughly 71% of operating margin came from recurring service and maintenance.</mark> Install pays the lights and feeds the service book. Service is the thing that compounds.
            </p>
          </div>
        </div>
      </SlideFrame>
    ),
  },

  // ─── 5. §i. Strategic exposure ────────────────────────────────
  {
    id: "margin-exposure",
    kind: "content",
    chapter: "§i. Where the margin actually lives",
    title: "The exposure the org chart doesn't show.",
    body: (
      <SlideFrame chapter="§i. Where the margin actually lives" title="The exposure the org chart doesn't show." pageNumber={5} totalPages={TOTAL}>
        <div className={s.contentLayout}>
          <div className={s.contentBody}>
            <p>
              The senior estimator runs the install pipeline. <mark>Nobody equivalent runs the service book at the executive level.</mark> Sales comp pays for install bid wins, not for renewing or expanding the agreements that produce the margin.
            </p>
            <p>
              When one of the top fifteen accounts moves, the install pipeline takes the second hit two quarters later — because those accounts are who refer the next install. The exposure is asymmetric in a way the org chart does not advertise.
            </p>
          </div>
          <div className={s.contentCallout}>
            <strong>Concentration</strong>
            Top fifteen accounts produce <em>~58%</em> of service revenue, on a screen that has not been replaced since 2017.
          </div>
        </div>
      </SlideFrame>
    ),
  },

  // ─── 6. §ii. Findings summary ──────────────────────────────────
  {
    id: "findings-summary",
    kind: "chart",
    chapter: "§ii. Where the margin's been waiting",
    title: "Four pools of margin.",
    body: (
      <SlideFrame chapter="§ii. Where the margin's been waiting" title="Four pools of margin." pageNumber={6} totalPages={TOTAL}>
        <div className={s.chartLayout}>
          <div className={s.chartArea}>
            <StackedBarFindings />
          </div>
          <div className={s.chartTakeaway}>
            <p className={s.chartTakeawayHead}>
              <mark>$2.4M – $3.3M annual.</mark> About 10–13% of revenue.
            </p>
            <p className={s.chartTakeawayBody}>
              Four pools, all addressable inside the current fiscal year with existing staff, two outside specialists, and roughly six to eight weeks of attention each.
            </p>
          </div>
        </div>
      </SlideFrame>
    ),
  },

  // ─── 7. Finding 1: Escalators ──────────────────────────────────
  {
    id: "finding-1",
    kind: "finding",
    chapter: "§ii. Finding 1",
    title: "Escalators frozen since 2022.",
    body: (
      <SlideFrame chapter="§ii. Finding 1" title="Escalators frozen since 2022." pageNumber={7} totalPages={TOTAL}>
        <div className={s.findingLayout}>
          <div className={s.findingLeft}>
            <p className={s.findingDollarLabel}>Estimated annual capture</p>
            <p className={s.findingDollar}>$1.4 – 1.8M</p>
            <p className={s.findingBody}>
              <mark>Sixty-one of the ninety-three active commercial maintenance agreements</mark> were last priced before the 2023–24 wage adjustments. The rate-card escalator clauses exist (<em>Schedule B</em> in the standard form, <em>Section 4.2</em> in the legacy form) and grant Northshore the right to adjust at each anniversary.
            </p>
            <p className={s.findingBody}>
              They were not exercised — the review fell to a senior coordinator carrying five other priorities.
            </p>
          </div>
          <div className={s.findingRight}>
            <EscalatorBar />
          </div>
        </div>
      </SlideFrame>
    ),
  },

  // ─── 8. Finding 2: Parts fragmentation ─────────────────────────
  {
    id: "finding-2",
    kind: "finding",
    chapter: "§ii. Finding 2",
    title: "Parts buying fragmented.",
    body: (
      <SlideFrame chapter="§ii. Finding 2" title="Parts buying fragmented." pageNumber={8} totalPages={TOTAL}>
        <div className={s.findingLayout}>
          <div className={s.findingLeft}>
            <p className={s.findingDollarLabel}>Estimated annual capture</p>
            <p className={s.findingDollar}>$520 – 740K</p>
            <p className={s.findingBody}>
              The same SKUs flow in through four supply houses at unit prices that vary <mark>8–18%</mark> depending on which technician calls which counter. Two of the four are owned by the same parent and have unified rebate programs Northshore is not enrolled in.
            </p>
            <p className={s.findingBody}>
              Consolidating to two preferred suppliers with a single rebate agreement — six weeks of procurement work — captures the range named above.
            </p>
          </div>
          <div className={s.findingRight}>
            <DistributorSpread />
          </div>
        </div>
      </SlideFrame>
    ),
  },

  // ─── 9. Finding 3: Labor utilization ────────────────────────
  {
    id: "finding-3",
    kind: "finding",
    chapter: "§ii. Finding 3",
    title: "Field labor utilization gap.",
    body: (
      <SlideFrame chapter="§ii. Finding 3" title="Field labor utilization gap." pageNumber={9} totalPages={TOTAL}>
        <div className={s.findingLayout}>
          <div className={s.findingLeft}>
            <p className={s.findingDollarLabel}>Estimated annual capture</p>
            <p className={s.findingDollar}>$380 – 560K</p>
            <p className={s.findingBody}>
              Service tickets under four billable hours run at <mark>58% productive utilization</mark>. The same technicians on planned-maintenance routes run at <mark>81%</mark>.
            </p>
            <p className={s.findingBody}>
              The gap is dispatch sequencing and parts staging, not technician effort. Two changes close most of it: pre-staged truck inventory tuned to the top forty service SKUs, and a same-day cluster rule that holds non-emergency small jobs until two are within ten miles.
            </p>
          </div>
          <div className={s.findingRight}>
            <UtilizationCompare />
          </div>
        </div>
      </SlideFrame>
    ),
  },

  // ─── 10. Finding 4: Software seats ────────────────────────────
  {
    id: "finding-4",
    kind: "finding",
    chapter: "§ii. Finding 4",
    title: "Software seats misaligned.",
    body: (
      <SlideFrame chapter="§ii. Finding 4" title="Software seats misaligned." pageNumber={10} totalPages={TOTAL}>
        <div className={s.findingLayout}>
          <div className={s.findingLeft}>
            <p className={s.findingDollarLabel}>Estimated annual capture</p>
            <p className={s.findingDollar}>$140 – 190K</p>
            <p className={s.findingBody}>
              Three platforms are licensed at a tier set when Northshore employed 134 people. Current headcount is <mark>108</mark>. There is also a fourth subscription — <mark>$3,400/month</mark>, charged to operations — that no one in the executive team could identify the owner of when asked.
            </p>
            <p className={s.findingBody}>
              The smallest of the four findings, and the most viscerally embarrassing.
            </p>
          </div>
          <div className={s.findingRight}>
            <SoftwareSeatsTimeline />
          </div>
        </div>
      </SlideFrame>
    ),
  },

  // ─── 11. §iii. Compression ────────────────────────────────────
  {
    id: "compression",
    kind: "chart",
    chapter: "§iii. What AI changes about this, today",
    title: "Nine days, not four months.",
    body: (
      <SlideFrame chapter="§iii. What AI changes about this, today" title="Nine days, not four months." pageNumber={11} totalPages={TOTAL}>
        <div className={s.chartLayout}>
          <div className={s.chartArea}>
            <Timeline />
          </div>
          <div className={s.chartTakeaway}>
            <p className={s.chartTakeawayHead}>
              The change is not that AI generated the insight.
            </p>
            <p className={s.chartTakeawayBody}>
              The change is that AI made it economical to parse the entire corpus in volume — every agreement, every clause, every renewal date, every line item — and surface the anomalies for a human to weigh.
            </p>
            <p className={s.chartTakeawayBody}>
              <mark>The volume of reading was, until recently, the part of the work that priced consulting out of mid-market budgets.</mark>
            </p>
          </div>
        </div>
      </SlideFrame>
    ),
  },

  // ─── 12. Build 1: Proposal generator ─────────────────────────
  {
    id: "build-1",
    kind: "build",
    chapter: "§iii. AI inside the operation",
    title: "Proposal generator.",
    body: (
      <SlideFrame chapter="§iii. AI inside the operation" title="Proposal generator." pageNumber={12} totalPages={TOTAL}>
        <div className={s.buildLayout}>
          <div className={s.buildLeft}>
            <p className={s.buildPill}>AI software · 4–6 weeks · build</p>
            <h3 className={s.buildHeading}>Custom tool for the senior estimator.</h3>
            <p className={s.buildBody}>
              Drafts from a prospect's scope document; pre-populates labor and parts from the last forty winning bids. Run cost under <mark>$400/month</mark>.
            </p>
            <ul className={s.buildMetrics}>
              <li>
                <span>Estimator time recovered</span>
                <strong>~14 hrs / week</strong>
              </li>
              <li>
                <span>Quote cycle</span>
                <strong>3 days → 4 hours</strong>
              </li>
              <li>
                <span>Estimated revenue lift</span>
                <strong>+8–12%</strong>
              </li>
            </ul>
          </div>
          <div className={s.buildRight}>
            <ProposalSystemDiagram />
          </div>
        </div>
      </SlideFrame>
    ),
  },

  // ─── 13. Build 2: Anniversary review agent ───────────────────
  {
    id: "build-2",
    kind: "build",
    chapter: "§iii. AI inside the operation",
    title: "Anniversary review agent.",
    body: (
      <SlideFrame chapter="§iii. AI inside the operation" title="Anniversary review agent." pageNumber={13} totalPages={TOTAL}>
        <div className={s.buildLayout}>
          <div className={s.buildLeft}>
            <p className={s.buildPill}>AI agent · 2–4 weeks · build</p>
            <h3 className={s.buildHeading}>An autonomous worker on a calendar trigger.</h3>
            <p className={s.buildBody}>
              Watches the contract calendar. At each anniversary, parses the rate-card escalator clauses, checks the labor-rate baseline, and drafts the renewal letter. Human review is sign-off, not effort.
            </p>
            <ul className={s.buildMetrics}>
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
          <div className={s.buildRight}>
            <AgentSystemDiagram />
          </div>
        </div>
      </SlideFrame>
    ),
  },

  // ─── 14. §iv. Roadmap ─────────────────────────────────────────
  {
    id: "roadmap",
    kind: "roadmap",
    chapter: "§iv. What to build first",
    title: "Three moves, ranked.",
    body: (
      <SlideFrame chapter="§iv. What to build first" title="Three moves, ranked." pageNumber={14} totalPages={TOTAL}>
        <div className={s.roadmapLayout}>
          <p className={s.roadmapLead}>
            Each tagged with the kind of work it implies, so the executive team can sequence resources.
          </p>
          <div className={s.chartArea} style={{ alignItems: "stretch" }}>
            <RoadmapTable />
          </div>
        </div>
      </SlideFrame>
    ),
  },

  // ─── 15. §iv. Risks ────────────────────────────────────────────
  {
    id: "risks",
    kind: "content",
    chapter: "§iv. What to build first",
    title: "Risks we'd name in advance.",
    body: (
      <SlideFrame chapter="§iv. What to build first" title="Risks we'd name in advance." pageNumber={15} totalPages={TOTAL}>
        <div className={s.contentLayout}>
          <div className={s.contentBody}>
            <p>
              <mark>Two or three of the fifteen largest accounts will push back hard at the first cycle of escalator letters.</mark> Plan for it; do not be surprised.
            </p>
            <p>
              Technician resistance to consolidating distributors is real — the existing supply-house relationships are personal. Best handled by paying close attention to the on-counter experience and credit-line behavior for the two preferred houses, not by mandate.
            </p>
            <p>
              The software-seat audit is small in dollars and disproportionate in political cost. Surface it; do not lead with it.
            </p>
          </div>
          <div className={s.contentCallout}>
            <strong>Sequence rule</strong>
            Lead with the agent. It is the cleanest demonstration that AI can be useful in concrete and unglamorous ways.
          </div>
        </div>
      </SlideFrame>
    ),
  },

  // ─── 16. §v. Two strategic questions ──────────────────────────
  {
    id: "questions",
    kind: "typography",
    chapter: "§v. Two strategic questions",
    title: "Two questions for next quarter.",
    body: (
      <SlideFrame chapter="§v. Two strategic questions" title="Two questions for next quarter." pageNumber={16} totalPages={TOTAL}>
        <div className={s.typographyLayout}>
          <p className={s.typographyQuestion}>
            <em>If service produces 71% of margin,</em> why is the senior selling effort going into install bids?
          </p>
          <p className={s.typographyAnswer}>
            Today there is no answer. The service book is healthy because it has always been healthy. The question is not rhetorical. It calls for a re-weighting of where the senior team spends its calendar.
          </p>

          <p className={s.typographyQuestion}>
            <em>What would it take, in the next six months,</em> to make Northshore the obvious place to call for the controls and energy-efficiency upgrades the top fifty service accounts are about to need anyway?
          </p>
          <p className={s.typographyAnswer}>
            Not more technicians. A customer portal, a 48-hour anniversary-quoting cycle, a named single point of contact for each top-fifty account.
          </p>
        </div>
      </SlideFrame>
    ),
  },

  // ─── 17. Methodology ─────────────────────────────────────────
  {
    id: "methodology",
    kind: "infographic",
    title: "What we read.",
    body: (
      <SlideFrame title="What we read." pageNumber={17} totalPages={TOTAL}>
        <div className={s.infographicLayout}>
          <p className={s.infographicLead}>
            Across ten business days, we worked through everything Northshore produced. AI handled the volume; every line above was weighted by us.
          </p>
          <div className={s.chartArea}>
            <MethodologyGrid />
          </div>
        </div>
      </SlideFrame>
    ),
  },

  // ─── 18. Closing ─────────────────────────────────────────────
  {
    id: "closing",
    kind: "closing",
    body: (
      <SlideFrame bare>
        <div className={s.closingLayout}>
          <div className={s.closingMain}>
            <p className={s.coverEyebrow}>
              <span className={s.coverEyebrowMark} aria-hidden="true" />
              <span>Talk to us about your operation</span>
            </p>
            <h2 className={s.closingTitle}>
              Find the AI in <em>your operation</em>.
            </h2>
            <p className={s.closingSub}>
              Ten days to your Action Plan. Months to build what compounds for years.
            </p>
            <div className={s.closingCtas}>
              <a href="https://cal.com/herenowlabs/intro" className="btn">
                Book a 30-minute intro
              </a>
              <Link href="/contact" className="btn btn--ghost">
                Use the contact form
              </Link>
            </div>
          </div>
          <div className={s.closingFoot}>
            <span>Here Now Labs · Confidential to the executive team named above</span>
            <span>{dateLine}</span>
          </div>
        </div>
      </SlideFrame>
    ),
  },
];
