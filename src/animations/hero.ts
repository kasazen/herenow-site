/**
 * Hero animation: black box → reveal hidden green/red pixels → sort
 * greens to the top, expel reds outside → reds pixelate and vanish →
 * greens propagate row by row until the box is fully green.
 *
 * Built with vanilla rAF + Canvas. ~5 seconds end-to-end.
 */

type Phase = "idle" | "breathe" | "reveal" | "sort" | "purge" | "spread" | "settled";

interface Pixel {
  // grid position within the GRID×GRID matrix (0..GRID-1)
  col: number;
  row: number;
  // current rendered position (in pixel space, relative to box top-left)
  x: number;
  y: number;
  // sort destination (in pixel space, relative to box top-left). For reds,
  // this is somewhere outside the box.
  destX: number;
  destY: number;
  // color identity
  kind: "noise" | "green" | "red";
  // 0..1 intensity used during reveal/purge
  intensity: number;
  // jitter offsets for the "expelled" red drift
  jitterPhase: number;
}

const GRID = 24;
const GREEN = "#34d399";
const RED = "#f87171";
const NOISE = "#1a1a1a";
const BG = "#0a0a0a";

// Phase boundaries in seconds
const T_BREATHE = 0.9;
const T_REVEAL = 1.6;
const T_SORT = 2.9;
const T_PURGE = 3.6;
const T_SPREAD = 5.0;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

function seedPixels(): Pixel[] {
  const pixels: Pixel[] = [];
  // ~14% green, ~7% red, rest noise. Greens cluster slightly so the sort
  // feels like discovery, not pure randomness.
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const r = Math.random();
      let kind: Pixel["kind"] = "noise";
      if (r < 0.14) kind = "green";
      else if (r < 0.21) kind = "red";
      pixels.push({
        col,
        row,
        x: 0,
        y: 0,
        destX: 0,
        destY: 0,
        kind,
        intensity: 0,
        jitterPhase: Math.random() * Math.PI * 2,
      });
    }
  }
  return pixels;
}

function assignDestinations(pixels: Pixel[], cell: number, boxSize: number): void {
  // Greens fill the top rows in reading order. Noise fills below the greens.
  // Reds get random destinations outside the box (left/right margins).
  const greens = pixels.filter((p) => p.kind === "green");
  const noise = pixels.filter((p) => p.kind === "noise");
  const reds = pixels.filter((p) => p.kind === "red");

  const sorted = [...greens, ...noise];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    const r = Math.floor(i / GRID);
    const c = i % GRID;
    p.destX = c * cell;
    p.destY = r * cell;
  }

  for (const p of reds) {
    // Pick a random angle pointing outward, push them past the box edge.
    const side = Math.random();
    const margin = boxSize * 0.35;
    if (side < 0.5) {
      // Left
      p.destX = -margin - Math.random() * margin * 0.6;
      p.destY = Math.random() * boxSize;
    } else {
      // Right
      p.destX = boxSize + Math.random() * margin * 0.6;
      p.destY = Math.random() * boxSize;
    }
  }
}

