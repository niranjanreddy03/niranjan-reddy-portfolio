"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight, Check, Clock3, Disc3, Headphones, Heart, Link2, LoaderCircle, Music2, RefreshCw, Sparkles, X } from "lucide-react";
import type { RefObject } from "react";
import { CoverArt } from "@/components/moodify/cover-art";
import { TrackCard } from "@/components/moodify/track-card";
import { appleMusicSearchUrl } from "@/lib/apple-music";
import { energyLabel } from "@/lib/mood-engine";
import { moodById } from "@/lib/moodify-data";
import { formatPlaylistDuration, playlistDuration, shareUrl } from "@/lib/playlist-generator";
import type { Playlist, Track } from "@/types/moodify";

const loadingLines = ["Reading your mood...", "Finding your vibe...", "Mixing tracks...", "Your playlist is ready."];

type Props = {
  sectionRef: RefObject<HTMLElement | null>;
  playlist: Playlist | null;
  generating: boolean;
  loadingStep: number;
  activeTracks: Track[];
  removedTracks: Track[];
  favorite: boolean;
  likedTrackIds: string[];
  appleConnected: boolean;
  appleSaving: boolean;
  appleSaved: boolean;
  playingTrackId: string | null;
  playing: boolean;
  shareOpen: boolean;
  shareCopied: boolean;
  onRegenerate: () => void;
  onFavorite: () => void;
  onShare: () => void;
  onShareClose: () => void;
  onLike: (id: string) => void;
  onToggleTrack: (id: string) => void;
  onPlay: (track: Track) => void;
  onSaveToApple: () => void;
};

