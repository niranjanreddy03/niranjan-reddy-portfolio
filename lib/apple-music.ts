import type { Track } from "@/types/moodify";

export type MusicKitInstance = {
  isAuthorized?: boolean;
  musicUserToken?: string;
  authorize: () => Promise<string>;
  unauthorize: () => Promise<void>;
  setQueue: (descriptor: { songs: string[] }) => Promise<unknown>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
};

type MusicKitGlobal = {
  configure: (options: { developerToken: string; app: { name: string; build: string } }) => Promise<unknown>;
  getInstance: () => MusicKitInstance;
};

declare global {
  interface Window { MusicKit?: MusicKitGlobal }
}

let scriptPromise: Promise<MusicKitGlobal> | null = null;
let configuredPromise: Promise<MusicKitInstance> | null = null;

function loadMusicKit(): Promise<MusicKitGlobal> {
  if (window.MusicKit) return Promise.resolve(window.MusicKit);
  if (scriptPromise) return scriptPromise;
  const loading = new Promise<MusicKitGlobal>((resolve, reject) => {
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => reject(new Error("Apple Music took too long to load. Please try again.")), 15000);
    const finish = () => {
      window.clearTimeout(timeout);
      if (window.MusicKit) resolve(window.MusicKit);
      else reject(new Error("Apple Music could not load in this browser."));
    };
    document.addEventListener("musickitloaded", finish, { once: true });
    script.src = "https://js-cdn.music.apple.com/musickit/v3/musickit.js";
    script.async = true;
    script.onerror = () => { window.clearTimeout(timeout); reject(new Error("Apple Music could not load. Check your connection or content blocker.")); };
    document.head.appendChild(script);
  });
  const result = loading.catch((error) => { scriptPromise = null; throw error; });
  scriptPromise = result;
  return result;
}

async function jsonOrError<T>(response: Response): Promise<T> {
  const data = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(data.error || "Apple Music is unavailable.");
  return data;
}

export function initializeAppleMusic(): Promise<MusicKitInstance> {
  if (configuredPromise) return configuredPromise;
  configuredPromise = (async () => {
    const tokenResponse = await fetch("/api/apple-music/token", { cache: "no-store" });
    const { token } = await jsonOrError<{ token: string }>(tokenResponse);
    const MusicKit = await loadMusicKit();
    await MusicKit.configure({ developerToken: token, app: { name: "Moodify", build: "1.0.0" } });
    return MusicKit.getInstance();
  })().catch((error) => { configuredPromise = null; throw error; });
  return configuredPromise;
}

export function appleMusicSearchUrl(track: Pick<Track, "title" | "artist">): string {
  return `https://music.apple.com/search?term=${encodeURIComponent(`${track.title} ${track.artist}`)}`;
}

export async function matchAppleTrack(trackId: string, musicUserToken: string): Promise<{ id: string; url: string | null }> {
  const response = await fetch("/api/apple-music/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trackId, musicUserToken }),
  });
  return jsonOrError(response);
}

export async function saveApplePlaylist(input: { name: string; description: string; trackIds: string[]; musicUserToken: string }): Promise<{ id: string | null; matched: number; missing: number }> {
  const response = await fetch("/api/apple-music/playlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return jsonOrError(response);
}
