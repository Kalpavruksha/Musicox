/**
 * lib/audio.ts — Musicox Audio Engine v2
 *
 * Instruments:
 *   🎸 Guitar  → Tone.PluckSynth (Karplus-Strong synthesis, zero CDN)
 *   🎹 Piano   → Tone.Sampler (Salamander Grand Piano, tonejs.github.io CDN)
 *   🥁 Drums   → Tone.MembraneSynth / NoiseSynth / MetalSynth (all built-in)
 *
 * Rules:
 *   - initAudio() MUST be called inside a user-gesture (click/touch) handler
 *   - All play*() functions are synchronous — never await them in event handlers
 *   - Piano samples are pre-loaded during initAudio(); _loading guard prevents double-init
 */

import type * as ToneType from "tone";

// ─── State ────────────────────────────────────────────────────────────────────

let Tone: typeof ToneType | null = null;
let _ready   = false;  // true once all samples loaded + synths created
let _loading = false;  // true while initAudio() is in progress (prevents double-init)

// Instruments
let guitar: ToneType.Sampler | null = null;
let piano:  ToneType.Sampler    | null = null;
let kick:   ToneType.MembraneSynth | null = null;
let snare:  ToneType.NoiseSynth    | null = null;
let hihat:  ToneType.MetalSynth    | null = null;
let tom:    ToneType.MembraneSynth | null = null;

// FX chain (shared by all instruments)
let limiter: ToneType.Limiter | null = null;
let reverb:  ToneType.Reverb  | null = null;

// Guitar string note names — index 0 = low E2, 5 = high E4
const GUITAR_NOTES = ["E2", "A2", "D3", "G3", "B3", "E4"] as const;

// ─── Init ─────────────────────────────────────────────────────────────────────

/**
 * Call this ONCE inside a user click/touch handler.
 * Lazy-loads Tone.js, creates all synths, and waits for piano samples.
 * Safe to call multiple times — subsequent calls are no-ops.
 */
export async function initAudio(): Promise<void> {
  if (_ready || _loading) return;
  _loading = true;

  try {
    // Dynamic import keeps Tone.js out of the SSR bundle
    Tone = await import("tone");
    const T = Tone;

    // Unlock the Web Audio API (browser requires user-gesture before first call)
    await T.start();
    if (T.getContext().state !== "running") {
      await T.getContext().resume();
    }

    // ── FX chain: instruments → limiter → reverb → destination ────────
    limiter = new T.Limiter(-6);
    reverb  = new T.Reverb({ decay: 1.5, wet: 0.15 });
    await reverb.ready;
    limiter.connect(reverb);
    reverb.toDestination();

    // ── 🎸 Guitar — Acoustic Nylon Sampler (from /sounds/guitar.json) ──
    try {
      const res = await fetch("/sounds/guitar.json");
      const guitarSoundfont = await res.json();
      guitar = new T.Sampler({
        urls: guitarSoundfont,
        release: 1,
      }).connect(limiter);
    } catch (e) {
      // Fallback to PluckSynth if soundfont fails to load
      console.warn("[Musicox] Guitar soundfont load failed, using PluckSynth fallback", e);
      guitar = new (T as any).PluckSynth({
        attackNoise: 2,
        dampening:   4000,
        resonance:   0.98,
      }).connect(limiter);
    }

    // ── 🥁 Kick — MembraneSynth (deep pitch-drop thump) ───────────────
    kick = new T.MembraneSynth({
      pitchDecay: 0.05,
      octaves:    6,
      envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.1 },
      volume: -4,
    }).connect(limiter);

    // ── 🥁 Snare — NoiseSynth (white-noise crack) ─────────────────────
    snare = new T.NoiseSynth({
      noise:    { type: "white" },
      envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.02 },
      volume: -8,
    }).connect(limiter);

    // ── 🥁 Hi-hat — MetalSynth (metallic shimmer) ─────────────────────
    hihat = new T.MetalSynth({
      harmonicity:    5.1,
      modulationIndex: 32,
      resonance:      4000,
      octaves:        1.5,
      envelope: { attack: 0.001, decay: 0.08, release: 0.01 },
      volume: -14,
    }).connect(limiter);
    hihat.frequency.value = 400;

    // ── 🥁 Tom — MembraneSynth (mid-frequency thump) ──────────────────
    tom = new T.MembraneSynth({
      pitchDecay: 0.08,
      octaves:    4,
      envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.15 },
      volume: -6,
    }).connect(reverb);

    // ── 🎹 Piano — Salamander Grand Piano samples (official Tone.js CDN)
    // ⚠️ Sharp notes: D#4 → "Ds4.mp3", F#4 → "Fs4.mp3" (no # in filenames)
    piano = new T.Sampler({
      urls: {
        A0: "A0.mp3",  C1: "C1.mp3",
        "D#1": "Ds1.mp3", "F#1": "Fs1.mp3",
        A1: "A1.mp3",  C2: "C2.mp3",
        "D#2": "Ds2.mp3", "F#2": "Fs2.mp3",
        A2: "A2.mp3",  C3: "C3.mp3",
        "D#3": "Ds3.mp3", "F#3": "Fs3.mp3",
        A3: "A3.mp3",  C4: "C4.mp3",
        "D#4": "Ds4.mp3", "F#4": "Fs4.mp3",
        A4: "A4.mp3",  C5: "C5.mp3",
        "D#5": "Ds5.mp3", "F#5": "Fs5.mp3",
        A5: "A5.mp3",  C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        A7: "A7.mp3",  C8: "C8.mp3",
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).connect(limiter);

    // Wait for all piano .mp3 samples to finish downloading
    await T.loaded();

    _ready   = true;
    _loading = false;
  } catch (err) {
    _loading = false;
    console.warn("[Musicox Audio] initAudio failed:", err);
  }
}

