// Fetch a website and extract the parts useful for grounding a memo:
// title, meta description, first ~12KB of visible body text. Designed to
// be fast (single fetch, simple text extraction) and forgiving (graceful
// errors so the user gets a clear "couldn't read that URL" message).

const MAX_BYTES = 250_000;
const MAX_TEXT_BYTES = 12_000;
const FETCH_TIMEOUT_MS = 7_000;
const USER_AGENT = "Mozilla/5.0 (compatible; HereNowLabsFirstRead/1.0; +https://herenowlabs.xyz)";

export type Scrape = {
  url: string;
  domain: string;
  title: string;
  description: string;
  body: string;
};

export class ScrapeError extends Error {
  constructor(public reason: string, message: string) {
    super(message);
  }
}

export async function scrapeUrl(input: string): Promise<Scrape> {
  const url = normalizeUrl(input);
  const domain = new URL(url).host.replace(/^www\./, "");

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);

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
    if ((err as Error).name === "AbortError") {
      throw new ScrapeError("timeout", "We couldn't load that site in time. Try again or paste a description instead.");
    }
    throw new ScrapeError("fetch_failed", "We couldn't reach that URL. Check it and try again.");
  }
  clearTimeout(timer);

  if (!res.ok) {
    throw new ScrapeError("http_error", `That URL returned ${res.status}. We can't read what isn't public.`);
  }

  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("html") && !ct.includes("xml")) {
    throw new ScrapeError("not_html", "That URL doesn't look like a webpage we can read.");
  }

  const buf = await res.arrayBuffer();
  const trimmed = buf.byteLength > MAX_BYTES ? buf.slice(0, MAX_BYTES) : buf;
  const html = new TextDecoder("utf-8", { fatal: false }).decode(trimmed);

  const title = extractTitle(html);
  const description = extractMeta(html, ["description", "og:description", "twitter:description"]);
  const body = extractBodyText(html);

  return {
    url,
    domain,
    title,
    description,
    body: body.slice(0, MAX_TEXT_BYTES),
  };
}

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

function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(stripTags(m[1])).trim().slice(0, 200) : "";
}

function extractMeta(html: string, keys: string[]): string {
  for (const key of keys) {
    const re = new RegExp(
      `<meta[^>]+(?:name|property)=["']${escapeRe(key)}["'][^>]+content=["']([^"']*)["']`,
      "i",
    );
    const m = html.match(re);
    if (m) return decodeEntities(m[1]).trim().slice(0, 400);
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
    .replace(/&rdquo;/g, """)
    .replace(/&ldquo;/g, """)
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
