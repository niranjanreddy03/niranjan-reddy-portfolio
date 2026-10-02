import { NextResponse, type NextRequest } from "next/server";
import { tracks } from "@/lib/moodify-data";
import { createDeveloperToken, getUserStorefront, matchCatalogTrack } from "@/lib/apple-music-server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: { trackId?: unknown; musicUserToken?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (typeof body.trackId !== "string" || !tracks.some((track) => track.id === body.trackId) || typeof body.musicUserToken !== "string" || body.musicUserToken.length < 10 || body.musicUserToken.length > 8192) {
    return NextResponse.json({ error: "Invalid track or Apple Music session." }, { status: 400 });
  }
  try {
    const { token } = createDeveloperToken();
    const storefront = await getUserStorefront(token, body.musicUserToken);
    const song = await matchCatalogTrack(body.trackId, storefront, token);
    if (!song) return NextResponse.json({ error: "This track was not found in your Apple Music catalog." }, { status: 404 });
    return NextResponse.json({ id: song.id, url: song.attributes.url || null }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Apple Music is unavailable." }, { status: 502 });
  }
}
