"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Frame } from "./Frame";
import { CabinScene } from "./CabinScene";
import { IdentityPicker } from "./IdentityPicker";
import { NotesPopup } from "./NotesPopup";
import { useIdentity } from "./IdentityProvider";
import { unreadCount, type NotesState } from "@/lib/types";

const POLL_MS = 15_000;

/**
 * Top-level client wrapper around the cabin. Owns:
 *   • polling for note state (every 15s when tab is visible)
 *   • opening/closing the notes popup
 *   • marking notes as seen when popup opens
 *   • surfacing the unread "!" badge on the fridge
 */
export function HomeClient() {
  const { identity, clearIdentity, hydrated } = useIdentity();
  const [state, setState] = useState<NotesState | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const inFlight = useRef(false);

  // Fetch latest state. Skips overlapping calls.
  const refresh = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const res = await fetch("/api/notes", { cache: "no-store" });
      if (!res.ok) throw new Error(`fetch failed (${res.status})`);
      const data = (await res.json()) as NotesState;
      setState(data);
    } catch (err) {
      // swallow — we'll try again next tick
      console.warn("notes refresh failed", err);
    } finally {
      inFlight.current = false;
    }
  }, []);

  // Initial load + polling
  useEffect(() => {
    if (!identity) return;
    refresh();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, POLL_MS);
    function onVisible() {
      if (document.visibilityState === "visible") refresh();
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [identity, refresh]);

  const handleFridgeClick = useCallback(async () => {
    if (!identity) return;
    setPopupOpen(true);
    // Optimistically clear the unread badge by bumping lastSeen locally
    setState((s) =>
      s ? { ...s, lastSeen: { ...s.lastSeen, [identity]: Date.now() } } : s
    );
    // Also persist server-side so the badge stays cleared next load
    try {
      await fetch("/api/notes/seen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: identity }),
      });
    } catch (err) {
      console.warn("mark-seen failed", err);
    }
    refresh();
  }, [identity, refresh]);

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
      await refresh();
    },
    [identity, refresh]
  );

  // Don't render the cabin while we wait for localStorage — avoids a flicker
  // of the identity picker on revisits.
  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center" aria-hidden>
        <div className="font-playful text-play-cloud/60">opening the door…</div>
      </main>
    );
  }

  const unread = identity && state ? unreadCount(state, identity) : 0;

  return (
    <>
      <main className="min-h-screen flex items-start sm:items-center justify-center relative py-4 sm:py-2">
        <Frame>
          <CabinScene
            onFridgeClick={identity ? handleFridgeClick : undefined}
            fridgeUnread={unread > 0}
          />
        </Frame>

        {/* Tiny "who am I?" toggle, only visible once an identity is picked. */}
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
      </main>

      {/* First-visit picker */}
      <IdentityPicker />

      {/* Notes popup */}
      {identity && (
        <NotesPopup
          open={popupOpen}
          onClose={() => setPopupOpen(false)}
          state={state}
          viewer={identity}
          onSubmit={handleSubmitNote}
        />
      )}
    </>
  );
}
