import { NextResponse, type NextRequest } from "next/server";
import { getAccessToken } from "@/lib/spotify";
import { USER_IDS, type UserId } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/spotify/search?user=jason&q=Bon%20Iver
 *
 * Proxied through the server so we don't expose the access token to
 * the client search input. Returns a slimmed-down list of tracks.
 */
export async function GET(req: NextRequest) {
  const userParam = req.nextUrl.searchParams.get("user");
  const q = req.nextUrl.searchParams.get("q");
  if (
    typeof userParam !== "string" ||
    !(USER_IDS as readonly string[]).includes(userParam)
  ) {
    return NextResponse.json({ error: "invalid user" }, { status: 400 });
  }
  if (!q || !q.trim()) {
    return NextResponse.json({ tracks: [] });
  }

  const user = userParam as UserId;
  const access = await getAccessToken(user);
  if (!access) {
    return NextResponse.json({ error: "not connected" }, { status: 401 });
  }

  const url = new URL("https://api.spotify.com/v1/search");
  url.searchParams.set("q", q);
  url.searchParams.set("type", "track");
  url.searchParams.set("limit", "10");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    console.warn("spotify search failed", res.status, text);
    return NextResponse.json(
      { error: "search_failed", status: res.status },
      { status: 502 }
    );
  }

  const data = (await res.json()) as {
    tracks: {
      items: Array<{
        id: string;
        uri: string;
        name: string;
        duration_ms: number;
        artists: { name: string }[];
        album: { name: string; images: { url: string; width: number }[] };
      }>;
    };
  };

  const tracks = data.tracks.items.map((t) => ({
    id: t.id,
    uri: t.uri,
    name: t.name,
    durationMs: t.duration_ms,
    artists: t.artists.map((a) => a.name).join(", "),
    album: t.album.name,
    art: pickAlbumArt(t.album.images),
  }));

  return NextResponse.json({ tracks });
}

function pickAlbumArt(images: { url: string; width: number }[]): string | null {
  if (!images || images.length === 0) return null;
  // Prefer the smallest image >= 200px wide.
  const sorted = [...images].sort((a, b) => a.width - b.width);
  const good = sorted.find((i) => i.width >= 200);
  return (good ?? sorted[sorted.length - 1]).url;
}

export type SearchTrack = {
  id: string;
  uri: string;
  name: string;
  durationMs: number;
  artists: string;
  album: string;
  art: string | null;
};
