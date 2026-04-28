// Tiny client for the First Read backend.
// In dev, falls back to a canned response so the UX is testable without the Worker.

export type IntakePayload = {
  business: string;
  size: string;
  revenue: string;
  prompting: string;
  firstName?: string;
};

export type Section = {
  index: number;
  title: string;
  body: string;
  locked?: boolean;
};

export type GenerateResponse = {
  id: string;
  cover: {
    echo: string;
    date: string;
  };
  sections: Section[];
};

export type UnlockPayload = {
  id: string;
  email: string;
  firstName?: string;
};

export type UnlockResponse = {
  sections: Section[];
};

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.trim() ?? "";

export async function generate(payload: IntakePayload): Promise<GenerateResponse> {
  if (!API_URL) return mockGenerate(payload);
  const res = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`generate_failed_${res.status}`);
  return (await res.json()) as GenerateResponse;
}

export async function unlock(payload: UnlockPayload): Promise<UnlockResponse> {
  if (!API_URL) return mockUnlock(payload);
  const res = await fetch(`${API_URL}/unlock`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`unlock_failed_${res.status}`);
  return (await res.json()) as UnlockResponse;
}

// ─── Dev mock ───────────────────────────────────────────────────
// Used only when VITE_API_URL is not set. Lets Joe demo the UX
// without the Worker deployed. Numbers and patterns here are
// deliberately generic — never ship this to prod-flow users.

async function mockGenerate(payload: IntakePayload): Promise<GenerateResponse> {
  await delay(2200);
  const echo = payload.business.length > 160 ? payload.business.slice(0, 160) + "…" : payload.business;
  return {
    id: "mock-" + Math.random().toString(36).slice(2, 10),
    cover: {
      echo,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    },
    sections: [
      {
        index: 1,
        title: "Where the leverage tends to live",
        body:
          "In operations like the one you describe, leverage usually lives in the seams between teams — the place where one group hands work to another and information is rewritten on the way through. Sales hands a deal to operations. Operations hands an account to support. Each handoff loses something; each handoff is a place where a small AI assist returns hours per week per person without changing how anyone works.\n\nThe second place leverage tends to live: the work that's repetitive and judgment-heavy at once. Quoting. Sourcing. Triage. The classic mistake is to look for AI in the obviously-automatable. The real returns are usually one layer up — where a person is reading, deciding, and writing the same shape of memo five times a week.",
      },
      {
        index: 2,
        title: "Where AI is shifting your numbers",
        body:
          "Two shifts are real for businesses your size. The first is the cost side: most operations are still paying full price for work that AI now does at the margin — research, drafting, first-pass classification. The second is the revenue side: the unit economics of customer acquisition are bending where AI helps a small team punch above its weight on outbound, on personalization, and on response time. The companies pulling ahead are the ones who recognize both shifts and deploy against them in order.",
        locked: true,
      },
      {
        index: 3,
        title: "Two questions we'd ask first",
        body:
          "First: where in your operation does a senior person re-do the work of a junior person because the junior person's output isn't reliable enough? That's a place AI sits in the middle.\n\nSecond: which of your customers, if you could serve them twice as quickly, would be willing to buy more from you?",
        locked: true,
      },
      {
        index: 4,
        title: "What to leave alone",
        body:
          "Don't touch the work that's load-bearing for trust — the customer-facing judgment calls, the parts of the brand that depend on a real person being on the other end. Don't touch what's already working well. The biggest risk for an operation your size is breaking something that's quietly compounding.",
        locked: true,
      },
      {
        index: 5,
        title: "A note on what this can't see",
        body:
          "This memo is what we can read from a paragraph in 30 seconds. It's patterns, not specifics. What Here Now does in two weeks is what we can only read in person — your contracts, your team, your customers, the actual systems, the actual numbers. The recommendations that come from that have dollar figures attached. This one doesn't.",
        locked: true,
      },
    ],
  };
}

async function mockUnlock(_payload: UnlockPayload): Promise<UnlockResponse> {
  await delay(900);
  // Mock: re-issue all sections unlocked. Server-side this is the canonical flow.
  const generated = await mockGenerate({ business: "(unchanged)", size: "", revenue: "", prompting: "" });
  return { sections: generated.sections.map((s) => ({ ...s, locked: false })) };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
