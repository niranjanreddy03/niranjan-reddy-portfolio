"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Disc3, Heart, Moon, Music2, Shuffle, SlidersHorizontal, Sparkles, Sun, WandSparkles, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CoverArt } from "@/components/moodify/cover-art";
import { AppleMusicButton, type AppleMusicStatus } from "@/components/moodify/apple-music-button";
import { MoodCard } from "@/components/moodify/mood-card";
import { PlaylistPanel } from "@/components/moodify/playlist-panel";
import { initializeAppleMusic, matchAppleTrack, saveApplePlaylist, type MusicKitInstance } from "@/lib/apple-music";
import { energyLabel } from "@/lib/mood-engine";
import { genres, moodById, moods } from "@/lib/moodify-data";
import { generatePlaylist, parseSharedPlaylist, shareUrl } from "@/lib/playlist-generator";
import type { Genre, MoodId, Playlist, PlaylistConfig, Track } from "@/types/moodify";

const HISTORY_KEY = "moodify-history-v1";
const FAVORITES_KEY = "moodify-favorites-v1";
const LIKES_KEY = "moodify-liked-tracks-v1";
const THEME_KEY = "moodify-theme-v1";
const loadingLines = ["Reading your mood...", "Finding your vibe...", "Mixing tracks...", "Your playlist is ready."];

function newSeed(): number { return Math.floor(Math.random() * 1_000_000_000) + 1; }
function randomMood(exclude?: MoodId): MoodId {
  const options = moods.filter((item) => item.id !== exclude);
  return options[Math.floor(Math.random() * options.length)].id;
}
function wait(ms: number): Promise<void> { return new Promise((resolve) => window.setTimeout(resolve, ms)); }

