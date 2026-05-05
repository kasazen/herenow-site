export function POST() {
  return Response.json({ pong: true, format: "node-classic", time: new Date().toISOString() });
}
