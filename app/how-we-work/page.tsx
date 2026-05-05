import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "How we work",
  description:
    "An AI-accelerated audit of operations, contracts, and partnership arrangements. Days, not months. One memo, read in one sitting. Every recommendation tied to a dollar figure.",
};

export default function HowWeWorkPage() {
  return (
    <article className="article" style={{ paddingBlock: "var(--section-y)" }}>
      <header className={styles.header}>
        <p className="eyebrow">How we work</p>
        <h1 className={styles.title}>
          A read of the operation, not a transformation program.
        </h1>
        <p className="lead" style={{ marginTop: "1.25rem" }}>
          Most consulting engagements take three months to tell you something you suspected after the second week. We compress that loop to days. Here is what that actually looks like, step by step, what we read, and what you receive.
        </p>
      </header>

      <hr />

      <section>
        <p className="eyebrow">The shape of an engagement</p>
        <h2>Two weeks, four steps, one memo.</h2>
        <p>
          A standard engagement runs ten business days. The first two are alignment and access. The next six are reading. The final two are writing and walkthrough. We hold the schedule tightly because the value of the read decays — the longer we sit with the data, the more we drift toward the kind of polish nobody asked for.
        </p>
        <p>
          We take a small number of engagements at a time. Pricing is fixed at the front and disclosed before the NDA is signed. We do not upsell mid-engagement. If we find a separate piece of work that ought to be done, we say so, and you decide whether it is us or someone else.
        </p>
      </section>

      <section>
        <h2>i. NDA and executive alignment</h2>
        <p>
          A mutual NDA, a master engagement letter with the price and scope written down, and a two-hour working session with you and one or two senior leaders. The session is not a kickoff deck. It is a structured conversation about the operation as you see it: where the margin lives, what is annoying, what would matter if it changed, and what you have already tried.
        </p>
        <p>
          We come out of the session with three things: a list of source materials we need access to, the names of the two or three people we will need a single short call with, and a written success criterion you sign off on. The success criterion matters. It is what we will measure the memo against when we deliver it.
        </p>
      </section>

      <section>
        <h2>ii. Discovery — across contracts, vendors, processes</h2>
        <p>
          The reading takes most of the engagement. We use AI to read in volume — every contract, every vendor master record, every renewal calendar entry, every process document, the public site, the policies, the playbooks, the marketing brief. AI accelerates the reading; the judgment about what matters stays with us.
        </p>
        <p>
          The pattern we are looking for, in order: dollars going out the door under terms nobody renegotiated; dollars coming in under terms a sharper team would have pushed harder on; process steps that exist because someone left and nobody removed them; and software seats, services, and subscriptions that used to be necessary and now are not. Most of what we surface is in this last category. It is unglamorous and it is real.
        </p>
        <p>
          During discovery we keep notes that you can read at any point. You see what we are reading and what we are flagging in roughly real time. There are no surprises in the memo.
        </p>
      </section>

      <section>
        <h2>iii. The strategic memo</h2>
        <p>
          The memo is five sections, eight to ten pages, written for an executive who wants to read it in one sitting. The structure is fixed:
        </p>
        <ol className={styles.memoSections}>
          <li>
            <strong>Where the margin actually lives.</strong> A falsifiable hypothesis about the business model — not a recap of your About page. The thing a sharp operator across the table would say.
          </li>
          <li>
            <strong>Where the leak is.</strong> Specific dollar figures, ranked by size, named by source. The longest section.
          </li>
          <li>
            <strong>What AI changes about that, today.</strong> Not what AI will change in three years. What it changes this quarter, in your industry, against the patterns we have seen elsewhere.
          </li>
          <li>
            <strong>Two to three moves to make first.</strong> Ranked by impact and ease. Each move includes the dollar estimate, the time estimate, and what you would need to commit.
          </li>
          <li>
            <strong>Two questions we would ask before the next quarter.</strong> The kind of question that, if a board member asked it, would make you sit up.
          </li>
        </ol>
        <p>
          A fully de-identified sample is on{" "}
          <Link href="/sample-memo">the sample memo page</Link>. If it does not read like something you would actually use inside the executive team, the rest of this page is selling a promise we have not earned.
        </p>
      </section>

      <section>
        <h2>iv. A live walkthrough</h2>
        <p>
          We sit with the executive team and walk every finding. Questions land in the room. The walkthrough is roughly ninety minutes. We bring printed copies — the memo is meant to be read on paper at least once. From there, the work either stops or continues. The natural continuations are an advisory retainer (we stay close, we do not run the work) or a custom build (we ship the AI tool the memo identified). You decide.
        </p>
        <p>
          For the room itself — who is there, how long, what is on the table, and what you walk out with each time — the{" "}
          <Link href="/working-sessions">working sessions page</Link> describes every session in the engagement, including the intro call, the alignment session, the mid-discovery check-in, and the walkthrough.
        </p>
      </section>

      <hr />

      <section>
        <p className="eyebrow">What we do not do</p>
        <h2>A short list of things we are not.</h2>
        <p>
          We are not a transformation consultancy. We do not run change-management programs, redesign org charts, or sit inside your operations for ninety days. We will tell you when those would help and we will introduce you to people who do them well.
        </p>
        <p>
          We are not a generalist AI shop. We do not build chatbots, marketing copy generators, or sales-deck assistants. The AI we use is the kind that reads in volume and surfaces patterns. The AI we build, when we build it, is the kind that takes a specific repeating decision off your team&rsquo;s plate.
        </p>
        <p>
          We do not work with companies under $10M in revenue. The math does not justify it for either side, and the wedge of an audit is wrong at that scale.
        </p>
      </section>

      <hr />

      <section>
        <p className="eyebrow">Pricing and timing</p>
        <h2>Fixed at the front.</h2>
        <p>
          A standard audit engagement is in the range that mid-market boutique advisory typically commands for a strategy-plus-build piece of work. The exact figure is set during the executive alignment session and written into the engagement letter before any NDA is signed. There are no hourly bills, no expansion clauses, and no “additional scope” line items.
        </p>
        <p>
          Continuations — advisory retainer, custom build — are scoped and priced separately, after the memo, with no commitment. Most clients keep us close; some do not. Either is a successful outcome.
        </p>
      </section>

      <hr />

      <section className={styles.cta}>
        <h2>If this sounds like the right shape.</h2>
        <p>
          The fastest way to find out if there is a fit is a thirty-minute conversation. No deck, no pitch.
        </p>
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
