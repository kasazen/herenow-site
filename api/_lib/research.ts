// External web research. Uses Anthropic's web_search server tool to
// gather context the website itself doesn't surface — peer-category
// benchmarks, recent news, hiring posture, public reviews, anything
// that sharpens the memo. Bounded by max_uses; fails soft (returns []
// on any error so memo generation still proceeds).
//
// Streams two kinds of events to the SSE relay in api/generate.ts:
//   - search_query: the query string the model just kicked off
//   - finding: a single short note as it lands (one line each)
//
// Findings are also accumulated and returned, so the structured memo
// call can use them as additional grounding via buildUserMessage().

import type { Pages } from "./scrape.js";

const MODEL = "claude-sonnet-4-6";
const API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const RESEARCH_TIMEOUT_MS = 12_000;
const MAX_SEARCHES = 2;

export type ResearchEvent =
  | { type: "search_query"; query: string }
  | { type: "finding"; text: string };

export type ResearchResult = {
  findings: string[];
};

export const RESEARCH_SYSTEM_PROMPT = `You are doing background research for the "First Read" memo writer at Here Now Labs — an advisory firm that runs single-day workshops with operating teams and delivers an Action Plan. The owner you're researching for built or runs this business and knows it cold; your job is to bring back what the *outside* of the internet says about them and their category that the website itself can't.

# What to look up

Use web_search up to 2 times. Examples of what's worth a search:
- recent news, press, or filings about the company
- public reviews, BBB complaints, Glassdoor signal, anything about how the operation actually runs
- hiring posture (open roles, recent listings) — tells you where the team is bottlenecked
- peer-category operators of similar size and what they're doing with AI right now
- industry benchmarks: typical margin profile, typical customer concentration, typical seasonality
- regulatory or supply-side shifts the operator might not have priced in

# Output format

After your searches, return 4–6 findings as plain text, one per line. Each finding is one sentence — a fact, a stat, a comparison, or a sharp observation rooted in something a search turned up. No preamble. No bullets. No numbering. No closing remark.

# Voice

Short declarative. Operator-to-operator. Examples of the right shape:

  Three competitors in the same metro have raised seed rounds in the last 18 months — capital is flowing into this category right now.
  Glassdoor reviews mention dispatcher turnover twice in the last year. That's where the institutional memory lives.
  The category's typical commercial-account churn is 12–18% annually; below 8% means somebody on the team is doing real work to retain.

# Hard rules

- Don't summarize the website. The website is what the memo writer already has.
- Refer to the business by its canonical name (e.g., "Control Air Systems") — never by URL/domain. The domain is input context only.
- Don't speculate without a source. If the searches turn up nothing useful, return fewer findings — even one strong one is better than five weak ones.
- No marketing-speak, no flattery, no "leverage" as a verb.
- Plain text only. One finding per line. Newlines separate.`;

