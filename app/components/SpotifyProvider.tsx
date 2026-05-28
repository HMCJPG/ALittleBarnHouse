"use client";

import Script from "next/script";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useIdentity } from "./IdentityProvider";
import type { UserId } from "@/lib/types";
import type { PlaybackState } from "@/lib/spotify";

/**
 * Wraps the Spotify Web Playback SDK + sync polling.
 *
 * Responsibilities:
 *   • Load the SDK script lazily.
 *   • Init a Player tied to the current user's access token (refreshing it
 *     via /api/spotify/token whenever Spotify's SDK asks for it).
 *   • Poll the shared playback state from /api/spotify/state every 3s and
 *     reconcile this client's actual playback with it (play new tracks,
 *     pause, seek if drift > 2s).
 *   • Expose a small API to children: connect button, play(track), pause(),
 *     resume(), the current shared state, "connection" status.
 *
 * Sync model:
 *   The server is the source of truth for { trackUri, positionMs,
 *   positionUpdatedAt, isPlaying, dj }. Whoever changes the music POSTs
 *   the new state; the other client sees it on the next poll and catches up.
 */

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
    Spotify?: {
      Player: new (opts: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume?: number;
      }) => SpotifyPlayer;
    };
  }
}

type SpotifyPlayer = {
  connect(): Promise<boolean>;
  disconnect(): void;
  addListener(event: string, cb: (...args: unknown[]) => void): void;
  removeListener(event: string): void;
  getCurrentState(): Promise<SpotifySDKState | null>;
  setVolume(v: number): Promise<void>;
};
type SpotifySDKState = {
  paused: boolean;
  position: number;
  duration: number;
  track_window: {
    current_track: {
      id: string;
      uri: string;
      name: string;
      album: { name: string; images: { url: string }[] };
      artists: { name: string }[];
      duration_ms?: number;
    };
  };
};

const POLL_MS = 3000;
const SEEK_DRIFT_MS = 2000;

type ConnectionStatus =
  | "idle" // not initialized yet
  | "needs-login" // user hasn't authorized Spotify
  | "loading-sdk" // SDK script loading
  | "initializing" // Player created, waiting for device ready
  | "ready" // device ready, can play
  | "premium-required" // account_error fired
  | "auth-error" // token issues
  | "error"; // generic

type SpotifyCtxValue = {
  status: ConnectionStatus;
  error: string | null;
  /** Shared playback state from the server (null until first fetch). */
  state: PlaybackState | null;
  /** Login URL for the current user. */
  loginHref: string | null;
  /** Start playing a track. DJ-initiated. */
  play: (track: {
    uri: string;
    id: string;
    name: string;
    artists: string;
    album: string;
    art: string | null;
    durationMs: number;
  }) => Promise<void>;
  /** Toggle play/pause for the current track. */
  togglePlayPause: () => Promise<void>;
  /** Force a refresh of the shared state. */
  refresh: () => Promise<void>;
};

const Ctx = createContext<SpotifyCtxValue | null>(null);

