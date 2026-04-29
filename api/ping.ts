// Minimal sanity-check endpoint. No imports, no env, no fetch.
// If this 404s or crashes, the issue is fundamental Vercel routing.

export default async function handler(): Promise<Response> {
  return new Response(
    JSON.stringify({
      pong: true,
      time: new Date().toISOString(),
      runtime: "node-web-api",
    }),
    { status: 200, headers: { "content-type": "application/json", "cache-control": "no-store" } },
  );
}
