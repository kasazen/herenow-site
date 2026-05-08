import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How we work",
};

// Placeholder while How We Work is rebuilt against the May 2026 brief.
// Replaced fully in a subsequent commit.
export default function HowWeWorkPage() {
  return (
    <article className="article" style={{ paddingBlock: "var(--section-y)" }}>
      <p className="eyebrow">How we work</p>
      <h1>Rebuilding.</h1>
    </article>
  );
}