export function useSpotify() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSpotify must be inside <SpotifyProvider>");
  return v;
}

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const { identity } = useIdentity();
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<PlaybackState | null>(null);

  const playerRef = useRef<SpotifyPlayer | null>(null);
  const deviceIdRef = useRef<string | null>(null);
  const lastAppliedRef = useRef<{
    trackUri: string | null;
    isPlaying: boolean;
    positionUpdatedAt: number;
  } | null>(null);
  const sdkLoadedRef = useRef(false);
  const pendingPlayRef = useRef<PlaybackState | null>(null);

  /* ─── connection bootstrapping ─────────────────────────────────── */

  // Check whether the user is already connected (has tokens in KV).
  // If yes, we can proceed to load the SDK. If no, surface "needs-login".
  useEffect(() => {
    if (!identity) return;
    let cancelled = false;
    setStatus("idle");
    setError(null);
    (async () => {
      try {
        const res = await fetch(`/api/spotify/token?user=${identity}`, {
          cache: "no-store",
        });
        if (cancelled) return;
        if (res.status === 401) {
          setStatus("needs-login");
          return;
        }
        if (!res.ok) {
          setStatus("error");
          setError(`token check ${res.status}`);
          return;
        }
        // We have a token — load the SDK.
        setStatus("loading-sdk");
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setError(err instanceof Error ? err.message : "token check failed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [identity]);

  // Init the player once the SDK is loaded AND we have an identity AND tokens.
  useEffect(() => {
    if (status !== "loading-sdk" || !identity) return;

    function tryInit() {
      if (!window.Spotify) return false;
      initPlayer(identity!);
      return true;
    }

    if (tryInit()) return;
    // SDK may finish loading just after this effect — register the global cb.
    window.onSpotifyWebPlaybackSDKReady = () => {
      tryInit();
    };
    // Also poll briefly in case the cb already fired before we got here.
    let tries = 0;
    const intv = setInterval(() => {
      if (tries++ > 50) {
        clearInterval(intv);
        return;
      }
      if (tryInit()) clearInterval(intv);
    }, 100);
    return () => clearInterval(intv);
  }, [status, identity]);

  function initPlayer(user: UserId) {
    if (playerRef.current) return;
    if (!window.Spotify) return;

    setStatus("initializing");
    setError(null);

    const player = new window.Spotify.Player({
      name: "A Little Barn House 🌲",
      volume: 0.5,
      getOAuthToken: async (cb) => {
        try {
          const res = await fetch(`/api/spotify/token?user=${user}`, {
            cache: "no-store",
          });
          if (!res.ok) {
            setStatus("auth-error");
            return;
          }
          const data = (await res.json()) as { access_token: string };
          cb(data.access_token);
        } catch (err) {
          console.warn("getOAuthToken failed", err);
          setStatus("auth-error");
        }
      },
    });

    player.addListener("ready", (...args: unknown[]) => {
      const { device_id } = args[0] as { device_id: string };
      deviceIdRef.current = device_id;
      setStatus("ready");
      // If a state arrived BEFORE we were ready, apply it now.
      const pending = pendingPlayRef.current;
      pendingPlayRef.current = null;
      if (pending) reconcile(pending, true).catch(console.warn);
    });
    player.addListener("not_ready", () => {
      deviceIdRef.current = null;
    });
    player.addListener("initialization_error", (...args: unknown[]) => {
      const { message } = args[0] as { message: string };
      setStatus("error");
      setError(message);
    });
    player.addListener("authentication_error", (...args: unknown[]) => {
      const { message } = args[0] as { message: string };
      setStatus("auth-error");
      setError(message);
    });
    player.addListener("account_error", () => {
      // Almost always: user isn't Premium.
      setStatus("premium-required");
      setError("Spotify Premium is required for in-browser playback.");
    });

    player.connect().catch((err) => {
      setStatus("error");
      setError(err instanceof Error ? err.message : "player connect failed");
    });

    playerRef.current = player;
  }

  // Tear down on identity change / unmount.
  useEffect(() => {
    return () => {
      playerRef.current?.disconnect();
      playerRef.current = null;
      deviceIdRef.current = null;
    };
  }, [identity]);

  /* ─── shared state polling + reconciliation ───────────────────── */

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/spotify/state", { cache: "no-store" });
      if (!res.ok) return;
      const next = (await res.json()) as PlaybackState;
      setState(next);
    } catch (err) {
      console.warn("spotify state refresh failed", err);
    }
  }, []);

  useEffect(() => {
    if (!identity) return;
    refresh();
    const intv = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, POLL_MS);
    const onVis = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(intv);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [identity, refresh]);

  // When shared state changes, reconcile this device.
  useEffect(() => {
    if (!state) return;
    if (status !== "ready") {
      // Queue the most recent state for when we ARE ready.
      if (state.trackUri) pendingPlayRef.current = state;
      return;
    }
    reconcile(state, false).catch(console.warn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, status]);

  async function reconcile(s: PlaybackState, forceApply: boolean) {
    const deviceId = deviceIdRef.current;
    if (!deviceId || !identity) return;

    const token = await fetchAccessToken(identity);
    if (!token) return;

    const last = lastAppliedRef.current;
    const trackChanged = !last || last.trackUri !== s.trackUri;
    const playStateChanged = !last || last.isPlaying !== s.isPlaying;
    const anchorChanged =
      !last || last.positionUpdatedAt !== s.positionUpdatedAt;

    // 1) Track changed — play the new track at the right position.
    if (s.trackUri && (forceApply || trackChanged)) {
      const targetPos = computeTargetPosition(s);
      await spotifyPlay(token, deviceId, s.trackUri, targetPos);
    } else if (!s.trackUri) {
      // No track at all — pause if needed.
      if (last?.isPlaying) await spotifyPause(token, deviceId);
    } else {
      // Same track. Handle play/pause/seek.
      if (forceApply || playStateChanged) {
        if (s.isPlaying) {
          await spotifyResume(token, deviceId);
        } else {
          await spotifyPause(token, deviceId);
        }
      }
      if (forceApply || (anchorChanged && s.isPlaying)) {
        const targetPos = computeTargetPosition(s);
        const local = await playerRef.current?.getCurrentState();
        if (local && Math.abs(local.position - targetPos) > SEEK_DRIFT_MS) {
          await spotifySeek(token, deviceId, targetPos);
        }
      }
    }

    lastAppliedRef.current = {
      trackUri: s.trackUri,
      isPlaying: s.isPlaying,
      positionUpdatedAt: s.positionUpdatedAt,
    };
  }

  /* ─── DJ actions (called by UI) ───────────────────────────────── */

  const play = useCallback(
    async (track: {
      uri: string;
      id: string;
      name: string;
      artists: string;
      album: string;
      art: string | null;
      durationMs: number;
    }) => {
      if (!identity) return;
      const now = Date.now();
      const next: Partial<PlaybackState> & { dj: UserId } = {
        trackUri: track.uri,
        trackId: track.id,
        trackName: track.name,
        artistName: track.artists,
        albumName: track.album,
        albumArt: track.art,
        durationMs: track.durationMs,
        positionMs: 0,
        positionUpdatedAt: now,
        isPlaying: true,
        dj: identity,
      };
      const res = await fetch("/api/spotify/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error(`state update failed (${res.status})`);
      const updated = (await res.json()) as PlaybackState;
      setState(updated);
    },
    [identity]
  );

  const togglePlayPause = useCallback(async () => {
    if (!identity || !state || !state.trackUri) return;
    const now = Date.now();
    const willPlay = !state.isPlaying;
    // When pausing: freeze the position. When resuming: the existing
    // positionMs is the resume point; positionUpdatedAt becomes now.
    const frozen = computeTargetPosition(state, now);
    const next: Partial<PlaybackState> & { dj: UserId } = {
      ...state,
      isPlaying: willPlay,
      positionMs: frozen,
      positionUpdatedAt: now,
      dj: identity,
    };
    const res = await fetch("/api/spotify/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    if (!res.ok) throw new Error(`state update failed (${res.status})`);
    const updated = (await res.json()) as PlaybackState;
    setState(updated);
  }, [identity, state]);

  const loginHref = identity ? `/api/spotify/login?user=${identity}` : null;

  return (
    <>
      {/* Lazy-load the SDK. Triggered the first time any tab needs it. */}
      <Script
        src="https://sdk.scdn.co/spotify-player.js"
        strategy="afterInteractive"
        onLoad={() => {
          sdkLoadedRef.current = true;
        }}
      />
      <Ctx.Provider
        value={{
          status,
          error,
          state,
          loginHref,
          play,
          togglePlayPause,
          refresh,
        }}
      >
        {children}
      </Ctx.Provider>
    </>
  );
}

/* ─── helpers ────────────────────────────────────────────────────── */

async function fetchAccessToken(user: UserId): Promise<string | null> {
  try {
    const res = await fetch(`/api/spotify/token?user=${user}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

function computeTargetPosition(s: PlaybackState, nowMs = Date.now()): number {
  if (!s.trackUri) return 0;
  if (!s.isPlaying) return s.positionMs;
  const elapsed = nowMs - s.positionUpdatedAt;
  const pos = s.positionMs + elapsed;
  if (s.durationMs > 0 && pos > s.durationMs) return s.durationMs;
  return pos < 0 ? 0 : pos;
}

async function spotifyPlay(
  token: string,
  deviceId: string,
  uri: string,
  positionMs: number
) {
  await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uris: [uri], position_ms: Math.max(0, positionMs) }),
  });
}
async function spotifyPause(token: string, deviceId: string) {
  await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
}
async function spotifyResume(token: string, deviceId: string) {
  await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
}
async function spotifySeek(token: string, deviceId: string, positionMs: number) {
  await fetch(
    `https://api.spotify.com/v1/me/player/seek?position_ms=${Math.max(0, Math.floor(positionMs))}&device_id=${deviceId}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}
