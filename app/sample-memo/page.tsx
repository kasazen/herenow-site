import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sample memo",
  description:
    "A fully de-identified strategic memo from a Here Now Labs engagement — five sections, every recommendation tied to a dollar figure.",
};

export default function SampleMemoPage() {
  return (
    <article className={`article ${styles.memo}`}>
      <p className={`eyebrow ${styles.eyebrow}`}>Sample memo · fictionalized</p>
      <h1 className={styles.title}>
        Strategic Read · Northshore Mechanical Services
      </h1>
      <p className={styles.dek}>
        A fully de-identified composite drawn from the patterns we see across mid-market mechanical and specialty-trade contractors. Names, figures, and details are altered. The structure and density are exactly how the real memo arrives in the executive&rsquo;s inbox.
      </p>

      <dl className={styles.meta}>
        <div>
          <dt>Prepared for</dt>
          <dd>The Northshore Mechanical executive team</dd>
        </div>
        <div>
          <dt>Engagement window</dt>
          <dd>Ten business days · audit only</dd>
        </div>
        <div>
          <dt>Read time</dt>
          <dd>Approx. nine minutes</dd>
        </div>
      </dl>

      <hr />

      <section>
        <h2>i. Where the margin actually lives</h2>
        <p>
          Northshore presents as a full-service mechanical contractor: install, retrofit, service, controls. The financials say something narrower. <mark>Roughly 71% of operating margin in the trailing twelve months came from recurring service and maintenance agreements</mark> — not from new install work. The install side of the business pays the lights and feeds the service book; the service book is what actually compounds.
        </p>
        <p>
          That is not how the company is sold internally. Sales compensation is weighted toward install bid wins. The senior estimator gets the calendar attention. The service dispatch function — the part of the business that produces most of the margin — runs on a senior coordinator who has been there fourteen years and a dispatch screen that has not been replaced since 2017. The exposure is concrete: when a competitor poaches one of the top fifteen recurring accounts, the swing is meaningful and shows up two quarters later in the install pipeline as well, because those accounts are who refer the next install.
        </p>
      </section>

      <section>
        <h2>ii. Where the leak is</h2>
        <p>
          Across the documents read during the engagement, four pools of leakage are large enough to act on this quarter. Listed in order of estimated annualized impact.
        </p>
        <ol className={styles.findings}>
          <li>
            <p>
              <strong>Service contract pricing frozen against 2022 labor rates — <mark>$1.4M to $1.8M annual</mark>.</strong>
              {" "}
              Of the ninety-three active commercial maintenance agreements, sixty-one were last priced before the 2023–2024 wage adjustments. The rate-card escalator clauses exist in the contracts but were not exercised at the last anniversary. The dollar value above assumes a two-step normalization over the next twelve months, not a single shock; a comparable contractor we have visibility on captured 89% of the implied uplift in the first cycle without losing accounts.
            </p>
          </li>
          <li>
            <p>
              <strong>Parts purchasing fragmented across four distributors — <mark>$520K to $740K annual</mark>.</strong>
              {" "}
              The same SKUs are flowing in through four supply houses at meaningfully different unit prices, depending on which technician calls which counter. Two of the four distributors are owned by the same parent. Consolidating to two preferred suppliers with a single rebate program — a six-week procurement effort — captures the range named above based on prior-year actuals.
            </p>
          </li>
          <li>
            <p>
              <strong>Field labor utilization on small-job tickets — <mark>$380K to $560K annual</mark>.</strong>
              {" "}
              Service tickets under four billable hours run at 58% productive utilization (drive, diagnose, fix, write up). The same technicians on planned-maintenance routes run at 81%. The gap is largely dispatch sequencing and parts staging, not technician effort. Tightening the small-ticket workflow — pre-staged truck inventory plus a same-day cluster rule — closes most of the gap. Comparable contractors who have tightened this workflow have moved similar utilization gaps in two to three months.
            </p>
          </li>
          <li>
            <p>
              <strong>Software seats and services aligned to 2022 headcount — <mark>$140K to $190K annual</mark>.</strong>
              {" "}
              Three platforms (the field service management suite, the CRM add-on, and an estimating tool) are licensed at a tier set when Northshore employed 134 people. Current headcount is 108. There is also a fourth subscription that no one in the executive team could identify the owner of when asked.
            </p>
          </li>
        </ol>
        <p>
          Total estimated annualized leakage across these four pools: <mark>$2.4M to $3.3M.</mark> All four are addressable inside the current fiscal year with existing staff, two outside specialists, and roughly six to eight weeks of attention each.
        </p>
      </section>

      <section>
        <h2>iii. What AI changes about that, today</h2>
        <p>
          The four findings above were surfaced in nine days of reading. Three years ago that would have been four months of consultant time at a meaningful multiple of the engagement fee. The change is not that AI generated insight. The change is that AI made it economical to read the entire contract and dispatch corpus in volume — every agreement, every escalator clause, every renewal date, every ticket time-stamp — and surface the anomalies for human review.
        </p>
        <p>
          Inside Northshore, the same pattern applies in two specific places this quarter. The first is the estimating function, where the team currently spends two to three days per week assembling proposals that draw from the same forty-odd component patterns. A small AI tool that drafts the estimate from the prospect&rsquo;s scope document and pre-populates the labor and parts mix would compress that work by an estimated 60–70%. We have built two of these inside comparable contractors; the build is roughly four to six weeks.
        </p>
        <p>
          The second is service-contract review at anniversary. Sixty-one of the missed escalators identified above were not flagged in the last cycle because the review was being done by a senior coordinator with five other priorities. AI-assisted contract review at anniversary would have surfaced all sixty-one in approximately ninety minutes of analyst time. This is a workflow change that does not require building anything: it requires standardizing how anniversaries enter the queue and applying a tool that already exists.
        </p>
        <p>
          Neither of these moves is the future of AI. They are the present. They are also the kind of move that is uninteresting at the conference and decisive on the income statement.
        </p>
      </section>

      <section>
        <h2>iv. Two to three moves to make first</h2>
        <ol className={styles.findings}>
          <li>
            <p>
              <strong>Run the service-contract repricing now.</strong> Six to eight weeks of senior-account-manager effort, one outside specialist for the contract review, and a single executive sponsor. Estimated capture: <mark>$1.4M to $1.8M annual.</mark> This is the single largest piece of unattended margin in the operation. If only one move is made this quarter, this is the one.
            </p>
          </li>
          <li>
            <p>
              <strong>Consolidate parts purchasing to two preferred distributors.</strong> Estimated capture: <mark>$520K to $740K annual.</mark> Lower lift than the repricing, can run in parallel under a different sponsor. The technician resistance is real — the existing supply-house relationships are personal — and is best handled by paying close attention to the on-counter experience for the two preferred houses, not by mandate.
            </p>
          </li>
          <li>
            <p>
              <strong>Build the estimate-drafting tool.</strong> Estimated capture in time recovered: roughly two FTE-equivalents of senior estimator attention. We would not lead with this on the income-statement basis — the dollar value is meaningful but smaller than the two above. We would lead with it because it is the fastest way to demonstrate, internally, that AI can be useful in concrete and unglamorous ways. That demonstration matters in this organization, where the appetite for AI is high but the trust is unproven.
            </p>
          </li>
        </ol>
      </section>

      <section>
        <h2>v. Two questions we would ask before the next quarter</h2>
        <p>
          The first question is uncomfortable: <em>If service and maintenance is what produces 71% of margin, why is the senior selling effort going into install bids?</em> Today there is no answer. The service book is healthy because it has always been healthy. It is also more concentrated, more strategically important, and more vulnerable to a single competitor decision than the comp plan implies.
        </p>
        <p>
          The second question is simpler: <em>What would it take, in the next six months, to make Northshore the obvious place to call for the controls and energy-efficiency upgrades these accounts are about to need anyway?</em> The answer is probably not more technicians. The answer is probably a small number of small things — a customer portal that holds equipment history, a faster anniversary-quoting cycle, a reliable single point of contact for each top-fifty account — that, taken together, are how the next-tier contractor wins this segment.
        </p>
      </section>

      <hr />

      <p className={styles.signoff}>
        — The team at Here Now Labs
      </p>

      <hr />

      <section className={styles.cta}>
        <h2>If you would like to read the actual document.</h2>
        <p>
          A typeset PDF version of this memo, suitable for printing and circulation, is available below. It runs to nine pages, including the cover and methodology footnote.
        </p>
        <div className={styles.ctaRow}>
          <a href="/sample-memo.pdf" className="btn">
            Download PDF (placeholder)
          </a>
          <Link href="/contact" className="btn btn--ghost">
            Talk to us about your operation
          </Link>
        </div>
        <p className={styles.disclaimer}>
          The PDF is a placeholder while the typeset version is being prepared. The HTML above is the canonical sample.
        </p>
      </section>
    </article>
  );
}
