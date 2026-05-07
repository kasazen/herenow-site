import type { Metadata } from "next";
import Link from "next/link";
import RisingMark from "../_components/RisingMark";
import SectionImage from "../_components/SectionImage";
import ActionPlanShape from "./ActionPlanShape";
import styles from "./page.module.css";
import leafDroplet from "../../public/images/sections/leaf-droplet.jpg";

export const metadata: Metadata = {
  title: "AI Action Plan",
  description:
    "What an Action Plan is — a working document where every move is named, ranked, and priced.",
};

const BEATS = [
  {
    label: "Built fast.",
    body: "Fast enough that it’s still fresh when you’re acting on it. Compressed by the AI that does the reading.",
  },
  {
    label: "Every line tied to a dollar.",
    body: "No vague opportunity areas. No “explore further.” A move you can’t price isn’t a move worth the page it’s on.",
  },
  {
    label: "Plan and build, same team.",
    body: "We don’t hand off and disappear. We ship the moves we recommend. Skin in the game.",
  },
  {
    label: "AI reads. Operators judge.",
    body: "Machines handle the volume. Senior partners weigh what matters. The judgment is the product.",
  },
];

export default function AIActionPlanPage() {
  return (
    <article className={`article ${styles.page}`}>
      <header className={styles.hero}>
        <p className="eyebrow">The Action Plan</p>
        <h1 className={styles.heroTitle}>
          A working document. <em>Every move named, ranked, priced.</em>
        </h1>
        <p className={styles.heroLead}>
          Read in one sitting. Defensible in the room. The opposite of a slide deck.
        </p>
        <p className={styles.heroSub}>
          What a senior team marks up with a pen, and walks out of the room with.
        </p>
      </header>

      <div className={styles.shapeWrap}>
        <ActionPlanShape />
      </div>

      <section className={styles.why}>
        <p className="eyebrow">Why it&rsquo;s different</p>
        <ul className={styles.beats}>
          {BEATS.map((b) => (
            <li key={b.label} className={styles.beat}>
              <p className={styles.beatLabel}>{b.label}</p>
              <p className={styles.beatBody}>{b.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <SectionImage src={leafDroplet} alt="" />

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Start with a conversation.</h2>
        <p className={styles.ctaSub}>
          No deck. No fee. Half end without a next step — that&rsquo;s the point.
        </p>
        <div className={styles.ctaButtons}>
          <Link href="/contact" className="btn">
            Book the intro
          </Link>
          <Link href="/ai-action-plan-lite" className="btn btn--ghost">
            Try Action Plan Lite
          </Link>
        </div>
      </section>

      <div className={styles.footMark} aria-hidden="true">
        <RisingMark variant="wide" />
      </div>
    </article>
  );
}
