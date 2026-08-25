"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playGuitar, playPiano, playDrum, initAudio, isAudioReady, isAudioLoading, getGuitarNote, playGuitarNote } from "@/lib/audio";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "guitar" | "piano" | "drums";
type DrumType = "kick" | "snare" | "hihat" | "tom";

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "guitar", label: "Guitar", emoji: "🎸" },
  { id: "piano",  label: "Piano",  emoji: "🎹" },
  { id: "drums",  label: "Drums",  emoji: "🥁" },
];

// Guitar strings — index 0 = low E, 5 = high E
const GUITAR_STRINGS = [
  { note: "E2", label: "E", color: "#d97706", glowColor: "#F59E0B", height: "5px",   desc: "low"  },
  { note: "A2", label: "A", color: "#fbbf24", glowColor: "#FCD34D", height: "4px",   desc: ""     },
  { note: "D3", label: "D", color: "#8b5cf6", glowColor: "var(--purple-light)", height: "3.5px", desc: ""     },
  { note: "G3", label: "G", color: "#60a5fa", glowColor: "#93C5FD", height: "3px",   desc: ""     },
  { note: "B3", label: "B", color: "#9ca3af", glowColor: "#D1D5DB", height: "2px",   desc: ""     },
  { note: "E4", label: "E", color: "#f3f4f6", glowColor: "var(--text-primary)", height: "1.5px", desc: "high" },
];

// Piano keys
interface PianoKey {
  note: string;
  label: string;
  type: "white" | "black";
  offset?: number; // left px offset for black keys
}
const WHITE_KEYS: PianoKey[] = [
  { note: "C4", label: "C", type: "white" },
  { note: "D4", label: "D", type: "white" },
  { note: "E4", label: "E", type: "white" },
  { note: "F4", label: "F", type: "white" },
  { note: "G4", label: "G", type: "white" },
  { note: "A4", label: "A", type: "white" },
  { note: "B4", label: "B", type: "white" },
  { note: "C5", label: "C", type: "white" },
];
const BLACK_KEYS: PianoKey[] = [
  { note: "C#4", label: "C#", type: "black", offset: 36 },
  { note: "D#4", label: "D#", type: "black", offset: 88 },
  { note: "F#4", label: "F#", type: "black", offset: 192 },
  { note: "G#4", label: "G#", type: "black", offset: 244 },
  { note: "A#4", label: "A#", type: "black", offset: 296 },
];

const KEY_MAP: Record<string, string> = {
  a: "C4", s: "D4", d: "E4", f: "F4", g: "G4", h: "A4", j: "B4", k: "C5",
  w: "C#4", e: "D#4", t: "F#4", y: "G#4", u: "A#4",
};

const DRUM_KEY_MAP: Record<string, DrumType> = {
  " ": "kick", s: "snare", h: "hihat", t: "tom",
};

// Beat sequencer default pattern
const DEFAULT_SEQ = {
  kick:  [true,  false, false, false, true,  false, false, false],
  snare: [false, false, true,  false, false, false, true,  false],
  hihat: [true,  true,  true,  true,  true,  true,  true,  true ],
};

// ─── Chord presets ────────────────────────────────────────────────────────────
// Each chord lists the actual pitched notes to play (low → high string order)
// These are standard guitar voicings in open position:
const CHORDS: { name: string; notes: string[]; stringIdxs: number[] }[] = [
  {
    name: "C Major",
    notes:      ["E2", "C3", "E3", "G3", "C4", "E4"],  // x32010 voicing
    stringIdxs: [0,    1,    2,    3,    4,    5],
  },
  {
    name: "G Major",
    notes:      ["G2", "B2", "D3", "G3", "B3", "G4"],  // 320003 voicing
    stringIdxs: [0,    1,    2,    3,    4,    5],
  },
  {
    name: "Am",
    notes:      ["A2", "E3", "A3", "C4", "E4"],        // x02210 — skip low E
    stringIdxs: [1,    2,    3,    4,    5],
  },
  {
    name: "Em",
    notes:      ["E2", "B2", "E3", "G3", "B3", "E4"],  // 022000 open
    stringIdxs: [0,    1,    2,    3,    4,    5],
  },
];

