export type UserId = "jason" | "melisa";

export const USER_IDS: readonly UserId[] = ["jason", "melisa"] as const;

export type Note = {
  id: string;
  author: UserId;
  text: string;
  createdAt: number; // unix ms
};

export type LastSeen = Record<UserId, number>;

export type NotesState = {
  notes: Note[];
  lastSeen: LastSeen;
};

export function otherUser(u: UserId): UserId {
  return u === "jason" ? "melisa" : "jason";
}

/**
 * A note is "unread" for the viewer if it was written by the other person
 * AFTER the viewer last opened the notes panel.
 *
 * If the viewer wrote it, they trivially "saw" it — no badge.
 */
export function unreadCount(state: NotesState, viewer: UserId): number {
  const cutoff = state.lastSeen[viewer] ?? 0;
  return state.notes.filter(
    (n) => n.author !== viewer && n.createdAt > cutoff
  ).length;
}