function pixelColor(p: Pixel, alpha: number): string {
  let base: string;
  if (p.kind === "green") base = GREEN;
  else if (p.kind === "red") base = RED;
  else base = NOISE;

  // Build rgba from hex
  const r = parseInt(base.slice(1, 3), 16);
  const g = parseInt(base.slice(3, 5), 16);
  const b = parseInt(base.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function mountHero(canvas: HTMLCanvasElement, onComplete: () => void): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pixels = seedPixels();
  let phase: Phase = "idle";
  let phaseStart = 0;
  let started = false;
  let completed = false;
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
    // Initial position is collapsed inside the box (we'll spawn from a
    // tight center scatter when reveal begins; for breathe, we draw the
    // solid box instead).
    for (const p of pixels) {
      p.x = p.col * cell;
      p.y = p.row * cell;
    }
  }

  function setPhase(next: Phase, t: number): void {
    phase = next;
    phaseStart = t;
  }

  function drawSolidBox(scale: number): void {
    ctx!.fillStyle = "#0a0a0a";
    const w = boxSize * scale;
    const h = boxSize * scale;
    const x = originX + (boxSize - w) / 2;
    const y = originY + (boxSize - h) / 2;
    // Subtle outline to anchor the box in the dark background
    ctx!.fillStyle = "#0e0e10";
    ctx!.fillRect(x, y, w, h);
    ctx!.strokeStyle = "rgba(255,255,255,0.06)";
    ctx!.lineWidth = 1;
    ctx!.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  }

  function drawPixel(p: Pixel, alpha: number): void {
    const px = originX + p.x;
    const py = originY + p.y;
    ctx!.fillStyle = pixelColor(p, alpha);
    // Subtract a 1px gap between pixels for a crisp grid feel
    ctx!.fillRect(Math.floor(px), Math.floor(py), Math.max(1, Math.floor(cell - 1)), Math.max(1, Math.floor(cell - 1)));
  }

  function frame(now: number): void {
    if (!started) return;
    const t = (now - phaseStart) / 1000;
    const elapsed = (now - startedAt) / 1000;

    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.clearRect(0, 0, cssSize, cssSize);
    // Background
    ctx!.fillStyle = BG;
    ctx!.fillRect(0, 0, cssSize, cssSize);

    if (phase === "breathe") {
      const k = clamp01(t / T_BREATHE);
      // Slight scale pulse (1 → 1.02 → 1)
      const pulse = 1 + Math.sin(k * Math.PI * 2) * 0.012;
      drawSolidBox(pulse);
      if (t >= T_BREATHE) setPhase("reveal", now);
    } else if (phase === "reveal") {
      const k = clamp01(t / (T_REVEAL - T_BREATHE));
      const eased = easeOutCubic(k);
      // Draw box getting eaten away as pixels appear
      drawSolidBox(1 - eased * 0.05);
      // Reveal pixels with rising intensity
      for (const p of pixels) {
        // Stagger reveal by row+col so it feels organic
        const stagger = ((p.row + p.col) % 8) / 8;
        const local = clamp01((eased - stagger * 0.4) * 1.6);
        if (local <= 0) continue;
        const colored = p.kind !== "noise";
        const alpha = colored ? local * 0.95 : local * 0.55;
        drawPixel(p, alpha);
      }
      if (t >= T_REVEAL - T_BREATHE) setPhase("sort", now);
    } else if (phase === "sort") {
      const k = clamp01(t / (T_SORT - T_REVEAL));
      const eased = easeInOutCubic(k);
      for (const p of pixels) {
        const startX = p.col * cell;
        const startY = p.row * cell;
        p.x = startX + (p.destX - startX) * eased;
        p.y = startY + (p.destY - startY) * eased;
        const colored = p.kind !== "noise";
        const alpha = colored ? 0.95 : 0.55;
        drawPixel(p, alpha);
      }
      if (t >= T_SORT - T_REVEAL) setPhase("purge", now);
    } else if (phase === "purge") {
      const k = clamp01(t / (T_PURGE - T_SORT));
      // Reds jitter and fade. Greens + noise sit in their sorted positions.
      for (const p of pixels) {
        if (p.kind === "red") {
          const wobble = Math.sin(now / 60 + p.jitterPhase) * 2 * (1 - k);
          const px = p.destX + wobble;
          const py = p.destY + wobble;
          const alpha = (1 - k) * 0.95;
          // Pixelate-out: shrink the rect as it fades
          const shrink = Math.max(1, (cell - 1) * (1 - k));
          ctx!.fillStyle = pixelColor(p, alpha);
          ctx!.fillRect(
            Math.floor(originX + px + (cell - shrink) / 2),
            Math.floor(originY + py + (cell - shrink) / 2),
            Math.floor(shrink),
            Math.floor(shrink),
          );
        } else {
          drawPixel(p, p.kind === "green" ? 0.95 : 0.55);
        }
      }
      if (t >= T_PURGE - T_SORT) setPhase("spread", now);
    } else if (phase === "spread") {
      const k = clamp01(t / (T_SPREAD - T_PURGE));
      const eased = easeInOutCubic(k);
      // The greens already occupy the top N rows. Spread converts noise
      // pixels (which are below the greens) to green, row by row.
      const greenCount = pixels.filter((p) => p.kind === "green").length;
      const greenRowsFull = Math.floor(greenCount / GRID);
      const remainingRows = GRID - greenRowsFull;
      const rowsToFill = Math.ceil(remainingRows * eased);

      for (const p of pixels) {
        if (p.kind === "red") continue;
        // Where is this pixel in the sorted order?
        const sortedIndex = Math.round(p.destY / cell) * GRID + Math.round(p.destX / cell);
        const sortedRow = Math.floor(sortedIndex / GRID);
        const isGreenZone = sortedRow < greenRowsFull;
        const isFilled = sortedRow < greenRowsFull + rowsToFill;
        if (isGreenZone || isFilled) {
          // Render as green
          const alpha = isGreenZone ? 0.95 : 0.85;
          ctx!.fillStyle = pixelColor({ ...p, kind: "green" }, alpha);
          ctx!.fillRect(
            Math.floor(originX + p.destX),
            Math.floor(originY + p.destY),
            Math.max(1, Math.floor(cell - 1)),
            Math.max(1, Math.floor(cell - 1)),
          );
        } else {
          drawPixel(p, 0.55);
        }
      }
      if (t >= T_SPREAD - T_PURGE) {
        setPhase("settled", now);
      }
    } else if (phase === "settled") {
      // Steady green field with a gentle breathing alpha
      const breath = 0.92 + Math.sin(elapsed * 1.4) * 0.04;
      for (const p of pixels) {
        if (p.kind === "red") continue;
        ctx!.fillStyle = pixelColor({ ...p, kind: "green" }, breath);
        ctx!.fillRect(
          Math.floor(originX + p.destX),
          Math.floor(originY + p.destY),
          Math.max(1, Math.floor(cell - 1)),
          Math.max(1, Math.floor(cell - 1)),
        );
      }
      if (!completed) {
        completed = true;
        onComplete();
      }
    }

    rafId = requestAnimationFrame(frame);
  }

  let rafId = 0;
  let startedAt = 0;

  function start(): void {
    if (started) return;
    started = true;
    startedAt = performance.now();
    setPhase("breathe", startedAt);
    rafId = requestAnimationFrame(frame);
  }

  function renderFinalState(): void {
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.fillStyle = BG;
    ctx!.fillRect(0, 0, cssSize, cssSize);
    for (const p of pixels) {
      if (p.kind === "red") continue;
      ctx!.fillStyle = pixelColor({ ...p, kind: "green" }, 0.92);
      ctx!.fillRect(
        Math.floor(originX + p.destX),
        Math.floor(originY + p.destY),
        Math.max(1, Math.floor(cell - 1)),
        Math.max(1, Math.floor(cell - 1)),
      );
    }
  }

  resize();
  window.addEventListener("resize", () => {
    resize();
    if (!started) {
      // Re-render the breathing solid box at idle
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.fillStyle = BG;
      ctx!.fillRect(0, 0, cssSize, cssSize);
      drawSolidBox(1);
    }
  });

  if (reduced) {
    renderFinalState();
    onComplete();
    return;
  }

  // Initial paint: solid box, before IO triggers start.
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, cssSize, cssSize);
  drawSolidBox(1);

  // Start when the canvas enters the viewport (covers reload at scroll
  // position other than top).
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

  // Stop the animation if the tab is hidden so we don't burn battery.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    } else if (!document.hidden && started && !completed) {
      rafId = requestAnimationFrame(frame);
    }
  });
}
