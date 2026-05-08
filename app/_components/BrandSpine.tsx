import styles from "./BrandSpine.module.css";

// BrandSpine — footer signature per section 8.2 of the brief.
// Renders three words: Find · Build · Compound in Fraunces italic 400, 16px,
// var(--accent), centered. Sits above the standard footer line.
export default function BrandSpine() {
  return (
    <p className={styles.spine} aria-label="Find. Build. Compound.">
      <span>Find</span>
      <span className={styles.dot} aria-hidden="true">·</span>
      <span>Build</span>
      <span className={styles.dot} aria-hidden="true">·</span>
      <span>Compound</span>
    </p>
  );
}