export function PlaylistPanel(props: Props) {
  const { sectionRef, playlist, generating, loadingStep, activeTracks, removedTracks, favorite, likedTrackIds, appleConnected, appleSaving, appleSaved, playingTrackId, playing, shareOpen, shareCopied, onRegenerate, onFavorite, onShare, onShareClose, onLike, onToggleTrack, onPlay, onSaveToApple } = props;
  const firstTrack = activeTracks[0];
  return (
    <section className="mf-result mf-container" id="playlist" ref={sectionRef} aria-labelledby="mf-result-title">
      <div className="mf-section-heading">
        <div><div className="mf-eyebrow">03 / THE GOOD PART</div><h2 id="mf-result-title">Your soundtrack <em>starts here.</em></h2><p>Made for this exact moment.</p></div>
        {playlist && <button type="button" className="mf-inline-button" disabled={generating} onClick={onRegenerate}><RefreshCw size={17} aria-hidden="true" /> Regenerate</button>}
      </div>
      <AnimatePresence mode="wait">
        {generating ? (
          <motion.div key="loading" className="mf-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status" aria-live="polite">
            <div className="mf-loading__disc"><Disc3 size={64} strokeWidth={1.3} aria-hidden="true" /></div>
            <span>THE MIX IS COMING TOGETHER</span><h3>{loadingLines[loadingStep]}</h3>
            <div className="mf-loading__progress"><i style={{ width: `${((loadingStep + 1) / loadingLines.length) * 100}%` }} /></div>
            <div className="mf-skeletons"><i /><i /><i /></div>
          </motion.div>
        ) : playlist ? (
          <motion.div key={playlist.id} className="mf-playlist" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45 }}>
            <div className="mf-playlist__top">
              <div className="mf-playlist__cover"><CoverArt mood={moodById[playlist.config.mood]} title={playlist.title} seed={playlist.config.seed} /></div>
              <div className="mf-playlist__details">
                <div className="mf-playlist__eyebrow"><span>✦</span> YOUR MADE-FOR-YOU MIX</div>
                <h3>{playlist.title}</h3><p>{playlist.description}</p>
                <div className="mf-playlist__tags"><span>{moodById[playlist.config.mood].emoji} {moodById[playlist.config.mood].name}{playlist.config.secondMood ? ` + ${moodById[playlist.config.secondMood].name}` : ""}</span><span>{energyLabel(playlist.config.energy)}</span><span>{playlist.config.genre === "Any" ? "Genre fluid" : `${playlist.config.genre}-first`}</span></div>
                <div className="mf-playlist__meta"><span><Music2 size={16} aria-hidden="true" /> {activeTracks.length} tracks</span><span><Clock3 size={16} aria-hidden="true" /> {formatPlaylistDuration(playlistDuration(playlist))}</span><span><Headphones size={16} aria-hidden="true" /> {appleConnected ? "Apple Music connected" : "Curated discovery mix"}</span></div>
                <div className="mf-playlist__buttons">
                  {appleConnected ? (
                    <button type="button" className="mf-button mf-button--primary" onClick={() => firstTrack && onPlay(firstTrack)} disabled={!firstTrack}><Headphones size={18} aria-hidden="true" /> {playing && playingTrackId === firstTrack?.id ? "Pause" : "Play with Apple Music"} <ArrowRight size={17} aria-hidden="true" /></button>
                  ) : (
                    <a className="mf-button mf-button--primary" href={firstTrack ? appleMusicSearchUrl(firstTrack) : "https://music.apple.com/"} target="_blank" rel="noopener noreferrer"><Headphones size={18} aria-hidden="true" /> Explore on Apple Music <ArrowRight size={17} aria-hidden="true" /></a>
                  )}
                  {appleConnected && <button type="button" className="mf-button mf-button--outline" onClick={onSaveToApple} disabled={appleSaving || appleSaved || !firstTrack}>{appleSaving ? <LoaderCircle className="mf-apple-spin" size={17} aria-hidden="true" /> : appleSaved ? <Check size={17} aria-hidden="true" /> : <Music2 size={17} aria-hidden="true" />}{appleSaving ? "Adding songs..." : appleSaved ? "Added to Apple Music" : "Add to Apple Music"}</button>}
                  <button type="button" className={`mf-button mf-button--outline ${favorite ? "is-favorite" : ""}`} onClick={onFavorite} aria-pressed={favorite}><Heart size={17} fill={favorite ? "currentColor" : "none"} aria-hidden="true" /> {favorite ? "Saved" : "Save mix"}</button>
                  <button type="button" className="mf-button mf-button--outline" onClick={onShare}><Link2 size={17} aria-hidden="true" /> Share</button>
                </div>
                {shareOpen && <div className="mf-share-box"><label htmlFor="mf-share-url">Share this playlist configuration</label><div><input id="mf-share-url" readOnly value={shareUrl(playlist.config)} onFocus={(event) => event.target.select()} aria-label="Shareable playlist URL" /><button type="button" onClick={onShare} aria-label="Copy share link">{shareCopied ? <Check size={17} aria-hidden="true" /> : <Link2 size={17} aria-hidden="true" />}{shareCopied ? "Copied" : "Copy"}</button><button type="button" className="mf-share-close" onClick={onShareClose} aria-label="Close share link"><X size={16} aria-hidden="true" /></button></div></div>}
              </div>
            </div>
            <div className="mf-playlist__trackhead"><span>TRACKLIST</span><span>{appleConnected ? "Play tracks here with Apple Music" : "Play opens Apple Music search · connect for in-app playback"}</span></div>
            <div className="mf-track-list">
              {activeTracks.length ? activeTracks.map((track, index) => <TrackCard key={track.id} track={track} index={index} liked={likedTrackIds.includes(track.id)} appleConnected={appleConnected} playing={playing && playingTrackId === track.id} onPlay={() => onPlay(track)} onLike={() => onLike(track.id)} onToggle={() => onToggleTrack(track.id)} />) : <div className="mf-empty-tracks"><Music2 size={26} aria-hidden="true" /><strong>Your mix is taking a breather.</strong><span>Add a removed track back below.</span></div>}
            </div>
            {removedTracks.length > 0 && <details className="mf-removed"><summary>{removedTracks.length} removed {removedTracks.length === 1 ? "track" : "tracks"} · add back</summary><div>{removedTracks.map((track, index) => <TrackCard key={track.id} track={track} index={index} liked={likedTrackIds.includes(track.id)} removed appleConnected={appleConnected} playing={false} onPlay={() => onPlay(track)} onLike={() => onLike(track.id)} onToggle={() => onToggleTrack(track.id)} />)}</div></details>}
          </motion.div>
        ) : (
          <motion.div key="empty" className="mf-result-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><div><Disc3 size={55} strokeWidth={1.25} aria-hidden="true" /><Sparkles size={21} aria-hidden="true" /></div><h3>The stage is yours.</h3><p>Pick a mood above and we&apos;ll make something worth pressing play for.</p><a className="mf-inline-button" href="#moods">Choose a mood <ArrowDown size={17} aria-hidden="true" /></a></motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
