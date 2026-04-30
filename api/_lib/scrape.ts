// Multi-page scraper. Takes a URL, fetches the root + up to 3 in-domain
// pages that look like "about / services / team / industries / approach"
// content, and returns the aggregate. Designed to give the model real
// substance to work with — not just whatever's on the marketing splash.

const MAX_BYTES_PER_PAGE = 250_000;
const MAX_TEXT_BYTES_PER_PAGE = 8_000;
const MAX_TOTAL_TEXT_BYTES = 20_000;
const PRIMARY_TIMEOUT_MS = 7_000;
const SECONDARY_BUDGET_MS = 6_000;
const MAX_SECONDARY_PAGES = 3;
const USER_AGENT = "Mozilla/5.0 (compatible; HereNowLabsFirstRead/1.0; +https://herenowlabs.xyz)";

export type PageData = {
  url: string;
  title: string;
  description: string;
  body: string;
};

export type Pages = {
  domain: string;
  primary: PageData;
  secondary: PageData[];
};

export class ScrapeError extends Error {
  constructor(public reason: string, message: string) {
    super(message);
  }
}

export type ScrapeProgress =
  | { type: "primary_start"; domain: string }
  | { type: "secondary_start"; pathname: string }
  | { type: "complete"; pageCount: number };

export async function scrapeBusiness(
  input: string,
  onProgress?: (e: ScrapeProgress) => void,
): Promise<Pages> {
  const rootUrl = normalizeUrl(input);
  const origin = new URL(rootUrl).origin;
  const domain = new URL(rootUrl).host.replace(/^www\./, "");

  onProgress?.({ type: "primary_start", domain });
  const primary = await fetchPage(rootUrl, PRIMARY_TIMEOUT_MS, /* required */ true);

  // Find candidate secondary URLs from the primary page's HTML.
  const candidates = extractInteriorLinks(primary.rawHtml ?? "", origin)
    .filter((u) => u !== primary.page.url)
    .slice(0, MAX_SECONDARY_PAGES);

  const secondary: PageData[] = [];
  if (candidates.length) {
    for (const c of candidates) {
      try {
        onProgress?.({ type: "secondary_start", pathname: new URL(c).pathname || "/" });
      } catch {
        /* ignore */
      }
    }
    const aggregate = new AbortController();
    const aggTimer = setTimeout(() => aggregate.abort(), SECONDARY_BUDGET_MS);
    try {
      const results = await Promise.allSettled(
        candidates.map((u) => fetchPage(u, SECONDARY_BUDGET_MS, false, aggregate.signal)),
      );
      for (const r of results) {
        if (r.status === "fulfilled" && r.value.page.body) {
          secondary.push(r.value.page);
        }
      }
    } finally {
      clearTimeout(aggTimer);
    }
  }

  // Cap total text size — give primary the most, share the rest among secondary.
  const capped = capTotalText(primary.page, secondary);

  onProgress?.({ type: "complete", pageCount: 1 + capped.secondary.length });

  return { domain, primary: capped.primary, secondary: capped.secondary };
}

// Back-compat alias for any caller that still imports the old name.
export const scrapeUrl = scrapeBusiness;

type FetchedPage = { page: PageData; rawHtml?: string };

async function fetchPage(
  url: string,
  timeoutMs: number,
  required: boolean,
  externalSignal?: AbortSignal,
): Promise<FetchedPage> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  // Forward external aborts (used to stop in-flight secondaries when budget elapses).
  const onExternalAbort = () => ctrl.abort();
  if (externalSignal) {
    if (externalSignal.aborted) ctrl.abort();
    else externalSignal.addEventListener("abort", onExternalAbort, { once: true });
  }

  let res: Response;
  try {
    res = await fetch(url, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml",
      },
    });
  } catch (err) {
    clearTimeout(timer);
    if (externalSignal) externalSignal.removeEventListener("abort", onExternalAbort);
    if (required) {
      const reason = (err as Error).name === "AbortError" ? "timeout" : "fetch_failed";
      const msg =
        reason === "timeout"
          ? "We couldn't load that site in time. Try again or paste a description instead."
          : "We couldn't reach that URL. Check it and try again.";
      throw new ScrapeError(reason, msg);
    }
    return emptyResult(url);
  }
  clearTimeout(timer);
  if (externalSignal) externalSignal.removeEventListener("abort", onExternalAbort);

  if (!res.ok) {
    if (required) throw new ScrapeError("http_error", `That URL returned ${res.status}. We can't read what isn't public.`);
    return emptyResult(url);
  }

  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("html") && !ct.includes("xml")) {
    if (required) throw new ScrapeError("not_html", "That URL doesn't look like a webpage we can read.");
    return emptyResult(url);
  }

  const buf = await res.arrayBuffer();
  const trimmed = buf.byteLength > MAX_BYTES_PER_PAGE ? buf.slice(0, MAX_BYTES_PER_PAGE) : buf;
  const html = new TextDecoder("utf-8", { fatal: false }).decode(trimmed);

  const finalUrl = res.url || url;
  const page: PageData = {
    url: finalUrl,
    title: extractTitle(html),
    description: extractMeta(html, ["description", "og:description", "twitter:description"]),
    body: extractBodyText(html).slice(0, MAX_TEXT_BYTES_PER_PAGE),
  };

  return { page, rawHtml: html };
}