export function MoodifyApp() {
  const [selectedMood, setSelectedMood] = useState<MoodId | null>(null);
  const [secondMood, setSecondMood] = useState<MoodId | null>(null);
  const [mixing, setMixing] = useState(false);
  const [energy, setEnergy] = useState(54);
  const [genre, setGenre] = useState<Genre>("Any");
  const [length, setLength] = useState<10 | 20 | 30>(10);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [history, setHistory] = useState<Playlist[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [hydrated, setHydrated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [notice, setNotice] = useState("");
  const [appleStatus, setAppleStatus] = useState<AppleMusicStatus>("loading");
  const [appleError, setAppleError] = useState("");
  const [musicUserToken, setMusicUserToken] = useState<string | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [appleSaving, setAppleSaving] = useState(false);
  const [appleSaved, setAppleSaved] = useState(false);
  const musicRef = useRef<MusicKitInstance | null>(null);
  const playlistRef = useRef<HTMLElement>(null);
  const customizeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      const savedFavorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      const savedLikes = JSON.parse(localStorage.getItem(LIKES_KEY) || "[]");
      if (Array.isArray(savedHistory)) setHistory(savedHistory.slice(0, 20));
      if (Array.isArray(savedFavorites)) setFavoriteIds(savedFavorites);
      if (Array.isArray(savedLikes)) setLikedTrackIds(savedLikes);
      const savedTheme = localStorage.getItem(THEME_KEY);
      setTheme(savedTheme === "light" || savedTheme === "dark" ? savedTheme : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
    } catch {
      setNotice("Your browser blocked saved mixes. You can still make a playlist this session.");
    }
    const shared = parseSharedPlaylist(new URLSearchParams(window.location.search));
    if (shared) {
      setSelectedMood(shared.mood);
      setSecondMood(shared.secondMood);
      setMixing(Boolean(shared.secondMood));
      setEnergy(shared.energy);
      setGenre(shared.genre);
      setLength(shared.length);
      setPlaylist(generatePlaylist(shared));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
      localStorage.setItem(LIKES_KEY, JSON.stringify(likedTrackIds));
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      setNotice("Storage is unavailable. Your mix will last until this tab closes.");
    }
  }, [history, favoriteIds, likedTrackIds, theme, hydrated]);

  useEffect(() => {
    let alive = true;
    void initializeAppleMusic().then((music) => {
      if (!alive) return;
      musicRef.current = music;
      if (music.isAuthorized && music.musicUserToken) {
        setMusicUserToken(music.musicUserToken);
        setAppleStatus("connected");
      } else {
        setAppleStatus("ready");
      }
    }).catch((error) => {
      if (!alive) return;
      const message = error instanceof Error ? error.message : "Apple Music is unavailable.";
      setAppleError(message);
      setAppleStatus(message.includes("developer key") ? "unconfigured" : "error");
    });
    return () => { alive = false; };
  }, []);

  const activeMood = moodById[selectedMood || "vibing"];
  const activeTracks = playlist?.tracks.filter((track) => !playlist.removedIds.includes(track.id)) || [];
  const removedTracks = playlist?.tracks.filter((track) => playlist.removedIds.includes(track.id)) || [];
  const shownHistory = favoritesOnly ? history.filter((item) => favoriteIds.includes(item.id)) : history;

  function selectMood(mood: MoodId) {
    setSelectedMood(mood);
    if (secondMood === mood) setSecondMood(null);
    window.setTimeout(() => customizeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 90);
  }

  function syncPlaylist(updated: Playlist) {
    setPlaylist(updated);
    setHistory((items) => items.map((item) => item.id === updated.id ? updated : item));
  }

  async function makePlaylist(config: PlaylistConfig) {
    if (generating) return;
    setGenerating(true);
    setLoadingStep(0);
    setNotice("");
    setShareOpen(false);
    setAppleSaved(false);
    for (let step = 0; step < loadingLines.length; step += 1) {
      setLoadingStep(step);
      await wait(step === loadingLines.length - 1 ? 260 : 390);
    }
    const result = generatePlaylist(config);
    setPlaylist(result);
    setHistory((items) => [result, ...items.filter((item) => item.id !== result.id)].slice(0, 20));
    setGenerating(false);
    window.setTimeout(() => playlistRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  function currentConfig(seed = newSeed()): PlaylistConfig | null {
    if (!selectedMood) return null;
    return { mood: selectedMood, secondMood: mixing ? secondMood : null, energy, genre, length, seed };
  }

  function surpriseMe() {
    const mood = randomMood();
    const genresForSurprise = genres.filter((item) => item !== "Any");
    const nextGenre = Math.random() < 0.45 ? "Any" : genresForSurprise[Math.floor(Math.random() * genresForSurprise.length)];
    const nextEnergy = Math.floor(Math.random() * 76) + 15;
    const nextLength = ([10, 20, 30] as const)[Math.floor(Math.random() * 3)];
    setSelectedMood(mood);
    setSecondMood(null);
    setMixing(false);
    setGenre(nextGenre);
    setEnergy(nextEnergy);
    setLength(nextLength);
    void makePlaylist({ mood, secondMood: null, energy: nextEnergy, genre: nextGenre, length: nextLength, seed: newSeed() });
  }

  function toggleFavorite() {
    if (!playlist) return;
    setFavoriteIds((items) => items.includes(playlist.id) ? items.filter((id) => id !== playlist.id) : [playlist.id, ...items]);
  }

  function toggleTrackLike(id: string) {
    setLikedTrackIds((items) => items.includes(id) ? items.filter((item) => item !== id) : [id, ...items]);
  }

  function toggleTrack(id: string) {
    if (!playlist) return;
    const removedIds = playlist.removedIds.includes(id) ? playlist.removedIds.filter((item) => item !== id) : [...playlist.removedIds, id];
    syncPlaylist({ ...playlist, removedIds });
  }

  function restorePlaylist(item: Playlist) {
    setPlaylist(item);
    setSelectedMood(item.config.mood);
    setSecondMood(item.config.secondMood);
    setMixing(Boolean(item.config.secondMood));
    setEnergy(item.config.energy);
    setGenre(item.config.genre);
    setLength(item.config.length);
    setAppleSaved(false);
    window.setTimeout(() => playlistRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
  }

  async function copyShareLink() {
    if (!playlist) return;
    setShareOpen(true);
    try {
      await navigator.clipboard.writeText(shareUrl(playlist.config));
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2400);
    } catch {
      setShareCopied(false);
      setNotice("Copy the link from the field below to share this mix.");
    }
  }

  async function connectAppleMusic() {
    const music = musicRef.current;
    if (!music) { setNotice(appleError || "Apple Music is still loading."); return; }
    setAppleStatus("connecting");
    try {
      const token = await music.authorize();
      if (!token) throw new Error("Apple Music did not return an account token.");
      setMusicUserToken(token);
      setAppleStatus("connected");
      setNotice("Apple Music connected. You can play tracks and add your mix to your library.");
    } catch (error) {
      setAppleStatus("ready");
      setNotice(error instanceof Error ? `Apple Music connection failed: ${error.message}` : "Apple Music connection failed. Please try again.");
    }
  }

  async function disconnectAppleMusic() {
    try { await musicRef.current?.pause(); } catch { /* The player may already be stopped. */ }
    try { await musicRef.current?.unauthorize(); } catch { /* Clear this page's session even if Apple fails to respond. */ }
    setMusicUserToken(null);
    setPlayingTrackId(null);
    setPlaying(false);
    setAppleStatus("ready");
    setNotice("Apple Music disconnected.");
  }

  async function playAppleTrack(track: Track) {
    const music = musicRef.current;
    if (!music || !musicUserToken) { setNotice("Connect Apple Music to play tracks here."); return; }
    try {
      if (playingTrackId === track.id && playing) {
        await music.pause();
        setPlaying(false);
        return;
      }
      if (playingTrackId === track.id) {
        await music.play();
        setPlaying(true);
        return;
      }
      const match = await matchAppleTrack(track.id, musicUserToken);
      await music.setQueue({ songs: [match.id] });
      await music.play();
      setPlayingTrackId(track.id);
      setPlaying(true);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Apple Music playback failed.");
    }
  }

  async function addPlaylistToAppleMusic() {
    if (!playlist || !musicUserToken || !activeTracks.length) return;
    setAppleSaving(true);
    try {
      const result = await saveApplePlaylist({
        name: playlist.title,
        description: playlist.description,
        trackIds: activeTracks.map((track) => track.id),
        musicUserToken,
      });
      setAppleSaved(true);
      setNotice(result.missing ? `Added ${result.matched} songs to Apple Music. ${result.missing} were unavailable in your region.` : `Added ${result.matched} songs to your Apple Music library.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not add this playlist to Apple Music.");
    } finally {
      setAppleSaving(false);
    }
  }

  return (
    <main className="moodify" data-theme={theme} style={{ "--mf-accent": activeMood.color, "--mf-accent-dark": activeMood.shade } as CSSProperties}>
      <div className="mf-ambient mf-ambient--one" aria-hidden="true" /><div className="mf-ambient mf-ambient--two" aria-hidden="true" />
      <header className="mf-header mf-container">
        <a className="mf-logo" href="/moodify" aria-label="Moodify home"><span className="mf-logo__icon"><Disc3 size={21} strokeWidth={2.4} aria-hidden="true" /></span><span>moodify<span className="mf-logo__dot">.</span></span></a>
        <nav className="mf-nav" aria-label="Main navigation"><a href="#moods">Explore moods</a><a href="#library">Your library</a></nav>
        <div className="mf-header__actions">
          <AppleMusicButton status={appleStatus} onConnect={() => void connectAppleMusic()} onDisconnect={() => void disconnectAppleMusic()} onUnavailable={() => setNotice(appleError || "Apple Music is loading. Please try again.")} />
          <button type="button" className="mf-icon-button mf-theme-toggle" onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title="Toggle theme">{theme === "dark" ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}</button>
        </div>
      </header>

      <section className="mf-hero mf-container" aria-labelledby="mf-hero-title">
        <div className="mf-hero__copy"><div className="mf-eyebrow"><span className="mf-eyebrow__line" /> THE SOUNDTRACK TO RIGHT NOW</div><h1 id="mf-hero-title">Every feeling<br />has a <em>frequency.</em></h1><p>Whatever your mood, there&apos;s a mix for it. Pick a feeling, make it yours, and let the music meet you there.</p><div className="mf-hero__actions"><a className="mf-button mf-button--primary" href="#moods">Find your sound <ArrowRight size={18} aria-hidden="true" /></a><button type="button" className="mf-button mf-button--ghost" onClick={surpriseMe}><Shuffle size={18} aria-hidden="true" /> Surprise me</button></div><div className="mf-hero__note"><span className="mf-wave-bars" aria-hidden="true"><i /><i /><i /><i /><i /></span> No sign-up. Just good music.</div></div>
        <div className="mf-hero__visual" aria-hidden="true"><div className="mf-hero__halo" /><div className="mf-hero__cover mf-hero__cover--back"><CoverArt mood={moodById.romantic} title="Heart on Repeat" seed={7} compact /></div><div className="mf-hero__cover mf-hero__cover--middle"><CoverArt mood={moodById["late-night"]} title="Midnight Drive" seed={13} compact /></div><div className="mf-hero__cover mf-hero__cover--front"><CoverArt mood={moodById.vibing} title="Good Mood Club" seed={3} compact /></div><div className="mf-float-label"><span>✦</span> Your vibe, your way</div></div>
      </section>

      <section className="mf-moods mf-container" id="moods" aria-labelledby="mf-moods-title"><div className="mf-section-heading"><div><div className="mf-eyebrow">01 / FIRST THINGS FIRST</div><h2 id="mf-moods-title">What are you <em>feeling</em> today?</h2><p>There are no wrong answers. Go with your gut.</p></div><button type="button" className="mf-inline-button" onClick={() => selectMood(randomMood(selectedMood || undefined))}><Shuffle size={17} aria-hidden="true" /> Shuffle mood</button></div><div className="mf-mood-grid">{moods.map((mood, index) => <MoodCard key={mood.id} mood={mood} index={index} selected={selectedMood === mood.id} onSelect={() => selectMood(mood.id)} />)}</div></section>

      <section className="mf-customize mf-container" id="customize" ref={customizeRef} aria-labelledby="mf-customize-title"><div className="mf-section-heading"><div><div className="mf-eyebrow">02 / MAKE IT YOURS</div><h2 id="mf-customize-title">Fine-tune your <em>vibe.</em></h2><p>A few little tweaks make it feel like you.</p></div><span className="mf-step-pill"><SlidersHorizontal size={15} aria-hidden="true" /> YOUR MIX, YOUR RULES</span></div><div className="mf-customize-card"><div className="mf-customize-card__main"><div className="mf-control-heading"><span className="mf-control-number">01</span><div><h3>How much energy?</h3><p>Set the pace for your playlist.</p></div><strong>{energyLabel(energy)}</strong></div><div className="mf-slider-wrap"><span>🧊 Chill</span><input type="range" min="0" max="100" value={energy} onChange={(event) => setEnergy(Number(event.target.value))} style={{ "--range-progress": `${energy}%` } as CSSProperties} aria-label="Playlist energy" /><span>Energetic 🔥</span></div><div className="mf-control-divider" /><div className="mf-control-heading"><span className="mf-control-number">02</span><div><h3>Pick a genre</h3><p>We&apos;ll use it to guide the sound.</p></div></div><div className="mf-genre-list" role="group" aria-label="Genre">{genres.map((item) => <button type="button" key={item} className={`mf-genre ${genre === item ? "is-active" : ""}`} onClick={() => setGenre(item)} aria-pressed={genre === item}>{item}</button>)}</div><div className="mf-control-divider" /><div className="mf-control-heading"><span className="mf-control-number">03</span><div><h3>How long is the ride?</h3><p>Choose your playlist length.</p></div></div><div className="mf-length-list" role="group" aria-label="Playlist length">{([10, 20, 30] as const).map((count) => <button type="button" key={count} className={length === count ? "is-active" : ""} onClick={() => setLength(count)} aria-pressed={length === count}><Music2 size={17} aria-hidden="true" /> {count} songs</button>)}</div></div><aside className="mf-mixer"><div className="mf-mixer__spark"><Sparkles size={24} aria-hidden="true" /></div><span className="mf-mixer__eyebrow">FEELING TWO THINGS?</span><h3>Meet the Mood Mixer.</h3><p>Some days are more than one mood. Blend a second feeling into your mix.</p><button type="button" className={`mf-mixer__toggle ${mixing ? "is-active" : ""}`} onClick={() => { setMixing(!mixing); if (mixing) setSecondMood(null); }} aria-expanded={mixing}>{mixing ? "Turn mixer off" : "Mix two moods"}<ChevronDown size={17} aria-hidden="true" /></button><AnimatePresence>{mixing && <motion.div className="mf-mixer__choices" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}><p>Choose a second mood</p><div>{moods.filter((item) => item.id !== selectedMood).map((item) => <button type="button" key={item.id} className={secondMood === item.id ? "is-active" : ""} onClick={() => setSecondMood(item.id)} aria-pressed={secondMood === item.id}>{item.emoji} {item.name}</button>)}</div></motion.div>}</AnimatePresence></aside></div><div className="mf-generate-row"><div><span className="mf-generate-dot" /> {selectedMood ? `${activeMood.name}${mixing && secondMood ? ` + ${moodById[secondMood].name}` : ""} is in the mix` : "Choose a mood to get started"}</div><button type="button" className="mf-button mf-button--primary mf-generate-button" onClick={() => { const config = currentConfig(); if (config) void makePlaylist(config); }} disabled={!selectedMood || generating}><WandSparkles size={19} aria-hidden="true" /> {generating ? "Making your mix..." : "Generate my playlist"}<ArrowRight size={19} aria-hidden="true" /></button></div></section>

      <PlaylistPanel
        sectionRef={playlistRef}
        playlist={playlist}
        generating={generating}
        loadingStep={loadingStep}
        activeTracks={activeTracks}
        removedTracks={removedTracks}
        favorite={Boolean(playlist && favoriteIds.includes(playlist.id))}
        likedTrackIds={likedTrackIds}
        appleConnected={appleStatus === "connected"}
        appleSaving={appleSaving}
        appleSaved={appleSaved}
        playingTrackId={playingTrackId}
        playing={playing}
        shareOpen={shareOpen}
        shareCopied={shareCopied}
        onRegenerate={() => { if (playlist) void makePlaylist({ ...playlist.config, seed: newSeed() }); }}
        onFavorite={toggleFavorite}
        onShare={() => void copyShareLink()}
        onShareClose={() => setShareOpen(false)}
        onLike={toggleTrackLike}
        onToggleTrack={toggleTrack}
        onPlay={(track) => void playAppleTrack(track)}
        onSaveToApple={() => void addPlaylistToAppleMusic()}
      />

      <section className="mf-library mf-container" id="library" aria-labelledby="mf-library-title"><div className="mf-section-heading"><div><div className="mf-eyebrow">04 / KEEP THE GOOD ONES</div><h2 id="mf-library-title">Your little <em>music diary.</em></h2><p>Good moods deserve an encore. Your recent mixes live here on this device.</p></div><button type="button" className={`mf-inline-button ${favoritesOnly ? "is-active" : ""}`} onClick={() => setFavoritesOnly((value) => !value)} aria-pressed={favoritesOnly}><Heart size={17} fill={favoritesOnly ? "currentColor" : "none"} aria-hidden="true" /> {favoritesOnly ? "Show all" : "Favorites only"}</button></div>{shownHistory.length ? <div className="mf-history-grid">{shownHistory.map((item) => <button type="button" key={item.id} className="mf-history-card" onClick={() => restorePlaylist(item)}><div className="mf-history-card__art"><CoverArt mood={moodById[item.config.mood]} title={item.title} seed={item.config.seed} compact /></div><div><span>{moodById[item.config.mood].emoji} {moodById[item.config.mood].name} · {item.tracks.length} songs</span><strong>{item.title}</strong><small>{new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })} {favoriteIds.includes(item.id) ? "· ♥ Saved" : ""}</small></div><ArrowRight size={18} aria-hidden="true" /></button>)}</div> : <div className="mf-library-empty"><div><Music2 size={27} aria-hidden="true" /></div><strong>{favoritesOnly ? "No favorites yet" : "A blank page, a world of music."}</strong><span>{favoritesOnly ? "Save a mix you love and it will show up here." : "Your generated playlists will show up here, ready for a replay."}</span></div>}</section>

      <footer className="mf-footer mf-container"><a className="mf-logo" href="/moodify"><span className="mf-logo__icon"><Disc3 size={18} aria-hidden="true" /></span><span>moodify<span className="mf-logo__dot">.</span></span></a><span>Feel something. Find something.</span><span>Made for music discovery · 2026</span></footer>
      {notice && <div className="mf-notice" role="status">{notice}<button type="button" onClick={() => setNotice("")} aria-label="Dismiss message"><X size={15} aria-hidden="true" /></button></div>}
    </main>
  );
}