export async function researchBusiness(
  apiKey: string,
  pages: Pages,
  prompting: string | undefined,
  onEvent: (e: ResearchEvent) => void,
): Promise<ResearchResult> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), RESEARCH_TIMEOUT_MS);

  const body = {
    model: MODEL,
    max_tokens: 1500,
    stream: true,
    system: [{ type: "text", text: RESEARCH_SYSTEM_PROMPT }],
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
        max_uses: MAX_SEARCHES,
      },
    ],
    messages: [{ role: "user", content: buildResearchUserMessage(pages, prompting) }],
  };

  let res: Response;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    console.error("research_fetch_failed", (err as Error)?.message?.slice(0, 200));
    return { findings: [] };
  }

  if (!res.ok || !res.body) {
    clearTimeout(timer);
    const errText = res.body ? await res.text().catch(() => "") : "";
    console.error("research_http_error", res.status, errText.slice(0, 200));
    return { findings: [] };
  }

  // Track each content block by index. Text blocks accumulate the model's
  // output; server_tool_use blocks accumulate the search query JSON.
  type TextBlock = { kind: "text"; text: string; emittedTo: number };
  type SearchBlock = { kind: "search"; jsonBuffer: string; queryEmitted: boolean };
  type OtherBlock = { kind: "other" };
  type Block = TextBlock | SearchBlock | OtherBlock;
  const blocks = new Map<number, Block>();

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  const findings: string[] = [];

  const processCompletedLines = (block: TextBlock) => {
    // Emit one finding per completed newline. Hold the trailing partial.
    while (true) {
      const nl = block.text.indexOf("\n", block.emittedTo);
      if (nl === -1) break;
      const line = block.text.slice(block.emittedTo, nl).trim();
      block.emittedTo = nl + 1;
      if (line && !findings.includes(line)) {
        findings.push(line);
        onEvent({ type: "finding", text: line });
      }
    }
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let nl: number;
      while ((nl = buffer.indexOf("\n\n")) !== -1) {
        const chunk = buffer.slice(0, nl);
        buffer = buffer.slice(nl + 2);
        const dataLine = chunk.split("\n").find((l) => l.startsWith("data:"));
        if (!dataLine) continue;
        const data = dataLine.slice(5).trim();
        if (!data) continue;

        let evt: AnthropicStreamEvent;
        try {
          evt = JSON.parse(data) as AnthropicStreamEvent;
        } catch {
          continue;
        }

        if (evt.type === "content_block_start") {
          const idx = evt.index;
          const cb = evt.content_block;
          if (cb?.type === "text") {
            blocks.set(idx, { kind: "text", text: "", emittedTo: 0 });
          } else if (cb?.type === "server_tool_use" && cb.name === "web_search") {
            blocks.set(idx, { kind: "search", jsonBuffer: "", queryEmitted: false });
          } else {
            blocks.set(idx, { kind: "other" });
          }
        } else if (evt.type === "content_block_delta") {
          const block = blocks.get(evt.index);
          if (!block) continue;
          if (block.kind === "text" && evt.delta?.type === "text_delta" && evt.delta.text) {
            block.text += evt.delta.text;
            processCompletedLines(block);
          } else if (block.kind === "search" && evt.delta?.type === "input_json_delta" && evt.delta.partial_json) {
            block.jsonBuffer += evt.delta.partial_json;
            // Try to extract the query as soon as it's quoted-closed.
            if (!block.queryEmitted) {
              const q = extractQuery(block.jsonBuffer);
              if (q) {
                block.queryEmitted = true;
                onEvent({ type: "search_query", query: q });
              }
            }
          }
        } else if (evt.type === "content_block_stop") {
          const block = blocks.get(evt.index);
          if (block?.kind === "text") {
            // Flush any trailing line without a newline.
            const tail = block.text.slice(block.emittedTo).trim();
            if (tail && !findings.includes(tail)) {
              findings.push(tail);
              onEvent({ type: "finding", text: tail });
            }
          }
        } else if (evt.type === "message_stop") {
          // Done.
        }
      }
    }
  } catch (err) {
    if ((err as Error).name !== "AbortError") {
      console.error("research_stream_failed", (err as Error)?.message?.slice(0, 200));
    }
  } finally {
    clearTimeout(timer);
  }

  return { findings };
}

function buildResearchUserMessage(pages: Pages, prompting: string | undefined): string {
  const lines: string[] = [
    `Domain: ${pages.domain}`,
    `Primary URL: ${pages.primary.url}`,
  ];
  if (pages.primary.title) lines.push(`Site title: ${pages.primary.title}`);
  if (pages.primary.description) lines.push(`Site description: ${pages.primary.description}`);
  // First ~600 chars of body so the model has enough to formulate good queries.
  const bodyHint = pages.primary.body.slice(0, 600).replace(/\s+/g, " ").trim();
  if (bodyHint) {
    lines.push("");
    lines.push("Site content (excerpt for context — do NOT search for this; search for what's NOT here):");
    lines.push(bodyHint);
  }
  if (prompting && prompting.trim()) {
    lines.push("");
    lines.push("What the operator told us:");
    lines.push(prompting.trim());
  }
  lines.push("");
  lines.push(
    "Now: 2–3 web searches max, then 4–6 findings as plain text, one per line. Skip the obvious. Bring what the website can't tell us.",
  );
  return lines.join("\n");
}

// Pulls the "query" string value out of a partial server_tool_use input
// JSON buffer, e.g. `{"query":"hvac repair`...
function extractQuery(buf: string): string | null {
  const needle = '"query":"';
  const start = buf.indexOf(needle);
  if (start === -1) return null;
  let i = start + needle.length;
  let out = "";
  while (i < buf.length) {
    const c = buf[i];
    if (c === "\\") {
      if (i + 1 >= buf.length) return null;
      const nxt = buf[i + 1];
      if (nxt === "n") out += "\n";
      else if (nxt === '"') out += '"';
      else if (nxt === "\\") out += "\\";
      else out += nxt;
      i += 2;
    } else if (c === '"') {
      return out.trim();
    } else {
      out += c;
      i += 1;
    }
  }
  return null;
}

// ── Anthropic stream event types (just what we use) ────────────────────

type AnthropicContentBlock =
  | { type: "text"; text?: string }
  | { type: "server_tool_use"; name: string; input?: unknown }
  | { type: "web_search_tool_result"; tool_use_id?: string; content?: unknown }
  | { type: string; [k: string]: unknown };

type AnthropicStreamEvent =
  | { type: "message_start"; [k: string]: unknown }
  | { type: "content_block_start"; index: number; content_block: AnthropicContentBlock }
  | {
      type: "content_block_delta";
      index: number;
      delta: { type: string; text?: string; partial_json?: string };
    }
  | { type: "content_block_stop"; index: number }
  | { type: "message_delta"; [k: string]: unknown }
  | { type: "message_stop"; [k: string]: unknown }
  | { type: "ping" | "error"; [k: string]: unknown };