// ─── 🎸 Guitar ────────────────────────────────────────────────────────────────

/**
 * Pluck a guitar string using the acoustic nylon sampler.
 * @param stringIndex  0 = low E2 … 5 = high E4
 */
export function playGuitar(stringIndex: number): void {
  if (!_ready || !guitar || !Tone) return;
  try {
    const note = GUITAR_NOTES[stringIndex] ?? "E2";
    (guitar as ToneType.Sampler).triggerAttackRelease(note, "2n", Tone.now());
  } catch { /* silent */ }
}

// ─── 🎹 Piano ─────────────────────────────────────────────────────────────────

/**
 * Play a piano note using real Salamander samples.
 * @param note  e.g. "C4", "D#4", "F#4", "A5"
 */
export function playPiano(note: string): void {
  if (!_ready || !piano || !Tone) return;
  try {
    piano.triggerAttackRelease(note, "4n", Tone.now());
  } catch { /* silent */ }
}

// ─── 🥁 Drums ─────────────────────────────────────────────────────────────────

/**
 * Fire a drum hit.
 * @param type  "kick" | "snare" | "hihat" | "tom"
 */
export function playDrum(type: "kick" | "snare" | "hihat" | "tom"): void {
  if (!_ready || !Tone) return;
  try {
    const now = Tone.now();
    switch (type) {
      case "kick":  kick?.triggerAttackRelease("C1", "8n", now); break;
      case "snare": snare?.triggerAttackRelease("8n", now);      break;
      case "hihat": hihat?.triggerAttackRelease("16n", now);     break;
      case "tom":   tom?.triggerAttackRelease("G1", "8n", now);  break;
    }
  } catch { /* silent */ }
}

// ─── State helpers ────────────────────────────────────────────────────────────

/** True once all synths are ready AND piano samples are loaded. */
export function isAudioReady(): boolean  { return _ready; }

/** True while initAudio() is still loading samples (prevents duplicate toast). */
export function isAudioLoading(): boolean { return _loading; }

/** Returns the note name for a guitar string index. */
export function getGuitarNote(index: number): string {
  return GUITAR_NOTES[index] ?? "?";
}
