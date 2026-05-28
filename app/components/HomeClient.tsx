"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Frame } from "./Frame";
import { CabinScene } from "./CabinScene";
import { IdentityPicker } from "./IdentityPicker";
import { NotesPopup } from "./NotesPopup";
import { MusicPlayerPanel } from "./MusicPlayerPanel";
import { useIdentity } from "./IdentityProvider";
import { useSpotify } from "./SpotifyProvider";
import { unreadCount, type NotesState } from "@/lib/types";

const POLL_MS = 15_000;

/**
 * Top-level client wrapper. Owns:
 *   • notes polling + popup
 *   • music popup open/close
 *   • routing OAuth callback params (spotify_connected / spotify_error)
 *   • surfacing the fridge "!" badge
 */
export function HomeClient() {
  const { identity, clearIdentity, hydrated } = useIdentity();
  const { state: musicState } = useSpotify();
  const [notesState, setNotesState] = useState<NotesState | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);
  const [oauthFlash, setOauthFlash] = useState<string | null>(null);
  const inFlight = useRef(false);

  /* ─── OAuth callback flash + URL cleanup ─────────────────────── */
  useEffect(() => {
    const url = new URL(window.location.href);
    const connected = url.searchParams.get("spotify_connected");
    const err = url.searchParams.get("spotify_error");
    if (connected) {
      setOauthFlash(`Spotify connected as ${connected === "jason" ? "Jason" : "Melisa"}.`);
      setMusicOpen(true);
    } else if (err) {
      setOauthFlash(`Spotify connection failed: ${err}`);
    }
    if (connected || err) {
      url.searchParams.delete("spotify_connected");
      url.searchParams.delete("spotify_error");
      window.history.replaceState({}, "", url.toString());
      // auto-dismiss flash after 4s
      setTimeout(() => setOauthFlash(null), 4000);
    }
  }, []);

  /* ─── notes polling ───────────────────────────────────────────── */
  const refreshNotes = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const res = await fetch("/api/notes", { cache: "no-store" });
      if (!res.ok) throw new Error(`fetch failed (${res.status})`);
      const data = (await res.json()) as NotesState;
      setNotesState(data);
    } catch (err) {
      console.warn("notes refresh failed", err);
    } finally {
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    if (!identity) return;
    refreshNotes();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") refreshNotes();
    }, POLL_MS);
    const onVis = () => {
      if (document.visibilityState === "visible") refreshNotes();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [identity, refreshNotes]);

  /* ─── fridge handler ─────────────────────────────────────────── */
  const handleFridgeClick = useCallback(async () => {
    if (!identity) return;
    setNotesOpen(true);
    setNotesState((s) =>
      s ? { ...s, lastSeen: { ...s.lastSeen, [identity]: Date.now() } } : s
    );
    try {
      await fetch("/api/notes/seen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: identity }),
      });
    } catch (err) {
      console.warn("mark-seen failed", err);
    }
    refreshNotes();
  }, [identity, refreshNotes]);

  /* ─── note submit ────────────────────────────────────────────── */
  const handleSubmitNote = useCallback(
    async (text: string) => {
      if (!identity) throw new Error("no identity");
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: identity, text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof data.error === "string" ? data.error : "send failed"
        );
      }
      await refreshNotes();
    },
    [identity, refreshNotes]
  );

  /* ─── record player handler ──────────────────────────────────── */
  const handleRecordPlayerClick = useCallback(() => {
    if (!identity) return;
    setMusicOpen(true);
  }, [identity]);

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center" aria-hidden>
        <div className="font-playful text-play-cloud/60">opening the door…</div>
      </main>
    );
  }

  const unread = identity && notesState ? unreadCount(notesState, identity) : 0;
  const musicPlaying = !!(musicState?.isPlaying && musicState?.trackUri);

  return (
    <>
      <main className="min-h-screen flex items-start sm:items-center justify-center relative py-4 sm:py-2">
        <Frame>
          <CabinScene
            onFridgeClick={identity ? handleFridgeClick : undefined}
            fridgeUnread={unread > 0}
            onRecordPlayerClick={identity ? handleRecordPlayerClick : undefined}
            recordPlayerActive={musicPlaying}
          />
        </Frame>

        {identity && (
          <button
            type="button"
            onClick={clearIdentity}
            className="fixed bottom-3 right-3 z-30 text-xs font-playful text-play-cloud/60 hover:text-play-cloud bg-night-deep/40 hover:bg-night-deep/70 backdrop-blur rounded-full px-3 py-1.5 transition border border-play-cloud/15"
            title="Switch to the other person"
          >
            i'm {identity === "jason" ? "Jason" : "Melisa"} · switch
          </button>
        )}

        {/* OAuth flash */}
        {oauthFlash && (
          <div
            className="fixed top-4 left-1/2 -translate-x-1/2 z-40 font-playful text-sm text-night-deep rounded-full px-4 py-2 shadow-lg"
            style={{ background: "linear-gradient(135deg, #ffd966 0%, #ff9b3a 100%)" }}
          >
            {oauthFlash}
          </div>
        )}
      </main>

      <IdentityPicker />

      {identity && (
        <>
          <NotesPopup
            open={notesOpen}
            onClose={() => setNotesOpen(false)}
            state={notesState}
            viewer={identity}
            onSubmit={handleSubmitNote}
          />
          <MusicPlayerPanel
            open={musicOpen}
            onClose={() => setMusicOpen(false)}
          />
        </>
      )}
    </>
  );
}
