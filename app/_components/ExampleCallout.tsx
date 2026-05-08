import { type StaticImageData } from "next/image";
import SectionImage from "./SectionImage";
import styles from "./ExampleCallout.module.css";

// ExampleCallout — used three times on the home page, section 5.
// Per section 8.6 of the brief.
//
// Desktop (≥900px): horizontal layout, image left 40%, text right 60%.
// Mobile: stacks, image on top.

type Props = {
  industry: string;
  quote: string;
  build: string;
  tier: "Starter" | "Builder" | "Compound";
  outcome: string;
  image: StaticImageData;
};

export default function ExampleCallout({ industry, quote, build, tier, outcome, image }: Props) {
  return (
    <article className={styles.callout}>
      <div className={styles.imageWrap}>
        <SectionImage src={image} alt="" />
      </div>

      <div className={styles.text}>
        <p className={`eyebrow ${styles.eyebrow}`}>{industry}</p>

        <blockquote className={styles.quote}>{quote}</blockquote>

        <p className={styles.buildLabel}>What we&rsquo;d build</p>
        <p className={styles.buildBody}>{build}</p>

        <div className={styles.tags}>
          <span className={styles.tag}>{tier}</span>
          <span className={styles.tag}>{outcome}</span>
        </div>
      </div>
    </article>
  );
}
