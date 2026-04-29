// Minimal Anthropic Messages API client. Sonnet 4.6 + prompt caching, no
// extended thinking. Targets sub-15s end-to-end so the modal feels live.

import { SYSTEM_PROMPT, MEMO_TOOL, buildUserMessage } from "./prompt.js";
import type { Scrape } from "./scrape.js";

export type MemoSection = {
  index: number;
  title: string;
  body: string;
};

export type MemoResult = {
  cover_echo: string;
  sections: MemoSection[];
};

const MODEL = "claude-sonnet-4-6";
const API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

export async function generateMemo(
  apiKey: string,
  scrape: Scrape,
  prompting: string | undefined,
): Promise<MemoResult> {
  const body = {
    model: MODEL,
    max_tokens: 3000,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [MEMO_TOOL],
    tool_choice: { type: "tool", name: MEMO_TOOL.name },
    messages: [
      {
        role: "user",
        content: buildUserMessage(scrape, prompting),
      },
    ],
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`anthropic_${res.status}: ${text.slice(0, 500)}`);
  }

  const json = (await res.json()) as {
    content: Array<{ type: string; name?: string; input?: unknown }>;
  };

  const toolUse = json.content.find((c) => c.type === "tool_use" && c.name === MEMO_TOOL.name);
  if (!toolUse || !toolUse.input) {
    throw new Error("anthropic_no_tool_use");
  }
  const result = toolUse.input as MemoResult;

  if (!result.cover_echo || !Array.isArray(result.sections) || result.sections.length !== 5) {
    throw new Error("anthropic_bad_shape");
  }
  result.sections.sort((a, b) => a.index - b.index);

  return result;
}
