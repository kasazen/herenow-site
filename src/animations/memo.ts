/**
 * Memo animation.
 *
 * A stylized memo cover renders itself: title bar, metadata, an abstract
 * paragraph, then a table of contents whose items un-blur one by one.
 * The point isn't to be readable — it's to feel like a real document is
 * resolving in front of the reader, with the shape of a serious memo.
 */

const BG = "#0a0a0a";
const PAPER = "#0e0e10";
const RULE = "#1f1f23";
const TEXT = "#a1a1aa";
const FAINT = "#3a3a40";
const ACCENT = "#34d399";

const TOC_ITEMS = [
  "01  Where AI shifts your numbers",
  "02  Vendors and contracts under load",
  "03  The two systems we'd build first",
  "04  What to leave alone",
  "05  Risk, and the order of operations",
];

const TOTAL = 5.2;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

function rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function mountMemo(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let dpr = 1;
  let w = 0;
  let h = 0;
  let started = false;
  let startedAt = 0;
  let rafId = 0;
  let done = false;

  function resize(): void {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
  }

  function draw(now: number): void {
    const elapsed = (now - startedAt) / 1000;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.fillStyle = BG;
    ctx!.fillRect(0, 0, w, h);

    // Memo "page" sits centered, with margins.
    const padX = w * 0.1;
    const padY = h * 0.08;
    const pageX = padX;
    const pageY = padY;
    const pageW = w - padX * 2;
    const pageH = h - padY * 2;

    // Page paper appears first
    const paperA = clamp01(elapsed / 0.4);
    ctx!.fillStyle = rgba(PAPER, paperA);
    ctx!.fillRect(pageX, pageY, pageW, pageH);
    ctx!.strokeStyle = rgba(RULE, paperA);
    ctx!.lineWidth = 1;
    ctx!.strokeRect(pageX + 0.5, pageY + 0.5, pageW - 1, pageH - 1);

    if (paperA <= 0) {
      rafId = requestAnimationFrame(draw);
      return;
    }

    const inX = pageX + pageW * 0.08;
    const inW = pageW * 0.84;
    const fontBase = Math.max(9, Math.min(13, w * 0.012));
    ctx!.font = `${fontBase}px "Geist Mono", ui-monospace, monospace`;
    ctx!.textBaseline = "top";

    // Header label: "MEMO · CONFIDENTIAL"
    const headerA = clamp01((elapsed - 0.4) / 0.4);
    if (headerA > 0) {
      ctx!.fillStyle = rgba(FAINT, headerA);
      ctx!.fillText("MEMO · CONFIDENTIAL", inX, pageY + pageH * 0.08);
      // Accent dot
      ctx!.fillStyle = rgba(ACCENT, headerA);
      ctx!.fillRect(inX - fontBase * 1.2, pageY + pageH * 0.08 + 2, fontBase * 0.5, fontBase * 0.5);
    }

    // Title — drawn as a heavy bar (we don't render real text headlines).
    const titleA = clamp01((elapsed - 0.7) / 0.5);
    if (titleA > 0) {
      const titleY = pageY + pageH * 0.16;
      const titleH = fontBase * 1.6;
      ctx!.fillStyle = rgba("#e8e8e2", titleA);
      // Fake a two-line title with bars of varying width
      ctx!.fillRect(inX, titleY, inW * easeOutCubic(titleA) * 0.78, titleH);
      ctx!.fillRect(inX, titleY + titleH * 1.4, inW * easeOutCubic(titleA) * 0.5, titleH);
    }

    // Metadata row (small mono text)
    const metaA = clamp01((elapsed - 1.2) / 0.4);
    if (metaA > 0) {
      ctx!.fillStyle = rgba(TEXT, metaA * 0.7);
      ctx!.fillText("Prepared by  Here Now Labs", inX, pageY + pageH * 0.34);
      ctx!.fillText("Audience      Executive team", inX, pageY + pageH * 0.34 + fontBase * 1.5);
      ctx!.fillText("Pages         24", inX, pageY + pageH * 0.34 + fontBase * 3);
    }

    // Horizontal divider
    const divA = clamp01((elapsed - 1.6) / 0.4);
    if (divA > 0) {
      ctx!.fillStyle = rgba(RULE, divA);
      ctx!.fillRect(inX, pageY + pageH * 0.5, inW * easeOutCubic(divA), 1);
    }

    // TOC items reveal one at a time
    const tocStart = 1.9;
    const tocStep = 0.35;
    for (let i = 0; i < TOC_ITEMS.length; i++) {
      const itemT = elapsed - (tocStart + i * tocStep);
      if (itemT <= 0) continue;
      const itemA = clamp01(itemT / 0.5);
      const slide = (1 - itemA) * 8;
      ctx!.fillStyle = rgba(TEXT, itemA * 0.85);
      ctx!.fillText(TOC_ITEMS[i], inX + slide, pageY + pageH * 0.56 + i * fontBase * 2.2);
    }

    if (elapsed > TOTAL + 0.4) {
      done = true;
      return;
    }
    rafId = requestAnimationFrame(draw);
  }

  function renderFinalState(): void {
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.fillStyle = BG;
    ctx!.fillRect(0, 0, w, h);
    // Cheat: jump elapsed to TOTAL so the live draw renders the resolved frame.
    startedAt = performance.now() - TOTAL * 1000;
    draw(performance.now());
  }

  function start(): void {
    if (started) return;
    resize();
    started = true;
    startedAt = performance.now();
    rafId = requestAnimationFrame(draw);
  }

  resize();
  const ro = new ResizeObserver(() => {
    resize();
    if (done) renderFinalState();
  });
  ro.observe(canvas);

  if (reduced) {
    renderFinalState();
    return;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, w, h);

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          start();
          io.disconnect();
        }
      }
    },
    { threshold: 0.4 },
  );
  io.observe(canvas);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    } else if (!document.hidden && started && !done) {
      rafId = requestAnimationFrame(draw);
    }
  });
}
