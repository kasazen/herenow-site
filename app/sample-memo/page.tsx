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
        Northshore Mechanical Services is a fictional company. The figures, clauses, account counts, and decisions described below are invented for this sample. The structure, density, voice, and the kind of work the document represents are exactly how a real Here Now Labs strategic memo arrives in the executive&rsquo;s inbox at the end of an engagement.
      </p>

      <dl className={styles.meta}>
        <div>
          <dt>Prepared for</dt>
          <dd>The Northshore Mechanical executive team</dd>
        </div>
        <div>
          <dt>Subject</dt>
          <dd>$24.8M commercial mechanical contractor · eastern MA / southern NH · founder-led, second generation · 108 staff</dd>
        </div>
        <div>
          <dt>Engagement window</dt>
          <dd>Ten business days · audit only</dd>
        </div>
        <div>
          <dt>Delivered</dt>
          <dd>End of Q1 · printed and digital</dd>
        </div>
        <div>
          <dt>Authored by</dt>
          <dd>The partners at Here Now Labs</dd>
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
          Northshore is sold internally as a full-service mechanical contractor — install, retrofit, service, controls — with install at the front of the marketing, the comp plan, and the calendar. The financials describe a different company. <mark>Roughly 71% of operating margin in the trailing twelve months came from recurring service and maintenance, not new install.</mark> Install pays the lights and feeds the service book. Service is what actually compounds. The thing producing most of the margin is structurally underweighted in every place the company makes a decision about itself.
        </p>
        <p>
          That gap shows up in concrete places. The senior estimator runs the install pipeline; nobody equivalent runs the service book at the executive level. The dispatch function that touches the top fifteen recurring accounts runs on a senior coordinator who has been there fourteen years and a screen that has not been replaced since 2017. Sales comp pays for install bid wins, not for renewing or expanding the agreements that produce the margin. When one of those top fifteen accounts moves, the install pipeline takes the second hit two quarters later — because those accounts are who refer the next install. The exposure is asymmetric in a way the org chart does not advertise.
        </p>
      </section>

      <section>
        <h2>ii. Where the leak is</h2>
        <p>
          Across the contracts, vendor records, dispatch logs, and software inventory read during the engagement, four pools of leakage are large enough to act on this quarter. The order is by estimated annualized impact, not by ease.
        </p>
        <ol className={styles.findings}>
          <li>
            <p>
              <strong>Service contract pricing frozen against 2022 labor rates — <mark>$1.4M to $1.8M annual</mark>.</strong>
              {" "}
              Sixty-one of the ninety-three active commercial maintenance agreements were last priced before the 2023–2024 wage adjustments. The rate-card escalator clauses exist in those contracts — Schedule B in the standard form, Section 4.2 in the legacy form — and grant Northshore the right to adjust at each anniversary on thirty days&rsquo; notice. They were not exercised at the last anniversary because the review fell to a senior coordinator carrying five other priorities at the time. The figure above assumes a two-step normalization over twelve months, not a one-time shock; a comparable contractor we have visibility on captured 89% of the implied uplift in the first cycle and lost zero accounts.
            </p>
          </li>
          <li>
            <p>
              <strong>Parts purchasing fragmented across four distributors — <mark>$520K to $740K annual</mark>.</strong>
              {" "}
              The same SKUs — refrigerant, copper line sets, control boards, the standard MRO consumables — are flowing in through four supply houses at unit prices that vary by 8–18% depending on which technician calls which counter. Two of the four distributors are owned by the same parent and have unified rebate programs Northshore is not enrolled in. Consolidating to two preferred suppliers with a single annual rebate agreement — a six-week procurement effort — captures the range named above based on prior-year purchase actuals.
            </p>
          </li>
          <li>
            <p>
              <strong>Field labor utilization on small-job tickets — <mark>$380K to $560K annual</mark>.</strong>
              {" "}
              Service tickets under four billable hours run at 58% productive utilization (drive, diagnose, fix, write up). The same technicians on planned-maintenance routes run at 81%. The gap is dispatch sequencing and parts staging, not technician effort. Two changes close most of it: pre-staged truck inventory tuned to the top forty service SKUs, and a same-day cluster rule that holds non-emergency small jobs until two are within ten miles. Comparable contractors have moved similar utilization gaps in two to three months without adding headcount.
            </p>
          </li>
          <li>
            <p>
              <strong>Software seats and services aligned to 2022 headcount — <mark>$140K to $190K annual</mark>.</strong>
              {" "}
              Three platforms are licensed at a tier set when Northshore employed 134 people: the field service management suite, the CRM add-on, and an estimating tool. Current headcount is 108. There is also a fourth subscription — $3,400 per month, charged to operations, last touched twenty-three months ago — that no one in the executive team could identify the owner of when asked. The dollar value here is the smallest of the four findings and the most viscerally embarrassing of the four, which is why it is on the list.
            </p>
          </li>
        </ol>
        <p>
          Total estimated annualized leakage across these four pools: <mark>$2.4M to $3.3M.</mark> Approximately 10–13% of revenue. All four are addressable inside the current fiscal year with existing staff, two outside specialists, and roughly six to eight weeks of attention each.
        </p>
      </section>

      <section>
        <h2>iii. What AI changes about that, today</h2>
        <p>
          The four findings above were surfaced in nine days of reading. Three years ago the same engagement would have taken four months of consultant time and a meaningful multiple of the fee. The change is not that AI generated the insight. The change is that AI made it economical to read the entire corpus in volume — every agreement, every escalator clause, every renewal date, every ticket time-stamp, every line item on every invoice — and surface the anomalies for a human to weigh.
        </p>
        <p>
          Inside Northshore, the same pattern is sitting in two specific places this quarter. The first is the estimating function, where the senior estimator and one assistant spend two to three days per week assembling proposals that draw from the same forty-odd component patterns. A small AI tool that drafts the estimate from the prospect&rsquo;s scope document and pre-populates the labor and parts mix would compress that work by an estimated 60–70% and free the senior estimator to do what only the senior estimator can do — which is sit with the customer and qualify the bid. We have built two of these inside comparable contractors; the build is four to six weeks and the running cost is under $400 a month.
        </p>
        <p>
          The second is service-contract review at anniversary. The sixty-one missed escalators identified above were not flagged in the last cycle because the review owner had five other priorities and the contracts arrive in the queue in no particular order. AI-assisted review at anniversary, fed the standard- and legacy-form contracts and the labor-rate baseline, would have surfaced all sixty-one in approximately ninety minutes of analyst time. This is a workflow change rather than a build: it requires standardizing how anniversaries enter the queue and applying a tool that already exists.
        </p>
        <p>
          What AI does not do, in the engagement we just completed or in the two moves above, is generate the strategy. It does not replace the conversation we are about to have at the walkthrough. It compresses the reading — and the reading is the part of the work that, until two years ago, was the rate-limiting step. Neither of the moves above is the future of AI. They are the present. They are also the kind of move that is uninteresting at the conference and decisive on the income statement.
        </p>
      </section>

      <section>
        <h2>iv. Two to three moves to make first</h2>
        <ol className={styles.findings}>
          <li>
            <p>
              <strong>Run the service-contract repricing now.</strong> Six to eight weeks of senior-account-manager effort, one outside specialist for the legal review of the rate-card escalator language, and a single executive sponsor with the authority to set the tone of the customer conversations. Estimated capture: <mark>$1.4M to $1.8M annual.</mark> This is the single largest piece of unattended margin in the operation. If only one move is made this quarter, this is the one. The risk we would name in advance: two or three of the largest accounts will renegotiate hard. Plan for it; do not be surprised by it.
            </p>
          </li>
          <li>
            <p>
              <strong>Consolidate parts purchasing to two preferred distributors.</strong> Estimated capture: <mark>$520K to $740K annual.</mark> Lower lift than the repricing and can run in parallel under a different sponsor. The technician resistance is real — the existing supply-house relationships are personal and several of them predate the current GM&rsquo;s tenure — and is best handled by paying close attention to the on-counter experience and credit-line behavior for the two preferred houses, not by mandate. A clean rebate program with one of the parent organizations behind two of the four current suppliers is the cleanest path; the parent has indicated as much in the standard intro deck.
            </p>
          </li>
          <li>
            <p>
              <strong>Build the estimate-drafting tool.</strong> Estimated capture in time recovered: roughly two FTE-equivalents of senior estimator attention. We would not lead with this on the income-statement basis — the dollar value is meaningful but smaller than the two above. We would lead with it because it is the fastest way to demonstrate, inside Northshore, that AI can be useful in concrete and unglamorous ways. That demonstration matters here. The appetite for AI is real and the trust is unproven, and the gap will be closed by one credible internal example, not by an external presentation.
            </p>
          </li>
        </ol>
        <p>
          What we would <em>not</em> do first: the software-seat audit, despite the visceral satisfaction of cancelling the orphaned subscription. The dollar value is small, the political cost of touching cherished tools is disproportionate, and the work belongs in a normal annual procurement cycle, not at the front of an AI conversation. Surface it; do not lead with it.
        </p>
      </section>

      <section>
        <h2>v. Two questions we would ask before the next quarter</h2>
        <p>
          The first question is the uncomfortable one: <em>If service and maintenance is what produces 71% of margin, why is the senior selling effort going into install bids?</em> Today there is no answer. The service book is healthy because it has always been healthy. It is also more concentrated than the org chart implies — the top fifteen accounts produce ~58% of the service revenue — more strategically important than the comp plan rewards, and more vulnerable to a single competitor decision than anyone has had time to model. The question is not rhetorical. It calls for a re-weighting of where the senior team spends its calendar.
        </p>
        <p>
          The second question is simpler: <em>What would it take, in the next six months, to make Northshore the obvious place to call for the controls and energy-efficiency upgrades the top fifty service accounts are about to need anyway?</em> The answer is probably not more technicians. The answer is probably a small number of small things — a customer portal that holds equipment history, a forty-eight-hour anniversary-quoting cycle, a named single point of contact for each top-fifty account — that, taken together, are how the next-tier contractor wins this segment in the next eighteen months. Northshore is the incumbent. Incumbents lose this kind of segment by under-investing in the customer&rsquo;s next adjacent need, not by being out-priced on the current one.
        </p>
      </section>

      <hr />

      <section className={styles.methodology}>
        <h2>Methodology</h2>
        <p>
          Over the ten business days of the engagement we read: the standard- and legacy-form maintenance contracts and amendments for all ninety-three active commercial accounts; the trailing eighteen months of vendor invoices from the four supply houses; the dispatch logs and ticket time-stamps for the trailing twelve months; the licensed-software inventory and renewal calendar; the public-facing site, the proposal templates, and the policy handbook. We held a two-hour executive alignment session at the start and four short calls during the discovery — with the VP Service, the VP Install, the senior estimator, and the dispatch coordinator. AI was used to read in volume and to flag anomalies; every finding above was reviewed and weighted by us before it entered this document. No client information used in the engagement appears in the memo or this footnote.
        </p>
      </section>

      <hr />

      <p className={styles.signoff}>
        — The partners at Here Now Labs
      </p>
      <p className={styles.confidentiality}>
        Here Now Labs · Confidential to the executive team named above. Not for circulation outside the company without consent.
      </p>

      <hr />

      <section className={styles.cta}>
        <h2>If you would like the printable version.</h2>
        <p>
          A typeset PDF of this memo, suitable for printing and circulation, will be available shortly. It runs to nine pages including the cover and the methodology footnote above. The HTML above is the canonical sample until the PDF lands.
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
          The PDF is a placeholder while the typeset version is being prepared.
        </p>
      </section>
    </article>
  );
}
