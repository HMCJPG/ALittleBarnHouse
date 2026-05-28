import { NextResponse, type NextRequest } from "next/server";
import { consumeNonce, writeTokens, type SpotifyTokens } from "@/lib/spotify";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const oauthError = req.nextUrl.searchParams.get("error");

  if (oauthError) {
    return redirectHome(req, { spotify_error: oauthError });
  }
  if (!code || !state) {
    return redirectHome(req, { spotify_error: "missing_params" });
  }

  const user = await consumeNonce(state);
  if (!user) {
    return redirectHome(req, { spotify_error: "bad_state" });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return redirectHome(req, { spotify_error: "server_misconfigured" });
  }

  const redirectUri = `${req.nextUrl.origin}/api/spotify/callback`;
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  let data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
  };
  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });
    if (!res.ok) {
      console.warn("spotify token exchange failed", await res.text());
      return redirectHome(req, { spotify_error: "exchange_failed" });
    }
    data = await res.json();
  } catch (err) {
    console.error("spotify token exchange threw", err);
    return redirectHome(req, { spotify_error: "exchange_threw" });
  }

  const tokens: SpotifyTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
    scope: data.scope,
  };
  await writeTokens(user, tokens);

  return redirectHome(req, { spotify_connected: user });
}

function redirectHome(req: NextRequest, params: Record<string, string>) {
  const url = new URL("/", req.nextUrl.origin);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url.toString());
}
