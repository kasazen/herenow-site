/**
 * Hero animation — SVG-based, CSS-driven, looping.
 *
 * Generates a 16×16 grid of rect elements with per-cell CSS variables
 * for origin/sort positions. Two CSS keyframe animations (one for green
 * cells, one for red) handle the entire sequence: appear at random
 * positions inside the box → migrate to sorted destinations → reds
 * fade and drift out → "fill" rects sweep in row-by-row to flood the
 * vacated red zone with green → fade out so the loop resets cleanly.
 *
 * No canvas, no IntersectionObserver, no rAF. CSS keyframes loop
 * forever and the browser handles compositing on the GPU.
 */

const GRID = 16;
const CELL = 15;
const GAP = 1;
const BOX_SIZE = GRID * CELL;
const BOX_OFFSET = 40;
const VIEWBOX = BOX_SIZE + BOX_OFFSET * 2;
const GREEN_RATIO = 0.74;
const SVG_NS = "http://www.w3.org/2000/svg";

interface Cell {
  kind: "green" | "red";
  originX: number;
  originY: number;
  sortX: number;
  sortY: number;
  sortRow: number;
}

function makeCells(): Cell[] {
  const cells: Cell[] = [];
  for (let i = 0; i < GRID * GRID; i++) {
    cells.push({
      kind: Math.random() < GREEN_RATIO ? "green" : "red",
      originX: 0,
      originY: 0,
      sortX: 0,
      sortY: 0,
      sortRow: 0,
    });
  }

  // Sort destinations: greens fill the top of the grid in reading order,
  // reds fill the rest.
  const greens = cells.filter((c) => c.kind === "green");
  const reds = cells.filter((c) => c.kind === "red");

  for (let i = 0; i < greens.length; i++) {
    const r = Math.floor(i / GRID);
    const col = i % GRID;
    greens[i].sortX = BOX_OFFSET + col * CELL;
    greens[i].sortY = BOX_OFFSET + r * CELL;
    greens[i].sortRow = r;
  }
  for (let i = 0; i < reds.length; i++) {
    const offset = greens.length + i;
    const r = Math.floor(offset / GRID);
    const col = offset % GRID;
    reds[i].sortX = BOX_OFFSET + col * CELL;
    reds[i].sortY = BOX_OFFSET + r * CELL;
    reds[i].sortRow = r;
  }

  // Random origin within the box for each cell.
  for (const c of cells) {
    c.originX = BOX_OFFSET + Math.floor(Math.random() * GRID) * CELL;
    c.originY = BOX_OFFSET + Math.floor(Math.random() * GRID) * CELL;
  }

  return cells;
}

export function mountHero(svg: SVGSVGElement): void {
  svg.setAttribute("viewBox", `0 0 ${VIEWBOX} ${VIEWBOX}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  const cells = makeCells();
  const reds = cells.filter((c) => c.kind === "red");
  const firstRedRow = Math.min(...reds.map((c) => c.sortRow));

  // Background frame — a faint outline of the box, always visible.
  const frame = document.createElementNS(SVG_NS, "rect");
  frame.setAttribute("x", String(BOX_OFFSET));
  frame.setAttribute("y", String(BOX_OFFSET));
  frame.setAttribute("width", String(BOX_SIZE));
  frame.setAttribute("height", String(BOX_SIZE));
  frame.setAttribute("class", "hero-frame");
  svg.appendChild(frame);

  for (const c of cells) {
    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttribute("width", String(CELL - GAP));
    rect.setAttribute("height", String(CELL - GAP));
    rect.setAttribute("class", `hero-pixel hero-pixel--${c.kind}`);
    rect.style.setProperty("--ox", `${c.originX}px`);
    rect.style.setProperty("--oy", `${c.originY}px`);
    rect.style.setProperty("--sx", `${c.sortX}px`);
    rect.style.setProperty("--sy", `${c.sortY}px`);
    svg.appendChild(rect);
  }

  // Fill rects: invisible green pixels positioned at each red's sort
  // destination. They sweep in row-by-row during the spread phase to
  // flood the vacated red zone.
  for (const r of reds) {
    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttribute("width", String(CELL - GAP));
    rect.setAttribute("height", String(CELL - GAP));
    rect.setAttribute("class", "hero-fill");
    rect.style.setProperty("--sx", `${r.sortX}px`);
    rect.style.setProperty("--sy", `${r.sortY}px`);
    // Row delay: top red rows fill first.
    const rowOffset = r.sortRow - firstRedRow;
    rect.style.setProperty("--row-delay", `${rowOffset * 0.06}s`);
    svg.appendChild(rect);
  }
}
