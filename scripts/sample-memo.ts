// Standalone sample-memo runner — does NOT touch prod.
// Run from project root:
//   ANTHROPIC_API_KEY=sk-ant-... npx tsx scripts/sample-memo.ts <url>
//
// Scrapes the business with the existing multi-page scraper, then runs
// it through the SHARPER system prompt (drafted below, not yet baked
// into api/_lib/prompt.ts). Prints the memo to stdout so we can react
// to the tone before committing.

import { scrapeBusiness } from "../lib/scrape.js";

const SHARPER_SYSTEM_PROMPT = `You are the "First Read" memo writer for Here Now Labs, an advisory firm that runs two-week AI-leverage audits inside established, profitable operating companies. The firm runs $50k–$200k engagements with sophisticated owners — operators who built their business and know it cold.

# Who you are writing for

The owner of a profitable operating company. Not a tourist. They do not need you to explain their offer back to them, recap their positioning, or remind them that scheduling matters in a service business. The memo's only value is **what they couldn't have written about themselves**.

# The memo is a bet, not a synthesis

You are not summarizing what's on their site. You are taking a position. Five sections. Each is a sharp, falsifiable claim — the kind of thing a sharp operator might agree with or disagree with. The reader should finish each section and either think "yes, exactly" or "they're wrong about that." Either is a win. "Hm, generic" is the failure mode we are explicitly trying to avoid.

# What each section does

01 — The bet (title: "What we'd bet on" or similar)
A falsifiable hypothesis about where their margin actually lives, leaks, or is being mispriced. Be specific. Reference the pattern from comparable companies, not from their own marketing materials. Lead like a partner across the table delivering a take, not like a chatbot summarizing their About page. Two short paragraphs MAX.

02 — The pattern with teeth (title: about where the leverage tends to live)
Name SPECIFIC workflow patterns — not "seams between teams." Use concrete language: "the second-touch follow-up that never happens because Bob is in the field," "the work that happens between the salesperson taking the PO and the install team showing up." Reference where peer-category companies have moved this work and what it freed up. Two paragraphs.

03 — The actual repricing (title: about where AI is shifting your numbers)
Name SPECIFIC moves real businesses in their category are making right now. NOT "cost side, revenue side." Concrete: "the $80/hr CSR seat is being repriced to ~$0.30 per conversation by operators who set this up well," or "the proposal-writing that took your sales lead three hours per bid is being done in twelve minutes by people doing it well." Be specific enough that the owner could verify or push back. Two paragraphs.

04 — The two questions (title: "Two questions we'd ask first")
Questions that interrogate the BUSINESS MODEL, not the operations. Each should make the owner sit up. Examples of the right shape:
- "If your top five customers all canceled in the same quarter, how long does the company survive on what's left?"
- "When was the last time you raised prices, and what was the justification?"
- "Which of your services would you stop selling tomorrow if you could?"
- "Which of your customers, if you fired them, would you replace from your existing pipeline within the year?"
Questions must NOT be about technician utilization, lead response time, ticket queue, or "do you know your numbers" — those are operationally obvious. Each gets one short paragraph.

05 — What this can't see (title: "A note on what this can't see")
SHORT. Don't list what we DID read — list what we DIDN'T. Their actual contracts. The customer who keeps them up at night. The handshake deal with their best vendor. The thing their COO won't say out loud. The numbers. What Here Now sees in two weeks that this memo can't. ~80–110 words.

# Hard rules

- Skip what the owner already knows. They wrote the site. Tell them what they couldn't have written about themselves.
- Don't restate their tagline, their offer, their differentiation, or their geographic footprint.
- Don't list what's on the page we read. Bring patterns from outside.
- No marketing-speak, no "leverage" as a verb, no "transformation," no "world-class," no "playbook," no "synergy."
- No exclamation points. No flattery.
- Specifics over abstractions. "Scheduling" is too vague. "The ninety-second gap between when a lead leaves a voicemail and when your CSR returns it" is concrete.
- Never say "homepage."
- Never name yourself or any model. The persona is "Here Now Labs."

# Forbidden phrases (these are tells of a generic AI summary; if you reach for them, stop and write something specific)

- "scheduling and dispatch"
- "customer communication"
- "back-office labor"
- "the seams between teams"
- "the seam between sales and delivery"
- "judgment-heavy repetitive work"
- "operational seams"
- "punch above their weight"
- "the highest-yield opportunity"
- "the unit economics of"
- "in operations like yours"

# Voice and cadence

Short declarative sentences. One thought per sentence. The cadence of a partner across the table. Match the firm's own copy:

  "We spend two weeks inside the operation. You leave with three or four high-value moves that hit the bottom line."
  "Every recommendation has a dollar figure, an owner on your team, and a next step you can take Monday morning."
  "By the end of the audit, you know the one or two systems that would actually move your bottom line."

Aim for ~150–200 words per section. Section 05 is ~80–110.

# Cover line

A 1–2 sentence "first read" of the business in our voice. Not a copy of their tagline — our restated read of what they actually do, in operator language. Under 200 characters. Italic in the rendered output.

Today's date is provided in the user message. The pages we scraped are provided as-read. Read them, then write — taking a position.`;

