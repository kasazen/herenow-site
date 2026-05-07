import type { Metadata } from "next";
import { Suspense } from "react";
import DeckViewer from "./_deck/DeckViewer";
import { ACTION_PLAN_SLIDES } from "./_deck/slides";

export const metadata: Metadata = {
  title: "AI Action Plan",
  description:
    "A fully de-identified sample AI Action Plan from a Here Now Labs engagement — eighteen slides, every recommendation tied to a dollar figure.",
};

export default function AIActionPlanPage() {
  return (
    <Suspense>
      <DeckViewer slides={ACTION_PLAN_SLIDES} pdfHref="/ai-action-plan.pdf" />
    </Suspense>
  );
}
