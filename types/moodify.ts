export type MoodId =
  | "vibing"
  | "sad"
  | "romantic"
  | "energetic"
  | "calm"
  | "focused"
  | "melancholic"
  | "party"
  | "road-trip"
  | "late-night";

export type Genre =
  | "Any"
  | "Pop"
  | "Hip-Hop"
  | "Rock"
  | "Electronic"
  | "R&B"
  | "Indie"
  | "Bollywood"
  | "Lo-fi";

export type Mood = {
  id: MoodId;
  name: string;
  emoji: string;
  description: string;
  color: string;
  shade: string;
  ink: string;
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  genre: Exclude<Genre, "Any">;
  energy: number;
  moods: MoodId[];
  color: string;
};

export type PlaylistConfig = {
  mood: MoodId;
  secondMood: MoodId | null;
  energy: number;
  genre: Genre;
  length: 10 | 20 | 30;
  seed: number;
};

export type Playlist = {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  config: PlaylistConfig;
  tracks: Track[];
  removedIds: string[];
};
