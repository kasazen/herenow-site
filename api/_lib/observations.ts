// Contextual filler observations injected by the SSE relay when the
// generation pipeline goes silent for >2.5s. Keeps the modal's learning
// queue populated through the slow phases (model thinking, tool calls)
// without inventing facts about the business.
//
// Phrases are deliberately operator-voiced and phase-aware. The relay
// rotates through them in order and never repeats one in a session.

export type Phase = "scrape" | "research" | "memo" | "wrapping";

const SCRAPE: string[] = [
  "reading what's on the site",
  "looking at how the offer is framed",
  "noting what the team chose to put on the front page",
];

const RESEARCH: string[] = [
  "looking outside the site for what the website can't tell us",
  "checking what the category looks like right now",
  "scanning for recent moves from peer-category operators",
  "looking at hiring posture as a tell",
];

const MEMO: string[] = [
  "drafting the bet — where the margin actually lives",
  "naming the workflow patterns that cost real money",
  "looking at where AI is repricing this category right now",
  "writing the questions a sharp owner would react to",
  "thinking about what the website can't see",
  "tightening the language — every word earning its keep",
  "the cadence of a partner across the table, not a chatbot",
];

const WRAPPING: string[] = [
  "putting the read together",
  "reading it back end-to-end before we send it",
];

const BANKS: Record<Phase, string[]> = {
  scrape: SCRAPE,
  research: RESEARCH,
  memo: MEMO,
  wrapping: WRAPPING,
};

export class ObservationBank {
  private used = new Set<string>();
  private cursor: Record<Phase, number> = { scrape: 0, research: 0, memo: 0, wrapping: 0 };

  /**
   * Pull the next phase-appropriate observation. Returns null if the bank
   * for this phase is exhausted (caller should accept silence rather than
   * loop or repeat).
   */
  next(phase: Phase): string | null {
    const bank = BANKS[phase];
    while (this.cursor[phase] < bank.length) {
      const candidate = bank[this.cursor[phase]++];
      if (!this.used.has(candidate)) {
        this.used.add(candidate);
        return candidate;
      }
    }
    return null;
  }

  /** Mark an externally-emitted observation as used so we don't re-inject it. */
  markUsed(text: string): void {
    this.used.add(text);
  }
}
