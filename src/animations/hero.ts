/**
 * Hero animation.
 *
 * Story: a black box → reveal hidden green/red pixels → sort greens to
 * the top of the grid, reds to the bottom of the grid → reds drift out
 * past the box edge and pixelate away → green floods down through the
 * (formerly red) rows until the entire box is green.
 *
 * Vanilla rAF + Canvas, ~5s end-to-end. Reduced-motion users see the
 * settled state immediately.
 */

type Phase = "idle" | "breathe" | "reveal" | "sort" | "purge" | "spread" | "settled";

interface Pixel {
  col: number;
  row: number;
  // Current rendered position (pixel space, relative to box top-left).
  x: number;
  y: number;
  // Sorted destination inside the grid.
  destX: number;
  destY: number;
  // For reds only: the position outside the box they drift toward during
  // the purge phase. For greens, equal to destX/destY (no movement).
  expelX: number;
  expelY: number;
  kind: "green" | "red";
  jitterPhase: number;
}

const GRID = 24;
const GREEN_RATIO = 0.72;
const GREEN = "#34d399";
const RED = "#f87171";
const BG = "#0a0a0a";
const BOX = "#0e0e10";

const T_BREATHE = 0.9;
const T_REVEAL = 1.7;
const T_SORT = 3.0;
const T_PURGE = 3.9;
const T_SPREAD = 5.2;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

function seedPixels(): Pixel[] {
  const pixels: Pixel[] = [];
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      pixels.push({
        col,
        row,
        x: 0,
        y: 0,
        destX: 0,
        destY: 0,
        expelX: 0,
        expelY: 0,
        kind: Math.random() < GREEN_RATIO ? "green" : "red",
        jitterPhase: Math.random() * Math.PI * 2,
      });
    }
  }
  return pixels;
}

function assignDestinations(pixels: Pixel[], cell: number, boxSize: number): void {
  // Stable order: walk the grid in reading order, assign greens to the
  // top G cells and reds to the remaining cells. Every grid cell ends
  // up with exactly one pixel.
  const greens = pixels.filter((p) => p.kind === "green");
  const reds = pixels.filter((p) => p.kind === "red");

  for (let i = 0; i < greens.length; i++) {
    const p = greens[i];
    const r = Math.floor(i / GRID);
    const c = i % GRID;
    p.destX = c * cell;
    p.destY = r * cell;
    p.expelX = p.destX;
    p.expelY = p.destY;
  }

  for (let i = 0; i < reds.length; i++) {
    const p = reds[i];
    const offset = greens.length + i;
    const r = Math.floor(offset / GRID);
    const c = offset % GRID;
    p.destX = c * cell;
    p.destY = r * cell;

    // Expel toward whichever side is closer, with a slight vertical drift.
    const margin = boxSize * 0.45;
    const goLeft = p.destX < boxSize / 2;
    p.expelX = goLeft
      ? -margin - Math.random() * margin * 0.6
      : boxSize + Math.random() * margin * 0.6;
    p.expelY = p.destY + (Math.random() - 0.5) * boxSize * 0.5;
  }
}

function rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function mountHero(canvas: HTMLCanvasElement, onComplete: () => void): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pixels = seedPixels();
  const greenCount = pixels.filter((p) => p.kind === "green").length;
  const greenRowsFull = Math.floor(greenCount / GRID);
  const greenInLastRow = greenCount - greenRowsFull * GRID;

  let phase: Phase = "idle";
  let phaseStart = 0;
  let started = false;
  let completed = false;
  let startedAt = 0;
  let rafId = 0;
  let dpr = 1;
  let cssSize = 0;
  let cell = 0;
  let boxSize = 0;
  let originX = 0;
  let originY = 0;

  function resize(): void {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    cssSize = Math.min(rect.width, rect.height);
    canvas.width = Math.floor(cssSize * dpr);
    canvas.height = Math.floor(cssSize * dpr);
    canvas.style.width = `${cssSize}px`;
    canvas.style.height = `${cssSize}px`;
    boxSize = cssSize * 0.7;
    cell = boxSize / GRID;
    originX = (cssSize - boxSize) / 2;
    originY = (cssSize - boxSize) / 2;
    assignDestinations(pixels, cell, boxSize);
    for (const p of pixels) {
      p.x = p.col * cell;
      p.y = p.row * cell;
    }
  }

  function setPhase(next: Phase, t: number): void {
    phase = next;
    phaseStart = t;
  }

  function clear(): void {
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.fillStyle = BG;
    ctx!.fillRect(0, 0, cssSize, cssSize);
  }

  function drawSolidBox(scale: number): void {
    const w = boxSize * scale;
    const h = boxSize * scale;
    const x = originX + (boxSize - w) / 2;
    const y = originY + (boxSize - h) / 2;
    ctx!.fillStyle = BOX;
    ctx!.fillRect(x, y, w, h);
    ctx!.strokeStyle = "rgba(255,255,255,0.06)";
    ctx!.lineWidth = 1;
    ctx!.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  }

  function drawCell(x: number, y: number, color: string, alpha: number, size: number = cell - 1): void {
    ctx!.fillStyle = rgba(color, alpha);
    ctx!.fillRect(
      Math.floor(originX + x),
      Math.floor(originY + y),
      Math.max(1, Math.floor(size)),
      Math.max(1, Math.floor(size)),
    );
  }

  function frame(now: number): void {
    if (!started) return;
    const t = (now - phaseStart) / 1000;
    const elapsed = (now - startedAt) / 1000;
    clear();

    if (phase === "breathe") {
      const k = clamp01(t / T_BREATHE);
      const pulse = 1 + Math.sin(k * Math.PI * 2) * 0.012;
      drawSolidBox(pulse);
      if (t >= T_BREATHE) setPhase("reveal", now);
    } else if (phase === "reveal") {
      const dur = T_REVEAL - T_BREATHE;
      const k = clamp01(t / dur);
      const eased = easeOutCubic(k);
      drawSolidBox(1 - eased * 0.04);
      for (const p of pixels) {
        const stagger = ((p.row + p.col) % 8) / 8;
        const local = clamp01((eased - stagger * 0.4) * 1.6);
        if (local <= 0) continue;
        drawCell(p.col * cell, p.row * cell, p.kind === "green" ? GREEN : RED, local * 0.95);
      }
      if (t >= dur) setPhase("sort", now);
    } else if (phase === "sort") {
      const dur = T_SORT - T_REVEAL;
      const k = clamp01(t / dur);
      const eased = easeInOutCubic(k);
      for (const p of pixels) {
        const startX = p.col * cell;
        const startY = p.row * cell;
        const x = startX + (p.destX - startX) * eased;
        const y = startY + (p.destY - startY) * eased;
        drawCell(x, y, p.kind === "green" ? GREEN : RED, 0.95);
      }
      if (t >= dur) setPhase("purge", now);
    } else if (phase === "purge") {
      const dur = T_PURGE - T_SORT;
      const k = clamp01(t / dur);
      const eased = easeInOutCubic(k);
      // Greens hold position. Reds drift to expel positions, shrink, fade.
      for (const p of pixels) {
        if (p.kind === "green") {
          drawCell(p.destX, p.destY, GREEN, 0.95);
          continue;
        }
        const wobble = Math.sin(now / 70 + p.jitterPhase) * 1.5;
        const x = p.destX + (p.expelX - p.destX) * eased + wobble;
        const y = p.destY + (p.expelY - p.destY) * eased;
        const alpha = (1 - k) * 0.95;
        const size = Math.max(1, (cell - 1) * (1 - k * 0.7));
        drawCell(x, y, RED, alpha, size);
      }
      if (t >= dur) setPhase("spread", now);
    } else if (phase === "spread") {
      const dur = T_SPREAD - T_PURGE;
      const k = clamp01(t / dur);
      const eased = easeInOutCubic(k);
      // Determine how many "red zone" rows have been converted to green so far.
      const totalRows = GRID;
      const redZoneStartRow = greenRowsFull;
      const redZoneRowCount = totalRows - redZoneStartRow;
      const filledRedRows = redZoneRowCount * eased;

      for (const p of pixels) {
        const cellRow = Math.round(p.destY / cell);
        const cellCol = Math.round(p.destX / cell);

        // Already-green zone: solid green.
        if (cellRow < redZoneStartRow) {
          drawCell(p.destX, p.destY, GREEN, 0.95);
          continue;
        }

        // First partial green row (mixed greens+reds inherently): fully green.
        if (cellRow === redZoneStartRow && cellCol < greenInLastRow) {
          drawCell(p.destX, p.destY, GREEN, 0.95);
          continue;
        }

        // Red-zone rows: progressively flooded with green, top-down.
        const distanceIntoRedZone = cellRow - redZoneStartRow;
        if (distanceIntoRedZone < filledRedRows) {
          // Brightness ramp on the leading row for a "sweep" feel.
          const isLeadingRow =
            distanceIntoRedZone >= Math.floor(filledRedRows) &&
            distanceIntoRedZone < Math.ceil(filledRedRows);
          const alpha = isLeadingRow ? 0.6 + 0.35 * (filledRedRows - Math.floor(filledRedRows)) : 0.95;
          drawCell(p.destX, p.destY, GREEN, alpha);
        }
        // Cells past the leading edge stay dark — the red has gone, no green yet.
      }

      if (t >= dur) setPhase("settled", now);
    } else if (phase === "settled") {
      const breath = 0.9 + Math.sin(elapsed * 1.3) * 0.05;
      for (const p of pixels) {
        drawCell(p.destX, p.destY, GREEN, breath);
      }
      if (!completed) {
        completed = true;
        onComplete();
      }
    }

    rafId = requestAnimationFrame(frame);
  }

  function renderFinalState(): void {
    clear();
    for (const p of pixels) {
      drawCell(p.destX, p.destY, GREEN, 0.92);
    }
  }

  function start(): void {
    if (started) return;
    started = true;
    startedAt = performance.now();
    setPhase("breathe", startedAt);
    rafId = requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", () => {
    resize();
    if (!started) {
      clear();
      drawSolidBox(1);
    }
  });

  if (reduced) {
    renderFinalState();
    onComplete();
    return;
  }

  clear();
  drawSolidBox(1);

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
    } else if (!document.hidden && started && !completed) {
      rafId = requestAnimationFrame(frame);
    }
  });
}
