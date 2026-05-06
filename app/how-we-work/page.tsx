import type { Metadata } from "next";
import Link from "next/link";
import HeroImage from "../_components/HeroImage";
import styles from "./page.module.css";
import howWeWorkHero from "../../public/images/hero/how-we-work.jpg";

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
          A conversation. Ten business days. Then a relationship that compounds.
        </p>
        <HeroImage
          src={howWeWorkHero}
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
        <p>Two hours with you. NDA, engagement letter, signed criterion by lunch.</p>
        <Difference
          without="A two-week kickoff. Slide deck. Status meetings."
          with_="A working session. Printed agenda. Signed criterion by lunch."
        />
      </section>

      <section id="step-ii">
        <h2>ii. Ingest, with our tooling</h2>
        <p>Six days. Every contract, vendor invoice, dispatch log, renewal calendar — through our parsing stack.</p>
        <Difference
          without="A procurement specialist works through 93 contracts in three weeks. Misses the 61 with unexercised escalators."
          with_="Our stack parses 93 contracts in 90 minutes. Flags every escalator. We weigh which ones matter."
        />
      </section>

      <section id="step-iii">
        <h2>iii. Weigh, with judgment</h2>
        <p>AI surfaces anomalies. Partners weigh which ones matter, and why. Most partner time goes here.</p>
      </section>

      <section id="step-iv">
        <h2>iv. The AI Action Plan</h2>
        <p>Five sections, ten pages. Cost savings, growth lanes, software, agents — all named, ranked, dollar-tagged.</p>
        <Difference
          without="A 60-slide deck. Skimmed across three calls. Lost in SharePoint by Q3."
          with_="A 9-page document. Sat with for an hour. Every line tied to a dollar."
        />
      </section>

      <section id="step-v">
        <h2>v. The walkthrough</h2>
        <p>Ninety minutes. Printed copies on the table. Every line agreed, sharpened, or struck.</p>
        <Difference
          without="A polished read-out. Q&A at the end. Decisions deferred."
          with_="A working session. Pushback in real time. Decisions before you leave."
        />
        <p style={{ marginTop: "1.5em" }}>
          <Link href="/working-sessions">See what each session looks like →</Link>
        </p>
      </section>

      <hr />

      <section>
        <p className="eyebrow">What we do not do</p>
        <h2>A short list.</h2>
        <p>
          Not transformation consulting. Not a generalist AI shop — no chatbots, no marketing copy, no model fine-tuning. No companies under $10M.
        </p>
      </section>

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
