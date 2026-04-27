/**
 * Wedge animation.
 *
 * A single source node on the left labeled "Audit". Lines stroke
 * outward to three intermediate nodes; from each, secondary lines
 * branch to leaf nodes labeled with the kind of follow-on builds we
 * actually do. The point is to show that the audit is the door, not
 * the destination.
 */

const BG = "#0a0a0a";
const RULE = "#1f1f23";
const TEXT = "#a1a1aa";
const FAINT = "#3a3a40";
const ACCENT = "#34d399";
const FG = "#f5f5f4";

interface Node {
  x: number; // 0..1, fraction of width
  y: number; // 0..1, fraction of height
  label: string;
  level: 0 | 1 | 2;
}

interface Edge {
  from: number;
  to: number;
  appearAt: number; // seconds from start
}

const NODES: Node[] = [
  { x: 0.08, y: 0.5, label: "Audit", level: 0 },

  { x: 0.42, y: 0.22, label: "Contract review", level: 1 },
  { x: 0.42, y: 0.5, label: "Vendor consolidation", level: 1 },
  { x: 0.42, y: 0.78, label: "Pricing model", level: 1 },

  { x: 0.78, y: 0.12, label: "Custom intake tool", level: 2 },
  { x: 0.78, y: 0.32, label: "MSA risk dashboard", level: 2 },
  { x: 0.78, y: 0.5, label: "Integrations layer", level: 2 },
  { x: 0.78, y: 0.66, label: "Bid forecaster", level: 2 },
  { x: 0.78, y: 0.86, label: "Renewal agent", level: 2 },
];

const EDGES: Edge[] = [
  { from: 0, to: 1, appearAt: 0.4 },
  { from: 0, to: 2, appearAt: 0.7 },
  { from: 0, to: 3, appearAt: 1.0 },

  { from: 1, to: 4, appearAt: 1.6 },
  { from: 1, to: 5, appearAt: 1.9 },

  { from: 2, to: 6, appearAt: 2.2 },

  { from: 3, to: 7, appearAt: 2.5 },
  { from: 3, to: 8, appearAt: 2.8 },
];

const NODE_REVEAL_DELAY = 0.18;
const TOTAL = 4.0;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

function rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function mountWedge(canvas: HTMLCanvasElement): void {
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

  function nodePos(n: Node): { x: number; y: number } {
    const padX = w * 0.04;
    const padY = h * 0.08;
    return {
      x: padX + (w - padX * 2) * n.x,
      y: padY + (h - padY * 2) * n.y,
    };
  }

  function nodeRadius(n: Node): number {
    const base = Math.min(w, h);
    if (n.level === 0) return base * 0.025;
    if (n.level === 1) return base * 0.018;
    return base * 0.012;
  }

  function draw(now: number): void {
    const elapsed = (now - startedAt) / 1000;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.fillStyle = BG;
    ctx!.fillRect(0, 0, w, h);

    const fontBase = Math.max(10, Math.min(13, w * 0.011));
    ctx!.font = `${fontBase}px "Geist Mono", ui-monospace, monospace`;
    ctx!.textBaseline = "middle";
    ctx!.lineCap = "round";

    // Edges first, so nodes overlay them.
    for (const edge of EDGES) {
      const k = clamp01((elapsed - edge.appearAt) / 0.5);
      if (k <= 0) continue;
      const a = nodePos(NODES[edge.from]);
      const b = nodePos(NODES[edge.to]);
      const ra = nodeRadius(NODES[edge.from]);
      const rb = nodeRadius(NODES[edge.to]);
      const eased = easeOutCubic(k);
      // Start just past the source node's radius
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy);
      const ux = dx / len;
      const uy = dy / len;
      const startX = a.x + ux * ra;
      const startY = a.y + uy * ra;
      const endTargetX = b.x - ux * rb;
      const endTargetY = b.y - uy * rb;
      const endX = startX + (endTargetX - startX) * eased;
      const endY = startY + (endTargetY - startY) * eased;

      ctx!.strokeStyle = rgba(RULE, 0.85);
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.moveTo(startX, startY);
      ctx!.lineTo(endX, endY);
      ctx!.stroke();

      // A faint accent dot rides the leading edge while the line is drawing.
      if (k < 1 && k > 0.05) {
        ctx!.fillStyle = rgba(ACCENT, (1 - k) * 0.9);
        ctx!.beginPath();
        ctx!.arc(endX, endY, 1.5, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    // Source node always visible from t=0
    drawNode(0, 1, elapsed);

    // Other nodes appear shortly after their incoming edge starts.
    for (let i = 1; i < NODES.length; i++) {
      const edge = EDGES.find((e) => e.to === i);
      const reveal = edge ? edge.appearAt + NODE_REVEAL_DELAY : 0;
      const k = clamp01((elapsed - reveal) / 0.5);
      if (k <= 0) continue;
      drawNode(i, k, elapsed);
    }

    if (elapsed > TOTAL + 0.4) {
      done = true;
      return;
    }
    rafId = requestAnimationFrame(draw);
  }

  function drawNode(idx: number, k: number, elapsed: number): void {
    const n = NODES[idx];
    const pos = nodePos(n);
    const r = nodeRadius(n);
    const eased = easeOutCubic(k);
    const fillA = eased;

    if (n.level === 0) {
      // The Audit node is filled with accent color and pulses gently.
      const pulse = 0.85 + Math.sin(elapsed * 1.5) * 0.1;
      ctx!.fillStyle = rgba(ACCENT, fillA * pulse);
      ctx!.beginPath();
      ctx!.arc(pos.x, pos.y, r * eased, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = rgba(FG, fillA);
    } else if (n.level === 1) {
      ctx!.fillStyle = rgba(BG, fillA);
      ctx!.strokeStyle = rgba(ACCENT, fillA * 0.8);
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.arc(pos.x, pos.y, r * eased, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.stroke();
      ctx!.fillStyle = rgba(TEXT, fillA);
    } else {
      ctx!.fillStyle = rgba(BG, fillA);
      ctx!.strokeStyle = rgba(FAINT, fillA);
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.arc(pos.x, pos.y, r * eased, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.stroke();
      ctx!.fillStyle = rgba(TEXT, fillA * 0.8);
    }

    // Label
    const labelOffset = r + 10;
    const labelX = n.level === 0 ? pos.x - labelOffset : pos.x + labelOffset;
    const align: CanvasTextAlign = n.level === 0 ? "right" : "left";
    ctx!.textAlign = align;
    ctx!.fillText(n.label, labelX, pos.y);
  }

  function renderFinalState(): void {
    startedAt = performance.now() - TOTAL * 1000;
    draw(performance.now());
  }

  function start(): void {
    if (started) return;
    started = true;
    startedAt = performance.now();
    rafId = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", () => {
    resize();
    if (done) renderFinalState();
  });

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
