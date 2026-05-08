import { type ReactNode } from "react";
import LeafVeinAccent from "./LeafVeinAccent";
import styles from "./TierCard.module.css";

// TierCard — used three times in a horizontal row on the home page.
// Per section 8.5 of the brief.

type Tier = "Starter" | "Builder" | "Compound";

type Props = {
  tier: Tier;
  headline: ReactNode;
  body: string;
  examples: [string, string, string];
  timeline: string;
};

export default function TierCard({ tier, headline, body, examples, timeline }: Props) {
  return (
    <article className={styles.card}>
      <p className={styles.tierMarker}>{tier}</p>

      <div className={styles.accent}>
        <LeafVeinAccent variant={tier.toLowerCase() as "starter" | "builder" | "compound"} />
      </div>

      <h3 className={styles.headline}>{headline}</h3>

      <p className={styles.body}>{body}</p>

      <hr className={styles.rule} />

      <p className={styles.examplesLabel}>Examples</p>
      <ul className={styles.examplesList}>
        {examples.map((ex, i) => (
          <li key={i} className={styles.exampleItem}>
            <span className={styles.bullet} aria-hidden="true">◇</span>
            <span>{ex}</span>
          </li>
        ))}
      </ul>

      <p className={styles.timeline}>
        <em>Timeline:</em> {timeline}
      </p>
    </article>
  );
}
