import { tracks } from "@/lib/moodify-data";
import { playlistCopy } from "@/lib/mood-engine";
import type { Playlist, PlaylistConfig, Track } from "@/types/moodify";

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function rankTracks(config: PlaylistConfig): Track[] {
  const random = seededRandom(config.seed);
  return tracks
    .map((track) => {
      const moodScore = track.moods.includes(config.mood) ? 46 : 0;
      const secondScore = config.secondMood && track.moods.includes(config.secondMood) ? 27 : 0;
      const genreScore = config.genre === "Any" || track.genre === config.genre ? 35 : -15;
      const energyScore = 25 - Math.abs(track.energy - config.energy) * 0.48;
      return { track, score: moodScore + secondScore + genreScore + energyScore + random() * 22 };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ track }) => track);
}

export function generatePlaylist(config: PlaylistConfig): Playlist {
  const { title, description } = playlistCopy(config);
  return {
    id: `${config.mood}-${config.seed}`,
    title,
    description,
    createdAt: Date.now(),
    config,
    tracks: rankTracks(config).slice(0, config.length),
    removedIds: [],
  };
}

export function playlistDuration(playlist: Playlist): number {
  return playlist.tracks
    .filter((track) => !playlist.removedIds.includes(track.id))
    .reduce((sum, track) => sum + track.duration, 0);
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

export function formatPlaylistDuration(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours ? `${hours} hr ${minutes} min` : `${minutes} min`;
}

export function parseSharedPlaylist(params: URLSearchParams): PlaylistConfig | null {
  const mood = params.get("m");
  if (!mood || !["vibing", "sad", "romantic", "energetic", "calm", "focused", "melancholic", "party", "road-trip", "late-night"].includes(mood)) return null;
  const second = params.get("mix");
  const validSecond = second && second !== mood && ["vibing", "sad", "romantic", "energetic", "calm", "focused", "melancholic", "party", "road-trip", "late-night"].includes(second) ? second : null;
  const energy = params.has("e") ? Number(params.get("e")) : 50;
  const length = Number(params.get("n"));
  const seed = params.has("s") ? Number(params.get("s")) : 1;
  const genre = params.get("g") || "Any";
  const allowedGenres = ["Any", "Pop", "Hip-Hop", "Rock", "Electronic", "R&B", "Indie", "Bollywood", "Lo-fi"];
  return {
    mood: mood as PlaylistConfig["mood"],
    secondMood: validSecond as PlaylistConfig["secondMood"],
    energy: Number.isFinite(energy) ? Math.max(0, Math.min(100, energy)) : 50,
    length: length === 20 || length === 30 ? length : 10,
    seed: Number.isSafeInteger(seed) && seed >= 0 ? seed : 1,
    genre: (allowedGenres.includes(genre) ? genre : "Any") as PlaylistConfig["genre"],
  };
}

export function shareUrl(config: PlaylistConfig): string {
  const path = window.location.hostname.toLowerCase().startsWith("moodify.") ? "/" : "/moodify";
  const url = new URL(path, window.location.origin);
  url.searchParams.set("m", config.mood);
  if (config.secondMood) url.searchParams.set("mix", config.secondMood);
  url.searchParams.set("e", String(config.energy));
  url.searchParams.set("g", config.genre);
  url.searchParams.set("n", String(config.length));
  url.searchParams.set("s", String(config.seed));
  return url.toString();
}