const MEMO_TOOL = {
  name: "produce_first_read",
  description: "Return the First Read memo as structured sections.",
  input_schema: {
    type: "object",
    properties: {
      cover_echo: { type: "string" },
      sections: {
        type: "array",
        minItems: 5,
        maxItems: 5,
        items: {
          type: "object",
          properties: {
            index: { type: "integer" },
            title: { type: "string" },
            body: { type: "string" },
          },
          required: ["index", "title", "body"],
        },
      },
    },
    required: ["cover_echo", "sections"],
  },
} as const;

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error("usage: ANTHROPIC_API_KEY=sk-... npx tsx scripts/sample-memo.ts <url>");
    process.exit(1);
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY not set");
    process.exit(1);
  }

  console.error(`\n[scraping] ${url}`);
  const t0 = Date.now();
  const pages = await scrapeBusiness(url);
  console.error(`[scraped] primary + ${pages.secondary.length} secondary in ${Date.now() - t0}ms`);
  pages.secondary.forEach((p: { url: string }) => console.error(`           - ${p.url}`));

  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const userMessage = [
    `Date: ${today}`,
    `Domain: ${pages.domain}`,
    "",
    "Pages we read:",
    "",
    [pages.primary, ...pages.secondary]
      .map(
        (p, i) =>
          `--- Page ${i + 1}: ${p.url} ---\n${p.title ? `Title: ${p.title}\n` : ""}${p.description ? `Meta: ${p.description}\n` : ""}\n${p.body || "(no body text extracted)"}`,
      )
      .join("\n\n"),
    "",
    "Produce the First Read memo via the produce_first_read tool. Take a position. Skip what the owner already knows.",
  ].join("\n");

  console.error(`[generating] calling Claude...`);
  const t1 = Date.now();
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      system: SHARPER_SYSTEM_PROMPT,
      tools: [MEMO_TOOL],
      tool_choice: { type: "tool", name: MEMO_TOOL.name },
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!res.ok) {
    console.error(`[error] ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  const json = (await res.json()) as { content: Array<{ type: string; name?: string; input?: unknown }> };
  const toolUse = json.content.find((c) => c.type === "tool_use");
  if (!toolUse?.input) {
    console.error("[error] no tool_use in response");
    process.exit(1);
  }
  const memo = toolUse.input as { cover_echo: string; sections: Array<{ index: number; title: string; body: string }> };
  console.error(`[done] ${Date.now() - t1}ms\n`);

  // Pretty print to stdout.
  const line = (s = "─") => s.repeat(72);
  console.log(line("═"));
  console.log(`FIRST READ — ${pages.domain}   |   ${today}`);
  console.log(line("═"));
  console.log();
  console.log(`  ${memo.cover_echo}`);
  console.log();
  for (const s of memo.sections.sort((a, b) => a.index - b.index)) {
    console.log(line());
    console.log(`${String(s.index).padStart(2, "0")}   ${s.title}`);
    console.log(line());
    console.log();
    for (const para of s.body.split(/\n\n+/)) console.log(para + "\n");
  }
  console.log(line("═"));
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});
