import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "How we work",
  description:
    "Ten business days. One AI Action Plan. Every recommendation tied to a dollar figure.",
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
          What normally takes three months. We compress with AI. The judgment stays human.
        </p>
      </header>

      <hr />

      <section>
        <h2>i. Executive alignment</h2>
        <p>
          Mutual NDA, master engagement letter with the price written down, and a two-hour working session with you and one or two senior leaders. We come out with three things on paper: the access we need, the calls we will need, and the success criterion the Action Plan will be measured against.
        </p>
        <Difference
          without="A two-week kickoff phase. Slide deck. Status meetings."
          with_="A working session. Printed agenda. Signed criterion by lunch."
        />
      </section>

      <section>
        <h2>ii. Discovery</h2>
        <p>
          Six business days of reading. Every contract, every renewal calendar, every vendor invoice, every dispatch log, every page of the public site, every line of the policies. AI accelerates the volume; the judgment about what matters stays with us.
        </p>
        <Difference
          without="A procurement specialist reads 93 contracts over three weeks. Misses the 61 with unexercised escalator clauses."
          with_="AI reads 93 contracts in 90 minutes. Flags every escalator. We weigh which ones matter."
        />
      </section>

      <section>
        <h2>iii. The AI Action Plan</h2>
        <p>
          Five sections, eight to ten pages, written for an executive who wants to read it in one sitting. Where the margin lives. Where the leak is. What AI changes about that, today. Two to three moves to make first. Two questions to ask before next quarter.
        </p>
        <p>
          Every recommendation tied to a dollar figure. A fully de-identified sample is on{" "}
          <Link href="/ai-action-plan">the AI Action Plan page</Link>. If it does not read like something you would actually use inside the executive team, the rest of this page is selling a promise we have not earned.
        </p>
        <Difference
          without="A 60-slide deck. Read in fragments across three calls. Lost in a SharePoint folder by Q3."
          with_="A 9-page document. Read in one sitting. Every line tied to a dollar."
        />
      </section>

      <section>
        <h2>iv. The walkthrough</h2>
        <p>
          Ninety minutes. Printed copies on the table. We walk every finding. Questions land in the room. From there the work either stops or continues — advisory retainer, custom build, or done. Your call.
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

      <section>
        <p className="eyebrow">What we do not do</p>
        <h2>A short list.</h2>
        <p>
          We are not a transformation consultancy. We do not redesign org charts or sit inside your operations for ninety days. We are not a generalist AI shop. We do not build chatbots. We do not work with companies under $10M in revenue.
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
