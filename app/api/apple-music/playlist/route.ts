import { NextResponse, type NextRequest } from "next/server";
import { tracks } from "@/lib/moodify-data";
import { appleMusicRequest, createDeveloperToken, getUserStorefront, matchCatalogTrack } from "@/lib/apple-music-server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: { name?: unknown; description?: unknown; trackIds?: unknown; musicUserToken?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const ids = body.trackIds;
  if (typeof body.name !== "string" || !body.name.trim() || body.name.length > 120 || typeof body.description !== "string" || body.description.length > 500 || !Array.isArray(ids) || ids.length < 1 || ids.length > 30 || !ids.every((id) => typeof id === "string" && tracks.some((track) => track.id === id)) || typeof body.musicUserToken !== "string" || body.musicUserToken.length < 10 || body.musicUserToken.length > 8192) {
    return NextResponse.json({ error: "Invalid playlist or Apple Music session." }, { status: 400 });
  }
  try {
    const { token } = createDeveloperToken();
    const storefront = await getUserStorefront(token, body.musicUserToken);
    const matched: Array<{ id: string; type: "songs" }> = [];
    const missing: string[] = [];
    for (const id of ids as string[]) {
      const song = await matchCatalogTrack(id, storefront, token);
      if (song) matched.push({ id: song.id, type: "songs" });
      else missing.push(id);
    }
    if (!matched.length) return NextResponse.json({ error: "None of these tracks were found in your Apple Music catalog." }, { status: 404 });
    const response = await appleMusicRequest("/v1/me/library/playlists", token, body.musicUserToken, {
      method: "POST",
      body: JSON.stringify({
        attributes: { name: body.name.trim(), description: body.description },
        relationships: { tracks: { data: matched } },
      }),
    });
    if (!response.ok) {
      return NextResponse.json({ error: response.status === 401 || response.status === 403 ? "Apple Music authorization expired. Reconnect your account." : "Apple Music could not save this playlist." }, { status: 502 });
    }
    const result = await response.json() as { data?: Array<{ id?: string }> };
    return NextResponse.json({ id: result.data?.[0]?.id || null, matched: matched.length, missing: missing.length }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Apple Music is unavailable." }, { status: 502 });
  }
}
