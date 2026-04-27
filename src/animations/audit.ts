/**
 * Audit animation.
 *
 * A column of "page" tiles flows down from the top. Each page hits a
 * horizontal scan line, gets converted into a single colored token
 * (green = signal, red = waste), and the token slides to a small ledger
 * stack on the right that grows as more pages process.
 */

const GREEN = "#34d399";
const RED = "#f87171";
const RULE = "#1f1f23";
const FAINT = "#3a3a40";
const BG = "#0a0a0a";

interface PageItem {
  spawnT: number; // seconds from animation start
  duration: number; // total flight time before resolving to a token
  kind: "green" | "red";
  lines: number; // how many text lines to draw on the page tile
}

const PAGES: PageItem[] = [
  { spawnT: 0.0, duration: 1.4, kind: "green", lines: 4 },
  { spawnT: 0.4, duration: 1.4, kind: "green", lines: 5 },
  { spawnT: 0.9, duration: 1.4, kind: "red", lines: 3 },
  { spawnT: 1.3, duration: 1.4, kind: "green", lines: 5 },
  { spawnT: 1.7, duration: 1.4, kind: "green", lines: 4 },
  { spawnT: 2.1, duration: 1.4, kind: "red", lines: 4 },
  { spawnT: 2.5, duration: 1.4, kind: "green", lines: 5 },
  { spawnT: 2.9, duration: 1.4, kind: "green", lines: 3 },
  { spawnT: 3.3, duration: 1.4, kind: "red", lines: 4 },
  { spawnT: 3.7, duration: 1.4, kind: "green", lines: 5 },
];

const TOTAL_DURATION = 5.6;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

function rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function mountAudit(canvas: HTMLCanvasElement): void {
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

  function drawFrame(now: number): void {
    const elapsed = (now - startedAt) / 1000;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.fillStyle = BG;
    ctx!.fillRect(0, 0, w, h);

    const padX = w * 0.08;
    const padY = h * 0.1;
    const innerW = w - padX * 2;
    const innerH = h - padY * 2;

    // Layout: pages flow down a 40%-wide channel on the left.
    // Scan line sits at the vertical middle. Ledger stack on the right.
    const channelLeft = padX;
    const channelWidth = innerW * 0.34;
    const channelTop = padY;
    const scanY = padY + innerH * 0.55;
    const ledgerLeft = padX + innerW * 0.62;
    const ledgerRight = padX + innerW;
    const ledgerWidth = ledgerRight - ledgerLeft;

    const pageW = channelWidth * 0.85;
    const pageH = innerH * 0.32;
    const pageX = channelLeft + (channelWidth - pageW) / 2;

    // Draw the scan line — a faint horizontal rule across the inner area.
    ctx!.strokeStyle = FAINT;
    ctx!.setLineDash([4, 4]);
    ctx!.lineWidth = 1;
    ctx!.beginPath();
    ctx!.moveTo(channelLeft, scanY);
    ctx!.lineTo(ledgerRight, scanY);
    ctx!.stroke();
    ctx!.setLineDash([]);

    // Ledger frame
    ctx!.strokeStyle = RULE;
    ctx!.lineWidth = 1;
    ctx!.strokeRect(ledgerLeft + 0.5, padY + 0.5, ledgerWidth - 1, innerH - 1);

    let processed = 0;

    for (const p of PAGES) {
      const local = elapsed - p.spawnT;
      if (local < 0) continue;
      const k = clamp01(local / p.duration);

      // Determine where this page is in its lifecycle.
      // 0 → 0.55: page travels from top of channel to scan line
      // 0.55 → 0.65: page collapses into a token at scan line
      // 0.65 → 1.0: token flies to the ledger
      // After 1.0: token sits in the ledger
      if (k < 0.55) {
        const tk = k / 0.55;
        const eased = easeInOutCubic(tk);
        const y = channelTop - pageH + (scanY - channelTop) * eased;
        drawPage(ctx!, pageX, y, pageW, pageH, p.lines, 1);
      } else if (k < 0.7) {
        const tk = (k - 0.55) / 0.15;
        // Page shrinks down into a small token at the scan line.
        const shrinkW = pageW + (cellSize() - pageW) * tk;
        const shrinkH = pageH + (cellSize() - pageH) * tk;
        const x = pageX + (pageW - shrinkW) / 2;
        const y = scanY - shrinkH / 2;
        const fadeLines = 1 - tk;
        drawPage(ctx!, x, y, shrinkW, shrinkH, p.lines, fadeLines);
        // Burst color hint just below
        ctx!.fillStyle = rgba(p.kind === "green" ? GREEN : RED, tk * 0.7);
        ctx!.fillRect(x, y, shrinkW, shrinkH);
      } else if (k < 1.0) {
        const tk = (k - 0.7) / 0.3;
        const eased = easeInOutCubic(tk);
        const startX = pageX + pageW / 2 - cellSize() / 2;
        const startY = scanY - cellSize() / 2;
        const slotIndex = ledgerSlot(p);
        const target = ledgerCellPos(slotIndex, ledgerLeft, padY, ledgerWidth, innerH);
        const x = startX + (target.x - startX) * eased;
        const y = startY + (target.y - startY) * eased;
        drawCell(ctx!, x, y, p.kind === "green" ? GREEN : RED, 0.95);
      } else {
        processed++;
        const slotIndex = ledgerSlot(p);
        const target = ledgerCellPos(slotIndex, ledgerLeft, padY, ledgerWidth, innerH);
        drawCell(ctx!, target.x, target.y, p.kind === "green" ? GREEN : RED, 0.95);
      }
    }

    // Counter on the ledger header
    const allDone = elapsed > TOTAL_DURATION;
    const reveal = allDone ? 1 : clamp01((elapsed - 4.0) / 1.2);
    if (reveal > 0) {
      const greenCount = PAGES.filter((p) => p.kind === "green").length;
      const redCount = PAGES.filter((p) => p.kind === "red").length;
      ctx!.fillStyle = rgba("#a1a1aa", reveal);
      ctx!.font = `${Math.max(10, Math.min(13, w * 0.012))}px "Geist Mono", ui-monospace, monospace`;
      ctx!.textBaseline = "top";
      ctx!.fillText(`${PAGES.length} sources`, ledgerLeft + 12, padY - 22);
      ctx!.fillText(`${greenCount} keep · ${redCount} cut`, ledgerLeft + 12, padY + innerH + 8);
    }

    if (elapsed > TOTAL_DURATION + 0.6) {
      done = true;
      return;
    }
    rafId = requestAnimationFrame(drawFrame);
  }

  // Helpers that depend on current canvas dimensions.
  function cellSize(): number {
    return Math.max(8, Math.min(14, w * 0.013));
  }

  function ledgerSlot(p: PageItem): number {
    return PAGES.indexOf(p);
  }

  function ledgerCellPos(
    index: number,
    left: number,
    top: number,
    width: number,
    height: number,
  ): { x: number; y: number } {
    const cs = cellSize();
    const gap = cs * 0.4;
    const cols = Math.max(1, Math.floor((width - 24) / (cs + gap)));
    const c = index % cols;
    const r = Math.floor(index / cols);
    return {
      x: left + 12 + c * (cs + gap),
      y: top + height - 12 - cs - r * (cs + gap),
    };
  }

  function drawPage(
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    pw: number,
    ph: number,
    lines: number,
    alpha: number,
  ): void {
    c.fillStyle = rgba("#15151a", alpha);
    c.fillRect(x, y, pw, ph);
    c.strokeStyle = rgba("#2a2a30", alpha);
    c.lineWidth = 1;
    c.strokeRect(x + 0.5, y + 0.5, pw - 1, ph - 1);
    c.fillStyle = rgba("#3a3a40", alpha * 0.9);
    const lineGap = ph / (lines + 2);
    for (let i = 0; i < lines; i++) {
      const ly = y + lineGap * (i + 1.2);
      const lw = pw * (0.7 + Math.sin(i * 1.7) * 0.15);
      c.fillRect(x + 8, ly, lw - 16, 1);
    }
  }

  function drawCell(
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    alpha: number,
  ): void {
    const cs = cellSize();
    c.fillStyle = rgba(color, alpha);
    c.fillRect(Math.floor(x), Math.floor(y), Math.floor(cs), Math.floor(cs));
  }

  function start(): void {
    if (started) return;
    resize();
    started = true;
    startedAt = performance.now();
    rafId = requestAnimationFrame(drawFrame);
  }

  function renderFinalState(): void {
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.fillStyle = BG;
    ctx!.fillRect(0, 0, w, h);
    const padX = w * 0.08;
    const padY = h * 0.1;
    const innerW = w - padX * 2;
    const innerH = h - padY * 2;
    const ledgerLeft = padX + innerW * 0.62;
    const ledgerWidth = innerW - innerW * 0.62;
    ctx!.strokeStyle = RULE;
    ctx!.strokeRect(ledgerLeft + 0.5, padY + 0.5, ledgerWidth - 1, innerH - 1);
    for (let i = 0; i < PAGES.length; i++) {
      const p = PAGES[i];
      const target = ledgerCellPos(i, ledgerLeft, padY, ledgerWidth, innerH);
      drawCell(ctx!, target.x, target.y, p.kind === "green" ? GREEN : RED, 0.95);
    }
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

  // Initial paint shows the empty stage; animation triggers on viewport entry.
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
      rafId = requestAnimationFrame(drawFrame);
    }
  });
}
