// Anthropic Messages API client. Supports streaming with tool_use so the
// frontend can surface mini-observations as the model writes the memo.

import { SYSTEM_PROMPT, MEMO_TOOL, buildUserMessage } from "./prompt.js";
import type { Pages } from "./scrape.js";

export type MemoSection = {
  index: number;
  title: string;
  body: string;
};

export type MemoResult = {
  business_name: string;
  cover_echo: string;
  sections: MemoSection[];
};

export type StreamEvent =
  | { type: "observation"; text: string }
  | { type: "section_start"; index: number; title: string }
  | { type: "business_name"; text: string }
  | { type: "warning"; message: string };

const MODEL = "claude-sonnet-4-6";
const API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

// ── Non-streaming (kept for compatibility with any callers that don't need streaming) ──

export async function generateMemo(
  apiKey: string,
  pages: Pages,
  prompting: string | undefined,
  research?: string[],
): Promise<MemoResult> {
  const body = baseRequestBody(pages, prompting, research, false);
  const res = await fetch(API_URL, { method: "POST", headers: headers(apiKey), body: JSON.stringify(body) });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`anthropic_${res.status}: ${text.slice(0, 500)}`);
  }
  const json = (await res.json()) as { content: Array<{ type: string; name?: string; input?: unknown }> };
  const toolUse = json.content.find((c) => c.type === "tool_use" && c.name === MEMO_TOOL.name);
  if (!toolUse?.input) throw new Error("anthropic_no_tool_use");
  return validateMemo(toolUse.input);
}

// ── Streaming ──────────────────────────────────────────────────────────

