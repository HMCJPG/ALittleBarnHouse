/**
 * Server-side notes domain logic.
 *
 * Storage layout (in KV):
 *   barnhouse:notes        → Note[] (newest last)
 *   barnhouse:lastSeen     → LastSeen { jason: number, melisa: number }
 *
 * Notes are stored as a single JSON blob. For a couple's note app this is
 * plenty efficient — there will only ever be hundreds at most, and we read
 * them in one round trip.
 */
import { kvGet, kvSet } from "./store";
import type { LastSeen, Note, NotesState, UserId } from "./types";

const NOTES_KEY = "barnhouse:notes";
const LAST_SEEN_KEY = "barnhouse:lastSeen";

const MAX_NOTE_LEN = 1000;
const MAX_NOTES = 500; // hard cap so the blob doesn't grow forever

async function readNotes(): Promise<Note[]> {
  return (await kvGet<Note[]>(NOTES_KEY)) ?? [];
}

async function readLastSeen(): Promise<LastSeen> {
  return (await kvGet<LastSeen>(LAST_SEEN_KEY)) ?? { jason: 0, melisa: 0 };
}

export async function getState(): Promise<NotesState> {
  const [notes, lastSeen] = await Promise.all([readNotes(), readLastSeen()]);
  return { notes, lastSeen };
}

export async function addNote(
  author: UserId,
  text: string
): Promise<Note> {
  const clean = text.trim().slice(0, MAX_NOTE_LEN);
  if (!clean) throw new Error("empty note");

  const note: Note = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    author,
    text: clean,
    createdAt: Date.now(),
  };

  const notes = await readNotes();
  notes.push(note);
  // keep the most recent MAX_NOTES
  const trimmed = notes.length > MAX_NOTES ? notes.slice(-MAX_NOTES) : notes;
  await kvSet(NOTES_KEY, trimmed);

  // Author has trivially "seen" their own note — bump lastSeen so they
  // don't trigger an unread badge for themselves.
  const lastSeen = await readLastSeen();
  lastSeen[author] = note.createdAt;
  await kvSet(LAST_SEEN_KEY, lastSeen);

  return note;
}

export async function markSeen(user: UserId): Promise<LastSeen> {
  const lastSeen = await readLastSeen();
  lastSeen[user] = Date.now();
  await kvSet(LAST_SEEN_KEY, lastSeen);
  return lastSeen;
}
