import { moodById } from "@/lib/moodify-data";
import type { MoodId, PlaylistConfig } from "@/types/moodify";

const copy: Record<MoodId, Array<[string, string]>> = {
  vibing: [["Good Mood Club", "A little bounce for whatever comes next."], ["Easy Does It", "The soundtrack to feeling pretty good about right now."], ["Golden State of Mind", "Bright moments, no special occasion required."]],
  sad: [["Rain on the Window", "Songs for staring outside and pretending you're in a movie."], ["It's Okay to Feel It", "A soft landing for a hard day."], ["Blue Hour", "For the feelings that need a little room."]],
  romantic: [["Main Character Energy", "Soft lights, questionable decisions, excellent music."], ["Love, Actually", "For the person on your mind and the song in your head."], ["Heart on Repeat", "All the lovely little things you can't quite say."]],
  energetic: [["No Days Off", "Maximum energy. Minimum excuses."], ["Full Volume", "The kind of momentum you can feel in your chest."], ["Let's Go", "For the next move, and the one after that."]],
  calm: [["Slow Morning", "Make space for a quieter kind of magic."], ["Soft Focus", "Breathe in. Let the rest wait."], ["Room to Breathe", "Gentle songs for finding your center."]],
  focused: [["Do Not Disturb", "Background music for getting things done."], ["In the Zone", "Find your rhythm and follow it."], ["Deep Work", "A soundtrack to the good kind of tunnel vision."]],
  melancholic: [["Beautiful Ache", "A little nostalgia looks good on you."], ["Almost Remembered", "For memories that feel like a film scene."], ["Grey Skies, Good Songs", "The beauty in a bittersweet afternoon."]],
  party: [["After Hours Only", "Good people, loud speakers, no early exits."], ["The Good Part", "Skip straight to the dancing."], ["Keep It Going", "One more song is never just one more song."]],
  "road-trip": [["Windows Down", "The best part is somewhere along the way."], ["Anywhere But Here", "A long road and an even longer playlist."], ["Next Exit: Everywhere", "For detours worth taking."]],
  "late-night": [["Midnight Drive", "For when the city is quiet and you don't want to go home yet."], ["After Midnight", "A little mystery for the hours that belong to you."], ["City Lights", "A soundtrack for taking the long way home."]],
};

export function playlistCopy(config: PlaylistConfig): { title: string; description: string } {
  const variants = copy[config.mood];
  const [title, description] = variants[config.seed % variants.length];
  if (!config.secondMood) return { title, description };
  const second = moodById[config.secondMood];
  return {
    title: `${title} / ${second.name}`,
    description: `${description} With a little ${second.name.toLowerCase()} mixed in.`,
  };
}

export function energyLabel(value: number): string {
  if (value < 35) return "Low key";
  if (value < 65) return "Balanced";
  return "High energy";
}
