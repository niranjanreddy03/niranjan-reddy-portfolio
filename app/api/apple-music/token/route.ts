import { NextResponse } from "next/server";
import { createDeveloperToken, isAppleMusicConfigured } from "@/lib/apple-music-server";

export const runtime = "nodejs";

export async function GET() {
  if (!isAppleMusicConfigured()) {
    return NextResponse.json({ error: "Apple Music needs a MusicKit developer key before account connection can be enabled." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  try {
    return NextResponse.json(createDeveloperToken(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "The Apple Music developer key could not be used. Check the server configuration." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
