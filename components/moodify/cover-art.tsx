import type { CSSProperties } from "react";
import type { Mood } from "@/types/moodify";

type Props = { mood: Mood; title: string; compact?: boolean; seed?: number };

export function CoverArt({ mood, title, compact = false, seed = 1 }: Props) {
  return (
    <div
      className={`mf-cover ${compact ? "mf-cover--compact" : ""}`}
      style={{ "--cover-color": mood.color, "--cover-shade": mood.shade, "--cover-rotation": `${(seed % 7) * 11 - 28}deg` } as CSSProperties}
      aria-label={`${title} playlist artwork`}
      role="img"
    >
      <div className="mf-cover-orbit mf-cover-orbit--one" />
      <div className="mf-cover-orbit mf-cover-orbit--two" />
      <div className="mf-cover-disc"><div /></div>
      <span className="mf-cover-mark">M<span>✳</span></span>
      <div className="mf-cover-caption"><span>Moodify presents</span><strong>{title}</strong></div>
      <span className="mf-cover-edition">MIX · {String(seed % 100).padStart(2, "0")}</span>
    </div>
  );
}
