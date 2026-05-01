// HTML email template for the First Read memo.
// Designed to render at the typographic quality of herenowlabs.xyz across
// Gmail (web/iOS/Android), Apple Mail, Outlook (web/desktop), and Hey.
// Web fonts (Fraunces, Geist Mono, Inter) load best-effort via Google Fonts;
// fallbacks match site palette and intent. Single cream surface throughout —
// structure comes from hairline rules, not nested boxes.

import type { MemoResult } from "./anthropic.js";

type RenderInput = {
  memo: MemoResult;
  firstName?: string;
  /** Domain is for fallback only; never displayed to the reader. */
  domain: string;
  calendlyHref: string;
};

type RenderOutput = {
  html: string;
  text: string;
  subject: string;
};

const COLORS = {
  bg: "#faf9f5",        // single cream surface (matches site)
  fg: "#14141a",        // headings + primary body
  fgMuted: "#4f4f57",   // closing italic, secondary body
  fgFaint: "#8e8e95",   // legal footer, fine print
  rule: "#d4d1c4",      // hairlines (matches site --rule-strong)
  accent: "#15803d",    // glyph, mono labels, CTA
};

const FONTS = {
  serif: `'Fraunces', 'Iowan Old Style', 'Charter', 'Georgia', 'Times New Roman', serif`,
  sans: `'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif`,
  mono: `'Geist Mono', 'SF Mono', 'Menlo', 'Consolas', 'Courier New', monospace`,
};

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&family=Inter:wght@400;500&family=Geist+Mono:wght@500&display=swap";

export function renderEmail(input: RenderInput): RenderOutput {
  const { memo, firstName, domain, calendlyHref } = input;

  const businessName = (memo.business_name ?? "").trim();
  // Refer to the business by name. If the model couldn't extract one,
  // fall back to a generic phrase rather than leaking the domain.
  const businessLabel = businessName || "your business";

  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const subject = businessName
    ? `Your First Read — ${businessName}`
    : `Your First Read`;

  const sectionBlocks = memo.sections
    .map((s) => sectionBlock(s.index, s.title, s.body, s.index === memo.sections.length))
    .join("");

  const greeting = firstName ? `${escapeHtml(firstName)} —` : "—";

  // 6-square brand glyph as inline SVG-data-URI background, sized to match the
  // mono eyebrow next to it. Mirrors the site topbar wordmark and OG image.
  const glyphImg = `<img alt="" width="20" height="12" src="data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 17 11'><rect width='5' height='5' fill='%2315803d'/><rect x='6' width='5' height='5' fill='%2315803d'/><rect x='12' width='5' height='5' fill='%2315803d'/><rect y='6' width='5' height='5' fill='%2315803d'/><rect x='6' y='6' width='5' height='5' fill='%2315803d'/><rect x='12' y='6' width='5' height='5' fill='%2315803d'/></svg>`,
  )}" style="display:block;width:20px;height:12px;" />`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(subject)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${FONTS_HREF}" rel="stylesheet" />
