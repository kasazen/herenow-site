// HTML email template for the First Read memo.
// Designed to render well in Gmail (web/iOS/Android), Apple Mail, Outlook
// (web/desktop), and Hey. Uses inline styles, table-based layout, and
// web-safe font stacks so the experience matches the herenowlabs.xyz site
// without requiring loaded webfonts.

import type { MemoResult } from "./anthropic.js";

type RenderInput = {
  memo: MemoResult;
  firstName?: string;
  domain: string;
  calendlyHref: string;
};

type RenderOutput = {
  html: string;
  text: string;
  subject: string;
};

const COLORS = {
  bg: "#faf9f5",
  paper: "#ffffff",
  paperTint: "#f3f2ec",
  fg: "#14141a",
  fgMuted: "#4f4f57",
  fgFaint: "#8e8e95",
  rule: "#e6e3d8",
  accent: "#15803d",
};

const FONTS = {
  serif: `Georgia, "Iowan Old Style", "Charter", "Times New Roman", serif`,
  sans: `-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif`,
  mono: `"SF Mono", "Menlo", "Consolas", "Courier New", monospace`,
};

export function renderEmail(input: RenderInput): RenderOutput {
  const { memo, firstName, domain, calendlyHref } = input;

  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const subject = `Your First Read — ${domain}`;

  const sectionBlocks = memo.sections
    .map((s) => sectionBlock(s.index, s.title, s.body, s.index === memo.sections.length))
    .join("");

  const greeting = firstName ? `${escapeHtml(firstName)} —` : "—";

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(subject)}</title>
<style>
  body { margin: 0; padding: 0; }
  a { color: ${COLORS.fg}; }
  @media (prefers-color-scheme: dark) {
    body { background: ${COLORS.bg} !important; color: ${COLORS.fg} !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};color:${COLORS.fg};">
  <div style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;">
    A short read on ${escapeHtml(domain)}. From Here Now Labs.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.bg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:${COLORS.paper};border:1px solid ${COLORS.rule};">

          <tr>
            <td style="padding:36px 40px 28px 40px;border-bottom:1px solid ${COLORS.rule};">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-bottom:14px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                      <td style="background:${COLORS.accent};width:8px;height:8px;line-height:8px;font-size:0;">&nbsp;</td>
                      <td style="padding-left:10px;font-family:${FONTS.mono};font-size:11px;letter-spacing:0.06em;color:${COLORS.fgFaint};text-transform:uppercase;">
                        FIRST READ &middot; HERE NOW LABS
                      </td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:18px;font-family:${FONTS.mono};font-size:11px;letter-spacing:0.02em;color:${COLORS.fgFaint};">
                    ${escapeHtml(date)}
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:14px;font-family:${FONTS.serif};font-style:italic;font-size:24px;line-height:1.28;color:${COLORS.fg};letter-spacing:-0.01em;">
                    A short read on ${escapeHtml(domain)}.
                  </td>
                </tr>
                <tr>
                  <td style="font-family:${FONTS.serif};font-style:italic;font-size:15px;line-height:1.55;color:${COLORS.fgMuted};">
                    ${escapeHtml(memo.cover_echo)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 40px 0 40px;font-family:${FONTS.sans};font-size:15px;line-height:1.6;color:${COLORS.fgMuted};">
              <p style="margin:0 0 14px 0;">${greeting}</p>
              <p style="margin:0;">Here is the short read on what you sent us. It runs five sections, takes about three minutes to read.</p>
            </td>
          </tr>

          ${sectionBlocks}

          <tr>
            <td style="padding:8px 40px 32px 40px;border-top:1px solid ${COLORS.rule};">
              <p style="margin:24px 0 6px 0;font-family:${FONTS.serif};font-style:italic;font-size:16px;color:${COLORS.fg};">— Here Now Labs</p>
              <p style="margin:0;font-family:${FONTS.mono};font-size:11px;letter-spacing:0.02em;color:${COLORS.fgFaint};">
                If you'd like the version specific to your operation, two weeks: <a href="${escapeAttr(calendlyHref)}" style="color:${COLORS.accent};text-decoration:none;border-bottom:1px solid ${COLORS.accent};">book time with us</a>.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:18px 40px 32px 40px;border-top:1px solid ${COLORS.rule};font-family:${FONTS.mono};font-size:10px;letter-spacing:0.04em;color:${COLORS.fgFaint};text-transform:uppercase;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                <td style="padding-right:8px;">Here Now Labs, Inc. &middot; A Delaware corporation</td>
                <td align="right" style="padding-left:8px;white-space:nowrap;">team@herenowlabs.xyz</td>
              </tr></table>
              <p style="margin:14px 0 0 0;text-transform:none;letter-spacing:0.02em;font-size:11px;">We won't email you again unless you reply.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = renderText(memo, firstName, domain, calendlyHref, date);

  return { html, text, subject };
}

function sectionBlock(index: number, title: string, body: string, isClosing: boolean): string {
  const num = String(index).padStart(2, "0");
  const paragraphs = body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (isClosing) {
    return `
      <tr>
        <td style="padding:24px 40px 0 40px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.paperTint};border-left:2px solid ${COLORS.accent};">
            <tr>
              <td style="padding:22px 24px 22px 24px;">
                <p style="margin:0 0 10px 0;font-family:${FONTS.mono};font-size:11px;letter-spacing:0.06em;color:${COLORS.accent};text-transform:uppercase;">${num}</p>
                <p style="margin:0 0 12px 0;font-family:${FONTS.serif};font-size:18px;font-weight:500;line-height:1.3;color:${COLORS.fg};letter-spacing:-0.01em;">${escapeHtml(title)}</p>
                ${paragraphs
                  .map(
                    (p) =>
                      `<p style="margin:0 0 12px 0;font-family:${FONTS.serif};font-style:italic;font-size:15px;line-height:1.65;color:${COLORS.fg};">${escapeHtml(p)}</p>`,
                  )
                  .join("")}
              </td>
            </tr>
          </table>
        </td>
      </tr>`;
  }

  return `
    <tr>
      <td style="padding:28px 40px 4px 40px;">
        <p style="margin:0 0 8px 0;font-family:${FONTS.mono};font-size:11px;letter-spacing:0.06em;color:${COLORS.accent};text-transform:uppercase;">${num}</p>
        <p style="margin:0 0 14px 0;font-family:${FONTS.serif};font-size:20px;font-weight:500;line-height:1.3;color:${COLORS.fg};letter-spacing:-0.012em;">${escapeHtml(title)}</p>
        ${paragraphs
          .map(
            (p) =>
              `<p style="margin:0 0 14px 0;font-family:${FONTS.sans};font-size:15px;line-height:1.65;color:${COLORS.fgMuted};">${escapeHtml(p)}</p>`,
          )
          .join("")}
      </td>
    </tr>`;
}

function renderText(memo: MemoResult, firstName: string | undefined, domain: string, calendlyHref: string, date: string): string {
  const greeting = firstName ? `${firstName} —` : "—";
  const sections = memo.sections
    .map((s) => {
      const num = String(s.index).padStart(2, "0");
      return `${num}  ${s.title}\n\n${s.body.trim()}`;
    })
    .join("\n\n———\n\n");

  return [
    "FIRST READ — HERE NOW LABS",
    date,
    "",
    `A short read on ${domain}.`,
    "",
    memo.cover_echo,
    "",
    "———",
    "",
    greeting,
    "",
    "Here is the short read on what you sent us. It runs five sections, takes about three minutes to read.",
    "",
    sections,
    "",
    "———",
    "",
    "— Here Now Labs",
    "",
    `If you'd like the version specific to your operation, two weeks: ${calendlyHref}`,
    "",
    "Here Now Labs, Inc. — A Delaware corporation",
    "team@herenowlabs.xyz",
    "",
    "We won't email you again unless you reply.",
  ].join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}
