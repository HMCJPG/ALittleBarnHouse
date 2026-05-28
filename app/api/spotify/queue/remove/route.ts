import { NextResponse, type NextRequest } from "next/server";
import { removeQueuedTrack } from "@/lib/spotify";
import { USER_IDS, type UserId } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isUserId(v: unknown): v is UserId {
  return typeof v === "string" && (USER_IDS as readonly string[]).includes(v);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const { user, queueId } = (body ?? {}) as {
    user?: unknown;
    queueId?: unknown;
  };
  if (!isUserId(user)) {
    return NextResponse.json({ error: "invalid user" }, { status: 400 });
  }
  if (typeof queueId !== "string") {
    return NextResponse.json({ error: "invalid queueId" }, { status: 400 });
  }
  try {
    const state = await removeQueuedTrack(queueId);
    return NextResponse.json(state);
  } catch (err) {
    console.error("POST /api/spotify/queue/remove failed", err);
    return NextResponse.json({ error: "write failed" }, { status: 500 });
  }
}
