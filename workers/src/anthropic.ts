// Minimal Anthropic Messages API client for Workers.
// Avoids pulling in @anthropic-ai/sdk to keep the bundle small and edge-runtime safe.

import { SYSTEM_PROMPT, MEMO_TOOL, buildUserMessage } from "./prompt";

export type IntakePayload = {
  business: string;
  size: string;
  revenue: string;
  prompting: string;
  firstName?: string;
};

export type MemoSection = {
  index: number;
  title: string;
  body: string;
};

export type MemoResult = {
  cover_echo: string;
  sections: MemoSection[];
};

const MODEL = "claude-opus-4-7";
const API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

export async function generateMemo(apiKey: string, intake: IntakePayload): Promise<MemoResult> {
  const body = {
    model: MODEL,
    max_tokens: 4096,
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
        content: buildUserMessage(intake),
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

  // Defensive shape check.
  if (!result.cover_echo || !Array.isArray(result.sections) || result.sections.length !== 5) {
    throw new Error("anthropic_bad_shape");
  }
  // Sort sections by index (the model usually orders them, but be safe).
  result.sections.sort((a, b) => a.index - b.index);

  return result;
}
