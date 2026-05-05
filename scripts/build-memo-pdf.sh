#!/usr/bin/env bash
# Build the typeset PDF for /sample-memo.pdf using the system Chrome
# in headless mode. The page itself carries the print CSS in
# app/globals.css; this script just wires Chrome to a running server.
#
# Usage: npm run build:memo-pdf
# Requires: Google Chrome installed at the standard macOS path.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

PORT=4150
URL="http://localhost:${PORT}/ai-action-plan"
OUT="public/ai-action-plan.pdf"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

if [[ ! -x "$CHROME" ]]; then
  echo "✗ Google Chrome not found at: $CHROME" >&2
  echo "  Install Chrome or edit scripts/build-memo-pdf.sh to point at another browser." >&2
  exit 1
fi

if [[ ! -d ".next" ]]; then
  echo "→ No .next build found; running next build first..."
  npx next build
fi

echo "→ Starting next start on port ${PORT}..."
npx next start -p "${PORT}" > /tmp/memo-pdf-server.log 2>&1 &
SERVER_PID=$!

cleanup() {
  if kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

# Wait for the server to come up. ~10 seconds max.
for i in {1..40}; do
  if /usr/bin/curl -fs "$URL" -o /dev/null 2>/dev/null; then
    echo "→ Server ready (after ${i} attempts)."
    break
  fi
  sleep 0.25
  if [[ "$i" == "40" ]]; then
    echo "✗ Server did not come up. Logs:" >&2
    tail -30 /tmp/memo-pdf-server.log >&2 || true
    exit 1
  fi
done

# Small extra delay for fonts to settle in headless render.
sleep 1

echo "→ Rendering PDF to ${OUT}..."
"$CHROME" \
  --headless=new \
  --disable-gpu \
  --no-sandbox \
  --hide-scrollbars \
  --print-to-pdf="${ROOT_DIR}/${OUT}" \
  --no-pdf-header-footer \
  --virtual-time-budget=10000 \
  "$URL"

echo "✓ Wrote ${OUT}"
ls -lh "${OUT}"
