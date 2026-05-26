import { NextResponse } from "next/server";
import { markSeen } from "@/lib/notes";
import { USER_IDS, type UserId } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isUserId(v: unknown): v is UserId {
  return typeof v === "string" && (USER_IDS as readonly string[]).includes(v);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const { user } = (body ?? {}) as { user?: unknown };
  if (!isUserId(user)) {
    return NextResponse.json({ error: "invalid user" }, { status: 400 });
  }

  try {
    const lastSeen = await markSeen(user);
    return NextResponse.json({ lastSeen });
  } catch (err) {
    console.error("POST /api/notes/seen failed", err);
    return NextResponse.json({ error: "write failed" }, { status: 500 });
  }
}
