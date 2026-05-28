import { NextResponse, type NextRequest } from "next/server";
import { getAccessToken, readTokens } from "@/lib/spotify";
import { USER_IDS, type UserId } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/spotify/token?user=jason
 *
 * Returns a fresh access token for the given user. This is what the
 * client SDK calls in its `getOAuthToken` callback. We don't expose
 * the refresh token to the browser — only the short-lived access token.
 */
export async function GET(req: NextRequest) {
  const userParam = req.nextUrl.searchParams.get("user");
  if (
    typeof userParam !== "string" ||
    !(USER_IDS as readonly string[]).includes(userParam)
  ) {
    return NextResponse.json({ error: "invalid user" }, { status: 400 });
  }
  const user = userParam as UserId;

  const tokens = await readTokens(user);
  if (!tokens) {
    return NextResponse.json(
      { connected: false, error: "not connected" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const access = await getAccessToken(user);
  if (!access) {
    return NextResponse.json(
      { connected: false, error: "refresh_failed" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { connected: true, access_token: access },
    { headers: { "Cache-Control": "no-store" } }
  );
}
