import { NextResponse } from "next/server";
import { addNote, getState } from "@/lib/notes";
import { USER_IDS, type UserId } from "@/lib/types";

// Always run dynamically — we don't want note state baked into a static page.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isUserId(v: unknown): v is UserId {
  return typeof v === "string" && (USER_IDS as readonly string[]).includes(v);
}

export async function GET() {
  try {
    const state = await getState();
    return NextResponse.json(state, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("GET /api/notes failed", err);
    return NextResponse.json({ error: "read failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const { author, text } = (body ?? {}) as { author?: unknown; text?: unknown };

  if (!isUserId(author)) {
    return NextResponse.json({ error: "invalid author" }, { status: 400 });
  }
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "empty note" }, { status: 400 });
  }

  try {
    const note = await addNote(author, text);
    return NextResponse.json({ note });
  } catch (err) {
    console.error("POST /api/notes failed", err);
    return NextResponse.json({ error: "write failed" }, { status: 500 });
  }
}
