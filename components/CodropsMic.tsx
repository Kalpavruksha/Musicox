"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function CodropsMic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isMouseDown = useRef(false);

  useEffect(() => {
    // Initialize Web Audio API
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0;
    gainNode.connect(ctx.destination);
    gainNodeRef.current = gainNode;

    // Fetch and decode the audio buffer
    fetch("/sounds/testingvoice.mp3")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        bufferRef.current = audioBuffer;
        setIsReady(true);
      })
      .catch((err) => console.error("Error loading mic sound:", err));

    return () => {
      ctx.close();
    };
  }, []);

  const playSound = () => {
    if (!audioCtxRef.current || !bufferRef.current || !gainNodeRef.current) return;
    
    // Stop previous source if exists
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch (e) {}
    }

    const source = audioCtxRef.current.createBufferSource();
    source.buffer = bufferRef.current;
    source.connect(gainNodeRef.current);
    source.start(0);
    
    source.onended = () => {
      if (isMouseDown.current) {
        playSound(); // loop
      }
    };
    sourceRef.current = source;
  };

  const stopSound = () => {
    if (sourceRef.current) {
      try { sourceRef.current.stop(0); } catch (e) {}
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = 0;
    }
  };

  const getGain = (clientX: number, clientY: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = Math.max(rect.width, rect.height) / 2;
    
    // Gain is higher closer to center
    let gain = 1 - (distance / maxDistance);
    return Math.max(0, Math.min(1, gain));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isReady) return;
    isMouseDown.current = true;
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
    
    const gainVal = getGain(e.clientX, e.clientY);
    if (gainNodeRef.current) gainNodeRef.current.gain.value = gainVal;
    
    playSound();
  };

  const handlePointerUp = () => {
    isMouseDown.current = false;
    stopSound();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isMouseDown.current || !gainNodeRef.current) return;
    
    requestAnimationFrame(() => {
      const gainVal = getGain(e.clientX, e.clientY);
      if (gainNodeRef.current) gainNodeRef.current.gain.value = gainVal;
    });
  };

  return (
    <section 
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#111] py-32 min-h-[500px] flex items-center justify-center cursor-crosshair touch-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative z-10 text-center select-none pointer-events-none"
      >
        <h2 className="text-5xl md:text-7xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#FFF" }}>
          Voice
        </h2>
        <p className="text-lg md:text-xl max-w-md mx-auto" style={{ color: "#AAA", fontFamily: "'Inter', sans-serif" }}>
          Click and drag around the center to manipulate the microphone feedback volume.
        </p>
      </motion.div>
    </section>
  );
}
