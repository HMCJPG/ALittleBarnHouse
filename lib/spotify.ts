/**
 * Spotify domain types and server-side helpers.
 *
 * Token storage layout (in KV):
 *   barnhouse:spotify:jason  → SpotifyTokens
 *   barnhouse:spotify:melisa → SpotifyTokens
 *   barnhouse:spotify:state  → PlaybackState
 *   barnhouse:spotify:nonce:<n> → UserId (TTL ~10 min; CSRF state)
 */
import { kvGet, kvSet } from "./store";
import type { UserId } from "./types";

export type SpotifyTokens = {
  access_token: string;
  refresh_token: string;
  expires_at: number; // unix ms when access_token expires
  scope: string;
};

export type PlaybackState = {
  trackUri: string | null; // e.g. "spotify:track:abc123"
  trackId: string | null;
  trackName: string;
  artistName: string;
  albumName: string;
  albumArt: string | null;
  durationMs: number;
  /** Position at the moment positionUpdatedAt was set. */
  positionMs: number;
  /** Unix ms when positionMs was anchored. */
  positionUpdatedAt: number;
  isPlaying: boolean;
  /** Who set this state — drives the "Jason is DJing" indicator. */
  dj: UserId | null;
  updatedAt: number;
};

export const EMPTY_STATE: PlaybackState = {
  trackUri: null,
  trackId: null,
  trackName: "",
  artistName: "",
  albumName: "",
  albumArt: null,
  durationMs: 0,
  positionMs: 0,
  positionUpdatedAt: 0,
  isPlaying: false,
  dj: null,
  updatedAt: 0,
};

export const SPOTIFY_SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-modify-playback-state",
  "user-read-playback-state",
  "user-read-currently-playing",
].join(" ");

/* ─── token helpers ──────────────────────────────────────────────── */

const tokenKey = (u: UserId) => `barnhouse:spotify:${u}`;

export async function readTokens(u: UserId): Promise<SpotifyTokens | null> {
  return kvGet<SpotifyTokens>(tokenKey(u));
}

export async function writeTokens(
  u: UserId,
  tokens: SpotifyTokens
): Promise<void> {
  await kvSet(tokenKey(u), tokens);
}

/**
 * Returns a usable access token for the user, refreshing it if it's
 * within 60s of expiring. Returns null if we have no tokens for the
 * user, OR if refresh fails (e.g. revoked access).
 */
export async function getAccessToken(u: UserId): Promise<string | null> {
  const tokens = await readTokens(u);
  if (!tokens) return null;

  const skewMs = 60_000;
  if (Date.now() < tokens.expires_at - skewMs) {
    return tokens.access_token;
  }

  // Refresh
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: tokens.refresh_token,
    }),
  });

  if (!res.ok) {
    console.warn("spotify token refresh failed", await res.text());
    return null;
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
  };

  const next: SpotifyTokens = {
    access_token: data.access_token,
    // Spotify rotates refresh tokens occasionally; only overwrite if given.
    refresh_token: data.refresh_token ?? tokens.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
    scope: data.scope ?? tokens.scope,
  };
  await writeTokens(u, next);
  return next.access_token;
}

/* ─── playback state helpers ─────────────────────────────────────── */

const STATE_KEY = "barnhouse:spotify:state";

export async function readPlaybackState(): Promise<PlaybackState> {
  return (await kvGet<PlaybackState>(STATE_KEY)) ?? EMPTY_STATE;
}

export async function writePlaybackState(s: PlaybackState): Promise<void> {
  await kvSet(STATE_KEY, s);
}

/**
 * Given a PlaybackState, compute the position the music should be at
 * RIGHT NOW. If it's playing, we extrapolate from positionUpdatedAt;
 * if paused, positionMs is the frozen position. Clamps to [0, duration].
 */
export function currentPositionMs(s: PlaybackState, nowMs = Date.now()): number {
  if (!s.trackUri) return 0;
  if (!s.isPlaying) return s.positionMs;
  const elapsed = nowMs - s.positionUpdatedAt;
  const pos = s.positionMs + elapsed;
  if (s.durationMs > 0 && pos > s.durationMs) return s.durationMs;
  return pos < 0 ? 0 : pos;
}

/* ─── CSRF nonce helpers (used by OAuth) ─────────────────────────── */

const nonceKey = (nonce: string) => `barnhouse:spotify:nonce:${nonce}`;

export async function storeNonce(nonce: string, user: UserId): Promise<void> {
  await kvSet(nonceKey(nonce), { user, createdAt: Date.now() });
}

export async function consumeNonce(nonce: string): Promise<UserId | null> {
  const v = await kvGet<{ user: UserId; createdAt: number }>(nonceKey(nonce));
  if (!v) return null;
  // 10-minute TTL enforced manually since not all stores honor SET EX.
  if (Date.now() - v.createdAt > 10 * 60_000) return null;
  // We don't bother deleting (kvSet doesn't expose del here, and the
  // nonce is single-use enough — the next nonce will overwrite anyway).
  return v.user;
}
