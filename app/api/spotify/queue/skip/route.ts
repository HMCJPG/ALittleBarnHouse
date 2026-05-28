import { NextResponse, type NextRequest } from "next/server";
import { skipToNext } from "@/lib/spotify";
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

  const { user, expectedCurrentUri } = (body ?? {}) as {
    user?: unknown;
    expectedCurrentUri?: unknown;
  };
  if (!isUserId(user)) {
    return NextResponse.json({ error: "invalid user" }, { status: 400 });
  }
  const expected =
    typeof expectedCurrentUri === "string" || expectedCurrentUri === null
      ? (expectedCurrentUri as string | null)
      : undefined;

  try {
    const state = await skipToNext(user, expected);
    return NextResponse.json(state);
  } catch (err) {
    console.error("POST /api/spotify/queue/skip failed", err);
    return NextResponse.json({ error: "write failed" }, { status: 500 });
  }
}
