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
        Strategic Read · Heartland Industrial Supply
      </h1>
      <p className={styles.dek}>
        A fully de-identified composite drawn from the patterns we see across mid-market industrial distributors. Names, figures, and details are altered. The structure and density are exactly how the real memo arrives in the executive&rsquo;s inbox.
      </p>

      <dl className={styles.meta}>
        <div>
          <dt>Prepared for</dt>
          <dd>The Heartland Industrial Supply executive team</dd>
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
          Heartland presents as a distribution business. The financials say something different. Roughly <mark>62% of operating margin in the last twelve months</mark> came from twelve customer relationships in three end-markets — agriculture equipment, food processing, and Tier-2 automotive — none of which appear as discrete units in the way the company is run. Distribution is the chassis. The actual business is private-label inventory underwriting for medium-volume industrial buyers who are too small to negotiate directly with mills and too large to be patient with the catalog houses.
        </p>
        <p>
          That is not how the company describes itself, internally or externally. The website talks about service. The sales conversation talks about product breadth. The compensation plan rewards revenue. The result is that the work most responsible for margin is the work least understood, least staffed, and most likely to be left to whoever is closest to the customer when the question arrives. The exposure is asymmetric: when one of those twelve relationships moves, the swing is meaningful before the rest of the operation has time to react.
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
              <strong>Vendor consolidation across 14 supplier contracts — <mark>$2.1M to $2.6M annual</mark>.</strong>
              {" "}
              Heartland is paying separately negotiated rates to fourteen MRO and consumables suppliers that, in three cases, are the same parent company under different legal entities. Where a peer regional distributor consolidated similar exposure last year, the realized savings was 11–13% of pre-consolidation spend. Applied to the comparable Heartland line items, the implied annual savings is in the range named above. The work to capture it is six to eight weeks of procurement effort, not a multi-quarter project.
            </p>
          </li>
          <li>
            <p>
              <strong>Auto-renewing freight terms with one regional carrier — <mark>$640K to $880K annual</mark>.</strong>
              {" "}
              The 2023 freight contract auto-renewed in March under fuel-surcharge language tied to a benchmark that has since moved adversely. The contract permits renegotiation on 90 days&rsquo; notice. Two of three comparable distributors we have visibility on renegotiated similar terms in 2024 with realized savings between 7% and 9% of the affected freight spend.
            </p>
          </li>
          <li>
            <p>
              <strong>Software seats and services aligned to 2022 headcount — <mark>$310K to $420K annual</mark>.</strong>
              {" "}
              Three platforms (the ERP add-on suite, the CRM, and the e-commerce backend) are licensed at a tier set when the company employed 178 people. The current headcount is 142. The seat counts have not been adjusted in either direction since. There is also a fourth subscription that no one in the executive team could identify the owner of when asked.
            </p>
          </li>
          <li>
            <p>
              <strong>Unrenegotiated rebate tiers with two key suppliers — <mark>$180K to $260K annual</mark>.</strong>
              {" "}
              Two of the largest inbound supply relationships have rebate tiers tied to volume thresholds that Heartland has cleared every year for three years. The rebate program has not been renegotiated to reflect that consistency. Comparable distributors have moved 1.5–2 percentage points of rebate in similar negotiations.
            </p>
          </li>
        </ol>
        <p>
          Total estimated annualized leakage across these four pools: <mark>$3.2M to $4.2M.</mark> All four are addressable inside the current fiscal year with existing staff, two outside specialists, and roughly six to eight weeks of attention each.
        </p>
      </section>

      <section>
        <h2>iii. What AI changes about that, today</h2>
        <p>
          The four findings above were surfaced in nine days of reading. Three years ago that would have been four months of consultant time at a meaningful multiple of the engagement fee. The change is not that AI generated insight. The change is that AI made it economical to read the entire vendor and contract corpus in volume — every page, every clause, every renewal date — and surface the anomalies for human review.
        </p>
        <p>
          Inside Heartland, the same pattern applies in two specific places this quarter. The first is the sales operations function, where the team currently spends two to three days per week assembling quotes that pull from the same forty-odd component sources. A small AI tool that drafts the quote from the customer&rsquo;s RFP and pre-populates the supplier mix would compress that work by an estimated 60–70%. We have built two of these inside comparable companies; the build is roughly four to six weeks.
        </p>
        <p>
          The second is contract review at renewal. Fourteen of the supplier consolidations identified above were missed in the last cycle because the review was done by a procurement function that had four other priorities. AI-assisted contract review at renewal would have surfaced all fourteen in approximately ninety minutes of analyst time. This is a workflow change that does not require building anything: it requires standardizing how renewals enter the queue and applying a tool that already exists.
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
              <strong>Run the vendor consolidation now.</strong> Six to eight weeks of procurement effort, two outside specialists for the legal review, and one senior sponsor inside Heartland. Estimated capture: <mark>$2.1M to $2.6M annual.</mark> This is the single largest piece of unattended margin in the operation. If only one move is made this quarter, this is the one.
            </p>
          </li>
          <li>
            <p>
              <strong>Renegotiate the freight contract on the next 90-day window.</strong> Estimated capture: <mark>$640K to $880K annual.</mark> Lower lift than the consolidation, but with a hard date — the surcharge mechanism is moving against Heartland every month it is left in place. If procurement is the bottleneck, this can be carried by a finance lead in parallel.
            </p>
          </li>
          <li>
            <p>
              <strong>Build the quote-drafting tool.</strong> Estimated capture in time recovered: roughly two FTE-equivalents of sales operations attention. We would not lead with this on the income-statement basis — the dollar value is meaningful but smaller than the two above. We would lead with it because it is the fastest way to demonstrate, internally, that AI can be useful in concrete and unglamorous ways. That demonstration matters in this organization, where the appetite for AI is high but the trust is unproven.
            </p>
          </li>
        </ol>
      </section>

      <section>
        <h2>v. Two questions we would ask before the next quarter</h2>
        <p>
          The first question is uncomfortable: <em>If the twelve customer relationships that drive 62% of margin were a separate business unit, who would run it?</em> Today there is no answer. The work is done by sales, served by inventory, billed by finance, and owned by no one. The relationships are healthy because they have always been healthy. They are also more concentrated, more strategically important, and more vulnerable to a single competitor decision than the org chart implies.
        </p>
        <p>
          The second question is simpler: <em>What would it take, in the next six months, to make Heartland the obvious place to call for those twelve customers&rsquo; next adjacent need?</em> The answer is probably not more product. The answer is probably a small number of small things — a portal that holds the buyer&rsquo;s preferences, a faster RFP-to-quote cycle, a reliable single point of contact — that, taken together, are how the next-tier distributor wins this segment.
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