// ─── Audio Helpers ────────────────────────────────────────────────────────────
let lastClickTime = 0;
const DEBOUNCE_MS = 30;

async function ensureAudio() {
  if (!isAudioReady()) {
    await initAudio();
  }
}

function tryPlayGuitar(idx: number) {
  const now = Date.now();
  if (now - lastClickTime < DEBOUNCE_MS) return;
  lastClickTime = now;
  playGuitar(idx);
}

function tryPlayPiano(note: string) {
  const now = Date.now();
  if (now - lastClickTime < DEBOUNCE_MS) return;
  lastClickTime = now;
  playPiano(note);
}

function tryPlayDrum(type: DrumType) {
  const now = Date.now();
  if (now - lastClickTime < DEBOUNCE_MS) return;
  lastClickTime = now;
  playDrum(type);
}

// ─── Guitar Panel ─────────────────────────────────────────────────────────────
function GuitarPanel({ onFirstPlay }: { onFirstPlay: () => void }) {
  const [vibratingIdx, setVibratingIdx] = useState<number | null>(null);
  const [badgeNote, setBadgeNote] = useState("Click a string");
  const [badgeColor, setBadgeColor] = useState("var(--purple-light)");
  const [visHeights, setVisHeights] = useState<number[]>(Array(8).fill(4));
  const hasInit = useRef(false);

  const animateVis = useCallback(() => {
    setVisHeights(Array.from({ length: 8 }, () => 4 + Math.random() * 22));
    setTimeout(() => setVisHeights(Array(8).fill(4)), 700);
  }, []);

  const pluck = useCallback(
    async (idx: number) => {
      if (!hasInit.current) {
        await ensureAudio();
        hasInit.current = true;
        onFirstPlay();
      }
      tryPlayGuitar(idx);
      setVibratingIdx(idx);
      setBadgeNote(GUITAR_STRINGS[idx].note);
      setBadgeColor(GUITAR_STRINGS[idx].glowColor);
      animateVis();
      setTimeout(() => setVibratingIdx(null), 500);
    },
    [animateVis, onFirstPlay]
  );

  const playChord = useCallback(
    async (chord: { name: string; notes: string[]; stringIdxs: number[] }) => {
      if (!hasInit.current) {
        await ensureAudio();
        hasInit.current = true;
        onFirstPlay();
      }
      setBadgeNote(chord.name);
      chord.notes.forEach((note, i) => {
        setTimeout(() => {
          playGuitarNote(note);
          // Animate the corresponding string visually
          const strIdx = chord.stringIdxs[i] ?? 0;
          setVibratingIdx(strIdx);
          setTimeout(() => setVibratingIdx(null), 500);
        }, i * 80);
      });
      animateVis();
    },
    [animateVis, onFirstPlay]
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--purple-light)", fontFamily: "'Inter', sans-serif" }}>
            Interactive
          </div>
          <h3 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
            Guitar
          </h3>
        </div>
        <div
          id="guitar-note-badge"
          className="px-4 py-1.5 rounded-full text-sm transition-all duration-200"
          style={{
            background: "rgba(124,58,237,0.2)",
            border: `1px solid ${badgeColor}`,
            color: badgeColor,
            fontFamily: "'Inter', sans-serif",
            minWidth: "100px",
            textAlign: "center",
          }}
        >
          {badgeNote}
        </div>
      </div>

      {/* Strings */}
      <div className="rounded-xl p-4 mb-2" style={{ background: "var(--card-bg)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {GUITAR_STRINGS.map((str, idx) => (
          <div
            key={str.note}
            role="button"
            tabIndex={0}
            aria-label={`Play ${str.note} string`}
            onClick={() => pluck(idx)}
            onKeyDown={(e) => e.key === "Enter" && pluck(idx)}
            className="flex items-center gap-3 py-3 px-2 rounded-lg cursor-pointer group transition-all duration-150 select-none"
            style={{ marginBottom: idx < 5 ? "4px" : 0 }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            {/* Label */}
            <span
              className="font-mono font-bold w-5 text-center text-sm flex-shrink-0"
              style={{ color: str.color }}
            >
              {str.label}
            </span>

            {/* String line */}
            <div className="flex-1 relative">
              <div
                className="w-full rounded-full transition-shadow duration-100"
                style={{
                  height: str.height,
                  background: `linear-gradient(90deg, ${str.color}80, ${str.color}, ${str.color}80)`,
                  boxShadow:
                    vibratingIdx === idx
                      ? `0 0 12px ${str.glowColor}, 0 0 4px ${str.glowColor}`
                      : "none",
                  animation: vibratingIdx === idx ? "vibrate 0.5s ease-out" : "none",
                }}
              />
            </div>

            {/* Desc */}
            {str.desc && (
              <span className="text-xs font-mono flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                {str.desc}
              </span>
            )}
          </div>
        ))}

        {/* Fret lines */}
        <div className="flex ml-8 mt-2 h-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex-1"
              style={{ borderLeft: "1.5px solid rgba(255,255,255,0.1)" }}
            />
          ))}
        </div>
      </div>

      {/* Chord shortcuts */}
      <div className="flex flex-wrap gap-2 items-center mt-4">
        <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
          Quick chords:
        </span>
        {CHORDS.map((chord) => (
          <button
            key={chord.name}
            id={`chord-${chord.name.replace(/\s/g, "-").toLowerCase()}`}
            onClick={() => playChord(chord)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 hover:text-white"
            style={{
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.35)",
              color: "var(--purple-light)",
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,58,237,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,58,237,0.15)";
            }}
          >
            {chord.name}
          </button>
        ))}
      </div>

      {/* Visualizer */}
      <div className="flex items-end gap-1 mt-4 h-7">
        {visHeights.map((h, i) => (
          <div
            key={i}
            className="rounded-sm transition-all duration-100"
            style={{
              width: "3px",
              height: `${h}px`,
              background: "var(--purple)",
              opacity: h > 4 ? 1 : 0.3,
            }}
          />
        ))}
        <span className="text-xs ml-2" style={{ color: "var(--text-muted)", fontFamily: "monospace" }}>
          waveform
        </span>
      </div>
    </div>
  );
}

