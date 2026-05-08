import type { Metadata } from "next";
import Link from "next/link";
import LeafVeinDiagram from "../_components/LeafVeinDiagram";
import SectionImage from "../_components/SectionImage";
import SprintStage, { type Stage } from "../_components/SprintStage";
import styles from "./page.module.css";
import deliverableDetail from "../../public/photos/deliverable-detail.jpg";

export const metadata: Metadata = {
  title: "How we work",
  description:
    "Two weeks paid. A working deliverable. Then we build. Here is exactly what the sprint looks like, what we ask from you, and what you walk out with.",
};

const STAGES: Stage[] = [
  {
    number: "01",
    name: "Listen",
    tagline: "Stakeholder interviews. The operator, the ops lead, one frontline person.",
    body:
      "We start with conversations. Three to five interviews, an hour each, recorded with permission. We talk to the person who runs the operation, the person who runs the day-to-day, and at least one person doing the work. We are listening for what is annoying, what is compounding, and what would matter changed. We are also listening for what software, vendors, and systems already exist. No frameworks. No discovery decks. Conversation.",
  },
  {
    number: "02",
    name: "Ingest",
    tagline: "Document access. Contracts, financials, process docs, system exports.",
    body:
      "We ask for read access to whatever you will give us. Contracts in force, vendor agreements, ops manuals, financial statements (P&L, AR, AP), system exports (CRM, ERP, ticketing, anything). Everything we ingest stays under your NDA, processed on infrastructure we control, deleted on your instruction at engagement end. We tell you exactly what we read and how.",
  },
  {
    number: "03",
    name: "Weigh",
    tagline: "Every move ranked. Cost, complexity, blast radius. Every move tied to a dollar.",
    body:
      "We list every AI move that fits your operation — usually fifteen to thirty candidates. Each one gets a name (what it is), a rank (where it sits in priority), a price (what it costs to build and to run), and a tier (Starter, Builder, or Compound). We weigh by three factors: dollar return, time to ship, and operational blast radius. The output is a ranked list, defensible in your boardroom.",
  },
  {
    number: "04",
    name: "Deliver",
    tagline: "A working document. Named, ranked, priced, sequenced.",
    body:
      "The deliverable is a document, not a deck. Read in one sitting. Defensible in the room. Every recommended move has a name, a rank, a price, and a place in the sequence. We hand it over in a working session — partners on the call, you and your stakeholders on the other side, two hours, recorded. You leave with the document, the recording, and a clear next move.",
  },
  {
    number: "05",
    name: "Build",
    tagline: "The first thing worth shipping. Usually a Starter.",
    body:
      "Most engagements roll directly from sprint to first build. We pick the highest-ranked move that's also the fastest to ship — almost always a Starter — and we build it. New scope, new contract, no obligation. If you want a different partner for the build, we will hand off cleanly.",
  },
];

export default function HowWeWorkPage() {
  return (
    <>
      {/* ─── 1. Hero ───────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={`article ${styles.heroInner}`}>
          <p className="eyebrow">How we work</p>
          <h1 className={styles.heroTitle}>
            Two weeks paid. <em>A working deliverable.</em> Then we build.
          </h1>
          <p className={`lead ${styles.heroLede}`}>
            Here is exactly what the sprint looks like, what we ask from you, and what you walk out with.
          </p>
        </div>
      </section>

      {/* ─── 2. The five stages ────────────────────────────────────── */}
      <section className={`section ${styles.stages}`}>
        <div className={`article ${styles.stagesInner}`}>
          <div className={styles.stagesHead}>
            <p className="eyebrow">Inside the two weeks</p>
            <h2 className={styles.h2}>
              Five stages. <em>Two partners on the work.</em>
            </h2>
          </div>
          <div className={styles.diagramSlot}>
            <LeafVeinDiagram
              labels={["Listen", "Ingest", "Weigh", "Deliver", "Build"]}
            />
          </div>
          <SprintStage stages={STAGES} />
        </div>
      </section>

      {/* ─── 3. The deliverable ────────────────────────────────────── */}
      <section className={`section section--paper ${styles.deliverable}`}>
        <div className={`container ${styles.deliverableInner}`}>
          <div className={styles.deliverableImage}>
            <SectionImage src={deliverableDetail} alt="" />
          </div>
          <div className={styles.deliverableText}>
            <p className="eyebrow">What you get</p>
            <h2 className={styles.h2}>
              A working document. <em>Every move named, ranked, priced, sequenced.</em>
            </h2>
            <p className={styles.body}>
              Not a slide deck. Not a list of opportunity areas. Not a SWOT, a 2x2, or a roadmap-shaped powerpoint. A document. An operator can read it in one sitting and defend it in the room. Each recommended move has a name, a rank, a price, and a place in the sequence. We tell you what to do first, second, third &mdash; and what not to do at all.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 4. What we ask for ────────────────────────────────────── */}
      <section className={`section ${styles.ask}`}>
        <div className={`article ${styles.askInner}`}>
          <p className="eyebrow">What we need from you</p>
          <h2 className={styles.h2}>
            Documents. <em>Stakeholder time.</em> Two weeks of focus.
          </h2>
          <p className={styles.body}>
            Practically: read access to your contracts, ops manuals, financial statements, and any system exports we ask for. About six to ten hours of stakeholder time across the engagement, split between an operator, an ops lead, and a frontline contributor. A primary point of contact who can unblock document access in under a day. That&rsquo;s it. We don&rsquo;t run away with your week.
          </p>
        </div>
      </section>

      {/* ─── 5. Pricing ────────────────────────────────────────────── */}
      <section className={`section section--alt ${styles.pricing}`}>
        <div className={`article ${styles.pricingInner}`}>
          <p className="eyebrow">What it costs</p>
          <h2 className={styles.h2}>
            Five thousand to ten thousand. <em>Paid up front.</em>
          </h2>
          <p className={styles.body}>
            Sprint pricing scales with operation complexity &mdash; number of stakeholders, document volume, number of operating systems we have to read across. Build engagements are scoped separately, after the sprint. We quote builds in fixed price for Starters, milestone for Builders, and monthly retainer for Compound.
          </p>
        </div>
      </section>

      {/* ─── 6. After the sprint ───────────────────────────────────── */}
      <section className={`section ${styles.after}`}>
        <div className={`article ${styles.afterInner}`}>
          <p className="eyebrow">What compounds</p>
          <h2 className={styles.h2}>
            We build the first thing. <em>Then we build the next.</em>
          </h2>
          <p className={styles.body}>
            Most clients move directly from sprint into Starter work. Builder and Compound engagements typically run on retainer or fixed milestones. We don&rsquo;t take a build engagement we don&rsquo;t believe will return ten times its cost. If we don&rsquo;t believe in it, we will say so on the call.
          </p>
        </div>
      </section>

      {/* ─── 7. Closing CTA ────────────────────────────────────────── */}
      <section className={`section section--accent ${styles.closingCta}`}>
        <div className={`article ${styles.closingInner}`}>
          <p className="eyebrow">The intro</p>
          <h2 className={styles.h2}>
            Thirty minutes. No deck. <em>No fee.</em>
          </h2>
          <p className={styles.body}>
            We&rsquo;ll talk through your operation &mdash; what&rsquo;s annoying, what&rsquo;s compounding, what would matter changed. Half the calls end without a next step. That&rsquo;s the point. We don&rsquo;t take a build engagement we don&rsquo;t believe in.
          </p>
          <div className={styles.closingButtons}>
            <Link href="/contact" className="btn">
              Book the intro
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
