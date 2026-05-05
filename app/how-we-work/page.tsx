import type { Metadata } from "next";
import Link from "next/link";
import HeroImage from "../_components/HeroImage";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "How we work",
  description:
    "Ten business days. One AI Action Plan. Every recommendation tied to a dollar figure. Then the work that compounds — agents, generators, reviewers — built into the operation.",
};

export default function HowWeWorkPage() {
  return (
    <article className="article" style={{ paddingBlock: "var(--section-y)" }}>
      <header className={styles.header}>
        <p className="eyebrow">How we work</p>
        <h1 className={styles.title}>
          <em>Ten business days.</em> Four steps.{" "}
          <span className={styles.titleAccent}>One Action Plan.</span>
        </h1>
        <p className="lead" style={{ marginTop: "1rem" }}>
          What normally takes three months. AI compresses the ingestion. The judgment stays human. Then the work compounds.
        </p>
        <HeroImage
          src="/images/hero/how-we-work.jpg"
          alt=""
          className={styles.heroImage}
        />
      </header>

      <hr />

      <section>
        <h2>i. Executive alignment</h2>
        <p>
          Mutual NDA, master engagement letter with the price written down, and a two-hour working session with you and one or two senior leaders. We come out with three things on paper: the access we need, the calls we will need, and the success criterion the Plan will be measured against.
        </p>
        <Difference
          without="A two-week kickoff phase. Slide deck. Status meetings."
          with_="A working session. Printed agenda. Signed criterion by lunch."
        />
      </section>

      <section>
        <h2>ii. Discovery</h2>
        <p>
          Six business days of ingestion. Every contract, every renewal calendar, every vendor invoice, every dispatch log, every page of the public site, every line of the policies. AI surfaces the patterns at speed; the judgment about what matters stays with us.
        </p>
        <Difference
          without="A procurement specialist works through 93 contracts over three weeks. Misses the 61 with unexercised escalator clauses."
          with_="AI parses 93 contracts in 90 minutes. Flags every escalator. We weigh which ones matter."
        />
      </section>

      <section>
        <h2>iii. The AI Action Plan</h2>
        <p>
          Five sections, eight to ten pages. Where the margin is leaking. Where growth is waiting. What AI changes about both, today. Two to three moves to make first. Two questions to ask before next quarter.
        </p>
        <p>
          Every recommendation tied to a dollar figure. A fully de-identified sample is on{" "}
          <Link href="/ai-action-plan">the AI Action Plan page</Link>. If it does not look like something you would actually use inside the executive team, the rest of this page is selling a promise we have not earned.
        </p>
        <Difference
          without="A 60-slide deck. Skimmed across three calls. Lost in a SharePoint folder by Q3."
          with_="A 9-page document. Sat with for an hour. Every line tied to a dollar."
        />
      </section>

      <section>
        <h2>iv. The walkthrough</h2>
        <p>
          Ninety minutes. Printed copies on the table. We walk every finding. Questions land in the room. From there the work either stops or continues — advisory retainer, custom AI build, or done. Your call.
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

      <hr />

      <section className={styles.compoundSection}>
        <p className="eyebrow">v. The work that compounds</p>
        <h2>After the Plan, the AI starts to operate.</h2>
        <p>
          The Plan names the moves. The retainer keeps us close while you make them. The build work ships the AI tools the Plan identified — agents, generators, reviewers — that turn one-time captures into ongoing margin.
        </p>

        <ol className={styles.continuationList}>
          <li>
            <p className={styles.continuationLabel}>Advisory retainer · ongoing</p>
            <h3>The quarterly AI working group</h3>
            <p>
              Two of our partners sit with the executive team once a quarter. We review what was shipped, what is next, and what should be retired. Cost is fixed; cadence is the point.
            </p>
          </li>
          <li>
            <p className={styles.continuationLabel}>Build · 2–6 weeks per tool</p>
            <h3>Custom AI tools, scoped to your operation</h3>
            <p>
              An anniversary review agent that catches every escalator clause. A proposal generator that drafts from a scope document. A dispatch optimizer that staged inventory for the top forty service SKUs. Each one is scoped from the Plan; each one ships with a dollar target.
            </p>
            <p className={styles.continuationExamples}>
              <strong>Worked example.</strong> A senior estimator at a $25M mechanical contractor spends roughly 14 hours a week assembling proposals. An AI generator drafts from the prospect&rsquo;s scope document, pre-populating the labor and parts mix from the last forty winning bids. <mark>Estimator time recovered: ~14 hrs/week.</mark> Proposal-to-quote cycle: 3 days → 4 hours. Estimated revenue lift from faster turnaround: <mark>+8–12%</mark>.
            </p>
          </li>
          <li>
            <p className={styles.continuationLabel}>Long arc · across years</p>
            <h3>The operation gets sharper, not just leaner</h3>
            <p>
              The point is not that you cut a few hours of work. The point is that the next quarter&rsquo;s decisions are faster, the next renewal cycle catches what last year missed, and the next adjacent product line is launchable because the team has the bandwidth to launch it.
            </p>
          </li>
        </ol>
      </section>

      <hr />

      <section>
        <p className="eyebrow">What we do not do</p>
        <h2>A short list.</h2>
        <p>
          We are not a transformation consultancy. We do not redesign org charts or sit inside your operations for ninety days. We are not a generalist AI shop — no chatbots, no marketing copy generators. We do not work with companies under $10M in revenue.
        </p>
      </section>

      <hr />

      <section className={styles.cta}>
        <h2>If this sounds like the right shape.</h2>
        <p>Thirty minutes. No deck.</p>
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