<style>
  body { margin: 0; padding: 0; background: ${COLORS.bg}; }
  a { color: ${COLORS.accent}; text-decoration: none; }
  @media (prefers-color-scheme: dark) {
    body { background: ${COLORS.bg} !important; color: ${COLORS.fg} !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};color:${COLORS.fg};">
  <div style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;">
    A short read on ${escapeHtml(businessLabel)}. From Here Now Labs.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.bg};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:640px;max-width:640px;background:${COLORS.bg};">

          <!-- ── Cover ─────────────────────────────────────────────── -->
          <tr>
            <td style="padding:8px 44px 32px 44px;border-bottom:1px solid ${COLORS.rule};">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-bottom:18px;vertical-align:middle;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                      <td style="vertical-align:middle;line-height:0;padding-right:12px;">${glyphImg}</td>
                      <td style="vertical-align:middle;font-family:${FONTS.mono};font-size:11px;letter-spacing:0.08em;color:${COLORS.fg};text-transform:uppercase;">
                        FIRST READ &middot; HERE NOW LABS
                      </td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:24px;font-family:${FONTS.mono};font-size:11px;letter-spacing:0.04em;color:${COLORS.fgFaint};text-transform:uppercase;">
                    ${escapeHtml(date)}
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:14px;font-family:${FONTS.serif};font-style:italic;font-size:30px;line-height:1.18;color:${COLORS.fg};letter-spacing:-0.012em;">
                    A short read on ${escapeHtml(businessLabel)}.
                  </td>
                </tr>
                <tr>
                  <td style="font-family:${FONTS.serif};font-style:italic;font-size:16px;line-height:1.55;color:${COLORS.fgMuted};">
                    ${escapeHtml(memo.cover_echo)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Greeting ──────────────────────────────────────────── -->
          <tr>
            <td style="padding:32px 44px 0 44px;font-family:${FONTS.sans};font-size:15px;line-height:1.65;color:${COLORS.fg};">
              <p style="margin:0 0 14px 0;">${greeting}</p>
              <p style="margin:0;">Here is the short read. Five sections, about three minutes.</p>
            </td>
          </tr>

          ${sectionBlocks}

          <!-- ── Sign-off + CTA ────────────────────────────────────── -->
          <tr>
            <td style="padding:8px 44px 36px 44px;border-top:1px solid ${COLORS.rule};">
              <p style="margin:28px 0 12px 0;font-family:${FONTS.serif};font-style:italic;font-size:18px;color:${COLORS.fg};">— Here Now Labs</p>
              <p style="margin:0;font-family:${FONTS.serif};font-style:italic;font-size:15px;line-height:1.55;color:${COLORS.fgMuted};">
                If you'd like the read specific to your operation, <a href="${escapeAttr(calendlyHref)}" style="color:${COLORS.accent};text-decoration:none;font-style:italic;">book a workshop day &rarr;</a>
              </p>
            </td>
          </tr>

          <!-- ── Footer ────────────────────────────────────────────── -->
          <tr>
            <td style="padding:20px 44px 36px 44px;border-top:1px solid ${COLORS.rule};font-family:${FONTS.mono};font-size:10px;letter-spacing:0.06em;color:${COLORS.fgFaint};text-transform:uppercase;">
              Here Now Labs, Inc. &middot; A Delaware corporation &middot; team@herenowlabs.xyz
              <p style="margin:14px 0 0 0;text-transform:none;letter-spacing:0.01em;font-family:${FONTS.serif};font-style:italic;font-size:13px;color:${COLORS.fgFaint};">We won't email you again unless you reply.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = renderText(memo, firstName, businessLabel, calendlyHref, date);

  return { html, text, subject };
}

function sectionBlock(index: number, title: string, body: string, isClosing: boolean): string {
  const num = String(index).padStart(2, "0");
  const paragraphs = body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (isClosing) {
    // Closing section: italic Fraunces body, accent left rule, no tinted box —
    // matches the site's voice for closing notes.
    return `
      <tr>
        <td style="padding:32px 44px 0 44px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="border-left:2px solid ${COLORS.accent};padding:4px 0 4px 22px;">
                <p style="margin:0 0 14px 0;font-family:${FONTS.mono};font-size:13px;font-weight:500;letter-spacing:0.06em;color:${COLORS.accent};">${num}</p>
                <p style="margin:0 0 16px 0;font-family:${FONTS.serif};font-style:italic;font-size:22px;font-weight:500;line-height:1.25;color:${COLORS.fg};letter-spacing:-0.012em;">${escapeHtml(title)}</p>
                ${paragraphs
                  .map(
                    (p) =>
                      `<p style="margin:0 0 14px 0;font-family:${FONTS.serif};font-style:italic;font-size:15.5px;line-height:1.7;color:${COLORS.fgMuted};">${escapeHtml(p)}</p>`,
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
      <td style="padding:36px 44px 0 44px;">
        <p style="margin:0 0 14px 0;font-family:${FONTS.mono};font-size:14px;font-weight:500;letter-spacing:0.06em;color:${COLORS.accent};">${num}</p>
        <p style="margin:0 0 18px 0;font-family:${FONTS.serif};font-style:italic;font-size:24px;font-weight:500;line-height:1.22;color:${COLORS.fg};letter-spacing:-0.014em;">${escapeHtml(title)}</p>
        ${paragraphs
          .map(
            (p) =>
              `<p style="margin:0 0 14px 0;font-family:${FONTS.sans};font-size:15px;line-height:1.7;color:${COLORS.fg};">${escapeHtml(p)}</p>`,
          )
          .join("")}
      </td>
    </tr>`;
}

function renderText(
  memo: MemoResult,
  firstName: string | undefined,
  businessLabel: string,
  calendlyHref: string,
  date: string,
): string {
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
    `A short read on ${businessLabel}.`,
    "",
    memo.cover_echo,
    "",
    "———",
    "",
    greeting,
    "",
    "Here is the short read. Five sections, about three minutes.",
    "",
    sections,
    "",
    "———",
    "",
    "— Here Now Labs",
    "",
    `If you'd like the read specific to your operation, book a workshop day: ${calendlyHref}`,
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
