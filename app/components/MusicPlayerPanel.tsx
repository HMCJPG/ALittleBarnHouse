"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSpotify } from "./SpotifyProvider";
import { useIdentity } from "./IdentityProvider";
import type { SearchTrack } from "@/app/api/spotify/search/route";
import type { QueuedTrack } from "@/lib/spotify";

/**
 * The record-player popup. Opens when the user clicks the record player.
 *
 * Layout:
 *   Header (title + close)
 *   Now Playing card (track art, name, artist, play/pause, skip, DJ tag)
 *   Volume slider (per-device)
 *   Up Next (queue) — each item has a remove button
 *   Search box → results list (click a result to play now, + to queue)
 *   Footer: connect / disconnect, status
 */
export function MusicPlayerPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { identity } = useIdentity();
  const {
    status,
    state,
    loginHref,
    play,
    queueTrack,
    skip,
    removeFromQueue,
    togglePlayPause,
    refresh,
    volume,
    setVolume,
  } = useSpotify();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchTrack[]>([]);
  const [searching, setSearching] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  useEffect(() => {
    if (!query.trim() || !identity || status !== "ready") {
      setResults([]);
      return;
    }
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `/api/spotify/search?user=${identity}&q=${encodeURIComponent(query)}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          setResults([]);
          return;
        }
        const data = (await res.json()) as { tracks: SearchTrack[] };
        setResults(data.tracks ?? []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 280);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [query, identity, status]);

  const onPlayResult = useCallback(
    async (t: SearchTrack) => {
      setActionError(null);
      try {
        await play({
          uri: t.uri,
          id: t.id,
          name: t.name,
          artists: t.artists,
          album: t.album,
          art: t.art,
          durationMs: t.durationMs,
        });
        setQuery("");
        setResults([]);
      } catch (err) {
        setActionError(
          err instanceof Error ? err.message : "Couldn't play that track"
        );
      }
    },
    [play]
  );

  const onQueueResult = useCallback(
    async (t: SearchTrack) => {
      setActionError(null);
      try {
        await queueTrack({
          uri: t.uri,
          id: t.id,
          name: t.name,
          artists: t.artists,
          album: t.album,
          art: t.art,
          durationMs: t.durationMs,
        });
        // Keep results visible — they can keep queueing more.
      } catch (err) {
        setActionError(
          err instanceof Error ? err.message : "Couldn't add to queue"
        );
      }
    },
    [queueTrack]
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="music-title"
      className="fixed inset-0 z-40 flex items-center justify-center px-4 py-6"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-night-deep/80 backdrop-blur-sm cursor-default"
      />

      <div
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(180deg, #fff9ec 0%, #f7eed2 100%)",
          boxShadow:
            "0 20px 60px -12px rgba(0,0,0,0.65), inset 0 2px 0 rgba(255,255,255,0.6)",
        }}
      >
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 4px #c4a878, inset 0 0 0 6px #6b3f23" }}
          aria-hidden
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center text-cabin-wooddark hover:bg-cabin-wooddark/10 transition"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
            <path
              d="M3 3 L15 15 M15 3 L3 15"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <header className="text-center px-6 pt-7 pb-2">
          <div className="text-xl mb-1" aria-hidden>♪</div>
          <h2
            id="music-title"
            className="font-playful font-semibold text-cabin-wooddark text-lg sm:text-xl"
          >
            The Cabin Record Player
          </h2>
          <div
            className="mx-auto mt-2 h-px w-24"
            style={{
              background: "linear-gradient(90deg, transparent, #c4a878, transparent)",
            }}
            aria-hidden
          />
        </header>

        {/* now playing */}
        <section className="px-5 sm:px-7 mt-3">
          <NowPlaying
            state={state}
            status={status}
            onToggle={async () => {
              setActionError(null);
              try {
                await togglePlayPause();
              } catch (err) {
                setActionError(
                  err instanceof Error ? err.message : "Couldn't toggle"
                );
              }
            }}
            onSkip={async () => {
              setActionError(null);
              try {
                await skip();
              } catch (err) {
                setActionError(
                  err instanceof Error ? err.message : "Couldn't skip"
                );
              }
            }}
          />
        </section>

        {/* volume slider — local-device only */}
        <section className="px-5 sm:px-7 mt-3">
          <VolumeSlider
            value={volume}
            onChange={setVolume}
            disabled={status !== "ready"}
          />
        </section>

        {/* queue */}
        {state && state.queue.length > 0 && (
          <section className="px-5 sm:px-7 mt-3">
            <p className="font-playful text-xs uppercase tracking-wider text-cabin-wooddark/60 mb-1">
              Up Next ({state.queue.length})
            </p>
            <ol className="space-y-1 max-h-40 overflow-y-auto -mx-1 px-1">
              {state.queue.map((q) => (
                <QueueRow
                  key={q.queueId}
                  track={q}
                  onRemove={async () => {
                    setActionError(null);
                    try {
                      await removeFromQueue(q.queueId);
                    } catch (err) {
                      setActionError(
                        err instanceof Error ? err.message : "Couldn't remove"
                      );
                    }
                  }}
                />
              ))}
            </ol>
          </section>
        )}

        {/* search */}
        <section className="px-5 sm:px-7 mt-4 flex-1 overflow-hidden flex flex-col">
          <label
            htmlFor="search"
            className="block font-playful text-xs uppercase tracking-wider text-cabin-wooddark/60 mb-1"
          >
            Pick a record
          </label>
          <input
            id="search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={status !== "ready"}
            placeholder={
              status === "ready"
                ? "Search Spotify… (artist, song, album)"
                : "Connect Spotify to search"
            }
            className="w-full rounded-xl border border-cabin-wooddark/25 bg-[#fffdf5] px-3 py-2 font-playful text-cabin-wooddark placeholder-cabin-wooddark/35 focus:outline-none focus:border-cabin-glow focus:ring-2 focus:ring-cabin-glow/40 transition disabled:opacity-50"
          />

          <div className="mt-2 overflow-y-auto pb-4 -mx-1 px-1">
            {searching && (
              <p className="text-xs text-cabin-wooddark/40 font-playful py-2 text-center">
                searching…
              </p>
            )}
            {!searching &&
              results.map((t) => (
                <SearchResultRow
                  key={t.id}
                  track={t}
                  onPlay={onPlayResult}
                  onQueue={onQueueResult}
                />
              ))}
            {!searching && query.trim() && results.length === 0 && (
              <p className="text-xs text-cabin-wooddark/40 font-playful py-3 text-center">
                no matches
              </p>
            )}
          </div>
        </section>

        <footer className="border-t border-cabin-wooddark/15 px-5 sm:px-7 py-3 bg-[#fffaf0]">
          <StatusLine status={status} loginHref={loginHref} />
          {actionError && (
            <p className="text-xs text-red-700 mt-2 font-playful">{actionError}</p>
          )}
        </footer>
      </div>
    </div>
  );
}

/* ─── pieces ─────────────────────────────────────────────────────── */

function NowPlaying({
  state,
  status,
  onToggle,
  onSkip,
}: {
  state: ReturnType<typeof useSpotify>["state"];
  status: ReturnType<typeof useSpotify>["status"];
  onToggle: () => void;
  onSkip: () => void;
}) {
  const noTrack = !state || !state.trackUri;
  const canToggle = status === "ready" && !!state?.trackUri;
  const canSkip = status === "ready" && !!state?.trackUri;

  return (
    <div
      className="rounded-2xl p-3 flex items-center gap-3 shadow-sm"
      style={{
        background: "linear-gradient(135deg, #2d2870 0%, #1a1850 100%)",
        boxShadow: "0 4px 12px -4px rgba(0,0,0,0.4)",
      }}
    >
      <div
        className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden grid place-items-center"
        style={{ background: "#0a0628" }}
      >
        {state?.albumArt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={state.albumArt}
            alt={state.albumName}
            className={`w-full h-full object-cover ${state.isPlaying ? "animate-record" : ""}`}
            style={{
              borderRadius: "9999px",
              transformOrigin: "center",
              animationDuration: "6s",
            }}
          />
        ) : (
          <span className="text-2xl text-play-cloud/40" aria-hidden>♪</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {noTrack ? (
          <div>
            <p className="font-playful text-play-cloud text-sm">
              Nothing's spinning yet.
            </p>
            <p className="font-playful text-play-cloud/60 text-xs">
              Search a song below to start.
            </p>
          </div>
        ) : (
          <>
            <p className="font-playful font-semibold text-play-cloud truncate">
              {state!.trackName}
            </p>
            <p className="font-playful text-play-cloud/70 text-sm truncate">
              {state!.artistName}
            </p>
            <p className="font-playful text-play-cloud/45 text-xs truncate mt-0.5">
              {state!.dj
                ? `${state!.dj === "jason" ? "Jason" : "Melisa"} put this on`
                : ""}
            </p>
          </>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-1.5">
        <button
          type="button"
          onClick={onToggle}
          disabled={!canToggle}
          aria-label={state?.isPlaying ? "Pause" : "Play"}
          className="w-12 h-12 rounded-full grid place-items-center text-night-deep disabled:opacity-40 disabled:cursor-not-allowed transition hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(135deg, #ffd966 0%, #ff9b3a 100%)" }}
        >
          {state?.isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
              <rect x="4" y="3" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="12" y="3" width="4" height="14" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
              <path d="M5 3 L17 10 L5 17 Z" fill="currentColor" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={onSkip}
          disabled={!canSkip}
          aria-label="Skip to next"
          title={
            state?.queue.length
              ? `Skip to next (${state.queue.length} queued)`
              : "Skip / stop"
          }
          className="w-9 h-9 rounded-full grid place-items-center text-play-cloud bg-play-cloud/10 disabled:opacity-30 disabled:cursor-not-allowed transition hover:bg-play-cloud/20 active:scale-95"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
            <path d="M3 2 L12 8 L3 14 Z" fill="currentColor" />
            <rect x="12" y="2" width="2" height="12" rx="0.5" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function VolumeSlider({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled: boolean;
}) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-3">
      <VolumeIcon level={value} />
      <input
        type="range"
        min={0}
        max={100}
        value={pct}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        disabled={disabled}
        aria-label="Volume"
        className="flex-1 accent-cabin-fire disabled:opacity-40"
        style={{
          // Light styling — actual thumb/track is browser default,
          // which Tailwind's `accent-` colors recolor in modern browsers.
          height: 4,
        }}
      />
      <span className="font-playful text-xs text-cabin-wooddark/55 w-10 text-right tabular-nums">
        {pct}%
      </span>
    </div>
  );
}

function VolumeIcon({ level }: { level: number }) {
  const showOne = level > 0.1;
  const showTwo = level > 0.55;
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className="text-cabin-wooddark/70">
      <path
        d="M3 10 L3 14 L7 14 L12 18 L12 6 L7 10 Z"
        fill="currentColor"
      />
      {level === 0 && (
        <path
          d="M16 10 L21 15 M21 10 L16 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {showOne && level > 0 && (
        <path
          d="M16 9 Q19 12, 16 15"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {showTwo && (
        <path
          d="M19 7 Q23 12, 19 17"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function QueueRow({
  track,
  onRemove,
}: {
  track: QueuedTrack;
  onRemove: () => void;
}) {
  return (
    <li className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-cabin-wooddark/5 group">
      <div className="w-8 h-8 rounded shrink-0 bg-cabin-wooddark/10 overflow-hidden grid place-items-center">
        {track.art ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={track.art} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-cabin-wooddark/30" aria-hidden>♪</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-playful text-cabin-wooddark text-sm truncate">
          {track.name}
        </p>
        <p className="font-playful text-cabin-wooddark/60 text-xs truncate">
          {track.artists} · queued by{" "}
          {track.addedBy === "jason" ? "Jason" : "Melisa"}
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${track.name} from queue`}
        className="shrink-0 w-7 h-7 rounded-full grid place-items-center text-cabin-wooddark/40 hover:text-cabin-wooddark hover:bg-cabin-wooddark/10 transition"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
          <path
            d="M2 2 L10 10 M10 2 L2 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </li>
  );
}

