// HTML email template for the First Read memo.
//
// Designed to mirror the site's own "memo" visualization at index.html:122–145:
// a single paper-card document with a designed masthead, spec strip, numbered
// TOC, large numbered section blocks, accent-bordered closing block, button
// CTA, and an expanded footer wordmark.
//
// Renders in Gmail (web/iOS/Android), Apple Mail, Outlook (web/desktop), and
// Hey. Webfonts (Fraunces / Inter / Geist Mono) load via @import in clients
// that support it (Apple Mail macOS/iOS, Outlook.com web). Everywhere else
// falls back to the system stack — same baseline as before.
//
// Layout is table-based; all critical styles are inline.
//
// Public surface unchanged: renderEmail(input) -> { html, text, subject }.

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
  ruleStrong: "#d4d1c4",
  accent: "#15803d",
};

const FONTS = {
  serif: `"Fraunces", Georgia, "Iowan Old Style", "Charter", "Times New Roman", serif`,
  sans: `"Inter", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif`,
  mono: `"Geist Mono", "SF Mono", "Menlo", "Consolas", "Courier New", monospace`,
};

export function renderEmail(input: RenderInput): RenderOutput {
  const { memo, firstName, domain, calendlyHref } = input;

  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const now = new Date();
  const monthShort = now.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const dateMono = `${monthShort} ${now.getDate()} · ${now.getFullYear()}`;

  const subject = `Your First Read — ${domain}`;
  const greeting = firstName ? `${escapeHtml(firstName)} —` : "—";
  const preheader = truncate(memo.cover_echo, 110);

  const masthead = renderMasthead(dateMono);
  const cover = renderCover(domain, memo.cover_echo);
  const toc = renderToc(memo.sections);
  const intro = renderIntro(greeting);
  const sectionBlocks = memo.sections
    .map((s) => sectionBlock(s.index, s.title, s.body, s.index === memo.sections.length))
    .join("");
  const cta = renderCta(calendlyHref);
  const footer = renderFooter();

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light dark" />
<meta name="supported-color-schemes" content="light dark" />
<title>${escapeHtml(subject)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=Geist+Mono:wght@400;500&display=swap');
  body, table, td, p, a, h1, h2, h3 { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
  img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
  body { margin: 0; padding: 0; width: 100% !important; }
  a { color: ${COLORS.fg}; }
  .fr-card { box-shadow: 0 30px 80px -40px rgba(20, 20, 26, 0.18); }
  @media (max-width: 620px) {
    .fr-container { width: 100% !important; max-width: 100% !important; }
    .fr-pad-x { padding-left: 24px !important; padding-right: 24px !important; }
    .fr-cover-title { font-size: 26px !important; line-height: 1.22 !important; }
    .fr-section-title { font-size: 20px !important; }
    .fr-section-num { font-size: 28px !important; }
    .fr-spec-key { padding-right: 14px !important; }
  }
  @media (prefers-color-scheme: dark) {
    body, .fr-bg { background: #0f0f12 !important; }
    .fr-card { background: #14141a !important; border-color: #2a2a30 !important; box-shadow: none !important; }
    .fr-tint { background: #1c1c22 !important; }
    .fr-fg { color: #ededeb !important; }
    .fr-fg-muted { color: #b5b5b0 !important; }
    .fr-fg-faint { color: #7a7a78 !important; }
    .fr-rule { border-color: #2a2a30 !important; background: #2a2a30 !important; }
    .fr-rule-bottom { border-bottom-color: #2a2a30 !important; }
    .fr-rule-top { border-top-color: #2a2a30 !important; }
    .fr-rule-left { border-left-color: ${COLORS.accent} !important; }
    .fr-cta { background: #ededeb !important; color: #14141a !important; }
    .fr-cta a { color: #14141a !important; }
  }
  [data-ogsc] body, [data-ogsc] .fr-bg { background: #0f0f12 !important; }
  [data-ogsc] .fr-card { background: #14141a !important; border-color: #2a2a30 !important; }
  [data-ogsc] .fr-tint { background: #1c1c22 !important; }
  [data-ogsc] .fr-fg { color: #ededeb !important; }
  [data-ogsc] .fr-fg-muted { color: #b5b5b0 !important; }
  [data-ogsc] .fr-fg-faint { color: #7a7a78 !important; }
  [data-ogsc] .fr-rule, [data-ogsc] .fr-rule-bottom, [data-ogsc] .fr-rule-top { border-color: #2a2a30 !important; }
  [data-ogsc] .fr-cta { background: #ededeb !important; }
  [data-ogsc] .fr-cta a { color: #14141a !important; }
</style>
</head>
<body class="fr-bg fr-fg" style="margin:0;padding:0;background:${COLORS.bg};color:${COLORS.fg};">
  <div style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;">
    ${escapeHtml(preheader)}
  </div>

  <table role="presentation" class="fr-bg" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.bg};">
    <tr>
      <td align="center" style="padding:40px 16px 56px 16px;">
        <table role="presentation" class="fr-container fr-card" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:${COLORS.paper};border:1px solid ${COLORS.rule};">

          ${masthead}
          ${cover}
          ${toc}
          ${intro}
          ${sectionBlocks}
          ${cta}
          ${footer}

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = renderText(memo, firstName, domain, calendlyHref, date);

  return { html, text, subject };
}

// ─── Components ────────────────────────────────────────────────────────────

function renderMasthead(dateMono: string): string {
  return `
    <tr>
      <td class="fr-pad-x fr-rule-bottom" style="padding:28px 40px 22px 40px;border-bottom:1px solid ${COLORS.rule};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td valign="middle" style="font-size:0;line-height:0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                <td style="background:${COLORS.accent};width:8px;height:8px;line-height:8px;font-size:0;mso-line-height-rule:exactly;">&nbsp;</td>
                <td class="fr-fg" style="padding-left:10px;font-family:${FONTS.mono};font-size:11px;letter-spacing:0.08em;color:${COLORS.fg};text-transform:uppercase;font-weight:500;">
                  Here Now Labs
                </td>
              </tr></table>
            </td>
            <td align="right" valign="middle" class="fr-fg-faint" style="font-family:${FONTS.mono};font-size:10px;letter-spacing:0.06em;color:${COLORS.fgFaint};text-transform:uppercase;">
              ${escapeHtml(dateMono)}
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function renderCover(domain: string, coverEcho: string): string {
  return `
    <tr>
      <td class="fr-pad-x" style="padding:44px 40px 8px 40px;">
        <p style="margin:0 0 22px 0;font-family:${FONTS.mono};font-size:10px;letter-spacing:0.18em;color:${COLORS.accent};text-transform:uppercase;font-weight:500;">
          First Read
        </p>
        <p class="fr-cover-title fr-fg" style="margin:0 0 20px 0;font-family:${FONTS.serif};font-style:italic;font-size:34px;line-height:1.18;color:${COLORS.fg};letter-spacing:-0.02em;font-weight:400;">
          A short read on ${escapeHtml(domain)}.
        </p>
        <p class="fr-fg-muted" style="margin:0;font-family:${FONTS.serif};font-style:italic;font-size:17px;line-height:1.5;color:${COLORS.fgMuted};max-width:460px;font-weight:400;">
          ${escapeHtml(coverEcho)}
        </p>
      </td>
    </tr>`;
}

function renderToc(sections: MemoResult["sections"]): string {
  const rows = sections
    .map((s) => {
      const num = String(s.index).padStart(2, "0");
      return `
            <tr>
              <td style="padding:8px 16px 8px 0;font-family:${FONTS.mono};font-size:11px;color:${COLORS.accent};letter-spacing:0.04em;font-weight:500;vertical-align:baseline;width:28px;font-feature-settings:'tnum','lnum';">
                ${num}
              </td>
              <td class="fr-fg" style="padding:8px 0;font-family:${FONTS.sans};font-size:14px;color:${COLORS.fg};line-height:1.5;vertical-align:baseline;letter-spacing:-0.005em;">
                ${escapeHtml(s.title)}
              </td>
            </tr>`;
    })
    .join("");

  return `
    <tr>
      <td class="fr-pad-x" style="padding:40px 40px 0 40px;">
        <p class="fr-fg-faint" style="margin:0 0 10px 0;font-family:${FONTS.mono};font-size:10px;letter-spacing:0.18em;color:${COLORS.fgFaint};text-transform:uppercase;font-weight:500;">
          Contents
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="fr-rule-top" style="border-top:1px solid ${COLORS.rule};">
          ${rows}
        </table>
      </td>
    </tr>`;
}

function renderIntro(greeting: string): string {
  return `
    <tr>
      <td class="fr-pad-x fr-fg" style="padding:44px 40px 0 40px;font-family:${FONTS.serif};font-style:italic;font-size:16px;line-height:1.6;color:${COLORS.fg};">
        <p style="margin:0;">${greeting}</p>
      </td>
    </tr>`;
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
        <td class="fr-pad-x" style="padding:44px 40px 0 40px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="fr-tint fr-rule-left" style="background:${COLORS.paperTint};border-left:2px solid ${COLORS.accent};">
            <tr>
              <td style="padding:26px 28px;">
                <p style="margin:0 0 6px 0;font-family:${FONTS.mono};font-size:10px;letter-spacing:0.18em;color:${COLORS.accent};text-transform:uppercase;font-weight:500;">
                  Closing
                </p>
                <p class="fr-fg" style="margin:0 0 14px 0;font-family:${FONTS.serif};font-size:20px;font-weight:500;line-height:1.3;color:${COLORS.fg};letter-spacing:-0.012em;">
                  ${escapeHtml(title)}
                </p>
                ${paragraphs
                  .map(
                    (p) =>
                      `<p class="fr-fg" style="margin:0 0 12px 0;font-family:${FONTS.serif};font-style:italic;font-size:16px;line-height:1.6;color:${COLORS.fg};letter-spacing:-0.005em;">${escapeHtml(p)}</p>`,
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
      <td class="fr-pad-x" style="padding:44px 40px 0 40px;">
        <p class="fr-section-num fr-fg-faint" style="margin:0 0 8px 0;font-family:${FONTS.serif};font-size:30px;font-weight:300;line-height:1;color:${COLORS.fgFaint};letter-spacing:-0.02em;font-feature-settings:'tnum','lnum';">
          ${num}
        </p>
        <p class="fr-section-title fr-fg" style="margin:0 0 18px 0;font-family:${FONTS.serif};font-size:22px;font-weight:500;line-height:1.3;color:${COLORS.fg};letter-spacing:-0.012em;">
          ${escapeHtml(title)}
        </p>
        ${paragraphs
          .map(
            (p) =>
              `<p class="fr-fg-muted" style="margin:0 0 14px 0;font-family:${FONTS.sans};font-size:15.5px;line-height:1.65;color:${COLORS.fgMuted};letter-spacing:-0.005em;">${escapeHtml(p)}</p>`,
          )
          .join("")}
      </td>
    </tr>`;
}

function renderCta(calendlyHref: string): string {
  return `
    <tr>
      <td class="fr-pad-x" style="padding:56px 40px 0 40px;">
        <p class="fr-fg" style="margin:0 0 10px 0;font-family:${FONTS.serif};font-style:italic;font-size:17px;color:${COLORS.fg};">
          — Here Now Labs
        </p>
        <p class="fr-fg-muted" style="margin:0 0 22px 0;font-family:${FONTS.sans};font-size:14.5px;line-height:1.55;color:${COLORS.fgMuted};letter-spacing:-0.005em;max-width:420px;">
          If you'd like the version specific to your operation, two weeks inside.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td class="fr-cta" style="background:${COLORS.fg};">
              <a href="${escapeAttr(calendlyHref)}" style="display:inline-block;padding:16px 28px;font-family:${FONTS.mono};font-size:11px;letter-spacing:0.12em;color:${COLORS.bg};text-decoration:none;text-transform:uppercase;font-weight:500;mso-padding-alt:16px 28px;">
                Book time with us&nbsp;&nbsp;&rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function renderFooter(): string {
  return `
    <tr>
      <td class="fr-pad-x fr-rule-top" style="padding:48px 40px 32px 40px;border-top:1px solid ${COLORS.rule};margin-top:48px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;">
          <tr>
            <td style="background:${COLORS.accent};width:8px;height:8px;line-height:8px;font-size:0;mso-line-height-rule:exactly;">&nbsp;</td>
            <td class="fr-fg" style="padding-left:10px;font-family:${FONTS.mono};font-size:11px;letter-spacing:0.08em;color:${COLORS.fg};text-transform:uppercase;font-weight:500;">
              Here Now Labs
            </td>
          </tr>
        </table>
        <p class="fr-fg" style="margin:0 0 22px 0;font-family:${FONTS.serif};font-style:italic;font-size:14px;color:${COLORS.fg};letter-spacing:-0.01em;">
          Action Plan at the Speed of AI.
        </p>
        <p class="fr-fg-faint" style="margin:0 0 4px 0;font-family:${FONTS.mono};font-size:10px;letter-spacing:0.06em;color:${COLORS.fgFaint};text-transform:uppercase;line-height:1.7;">
          Here Now Labs, Inc. &middot; A Delaware corporation
        </p>
        <p class="fr-fg-faint" style="margin:0 0 4px 0;font-family:${FONTS.mono};font-size:10px;letter-spacing:0.06em;color:${COLORS.fgFaint};line-height:1.7;">
          team@herenowlabs.xyz
        </p>
        <p class="fr-fg-faint" style="margin:0 0 18px 0;font-family:${FONTS.mono};font-size:10px;letter-spacing:0.06em;color:${COLORS.fgFaint};line-height:1.7;">
          herenowlabs.xyz
        </p>
        <p class="fr-fg-faint" style="margin:0;font-family:${FONTS.sans};font-size:12px;line-height:1.55;color:${COLORS.fgFaint};letter-spacing:-0.005em;">
          One read per email. We won't email you again unless you reply.
        </p>
      </td>
    </tr>`;
}

// ─── Plain-text fallback ───────────────────────────────────────────────────

function renderText(
  memo: MemoResult,
  firstName: string | undefined,
  domain: string,
  calendlyHref: string,
  date: string,
): string {
  const greeting = firstName ? `${firstName} —` : "—";

  const toc = memo.sections
    .map((s) => `  ${String(s.index).padStart(2, "0")}   ${s.title}`)
    .join("\n");

  const sections = memo.sections
    .map((s) => {
      const isClosing = s.index === memo.sections.length;
      const head = isClosing ? `CLOSING\n${s.title}` : `${String(s.index).padStart(2, "0")}\n${s.title}`;
      return `${head}\n\n${s.body.trim()}`;
    })
    .join("\n\n———\n\n");

  return [
    "HERE NOW LABS — FIRST READ",
    date,
    "",
    `A short read on ${domain}.`,
    "",
    memo.cover_echo,
    "",
    "———",
    "",
    "CONTENTS",
    "",
    toc,
    "",
    "———",
    "",
    greeting,
    "",
    sections,
    "",
    "———",
    "",
    "— Here Now Labs",
    "",
    "If you'd like the version specific to your operation, two weeks inside:",
    calendlyHref,
    "",
    "Here Now Labs, Inc. — A Delaware corporation",
    "team@herenowlabs.xyz",
    "herenowlabs.xyz",
    "",
    "One read per email. We won't email you again unless you reply.",
  ].join("\n");
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
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
