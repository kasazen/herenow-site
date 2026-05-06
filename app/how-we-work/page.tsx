import type { Metadata } from "next";
import Link from "next/link";
import HeroImage from "../_components/HeroImage";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "How we work",
  description:
    "The Here Now Method — five stages, ten business days, one AI Action Plan. Then the work that compounds: AI software, AI agents, ongoing advisory.",
};

export default function HowWeWorkPage() {
  return (
    <article className="article" style={{ paddingBlock: "var(--section-y)" }}>
      <header className={styles.header}>
        <p className="eyebrow">How we work</p>
        <h1 className={styles.title}>
          <em>The Here Now Method</em>.{" "}
          <span className={styles.titleAccent}>Five stages.</span>{" "}
          One Action Plan.
        </h1>
        <p className="lead" style={{ marginTop: "1rem" }}>
          A conversation, then ten business days — AI parsing every contract, vendor record, and dispatch log while your partners weigh the bets that move the operation. Then the relationship continues, and the work compounds.
        </p>
        <HeroImage
          src="/images/hero/how-we-work.jpg"
          alt=""
          className={styles.heroImage}
        />
      </header>

      <hr />

      <ol className={styles.overview} aria-label="Method overview">
        <li><a href="#step-i" className={styles.overviewItem}>
          <span className={styles.overviewNum}><em>i.</em></span>
          <span className={styles.overviewTitle}>Listen, in person</span>
        </a></li>
        <li><a href="#step-ii" className={styles.overviewItem}>
          <span className={styles.overviewNum}><em>ii.</em></span>
          <span className={styles.overviewTitle}>Ingest, with our tooling</span>
        </a></li>
        <li><a href="#step-iii" className={styles.overviewItem}>
          <span className={styles.overviewNum}><em>iii.</em></span>
          <span className={styles.overviewTitle}>Weigh, with judgment</span>
        </a></li>
        <li><a href="#step-iv" className={styles.overviewItem}>
          <span className={styles.overviewNum}><em>iv.</em></span>
          <span className={styles.overviewTitle}>The AI Action Plan</span>
        </a></li>
        <li><a href="#step-v" className={styles.overviewItem}>
          <span className={styles.overviewNum}><em>v.</em></span>
          <span className={styles.overviewTitle}>The walkthrough</span>
        </a></li>
      </ol>

      <section id="step-i">
        <h2>i. Listen, in person</h2>
        <p>
          Mutual NDA, master engagement letter with the price written down, and a two-hour working session with you and one or two senior leaders. We are operators ourselves; we listen the way operators listen — for what is annoying, what is compounding, what would matter if it changed.
        </p>
        <p>
          We come out with three things on paper: the access we need, the calls we will need, and the success criterion the Plan will be measured against.
        </p>
        <Difference
          without="A two-week kickoff phase. Slide deck. Status meetings."
          with_="A working session. Printed agenda. Signed criterion by lunch."
        />
      </section>

      <section id="step-ii">
        <h2>ii. Ingest, with our tooling</h2>
        <p>
          Six business days. Every contract, every renewal calendar, every vendor invoice, every dispatch log, every page of the public site, every line of the policies. Our internal parsing stack is tuned to what mid-market operations actually produce — the standard- and legacy-form contracts, the vendor masters, the maintenance tickets, the renewal calendars — and surfaces patterns at speed.
        </p>
        <Difference
          without="A procurement specialist works through 93 contracts over three weeks. Misses the 61 with unexercised escalator clauses."
          with_="Our stack parses 93 contracts in 90 minutes. Flags every escalator. We weigh which ones matter."
        />
      </section>

      <section id="step-iii">
        <h2>iii. Weigh, with judgment</h2>
        <p>
          The anomalies AI surfaces are not the answer. The judgment about which ones matter — and why — is the work. Our partners spend the bulk of the engagement here, alongside two or three short calls with the people who run the parts of the operation we are weighing.
        </p>
        <p>
          Around day five or six, we sit with you for a forty-five-minute check-in. We share what is starting to surface; you tell us what to pull on harder. The Plan&rsquo;s shape gets agreed before it is written.
        </p>
      </section>

      <section id="step-iv">
        <h2>iv. The AI Action Plan</h2>
        <p>
          Five sections, eight to ten pages. <strong>Cost savings, growth lanes, software builds, and agent builds — all named, ranked, and tagged.</strong> Where the margin&rsquo;s been waiting. Where growth is waiting. What AI changes about both. What to build first.
        </p>
        <p>
          Every recommendation is tied to a dollar figure and tagged with the kind of work it implies — workflow change, procurement, AI software, or AI agent. A fully de-identified sample is on{" "}
          <Link href="/ai-action-plan">the AI Action Plan page</Link>.
        </p>
        <Difference
          without="A 60-slide deck. Skimmed across three calls. Lost in a SharePoint folder by Q3."
          with_="A 9-page document. Sat with for an hour. Every line tied to a dollar and tagged for what we would build."
        />
      </section>

      <section id="step-v">
        <h2>v. The walkthrough</h2>
        <p>
          Ninety minutes. Printed copies on the table. We walk every finding. Questions land in the room. By the end every recommendation has been agreed with, sharpened, or struck.
        </p>
        <Difference
          without="A polished read-out. Q&A at the end. Decisions deferred to a follow-up."
          with_="A working session. Pushback in real time. Decisions made before you leave the room."
        />
        <p style={{ marginTop: "1.5em" }}>
          For the room itself —{" "}
          <Link href="/working-sessions">see what each session looks like</Link>.
        </p>
      </section>

      <div className="mark-divider" aria-hidden="true" />

      <section className={styles.compoundSection}>
        <p className="eyebrow">The work that compounds</p>
        <h2>After the Plan, the AI starts to operate.</h2>
        <p>
          Most engagements continue. The audit is the wedge; the relationship that follows is where AI begins to operate inside the business. Three shapes the continuation tends to take.
        </p>

        <ol className={styles.continuationList}>
          <li>
            <p className={styles.continuationLabel}>AI software · 4–6 weeks per tool</p>
            <h3>Custom tools, scoped to a role</h3>
            <p>
              Software your team uses every day. A senior estimator gets a proposal generator. A dispatch coordinator gets an inventory and routing helper. A controller gets a renewal-and-anomaly scanner. Built around a specific role; used by a specific person.
            </p>
            <p className={styles.continuationExamples}>
              <strong>Worked example.</strong> A senior estimator at a $25M mechanical contractor spends roughly 14 hours a week on proposals. An AI generator drafts from the prospect&rsquo;s scope document, pre-populating labor and parts from the last forty winning bids. <mark>Estimator time recovered: ~14 hrs/week.</mark> Quote cycle: 3 days → 4 hours. Estimated revenue lift: <mark>+8–12%</mark>. Build cost: 4–6 weeks. Run cost: under $400/month.
            </p>
          </li>
          <li>
            <p className={styles.continuationLabelAgent}>AI agents · 2–4 weeks per agent</p>
            <h3>Autonomous workers, on a schedule or trigger</h3>
            <p>
              No one invokes them. They watch the calendar, the inbox, the document folder, the dispatch queue — and act when their conditions fire. Human review is sign-off, not effort.
            </p>
            <p className={styles.continuationExamples}>
              <strong>Worked example.</strong> An anniversary review agent watches the contract calendar. At each maintenance-agreement anniversary, it parses the rate-card escalator clauses (<em>Schedule B</em> and <em>Section 4.2</em>), checks the current labor-rate baseline, and drafts the renewal letter for human sign-off. <mark>93 contracts reviewed in 90 minutes</mark> instead of three weeks. Captured margin: <mark>$1.4M – $1.8M / yr</mark>. Human time: sign-off only.
            </p>
          </li>
          <li>
            <p className={styles.continuationLabelRetainer}>Advisory · ongoing</p>
            <h3>The quarterly AI working group</h3>
            <p>
              Two of our partners sit with the executive team once a quarter. We review what shipped. Rank what to build next. Retire what is not pulling its weight. Cost is fixed; cadence is the point.
            </p>
            <p className={styles.continuationExamples}>
              <strong>Output.</strong> A short list of next AI builds — software or agent — each scoped to a known dollar target, ready for the build pipeline. The quarterly is also where a struggling tool gets killed before it accrues maintenance debt.
            </p>
          </li>
        </ol>
      </section>

      <hr />

      <section>
        <p className="eyebrow">What we do not do</p>
        <h2>A short list.</h2>
        <p>
          We are not a transformation consultancy. We do not redesign org charts or sit inside your operations for ninety days. We are not a generalist AI shop — no chatbots, no marketing copy generators, no model fine-tuning side projects. We do not work with companies under $10M in revenue.
        </p>
      </section>

      <hr />

      <section className={styles.cta}>
        <h2>If this sounds like the right shape.</h2>
        <p>Thirty minutes. No deck. A conversation.</p>
        <div className={styles.ctaRow}>
          <a href="https://cal.com/herenowlabs/intro" className="btn">
            Book a 30-minute intro
          </a>
          <Link href="/contact" className="btn btn--ghost">
            Use the contact form
          </Link>
        </div>
      </section>
    </article>
  );
}

function Difference({ without, with_ }: { without: string; with_: string }) {
  return (
    <div className={styles.diff}>
      <div className={styles.diffRow}>
        <span className={styles.diffLabel}>Without AI</span>
        <p className={styles.diffWithout}>{without}</p>
      </div>
      <div className={styles.diffRow}>
        <span className={styles.diffLabelOn}>With AI</span>
        <p className={styles.diffWith}>{with_}</p>
      </div>
    </div>
  );
}
