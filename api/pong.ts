// Express-style Vercel Node handler (the most well-trodden path).
// If this works and /api/ping doesn't, the issue is Edge runtime detection.

import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse): void {
  res.status(200).json({ pong: true, format: "node-classic", time: new Date().toISOString() });
}
