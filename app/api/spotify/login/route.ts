import { NextResponse, type NextRequest } from "next/server";
import { SPOTIFY_SCOPES, storeNonce } from "@/lib/spotify";
import { USER_IDS, type UserId } from "@/lib/types";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "SPOTIFY_CLIENT_ID not set" },
      { status: 500 }
    );
  }

  const userParam = req.nextUrl.searchParams.get("user");
  if (
    typeof userParam !== "string" ||
    !(USER_IDS as readonly string[]).includes(userParam)
  ) {
    return NextResponse.json(
      { error: "missing or invalid ?user= (jason|melisa)" },
      { status: 400 }
    );
  }
  const user = userParam as UserId;

  const nonce = randomBytes(24).toString("hex");
  await storeNonce(nonce, user);

  const redirectUri = `${req.nextUrl.origin}/api/spotify/callback`;
  const authorize = new URL("https://accounts.spotify.com/authorize");
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("scope", SPOTIFY_SCOPES);
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("state", nonce);
  authorize.searchParams.set("show_dialog", "false");

  return NextResponse.redirect(authorize.toString());
}
