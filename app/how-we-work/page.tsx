import type { Metadata } from "next";
import Link from "next/link";
import HeroImage from "../_components/HeroImage";
import Accordion from "../_components/Accordion";
import BuildsCarousel from "../_components/BuildsCarousel";
import SectionImage from "../_components/SectionImage";
import styles from "./page.module.css";
import howWeWorkHero from "../../public/images/hero/how-we-work.jpg";
import weatheredNetworkSection from "../../public/images/sections/weathered-network.jpg";

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
        <p>
          NDA, engagement letter, two hours with you. We listen the way operators listen — for what&rsquo;s annoying, what&rsquo;s compounding, what would matter changed.
        </p>
        <Difference
          without="A two-week kickoff phase. Slide deck. Status meetings."
          with_="A working session. Printed agenda. Signed criterion by lunch."
        />
        <Accordion label="What you walk out with">
          <p>
            Three things on paper: the access we need, the calls we&rsquo;ll need, and the success criterion the Plan will be measured against.
          </p>
        </Accordion>
      </section>

      <section id="step-ii">
        <h2>ii. Ingest, with our tooling</h2>
        <p>
          Six days. Every contract, vendor invoice, dispatch log, renewal calendar. Our parsing stack is tuned to what mid-market operations actually produce.
        </p>
        <Difference
          without="A procurement specialist works through 93 contracts over three weeks. Misses the 61 with unexercised escalator clauses."
          with_="Our stack parses 93 contracts in 90 minutes. Flags every escalator. We weigh which ones matter."
        />
      </section>

      <section id="step-iii">
        <h2>iii. Weigh, with judgment</h2>
        <p>
          AI surfaces anomalies. The judgment about which ones matter — and why — is the work. Most partner time goes here.
        </p>
        <Accordion label="The mid-discovery check-in">
          <p>
            Around day five or six, a forty-five-minute check-in. We share what&rsquo;s surfacing; you tell us what to pull on harder. The Plan&rsquo;s shape gets agreed before it&rsquo;s written.
          </p>
        </Accordion>
      </section>

      <section id="step-iv">
        <h2>iv. The AI Action Plan</h2>
        <p>
          Five sections, ten pages. <strong>Cost savings, growth lanes, software builds, agent builds — all named, ranked, dollar-tagged.</strong>
        </p>
        <Difference
          without="A 60-slide deck. Skimmed across three calls. Lost in a SharePoint folder by Q3."
          with_="A 9-page document. Sat with for an hour. Every line tied to a dollar and tagged for what we would build."
        />
        <Accordion label="How recommendations are tagged">
          <p>
            Every line is tagged with the kind of work it implies — workflow, procurement, AI software, or AI agent. A de-identified sample is on{" "}
            <Link href="/ai-action-plan">the AI Action Plan page</Link>.
          </p>
        </Accordion>
      </section>

      <section id="step-v">
        <h2>v. The walkthrough</h2>
        <p>
          Ninety minutes. Printed copies on the table. By the end every recommendation has been agreed, sharpened, or struck.
        </p>
        <Difference
          without="A polished read-out. Q&A at the end. Decisions deferred to a follow-up."
          with_="A working session. Pushback in real time. Decisions made before you leave the room."
        />
        <p style={{ marginTop: "1.5em" }}>
          <Link href="/working-sessions">See what each session looks like →</Link>
        </p>
      </section>

      <div className="mark-divider" aria-hidden="true" />

      <section className={styles.compoundSection}>
        <p className="eyebrow">The work that compounds</p>
        <h2>After the Plan, the AI starts to operate.</h2>
        <p>
          Most engagements continue. Three shapes the work tends to take.
        </p>

        <BuildsCarousel
          ariaLabel="Three shapes the engagement continues in"
          slides={[
            {
              id: "software",
              label: "AI software",
              content: (
                <div className={styles.continuationCard}>
                  <p className={styles.continuationLabel}>AI software · 4–6 weeks per tool</p>
                  <h3>Tools scoped to a role</h3>
                  <p>
                    Used every day. Built for a specific role: a proposal generator for the senior estimator, a renewal scanner for the controller, a routing helper for dispatch.
                  </p>
                  <p className={styles.continuationExamples}>
                    <strong>Worked example.</strong> Senior estimator at a $25M contractor: <mark>~14 hrs/week recovered</mark>; quote cycle 3 days → 4 hours; <mark>+8–12% revenue lift</mark>. Build 4–6 weeks; run cost under $400/month.
                  </p>
                </div>
              ),
            },
            {
              id: "agent",
              label: "AI agents",
              content: (
                <div className={styles.continuationCard}>
                  <p className={styles.continuationLabel}>AI agents · 2–4 weeks per agent</p>
                  <h3>Autonomous, on a schedule or trigger</h3>
                  <p>
                    No one invokes them. They watch the calendar; act when conditions fire. Human review is sign-off.
                  </p>
                  <p className={styles.continuationExamples}>
                    <strong>Worked example.</strong> Anniversary review agent. Drafts the renewal letter at each contract anniversary. <mark>93 contracts in 90 minutes</mark>; <mark>$1.4M–$1.8M/yr captured</mark>; human time = sign-off.
                  </p>
                </div>
              ),
            },
            {
              id: "advisory",
              label: "Advisory",
              content: (
                <div className={styles.continuationCard}>
                  <p className={styles.continuationLabel}>Advisory · ongoing</p>
                  <h3>Quarterly AI working group</h3>
                  <p>
                    Two partners with the executive team. Review what shipped. Rank what to build next. Retire what isn&rsquo;t pulling weight.
                  </p>
                  <p className={styles.continuationExamples}>
                    <strong>Output.</strong> A short list of next builds, each scoped to a dollar. Also where a struggling tool gets killed.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </section>

      <hr />

      <section>
        <p className="eyebrow">What we do not do</p>
        <h2>A short list.</h2>
        <p>
          Not a transformation consultancy. Not a generalist AI shop — no chatbots, no marketing-copy generators, no model fine-tuning. No companies under $10M in revenue.
        </p>
      </section>

      <SectionImage src={weatheredNetworkSection} />

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
