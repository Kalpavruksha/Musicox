"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

export default function CodropsMic() {
  const containerRef   = useRef<HTMLDivElement>(null);
  const audioCtxRef    = useRef<AudioContext | null>(null);
  const gainNodeRef    = useRef<GainNode | null>(null);
  const pannerNodeRef  = useRef<StereoPannerNode | null>(null);
  const bufferRef      = useRef<AudioBuffer | null>(null);
  const sourceRef      = useRef<AudioBufferSourceNode | null>(null);
  const [isReady, setIsReady]     = useState(false);
  const isDownRef                  = useRef(false);
  const rafRef                     = useRef<number | null>(null);

  // ── Setup audio graph: source → gain → panner → destination ───────────────
  useEffect(() => {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    // Gain node (volume based on Y distance from centre)
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0;
    gainNodeRef.current = gainNode;

    // StereoPanner node (left/right based on X position)
    const pannerNode = ctx.createStereoPanner();
    pannerNode.pan.value = 0;
    pannerNodeRef.current = pannerNode;

    // Graph: gain → panner → speakers
    gainNode.connect(pannerNode);
    pannerNode.connect(ctx.destination);

    fetch("/sounds/testingvoice.mp3")
      .then((r) => r.arrayBuffer())
      .then((ab) => ctx.decodeAudioData(ab))
      .then((decoded) => {
        bufferRef.current = decoded;
        setIsReady(true);
      })
      .catch((e) => console.error("Mic audio load error:", e));

    return () => { ctx.close(); };
  }, []);

  // ── Play (loops while held) ────────────────────────────────────────────────
  const playSound = useCallback(() => {
    if (!audioCtxRef.current || !bufferRef.current || !gainNodeRef.current) return;
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch (_) {}
    }
    const src = audioCtxRef.current.createBufferSource();
    src.buffer = bufferRef.current;
    src.connect(gainNodeRef.current);
    src.start(0);
    src.onended = () => { if (isDownRef.current) playSound(); };
    sourceRef.current = src;
  }, []);

  const stopSound = useCallback(() => {
    isDownRef.current = false;
    if (sourceRef.current) {
      try { sourceRef.current.stop(0); } catch (_) {}
    }
    // Fade out smoothly
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.05);
    }
  }, []);

  // ── Calculate pan + gain from pointer position ────────────────────────────
  const applyPosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Pan: -1 (full left) … 0 (centre) … +1 (full right)
    const relX = (clientX - rect.left) / rect.width;     // 0-1
    const pan  = Math.max(-1, Math.min(1, (relX - 0.5) * 2));

    // Gain: based on distance from centre — closer = louder
    const relY    = (clientY - rect.top) / rect.height;  // 0-1
    const centreX = 0.5;
    const centreY = 0.5;
    const dist    = Math.sqrt((relX - centreX) ** 2 + (relY - centreY) ** 2);
    const maxDist = Math.sqrt(centreX ** 2 + centreY ** 2);
    const gain    = Math.max(0, Math.min(1, 1 - dist / maxDist));

    if (pannerNodeRef.current && audioCtxRef.current) {
      pannerNodeRef.current.pan.setTargetAtTime(pan, audioCtxRef.current.currentTime, 0.02);
    }
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(gain, audioCtxRef.current.currentTime, 0.02);
    }

  }, []);

  // ── Pointer handlers ──────────────────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isReady) return;
    isDownRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
    applyPosition(e.clientX, e.clientY);
    playSound();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDownRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => applyPosition(e.clientX, e.clientY));
  };

  const handlePointerUp = () => { stopSound(); };

  // ── Helpers for visual feedback ───────────────────────────────────────────

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden py-32 min-h-[500px] flex items-center justify-center cursor-crosshair touch-none bg-cover bg-center select-none"
      style={{ backgroundImage: "url('/images/mic.jpg')" }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative z-10 text-center pointer-events-none w-full max-w-md mx-auto px-6"
      >
        <h2 className="text-5xl md:text-7xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#FFF" }}>
          Voice
        </h2>
        <p className="text-lg md:text-xl max-w-md mx-auto" style={{ color: "#AAA", fontFamily: "'Inter', sans-serif" }}>
          Click and drag around the center to manipulate the microphone feedback.
        </p>
      </motion.div>
    </section>
  );
}
