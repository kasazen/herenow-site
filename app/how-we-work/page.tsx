import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How we work",
};

// Stub during the operator-first rebuild. Replaced in step 5.
export default function HowWeWorkPage() {
  return (
    <article className="article" style={{ paddingBlock: "var(--section-y)" }}>
      <p className="eyebrow">How we work</p>
      <h1>Rebuilding.</h1>
    </article>
  );
}
