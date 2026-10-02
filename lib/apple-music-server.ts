import { createPrivateKey, sign } from "node:crypto";
import { tracks } from "@/lib/moodify-data";
import type { Track } from "@/types/moodify";

type CatalogSong = {
  id: string;
  type: "songs";
  attributes: { name: string; artistName: string; url?: string; artwork?: { url?: string } };
};

function encodeBase64Url(value: string): string {
  return Buffer.from(value).toString("base64url");
}

export function isAppleMusicConfigured(): boolean {
  return Boolean(process.env.APPLE_MUSIC_TEAM_ID && process.env.APPLE_MUSIC_KEY_ID && (process.env.APPLE_MUSIC_PRIVATE_KEY || process.env.APPLE_MUSIC_PRIVATE_KEY_BASE64));
}

export function createDeveloperToken(): { token: string; expiresAt: number } {
  const teamId = process.env.APPLE_MUSIC_TEAM_ID;
  const keyId = process.env.APPLE_MUSIC_KEY_ID;
  const privateKey = process.env.APPLE_MUSIC_PRIVATE_KEY_BASE64
    ? Buffer.from(process.env.APPLE_MUSIC_PRIVATE_KEY_BASE64, "base64").toString("utf8")
    : process.env.APPLE_MUSIC_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!teamId || !keyId || !privateKey) throw new Error("Apple Music is not configured.");
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + 60 * 60 * 12;
  const header = encodeBase64Url(JSON.stringify({ alg: "ES256", kid: keyId, typ: "JWT" }));
  const allowedOrigins = (process.env.APPLE_MUSIC_ALLOWED_ORIGINS || "").split(",").map((origin) => origin.trim()).filter(Boolean);
  const payload = encodeBase64Url(JSON.stringify({ iss: teamId, iat: now, exp: expiresAt, ...(allowedOrigins.length ? { origin: allowedOrigins } : {}) }));
  const unsigned = `${header}.${payload}`;
  const signature = sign("sha256", Buffer.from(unsigned), {
    key: createPrivateKey(privateKey),
    dsaEncoding: "ieee-p1363",
  }).toString("base64url");
  return { token: `${unsigned}.${signature}`, expiresAt };
}

export async function appleMusicRequest(path: string, developerToken: string, musicUserToken?: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${developerToken}`);
  if (musicUserToken) headers.set("Music-User-Token", musicUserToken);
  if (init?.body) headers.set("Content-Type", "application/json");
  return fetch(`https://api.music.apple.com${path}`, { ...init, headers, cache: "no-store" });
}

export async function getUserStorefront(developerToken: string, musicUserToken: string): Promise<string> {
  const response = await appleMusicRequest("/v1/me/storefront", developerToken, musicUserToken);
  if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ? "Apple Music authorization expired. Reconnect your account." : "Could not read your Apple Music storefront.");
  const data = await response.json() as { data?: Array<{ id?: string }> };
  const storefront = data.data?.[0]?.id;
  if (!storefront || !/^[a-z]{2}$/.test(storefront)) throw new Error("Apple Music did not return a valid storefront.");
  return storefront;
}

function normalize(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function matchScore(song: CatalogSong, track: Track): number {
  const title = normalize(track.title);
  const artist = normalize(track.artist.split(/[,&]/)[0]);
  const candidateTitle = normalize(song.attributes.name);
  const candidateArtist = normalize(song.attributes.artistName);
  const titleScore = candidateTitle === title ? 6 : candidateTitle.includes(title) || title.includes(candidateTitle) ? 3 : 0;
  const artistScore = candidateArtist.includes(artist) || artist.includes(candidateArtist) ? 4 : 0;
  return titleScore + artistScore;
}

export async function matchCatalogTrack(trackId: string, storefront: string, developerToken: string): Promise<CatalogSong | null> {
  const track = tracks.find((item) => item.id === trackId);
  if (!track) return null;
  const term = new URLSearchParams({ term: `${track.title} ${track.artist}`, types: "songs", limit: "5" });
  const response = await appleMusicRequest(`/v1/catalog/${storefront}/search?${term}`, developerToken);
  if (!response.ok) throw new Error(response.status === 429 ? "Apple Music is busy. Please try again shortly." : "Apple Music catalog search failed.");
  const data = await response.json() as { results?: { songs?: { data?: CatalogSong[] } } };
  const candidates = data.results?.songs?.data || [];
  const ranked = candidates.map((song) => ({ song, score: matchScore(song, track) })).sort((a, b) => b.score - a.score);
  return ranked[0]?.score >= 7 ? ranked[0].song : null;
}