export async function generateMemoStreaming(
  apiKey: string,
  pages: Pages,
  prompting: string | undefined,
  research: string[] | undefined,
  onEvent: (e: StreamEvent) => void,
): Promise<MemoResult> {
  const body = baseRequestBody(pages, prompting, research, true);
  const res = await fetch(API_URL, { method: "POST", headers: headers(apiKey), body: JSON.stringify(body) });
  if (!res.ok || !res.body) {
    const text = res.body ? await res.text() : "";
    throw new Error(`anthropic_${res.status}: ${text.slice(0, 500)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let sseBuffer = "";
  let toolJsonBuffer = "";
  const watcher = createObservationWatcher(onEvent);

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    sseBuffer += decoder.decode(value, { stream: true });

    // Anthropic SSE: messages are separated by \n\n, each contains
    //   event: <name>\ndata: <json>
    let nl: number;
    while ((nl = sseBuffer.indexOf("\n\n")) !== -1) {
      const block = sseBuffer.slice(0, nl);
      sseBuffer = sseBuffer.slice(nl + 2);
      const dataLine = block.split("\n").find((l) => l.startsWith("data:"));
      if (!dataLine) continue;
      const data = dataLine.slice(5).trim();
      if (!data) continue;
      let evt: AnthropicStreamEvent;
      try {
        evt = JSON.parse(data) as AnthropicStreamEvent;
      } catch {
        continue;
      }

      if (evt.type === "content_block_delta" && evt.delta?.type === "input_json_delta") {
        const partial = evt.delta.partial_json ?? "";
        if (partial) {
          toolJsonBuffer += partial;
          watcher.scan(toolJsonBuffer);
        }
      } else if (evt.type === "message_stop") {
        // Stream complete.
      }
    }
  }

  // Parse the final accumulated tool input JSON.
  let parsed: unknown;
  try {
    parsed = JSON.parse(toolJsonBuffer);
  } catch (err) {
    // Surface the truncation point so we can see which field/section ran out
    // of tokens. Helps debugging when the model hits max_tokens mid-output.
    const tail = toolJsonBuffer.slice(-200);
    console.error("anthropic_bad_tool_json", {
      bufferLen: toolJsonBuffer.length,
      tail,
      err: (err as Error)?.message?.slice(0, 200),
    });
    throw new Error(`anthropic_bad_tool_json: ${(err as Error).message?.slice(0, 200) ?? "parse failed"}`);
  }
  return validateMemo(parsed);
}

// ── Helpers ────────────────────────────────────────────────────────────

function baseRequestBody(
  pages: Pages,
  prompting: string | undefined,
  research: string[] | undefined,
  stream: boolean,
) {
  return {
    model: MODEL,
    max_tokens: 4000,
    stream,
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    tools: [MEMO_TOOL],
    tool_choice: { type: "tool", name: MEMO_TOOL.name },
    messages: [{ role: "user", content: buildUserMessage(pages, prompting, research) }],
  };
}

function headers(apiKey: string): Record<string, string> {
  return {
    "content-type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": ANTHROPIC_VERSION,
  };
}

function validateMemo(input: unknown): MemoResult {
  const m = input as Partial<MemoResult> | null | undefined;
  // Log the actual shape on the way in so any downstream issue is diagnosable
  // from production logs without re-running.
  const shape = {
    keys: m && typeof m === "object" ? Object.keys(m as object) : null,
    sectionCount: Array.isArray(m?.sections) ? m!.sections!.length : null,
    hasCover: typeof m?.cover_echo === "string" && Boolean(m!.cover_echo!.trim()),
    hasName: typeof m?.business_name === "string" && Boolean(m!.business_name!.trim()),
  };
  console.log("memo_parsed_shape", shape);

  // Hard floor: we need *something* — at least an object with a sections array.
  if (!m || typeof m !== "object" || !Array.isArray(m.sections) || m.sections.length === 0) {
    console.error("anthropic_bad_shape_hard", { shape, raw: JSON.stringify(m).slice(0, 500) });
    throw new Error("anthropic_bad_shape");
  }

  // Soft-fallback for everything else so a slightly-off model output still
  // produces a deliverable instead of an error message to the user.
  const out: MemoResult = {
    business_name: typeof m.business_name === "string" ? m.business_name.trim() : "",
    cover_echo:
      typeof m.cover_echo === "string" && m.cover_echo.trim()
        ? m.cover_echo.trim()
        : "A short read on the operation.",
    sections: m.sections.slice(0, 5).map((s, i) => ({
      index: typeof s?.index === "number" ? s.index : i + 1,
      title: typeof s?.title === "string" && s.title.trim() ? s.title : `Section ${i + 1}`,
      body: typeof s?.body === "string" ? s.body : "",
    })),
  };

  // Pad to exactly 5 sections so the teaser and email render consistently.
  while (out.sections.length < 5) {
    const idx = out.sections.length + 1;
    out.sections.push({
      index: idx,
      title: idx === 5 ? "A note on what this can't see" : `Section ${idx}`,
      body: "",
    });
  }

  out.sections.sort((a, b) => a.index - b.index);
  return out;
}

// ── Anthropic stream event types (just what we use) ────────────────────

type AnthropicStreamEvent =
  | { type: "message_start"; [k: string]: unknown }
  | { type: "content_block_start"; [k: string]: unknown }
  | { type: "content_block_delta"; index: number; delta: { type: string; partial_json?: string; text?: string } }
  | { type: "content_block_stop"; [k: string]: unknown }
  | { type: "message_delta"; [k: string]: unknown }
  | { type: "message_stop"; [k: string]: unknown }
  | { type: "ping" | "error"; [k: string]: unknown };

// ── Observation watcher ────────────────────────────────────────────────
// Tolerant scanner over the accumulating tool-input JSON. Emits events at
// boundaries that matter to the user: cover_echo done, each section's
// title done, each section's body's first sentence done. Doesn't try to
// be a strict JSON parser — uses simple position-based pattern matching.

type WatcherState = {
  emittedBusinessName: boolean;
  emittedCover: boolean;
  emittedTitles: Set<number>;
  emittedFirstSentence: Set<number>;
};

function createObservationWatcher(onEvent: (e: StreamEvent) => void) {
  const state: WatcherState = {
    emittedBusinessName: false,
    emittedCover: false,
    emittedTitles: new Set(),
    emittedFirstSentence: new Set(),
  };

  function scan(buf: string): void {
    if (!state.emittedBusinessName) {
      const name = extractStringValue(buf, "business_name");
      if (name !== null && name.trim()) {
        state.emittedBusinessName = true;
        onEvent({ type: "business_name", text: name.trim() });
      }
    }
    if (!state.emittedCover) {
      const cover = extractStringValue(buf, "cover_echo");
      if (cover !== null) {
        state.emittedCover = true;
        onEvent({ type: "observation", text: cover });
      }
    }

    // Scan all section objects we've completed enough to extract from.
    // Section JSON looks like: {"index":1,"title":"...","body":"..."}
    let cursor = 0;
    while (true) {
      const titleMatch = matchSectionTitle(buf, cursor);
      if (!titleMatch) break;
      cursor = titleMatch.endIndex;
      if (!state.emittedTitles.has(titleMatch.index)) {
        state.emittedTitles.add(titleMatch.index);
        onEvent({ type: "section_start", index: titleMatch.index, title: titleMatch.title });
      }
      // Try to extract this section's body's first sentence.
      const body = extractStringValueAfter(buf, "body", cursor);
      if (body && !state.emittedFirstSentence.has(titleMatch.index)) {
        const sentence = firstSentence(body);
        if (sentence) {
          state.emittedFirstSentence.add(titleMatch.index);
          onEvent({ type: "observation", text: sentence });
        }
      }
    }
  }

  return { scan };
}

// Find a closed JSON string value for a given top-level key. Returns the
// decoded string if the value's closing quote is in the buffer, else null.
function extractStringValue(buf: string, key: string): string | null {
  const needle = `"${key}":"`;
  const start = buf.indexOf(needle);
  if (start === -1) return null;
  return readClosedString(buf, start + needle.length);
}

function extractStringValueAfter(buf: string, key: string, from: number): string | null {
  const needle = `"${key}":"`;
  const start = buf.indexOf(needle, from);
  if (start === -1) return null;
  return readClosedString(buf, start + needle.length);
}

// Read a JSON string body starting at `start` (the char after the opening quote).
// Honors backslash escapes. Returns the unescaped string if the closing quote
// has been seen in the buffer, else null.
function readClosedString(buf: string, start: number): string | null {
  let i = start;
  let out = "";
  while (i < buf.length) {
    const c = buf[i];
    if (c === "\\") {
      // Need at least one more char to know what's escaped.
      if (i + 1 >= buf.length) return null;
      const nxt = buf[i + 1];
      if (nxt === "n") out += "\n";
      else if (nxt === "t") out += "\t";
      else if (nxt === "r") out += "\r";
      else if (nxt === "\"") out += "\"";
      else if (nxt === "\\") out += "\\";
      else if (nxt === "/") out += "/";
      else if (nxt === "u") {
        if (i + 5 >= buf.length) return null;
        const hex = buf.slice(i + 2, i + 6);
        out += String.fromCharCode(parseInt(hex, 16));
        i += 6;
        continue;
      } else {
        out += nxt;
      }
      i += 2;
    } else if (c === "\"") {
      return out;
    } else {
      out += c;
      i += 1;
    }
  }
  return null; // closing quote not yet in buffer
}

type SectionTitleMatch = { index: number; title: string; endIndex: number };

function matchSectionTitle(buf: string, fromPos: number): SectionTitleMatch | null {
  // Find next "index": <number> followed (anywhere reasonably close) by "title":"...".
  const indexRe = /"index"\s*:\s*(\d+)/g;
  indexRe.lastIndex = fromPos;
  const m = indexRe.exec(buf);
  if (!m) return null;
  const idx = parseInt(m[1], 10);
  // Look for title after this index occurrence; cap search range.
  const searchStart = m.index + m[0].length;
  const searchEnd = Math.min(buf.length, searchStart + 800);
  const slice = buf.slice(searchStart, searchEnd);
  const titleNeedle = '"title":"';
  const tStart = slice.indexOf(titleNeedle);
  if (tStart === -1) return null;
  const absoluteStart = searchStart + tStart + titleNeedle.length;
  const title = readClosedString(buf, absoluteStart);
  if (title === null) return null;
  return { index: idx, title, endIndex: absoluteStart + title.length + 1 };
}

function firstSentence(body: string): string {
  const flat = body.replace(/\s+/g, " ").trim();
  const m = flat.match(/^(.+?[.!?])(\s|$)/);
  if (m) return m[1];
  if (flat.length > 30) return flat.slice(0, 140) + "…";
  return "";
}
