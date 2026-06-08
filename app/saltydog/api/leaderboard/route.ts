import { NextRequest, NextResponse } from "next/server";
import { topN } from "../../_lib/leaderboard";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = Math.max(1, Math.min(parseInt(limitParam || "20", 10) || 20, 200));
  const crew = await topN(limit);
  return NextResponse.json({ crew, limit });
}