function SearchResultRow({
  track,
  onPlay,
  onQueue,
}: {
  track: SearchTrack;
  onPlay: (t: SearchTrack) => void;
  onQueue: (t: SearchTrack) => void;
}) {
  return (
    <div className="group flex items-center gap-3 p-2 rounded-lg hover:bg-cabin-wooddark/5 transition">
      <button
        type="button"
        onClick={() => onPlay(track)}
        className="flex-1 flex items-center gap-3 min-w-0 text-left focus:outline-none"
        aria-label={`Play ${track.name} by ${track.artists} now`}
      >
        <div className="w-10 h-10 rounded shrink-0 bg-cabin-wooddark/10 overflow-hidden grid place-items-center">
          {track.art ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={track.art} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-cabin-wooddark/30 text-lg" aria-hidden>♪</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-playful text-cabin-wooddark text-sm truncate">
            {track.name}
          </p>
          <p className="font-playful text-cabin-wooddark/60 text-xs truncate">
            {track.artists}
          </p>
        </div>
        <span className="text-cabin-wooddark/30 font-playful text-xs shrink-0">
          {formatDuration(track.durationMs)}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onQueue(track)}
        aria-label={`Add ${track.name} to queue`}
        title="Add to queue"
        className="shrink-0 w-8 h-8 rounded-full grid place-items-center text-cabin-wooddark/50 hover:text-cabin-wooddark bg-cabin-wooddark/5 hover:bg-cabin-wooddark/15 transition"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
          <path
            d="M7 2 L7 12 M2 7 L12 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

function StatusLine({
  status,
  loginHref,
}: {
  status: ReturnType<typeof useSpotify>["status"];
  loginHref: string | null;
}) {
  if (status === "ready") {
    return (
      <p className="text-xs font-playful text-cabin-wooddark/55 flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full bg-green-500"
          aria-hidden
        />
        connected — synced with the cabin
      </p>
    );
  }
  if (status === "needs-login" && loginHref) {
    return (
      <a
        href={loginHref}
        className="inline-flex items-center gap-2 font-playful text-sm font-semibold text-white rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition"
        style={{ background: "linear-gradient(135deg, #1db954 0%, #138139 100%)" }}
      >
        <SpotifyIcon /> Connect Spotify
      </a>
    );
  }
  if (status === "premium-required") {
    return (
      <p className="text-xs font-playful text-amber-800">
        Spotify Premium is required to play music in the browser. (Free
        accounts can't use the Web Playback SDK.)
      </p>
    );
  }
  if (status === "auth-error") {
    return (
      <p className="text-xs font-playful text-red-700">
        Spotify auth expired or was revoked.{" "}
        {loginHref && (
          <a href={loginHref} className="underline">
            Reconnect
          </a>
        )}
      </p>
    );
  }
  if (status === "loading-sdk" || status === "initializing" || status === "idle") {
    return (
      <p className="text-xs font-playful text-cabin-wooddark/40">
        connecting to Spotify…
      </p>
    );
  }
  return (
    <p className="text-xs font-playful text-red-700">
      Spotify error. Try refreshing the page.
    </p>
  );
}

function SpotifyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.5 17.3a.75.75 0 0 1-1 .25c-2.7-1.6-6.1-2-10.1-1.1a.75.75 0 1 1-.3-1.5c4.4-1 8.2-.5 11.2 1.3a.75.75 0 0 1 .3 1.1Zm1.5-3.3a.94.94 0 0 1-1.3.3c-3.1-1.9-7.8-2.4-11.5-1.3a.94.94 0 1 1-.5-1.8c4.2-1.2 9.4-.7 13 1.4.4.3.6.8.3 1.4Zm.1-3.4c-3.7-2.2-9.8-2.4-13.4-1.3a1.13 1.13 0 1 1-.7-2.2c4.1-1.3 10.8-1 15.1 1.5 1 .5.6 2.5-1 2Z"
      />
    </svg>
  );
}

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
