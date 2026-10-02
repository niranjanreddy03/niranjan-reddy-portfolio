"use client";

import { Heart, Plus, RotateCcw, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { formatDuration } from "@/lib/playlist-generator";
import { appleMusicSearchUrl } from "@/lib/apple-music";
import type { Track } from "@/types/moodify";

type Props = {
  track: Track;
  index: number;
  liked: boolean;
  removed?: boolean;
  appleConnected: boolean;
  playing: boolean;
  onPlay: () => void;
  onLike: () => void;
  onToggle: () => void;
};

export function TrackCard({ track, index, liked, removed = false, appleConnected, playing, onPlay, onLike, onToggle }: Props) {
  return (
    <motion.div
      className={`mf-track ${removed ? "mf-track--removed" : ""}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.025, 0.35) }}
      layout
    >
      <span className="mf-track__index">{String(index + 1).padStart(2, "0")}</span>
      <div className="mf-track__art" style={{ backgroundColor: track.color }} aria-hidden="true"><span>{track.title.slice(0, 1)}</span><i /></div>
      <div className="mf-track__info"><strong>{track.title}</strong><span>{track.artist}<span className="mf-track__dot"> · </span>{track.album}</span></div>
      <span className="mf-track__duration">{formatDuration(track.duration)}</span>
      <div className="mf-track__actions">
        {!removed && (appleConnected
          ? <button type="button" className="mf-icon-button mf-track__play" onClick={onPlay} aria-label={`${playing ? "Pause" : "Play"} ${track.title} in Apple Music`} title={playing ? "Pause" : "Play with Apple Music"}>{playing ? <Pause size={15} fill="currentColor" aria-hidden="true" /> : <Play size={15} fill="currentColor" aria-hidden="true" />}</button>
          : <a className="mf-icon-button mf-track__play" href={appleMusicSearchUrl(track)} target="_blank" rel="noopener noreferrer" aria-label={`Find ${track.title} by ${track.artist} on Apple Music`} title="Find on Apple Music"><Play size={15} fill="currentColor" aria-hidden="true" /></a>)}
        {!removed && <motion.button type="button" className={`mf-icon-button ${liked ? "is-liked" : ""}`} onClick={onLike} aria-label={`${liked ? "Unlike" : "Like"} ${track.title}`} aria-pressed={liked} whileTap={{ scale: 1.25 }} title={liked ? "Unlike track" : "Like track"}><Heart size={17} fill={liked ? "currentColor" : "none"} aria-hidden="true" /></motion.button>}
        <button type="button" className="mf-icon-button" onClick={onToggle} aria-label={`${removed ? "Add" : "Remove"} ${track.title} ${removed ? "back to" : "from"} playlist`} title={removed ? "Add back" : "Remove from playlist"}>{removed ? <RotateCcw size={17} aria-hidden="true" /> : <Plus className="mf-rotated-plus" size={18} aria-hidden="true" />}</button>
      </div>
    </motion.div>
  );
}
