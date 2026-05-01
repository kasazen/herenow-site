#!/usr/bin/env node
// Render OG image + favicons to /public/ via headless Chrome.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..", "..");
const publicDir = join(repoRoot, "public");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
if (!existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME}. Install Chrome or regenerate manually.`);
  process.exit(1);
}

const targets = [
  { src: "og-image.html", out: "og-image.png", w: 1200, h: 630, networkWait: true },
  { src: "apple-touch-icon.svg", out: "apple-touch-icon.png", w: 180, h: 180 },
  { src: "favicon-32.svg", out: "favicon-32.png", w: 32, h: 32 },
  { src: "favicon-16.svg", out: "favicon-16.png", w: 16, h: 16 },
];

const tmp = mkdtempSync(join(tmpdir(), "og-render-"));

for (const t of targets) {
  const src = `file://${join(__dirname, t.src)}`;
  const tmpOut = join(tmp, t.out);
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--default-background-color=00000000",
    `--window-size=${t.w},${t.h}`,
    `--screenshot=${tmpOut}`,
  ];
  if (t.networkWait) {
    args.push("--virtual-time-budget=4000");
  }
  args.push(src);

  console.log(`rendering ${t.src} → ${t.out} (${t.w}×${t.h})`);
  execFileSync(CHROME, args, { stdio: "inherit" });
  copyFileSync(tmpOut, join(publicDir, t.out));
}

rmSync(tmp, { recursive: true, force: true });
console.log("done.");