function emptyResult(url: string): FetchedPage {
  return { page: { url, title: "", description: "", body: "" } };
}

function capTotalText(primary: PageData, secondary: PageData[]): { primary: PageData; secondary: PageData[] } {
  let used = primary.body.length;
  if (used > MAX_TOTAL_TEXT_BYTES) {
    return { primary: { ...primary, body: primary.body.slice(0, MAX_TOTAL_TEXT_BYTES) }, secondary: [] };
  }
  const cappedSecondary: PageData[] = [];
  for (const s of secondary) {
    const remaining = MAX_TOTAL_TEXT_BYTES - used;
    if (remaining <= 0) break;
    cappedSecondary.push({ ...s, body: s.body.slice(0, remaining) });
    used += Math.min(s.body.length, remaining);
  }
  return { primary, secondary: cappedSecondary };
}

// ── URL handling ────────────────────────────────────────────────────────

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new ScrapeError("empty", "Add the URL of your business.");
  let withScheme = trimmed;
  if (!/^https?:\/\//i.test(withScheme)) withScheme = "https://" + withScheme;
  try {
    const u = new URL(withScheme);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      throw new ScrapeError("bad_url", "That URL doesn't look right.");
    }
    return u.toString();
  } catch {
    throw new ScrapeError("bad_url", "That URL doesn't look right.");
  }
}

const INTERESTING_LINK_RE =
  /\/(?:about|about-us|services?|what-we-do|approach|process|team|people|industries|sectors|practice|practices|capabilities|solutions|work|case-studies|clients|customers|company)(?:\/|$|#|\?)/i;

function extractInteriorLinks(html: string, origin: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const linkRe = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;
  while ((match = linkRe.exec(html)) !== null) {
    const href = match[1];
    const text = stripTags(match[2]).trim().toLowerCase();
    let resolved: URL;
    try {
      resolved = new URL(href, origin);
    } catch {
      continue;
    }
    if (resolved.origin !== origin) continue;
    if (resolved.pathname === "/" || resolved.pathname === "") continue;
    // Score: prefer URL-pattern matches; secondarily, link text matches.
    const urlMatch = INTERESTING_LINK_RE.test(resolved.pathname);
    const textMatch = /(about|services?|what we do|approach|team|industries|capabilities|solutions|clients|customers)/i.test(
      text,
    );
    if (!urlMatch && !textMatch) continue;
    // Drop fragments and queries for de-dup, prefer canonical pathname.
    const canonical = resolved.origin + resolved.pathname.replace(/\/+$/, "");
    if (seen.has(canonical)) continue;
    seen.add(canonical);
    out.push(canonical);
  }
  return out;
}

// ── HTML parsing primitives ────────────────────────────────────────────

function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(stripTags(m[1])).trim().slice(0, 200) : "";
}

function extractMeta(html: string, keys: string[]): string {
  for (const key of keys) {
    const re1 = new RegExp(
      `<meta[^>]+(?:name|property)=["']${escapeRe(key)}["'][^>]+content=["']([^"']*)["']`,
      "i",
    );
    const m1 = html.match(re1);
    if (m1) return decodeEntities(m1[1]).trim().slice(0, 400);
    const re2 = new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${escapeRe(key)}["']`,
      "i",
    );
    const m2 = html.match(re2);
    if (m2) return decodeEntities(m2[1]).trim().slice(0, 400);
  }
  return "";
}

function extractBodyText(html: string): string {
  let t = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<head[\s\S]*?<\/head>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");

  t = t.replace(/<\/?(?:p|div|li|h[1-6]|section|article|header|footer|main|nav|br|tr|td|th)[^>]*>/gi, "\n");
  t = stripTags(t);
  t = decodeEntities(t);

  t = t
    .replace(/[ \t\r\f\v]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return t;
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "");
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, "”")
    .replace(/&ldquo;/g, "“")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
