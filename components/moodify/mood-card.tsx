"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import type { Mood } from "@/types/moodify";

type Props = { mood: Mood; selected: boolean; onSelect: () => void; index: number };

export function MoodCard({ mood, selected, onSelect, index }: Props) {
  return (
    <motion.button
      type="button"
      className={`mf-mood-card ${selected ? "is-selected" : ""}`}
      style={{ "--card-color": mood.color, "--card-shade": mood.shade, "--card-ink": mood.ink } as CSSProperties}
      onClick={onSelect}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.045, 0.35), duration: 0.36 }}
      aria-pressed={selected}
      aria-label={`Select ${mood.name} mood`}
    >
      <span className="mf-mood-card__top"><span className="mf-mood-card__emoji" aria-hidden="true">{mood.emoji}</span><ArrowUpRight size={18} aria-hidden="true" /></span>
      <span className="mf-mood-card__ring" aria-hidden="true" />
      <span className="mf-mood-card__content"><strong>{mood.name}</strong><small>{mood.description}</small></span>
    </motion.button>
  );
}
