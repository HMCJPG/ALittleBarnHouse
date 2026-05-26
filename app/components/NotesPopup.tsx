"use client";

import { useEffect, useRef, useState } from "react";
import type { Note, NotesState, UserId } from "@/lib/types";

/**
 * The note-leaving popup that opens when you click the fridge.
 *
 * Layout: a single feed of notes (newest first), each tagged with who
 * sent it. Beneath the feed, a notepad input that submits as the
 * current user.
 *
 * The popup's title is viewer-aware:
 *   • Jason sees → "With Love and Adoration, From Melisa, to Jason"
 *   • Melisa sees → "With Adoration and Love, to Melisa"
 */
export function NotesPopup({
  open,
  onClose,
  state,
  viewer,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  state: NotesState | null;
  viewer: UserId;
  onSubmit: (text: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Focus the textarea when opened
  useEffect(() => {
    if (open) {
      // small delay so the transition doesn't fight the focus
      setTimeout(() => textareaRef.current?.focus(), 80);
    } else {
      setDraft("");
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  const title =
    viewer === "jason"
      ? "With Love and Adoration, From Melisa, to Jason"
      : "With Adoration and Love, to Melisa";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setError(null);
    try {
      await onSubmit(text);
      setDraft("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't send. Try again?"
      );
    } finally {
      setSending(false);
    }
  }

  // Notes sorted newest first for display
  const sortedNotes = state
    ? [...state.notes].sort((a, b) => b.createdAt - a.createdAt)
    : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notes-title"
      className="fixed inset-0 z-40 flex items-center justify-center px-4 py-6"
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-night-deep/80 backdrop-blur-sm cursor-default"
      />

      <div
        ref={dialogRef}
        className="relative w-full max-w-xl max-h-[88vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background:
            "linear-gradient(180deg, #fff9ec 0%, #f7eed2 100%)",
          boxShadow:
            "0 20px 60px -12px rgba(0,0,0,0.65), inset 0 2px 0 rgba(255,255,255,0.6)",
        }}
      >
        {/* decorative wood frame edge */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            boxShadow:
              "inset 0 0 0 4px #c4a878, inset 0 0 0 6px #6b3f23",
          }}
          aria-hidden
        />

        {/* close button */}
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

        {/* header */}
        <header className="text-center px-6 pt-7 pb-4">
          <div className="text-xl mb-1" aria-hidden>
            ✿
          </div>
          <h2
            id="notes-title"
            className="font-playful font-semibold text-cabin-wooddark text-lg sm:text-xl leading-snug"
          >
            {title}
          </h2>
          <div
            className="mx-auto mt-3 h-px w-24"
            style={{ background: "linear-gradient(90deg, transparent, #c4a878, transparent)" }}
            aria-hidden
          />
        </header>

        {/* feed */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 pb-3 space-y-3">
          {sortedNotes.length === 0 ? (
            <EmptyState viewer={viewer} />
          ) : (
            sortedNotes.map((n) => (
              <NoteCard key={n.id} note={n} viewer={viewer} />
            ))
          )}
        </div>

        {/* composer */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-cabin-wooddark/15 px-5 sm:px-7 py-4 bg-[#fffaf0]"
        >
          <label
            htmlFor="note-input"
            className="block font-playful text-xs uppercase tracking-wider text-cabin-wooddark/60 mb-2"
          >
            Leave a note {viewer === "jason" ? "for Melisa" : "for Jason"}
          </label>
          <div className="relative">
            <textarea
              ref={textareaRef}
              id="note-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                // ⌘/Ctrl+Enter submits
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent);
                }
              }}
              rows={3}
              maxLength={1000}
              placeholder={
                viewer === "jason"
                  ? "Dear Melisa,"
                  : "Dear Jason,"
              }
              className="w-full resize-none rounded-xl border border-cabin-wooddark/25 bg-[#fffdf5] p-3 font-playful text-cabin-wooddark placeholder-cabin-wooddark/35 focus:outline-none focus:border-cabin-glow focus:ring-2 focus:ring-cabin-glow/40 transition"
              style={{
                // a barely-there ruled-paper feel
                backgroundImage:
                  "repeating-linear-gradient(transparent 0, transparent 27px, rgba(107,63,35,0.08) 27px, rgba(107,63,35,0.08) 28px)",
                lineHeight: "28px",
              }}
            />
            <div className="absolute bottom-2 right-3 text-xs text-cabin-wooddark/40 font-playful">
              {draft.length}/1000
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-700 mt-2 font-playful">{error}</p>
          )}

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs font-playful text-cabin-wooddark/50">
              ⌘/Ctrl + Enter to send
            </p>
            <button
              type="submit"
              disabled={!draft.trim() || sending}
              className="font-playful font-semibold text-white rounded-xl px-5 py-2.5 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-md"
              style={{
                background:
                  "linear-gradient(135deg, #ff9b5a 0%, #ff7b3a 60%, #c44a1a 100%)",
              }}
            >
              {sending ? "Sending…" : "Send with love"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function NoteCard({ note, viewer }: { note: Note; viewer: UserId }) {
  const fromMe = note.author === viewer;
  const fromName = note.author === "jason" ? "Jason" : "Melisa";
  const toName = note.author === "jason" ? "Melisa" : "Jason";

  return (
    <article
      className="relative rounded-xl px-4 py-3 shadow-sm"
      style={{
        background: fromMe
          ? "linear-gradient(180deg, #fff8e0 0%, #fceec0 100%)"
          : "linear-gradient(180deg, #fdeaf0 0%, #f8d4dd 100%)",
        boxShadow:
          "0 1px 0 rgba(0,0,0,0.06), 0 4px 10px -6px rgba(0,0,0,0.15)",
      }}
    >
      {/* little stationery pin */}
      <div
        className="absolute -top-1.5 left-3 w-3 h-3 rounded-full"
        style={{
          background: fromMe
            ? "radial-gradient(circle at 35% 30%, #ffd966 0%, #b87a2b 80%)"
            : "radial-gradient(circle at 35% 30%, #f78ca0 0%, #a82a48 80%)",
          boxShadow: "0 1px 1px rgba(0,0,0,0.25)",
        }}
        aria-hidden
      />
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <p className="font-playful text-xs uppercase tracking-wider text-cabin-wooddark/70">
          From {fromName} <span className="opacity-50">→</span> {toName}
        </p>
        <time
          className="font-playful text-[11px] text-cabin-wooddark/50 shrink-0"
          dateTime={new Date(note.createdAt).toISOString()}
        >
          {formatRelativeTime(note.createdAt)}
        </time>
      </div>
      <p className="font-playful text-cabin-wooddark whitespace-pre-wrap break-words leading-snug">
        {note.text}
      </p>
    </article>
  );
}

function EmptyState({ viewer }: { viewer: UserId }) {
  const them = viewer === "jason" ? "Melisa" : "Jason";
  return (
    <div className="text-center py-10 px-4 font-playful text-cabin-wooddark/55">
      <div className="text-3xl mb-2" aria-hidden>
        ✉️
      </div>
      <p className="text-sm">
        No notes yet. Be the first to leave one for {them}.
      </p>
    </div>
  );
}

function formatRelativeTime(t: number): string {
  const diff = Date.now() - t;
  const min = 60_000;
  const hr = 60 * min;
  const day = 24 * hr;
  const wk = 7 * day;
  if (diff < min) return "just now";
  if (diff < hr) return `${Math.floor(diff / min)}m ago`;
  if (diff < day) return `${Math.floor(diff / hr)}h ago`;
  if (diff < wk) return `${Math.floor(diff / day)}d ago`;
  return new Date(t).toLocaleDateString();
}
