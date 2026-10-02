import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./moodify.css";

export const metadata: Metadata = {
  title: "Moodify — Music for how you feel",
  description: "Pick a mood, shape the energy, and discover a playlist made for this moment. A playful music discovery experience.",
  icons: { icon: "/moodify-icon.svg" },
  openGraph: { title: "Moodify — Music for how you feel", description: "Your mood has a soundtrack. Find it with Moodify." },
};

export default function MoodifyLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
