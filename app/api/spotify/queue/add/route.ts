import { NextResponse, type NextRequest } from "next/server";
import { enqueueTrack, type TrackInfo } from "@/lib/spotify";
import { USER_IDS, type UserId } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isUserId(v: unknown): v is UserId {
  return typeof v === "string" && (USER_IDS as readonly string[]).includes(v);
}

function isTrackInfo(v: unknown): v is TrackInfo {
  if (!v || typeof v !== "object") return false;
  const t = v as Record<string, unknown>;
  return (
    typeof t.uri === "string" &&
    typeof t.id === "string" &&
    typeof t.name === "string" &&
    typeof t.artists === "string" &&
    typeof t.album === "string" &&
    (t.art === null || typeof t.art === "string") &&
    typeof t.durationMs === "number"
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const { user, track } = (body ?? {}) as { user?: unknown; track?: unknown };
  if (!isUserId(user)) {
    return NextResponse.json({ error: "invalid user" }, { status: 400 });
  }
  if (!isTrackInfo(track)) {
    return NextResponse.json({ error: "invalid track" }, { status: 400 });
  }

  try {
    const state = await enqueueTrack(track, user);
    return NextResponse.json(state);
  } catch (err) {
    console.error("POST /api/spotify/queue/add failed", err);
    return NextResponse.json({ error: "write failed" }, { status: 500 });
  }
}
