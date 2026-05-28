import { NextResponse, type NextRequest } from "next/server";
import {
  readPlaybackState,
  writePlaybackState,
  type PlaybackState,
} from "@/lib/spotify";
import { USER_IDS, type UserId } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/spotify/state
 *   → returns the current shared PlaybackState
 *
 * POST /api/spotify/state
 *   body: Partial<PlaybackState> with at minimum { dj }
 *   → merges updates and writes back. Caller is responsible for setting
 *     positionUpdatedAt/updatedAt — but we re-stamp updatedAt server-side
 *     so the clock is authoritative.
 */
export async function GET() {
  const state = await readPlaybackState();
  return NextResponse.json(state, {
    headers: { "Cache-Control": "no-store" },
  });
}

function isUserId(v: unknown): v is UserId {
  return typeof v === "string" && (USER_IDS as readonly string[]).includes(v);
}

export async function POST(req: NextRequest) {
  let body: Partial<PlaybackState>;
  try {
    body = (await req.json()) as Partial<PlaybackState>;
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  if (!isUserId(body.dj)) {
    return NextResponse.json(
      { error: "dj (UserId) required on every state update" },
      { status: 400 }
    );
  }

  const prev = await readPlaybackState();
  const next: PlaybackState = {
    ...prev,
    ...body,
    dj: body.dj,
    updatedAt: Date.now(),
  };

  // Sanity defaults
  if (next.positionUpdatedAt === undefined || next.positionUpdatedAt === 0) {
    next.positionUpdatedAt = Date.now();
  }
  if (next.positionMs === undefined || next.positionMs === null) {
    next.positionMs = 0;
  }

  await writePlaybackState(next);
  return NextResponse.json(next);
}
