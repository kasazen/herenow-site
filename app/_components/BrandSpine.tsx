import ForwardArrow from "./Arrow";

/**
 * The brand's typographic spine. Three imperative verbs separated by the
 * forward+up arrow. Recurs at the foot of major pages as a signature mark —
 * memorability through repetition.
 */
export default function BrandSpine() {
  return (
    <div className="brand-spine" aria-label="Find. Build. Compound.">
      <em className="brand-spine__verb">Find</em>
      <span className="brand-spine__arrow">
        <ForwardArrow size="sm" />
      </span>
      <em className="brand-spine__verb">Build</em>
      <span className="brand-spine__arrow">
        <ForwardArrow size="sm" />
      </span>
      <em className="brand-spine__verb">Compound</em>
    </div>
  );
}