// ─── Piano Panel ──────────────────────────────────────────────────────────────
function PianoPanel({ onFirstPlay }: { onFirstPlay: () => void }) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [badgeNote, setBadgeNote] = useState("Tap a key");
  const hasInit = useRef(false);

  const pressKey = useCallback(
    async (note: string) => {
      if (!hasInit.current) {
        await ensureAudio();
        hasInit.current = true;
        onFirstPlay();
      }
      tryPlayPiano(note);
      setBadgeNote(note);
      setPressedKeys((prev) => new Set([...prev, note]));
      setTimeout(() => {
        setPressedKeys((prev) => {
          const next = new Set(prev);
          next.delete(note);
          return next;
        });
      }, 300);
    },
    [onFirstPlay]
  );

  // Keyboard support
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const note = KEY_MAP[e.key];
      if (note) pressKey(note);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [pressKey]);

  const playScale = useCallback(() => {
    WHITE_KEYS.forEach((k, i) => {
      setTimeout(() => pressKey(k.note), i * 180);
    });
  }, [pressKey]);

  const playArp = useCallback(() => {
    const order = [0, 2, 4, 7, 4, 2, 0, 2];
    order.forEach((idx, i) => {
      setTimeout(() => pressKey(WHITE_KEYS[idx].note), i * 170);
    });
  }, [pressKey]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--purple-light)", fontFamily: "'Inter', sans-serif" }}>
            Interactive
          </div>
          <h3 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
            Piano
          </h3>
        </div>
        <div
          className="px-4 py-1.5 rounded-full text-sm"
          style={{
            background: "rgba(124,58,237,0.2)",
            border: "1px solid rgba(124,58,237,0.4)",
            color: "var(--purple-light)",
            fontFamily: "'Inter', sans-serif",
            minWidth: "80px",
            textAlign: "center",
          }}
        >
          {badgeNote}
        </div>
      </div>

      {/* Keyboard */}
      <div className="overflow-x-auto pb-2">
        <div className="relative" style={{ height: "160px", width: `${WHITE_KEYS.length * 52}px`, minWidth: "fit-content" }}>
          {/* White keys */}
          {WHITE_KEYS.map((key) => (
            <div
              key={key.note}
              role="button"
              tabIndex={0}
              aria-label={`Play ${key.note}`}
              onMouseDown={() => pressKey(key.note)}
              onTouchStart={(e) => { e.preventDefault(); pressKey(key.note); }}
              onKeyDown={(e) => e.key === "Enter" && pressKey(key.note)}
              className="absolute top-0 cursor-pointer select-none rounded-b-md flex flex-col justify-end items-center pb-2 transition-all duration-75"
              style={{
                width: "50px",
                height: "155px",
                left: `${WHITE_KEYS.indexOf(key) * 52}px`,
                background: pressedKeys.has(key.note) ? "#e9d5ff" : "#fafafa",
                border: "1.5px solid #ccc",
                borderTop: "none",
                transform: pressedKeys.has(key.note) ? "scaleY(0.97) translateY(3px)" : "none",
                transformOrigin: "top",
                zIndex: 1,
              }}
            >
              {pressedKeys.has(key.note) && (
                <div className="w-2 h-2 rounded-full mb-1" style={{ background: "var(--purple)" }} />
              )}
              <span
                className="text-xs font-mono font-semibold"
                style={{ color: pressedKeys.has(key.note) ? "var(--purple)" : "var(--text-muted)" }}
              >
                {key.label}
              </span>
            </div>
          ))}

          {/* Black keys */}
          {BLACK_KEYS.map((key) => (
            <div
              key={key.note}
              role="button"
              tabIndex={0}
              aria-label={`Play ${key.note}`}
              onMouseDown={() => pressKey(key.note)}
              onTouchStart={(e) => { e.preventDefault(); pressKey(key.note); }}
              onKeyDown={(e) => e.key === "Enter" && pressKey(key.note)}
              className="absolute top-0 cursor-pointer select-none rounded-b-md flex flex-col justify-end items-center pb-2"
              style={{
                width: "32px",
                height: "100px",
                left: `${key.offset}px`,
                background: pressedKeys.has(key.note) ? "#4C1D95" : "#1a1a2e",
                border: "none",
                transform: pressedKeys.has(key.note) ? "scaleY(0.96) translateY(2px)" : "none",
                transformOrigin: "top",
                zIndex: 3,
                transition: "background 0.08s, transform 0.08s",
                boxShadow: "2px 4px 8px rgba(0,0,0,0.6)",
              }}
            >
              {pressedKeys.has(key.note) && (
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--purple-light)" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scale / Arp buttons */}
      <div className="flex gap-3 flex-wrap mt-4">
        <button
          id="piano-play-scale"
          onClick={playScale}
          className="px-4 py-2 rounded-full text-sm transition-all duration-150"
          style={{
            background: "rgba(124,58,237,0.2)",
            border: "1px solid rgba(124,58,237,0.4)",
            color: "var(--purple-light)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          ▶ C Major Scale
        </button>
        <button
          id="piano-play-arp"
          onClick={playArp}
          className="px-4 py-2 rounded-full text-sm transition-all duration-150"
          style={{
            background: "rgba(245,158,11,0.15)",
            border: "1px solid rgba(245,158,11,0.35)",
            color: "#F59E0B",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          ▶ Arpeggio
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="mt-4">
        <div className="text-xs mb-2" style={{ color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
          Keyboard shortcuts:
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(KEY_MAP)
            .filter(([, note]) => !note.includes("#"))
            .map(([key, note]) => (
              <span key={key} className="flex items-center gap-1">
                <span
                  className="inline-block px-1.5 py-0.5 rounded text-xs font-mono border"
                  style={{
                    background: "var(--border-color)",
                    borderColor: "rgba(255,255,255,0.15)",
                    color: "var(--text-muted)",
                  }}
                >
                  {key.toUpperCase()}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
                  {note}
                </span>
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

// ─── Drum Panel ───────────────────────────────────────────────────────────────
function DrumPanel({ onFirstPlay }: { onFirstPlay: () => void }) {
  const [hitting, setHitting] = useState<DrumType | null>(null);
  const [badgeText, setBadgeText] = useState("Tap to play");
  const [seq, setSeq] = useState(DEFAULT_SEQ);
  const [seqRunning, setSeqRunning] = useState(false);
  const [seqStep, setSeqStep] = useState(-1);
  const seqTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInit = useRef(false);
  const seqStepRef = useRef(0);
  const seqRunningRef = useRef(false);

  const hitDrum = useCallback(
    async (type: DrumType, label: string) => {
      if (!hasInit.current) {
        await ensureAudio();
        hasInit.current = true;
        onFirstPlay();
      }
      tryPlayDrum(type);
      setHitting(type);
      setBadgeText(label);
      setTimeout(() => setHitting(null), 250);
    },
    [onFirstPlay]
  );

  // Keyboard support
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const type = DRUM_KEY_MAP[e.key];
      if (type) {
        const labels: Record<DrumType, string> = { kick: "Kick", snare: "Snare", hihat: "HH", tom: "Tom" };
        hitDrum(type, labels[type]);
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [hitDrum]);

  // Sequencer
  const runSeq = useCallback(() => {
    if (!seqRunningRef.current) return;
    const step = seqStepRef.current;
    setSeqStep(step);

    if (seq.kick[step])  playDrum("kick");
    if (seq.snare[step]) playDrum("snare");
    if (seq.hihat[step]) playDrum("hihat");

    seqStepRef.current = (step + 1) % 8;
    seqTimerRef.current = setTimeout(runSeq, 500); // 120 BPM = 500ms per step
  }, [seq]);

  const toggleSeq = useCallback(async () => {
    if (!hasInit.current) {
      await ensureAudio();
      hasInit.current = true;
      onFirstPlay();
    }
    if (seqRunningRef.current) {
      seqRunningRef.current = false;
      setSeqRunning(false);
      setSeqStep(-1);
      if (seqTimerRef.current) clearTimeout(seqTimerRef.current);
    } else {
      seqStepRef.current = 0;
      seqRunningRef.current = true;
      setSeqRunning(true);
      runSeq();
    }
  }, [onFirstPlay, runSeq]);

  useEffect(() => {
    return () => {
      seqRunningRef.current = false;
      if (seqTimerRef.current) clearTimeout(seqTimerRef.current);
    };
  }, []);

  const toggleStep = (row: keyof typeof seq, idx: number) => {
    setSeq((prev) => {
      const next = { ...prev, [row]: [...prev[row]] };
      next[row][idx] = !next[row][idx];
      return next;
    });
  };

  const clearSeq = () => {
    setSeq({ kick: Array(8).fill(false), snare: Array(8).fill(false), hihat: Array(8).fill(false) });
  };

  const DRUMS = [
    { type: "hihat" as DrumType, label: "Hi-hat", abbr: "HH",   size: 56,  color: "var(--text-secondary)", borderColor: "var(--text-secondary)", bg: "radial-gradient(circle at 35% 35%, #6b7280, #374151, #111827)" },
    { type: "snare" as DrumType, label: "Snare",  abbr: "SN",   size: 80,  color: "#D97706", borderColor: "#D97706", bg: "radial-gradient(circle at 35% 35%, #92400e, #78350f, #1c0a00)" },
    { type: "kick"  as DrumType, label: "Kick",   abbr: "KICK", size: 110, color: "var(--purple-light)", borderColor: "var(--purple)", bg: "radial-gradient(circle at 35% 35%, #1e1b4b, #312e81, #0a0a1a)" },
    { type: "tom"   as DrumType, label: "Tom",    abbr: "TOM",  size: 72,  color: "#7DD3FC", borderColor: "#0EA5E9", bg: "radial-gradient(circle at 35% 35%, #164e63, #0e7490, #0c1a22)" },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--purple-light)", fontFamily: "'Inter', sans-serif" }}>
            Interactive
          </div>
          <h3 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
            Drums
          </h3>
        </div>
        <div
          className="px-4 py-1.5 rounded-full text-sm"
          style={{
            background: "rgba(124,58,237,0.2)",
            border: "1px solid rgba(124,58,237,0.4)",
            color: "var(--purple-light)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {badgeText}
        </div>
      </div>

      {/* Drum circles */}
      <div className="flex justify-center items-end gap-6 flex-wrap mb-8">
        {DRUMS.map((drum) => (
          <div key={drum.type} className="flex flex-col items-center gap-2">
            <button
              id={`drum-${drum.type}`}
              onClick={() => hitDrum(drum.type, drum.label)}
              className="rounded-full flex items-center justify-center cursor-pointer transition-filter duration-100 hover:brightness-125"
              style={{
                width: `${drum.size}px`,
                height: `${drum.size}px`,
                background: drum.bg,
                border: `${drum.size > 80 ? 5 : 4}px solid ${drum.borderColor}`,
                boxShadow: `inset 0 0 ${drum.size / 5}px rgba(0,0,0,0.7)`,
                animation: hitting === drum.type ? "drum-hit 0.25s ease-out" : "none",
              }}
              aria-label={`Hit ${drum.label}`}
            >
              <span className="font-mono font-bold text-xs" style={{ color: drum.color }}>
                {drum.abbr}
              </span>
            </button>
            <span className="text-xs" style={{ color: drum.color, fontFamily: "'Inter', sans-serif" }}>
              {drum.label}
            </span>
            <span
              className="text-xs font-mono px-1.5 py-0.5 rounded border"
              style={{
                background: "var(--border-color)",
                borderColor: "rgba(255,255,255,0.12)",
                color: "var(--text-muted)",
              }}
            >
              {drum.type === "kick" ? "Space" : drum.type === "snare" ? "S" : drum.type === "hihat" ? "H" : "T"}
            </span>
          </div>
        ))}
      </div>

      {/* 8-step sequencer */}
      <div
        className="rounded-xl p-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "var(--card-bg)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs" style={{ color: "var(--text-secondary)", fontFamily: "'Inter', sans-serif" }}>
            Beat sequencer — 8 steps @ 120 BPM
          </span>
          <div className="flex gap-2">
            <button
              id="seq-play-btn"
              onClick={toggleSeq}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
              style={{
                background: seqRunning ? "rgba(236,72,153,0.25)" : "rgba(124,58,237,0.25)",
                border: seqRunning ? "1px solid rgba(236,72,153,0.5)" : "1px solid rgba(124,58,237,0.5)",
                color: seqRunning ? "#F472B6" : "var(--purple-light)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {seqRunning ? "■ Stop" : "▶ Play"}
            </button>
            <button
              id="seq-clear-btn"
              onClick={clearSeq}
              className="px-3 py-1.5 rounded-full text-xs transition-all duration-150"
              style={{
                background: "var(--border-color)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "var(--text-muted)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Sequencer rows */}
        {(["kick", "snare", "hihat"] as const).map((row) => (
          <div key={row} className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-mono w-10 text-right pr-2 flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
            >
              {row === "hihat" ? "HH" : row.charAt(0).toUpperCase() + row.slice(1)}
            </span>
            <div className="flex gap-1.5">
              {seq[row].map((on, i) => (
                <button
                  key={i}
                  onClick={() => toggleStep(row, i)}
                  className="rounded transition-all duration-100"
                  style={{
                    width: "28px",
                    height: "28px",
                    background: on ? "var(--purple)" : "rgba(255,255,255,0.04)",
                    border: seqStep === i
                      ? "1.5px solid #F59E0B"
                      : on
                        ? "1.5px solid #7C3AED"
                        : "1.5px solid rgba(255,255,255,0.12)",
                    boxShadow: seqStep === i ? "0 0 6px #F59E0B" : "none",
                  }}
                  aria-label={`Toggle ${row} step ${i + 1}`}
                  aria-pressed={on}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InstrumentLab() {
  const [activeTab, setActiveTab] = useState<Tab>("guitar");
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showAudioToast = useCallback((msg: string, duration = 2500) => {
    setToastMsg(msg);
    setShowToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setShowToast(false), duration);
  }, []);

  const handleFirstPlay = useCallback(async () => {
    // Show loading toast immediately while samples download
    showAudioToast("🎹 Loading piano samples…", 8000);
    // Wait for initAudio to finish (piano samples can take 2–4s on first load)
    // The GuitarPanel / DrumPanel call initAudio() themselves;
    // here we just update the toast once done
    const poll = setInterval(() => {
      if (!isAudioLoading()) {
        clearInterval(poll);
        if (isAudioReady()) {
          showAudioToast("🎵 Audio ready — let's play!", 2500);
        }
      }
    }, 200);
  }, [showAudioToast]);

  return (
    <section
      id="instruments"
      className="relative py-24 bg-fixed bg-center bg-cover"
      style={{ 
        backgroundImage: "url('/drum-bg.jpg')",
        backgroundColor: "var(--bg-primary)" 
      }}
      aria-label="Interactive instrument lab"
    >
      {/* Dark overlay for readability, reduced so drums are visible */}
      <div className="absolute inset-0 bg-[#0D0D1A]/60 pointer-events-none" />
      
      {/* Content wrapper needs relative to sit above overlay */}
      <div className="relative z-10 w-full">
      {/* Audio toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap"
            style={{
              background: toastMsg.includes("Loading")
                ? "rgba(245,158,11,0.15)"
                : "rgba(16,185,129,0.15)",
              border: toastMsg.includes("Loading")
                ? "1px solid rgba(245,158,11,0.4)"
                : "1px solid rgba(16,185,129,0.4)",
              color: toastMsg.includes("Loading") ? "#FCD34D" : "#6EE7B7",
              fontFamily: "'Inter', sans-serif",
              backdropFilter: "blur(8px)",
            }}
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-widest uppercase mb-3"
            style={{ color: "var(--purple-light)", fontFamily: "'Inter', sans-serif" }}
          >
            Instrument Lab
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Play Our Instruments
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-sm max-w-md mx-auto"
            style={{ color: "var(--text-secondary)", fontFamily: "'Inter', sans-serif" }}
          >
            Click any instrument below to hear real audio — powered by Tone.js.
            <br />
            <span style={{ color: "var(--text-muted)" }}>First click activates audio on your browser.</span>
          </motion.p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-10">
          <div
            className="flex gap-1 p-1 rounded-full relative"
            style={{ background: "var(--card-bg)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className="relative z-10 px-6 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                style={{
                  color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-secondary)",
                  fontFamily: "'Inter', sans-serif",
                }}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "linear-gradient(135deg, var(--purple), var(--pink))" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.emoji}</span>
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Panel */}
        <div
          className="rounded-2xl p-6 md:p-10"
          style={{
            background: "var(--card-bg)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(8px)",
            minHeight: "420px",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === "guitar" && <GuitarPanel onFirstPlay={handleFirstPlay} />}
              {activeTab === "piano"  && <PianoPanel  onFirstPlay={handleFirstPlay} />}
              {activeTab === "drums"  && <DrumPanel   onFirstPlay={handleFirstPlay} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      </div>
    </section>
  );
}
