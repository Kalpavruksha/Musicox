"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";
import { initAudio, isAudioReady, playGuitar } from "@/lib/audio";
import { motion } from "framer-motion";
import { useState } from "react";

export default function CodropsGuitar() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [audioReady, setAudioReady] = useState(false);

  // Map Codrops note IDs to string indices (0=E2 … 5=E4)
  const getNoteIndex = (id: string): number => {
    switch (id) {
      case "19": return 0; // E2
      case "24": return 1; // A2
      case "29": return 2; // D3
      case "34": return 3; // G3
      case "38": return 4; // B3
      case "43": return 5; // E4
      default: return 0;
    }
  };

  const handleActivate = async () => {
    if (!isAudioReady()) {
      await initAudio(); // loads the shared acoustic-nylon sampler + all synths
    }
    setAudioReady(true);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const hoverAreas = containerRef.current.querySelectorAll(".guitar__string-hover");
    
    hoverAreas.forEach((hoverArea) => {
      const parentNode = hoverArea.parentNode as HTMLElement;
      const noteId = hoverArea.getAttribute("data-note");

      const handleHover = () => {
        if (noteId) {
          playGuitar(getNoteIndex(noteId));
        }
        
        anime.remove(parentNode);
        anime({
          targets: parentNode,
          duration: 2600,
          easing: "easeOutElastic(1, .3)",
          translateY: [-3, 0],
        });
      };

      hoverArea.addEventListener("mouseenter", handleHover);
      hoverArea.addEventListener("touchstart", (e) => {
        e.preventDefault();
        handleHover();
      });
    });

  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#E2D5C3] py-24 min-h-[600px] flex flex-col md:flex-row items-center justify-center">
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center gap-12 z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1 text-center md:text-left"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#111" }}>
            The Guitar
          </h2>
          <p className="text-lg mb-8 max-w-md mx-auto md:mx-0" style={{ color: "#333", fontFamily: "'Inter', sans-serif" }}>
            Hover or tap the strings to play. Experience the resonance of standard tuning directly in your browser.
          </p>
          
          {!audioReady && (
            <button 
              onClick={handleActivate}
              className="px-6 py-3 bg-[#2E2E2E] text-[#E2D5C3] rounded-full font-semibold hover:bg-black transition-colors"
            >
              Click to activate audio
            </button>
          )}
        </motion.div>

        <div className="flex-1 w-full max-w-2xl" ref={containerRef} onPointerDown={handleActivate}>
          <svg className="w-full h-auto cursor-crosshair drop-shadow-xl" preserveAspectRatio="xMinYMax meet" viewBox="0 0 1440 780">
            <path fill="#2E2E2E" d="M-130.9,612.4c0-280,106.5-487.9,356.5-487.9c250,0,347.8,167.6,428.3,167.6c80.4,0,223.9-72.1,350-17
            c126.1,55.2,132.6,275.8,132.6,333.1c0,57.3-6.5,277.9-132.6,333.1c-126.1,55.2-269.6-17-350-17c-80.4,0-178.3,167.6-428.3,167.6
            C-24.4,1091.8-130.9,892.4-130.9,612.4z" />
            <path fill="#1F1F1F" d="M575.7,608.1c0,79.1,64.5,143.6,143.6,143.6c79.1,0,143.6-64.5,143.6-143.6c0-79.1-64.5-143.6-143.6-143.6
            C640.2,464.5,575.7,529,575.7,608.1z" />
            <path fill="#181818" d="M842.7,671.9V544.3h1087.6v127.6H842.7z" />
            <path fill="#0F0F0F" d="M223.3,487.6v249.1c0,71.5-32.3,33.9-38.7,72.9h-15.6c-7.5,0-13.6-5.4-13.6-12V427.3c0-6.6,6.1-12,13.6-12h15.6
            C191,454.3,223.3,417,223.3,487.6z" />
            
            {/* Strings */}
            <g>
              <rect className="guitar__string-hover" fill="transparent" data-note="19" x="184.5" y="547.6" width="1740.7" height="13.2" />
              <line stroke="#E2D5C3" strokeWidth="2" x1="1925.2" y1="554.2" x2="183.6" y2="554.2" />
            </g>
            <g>
              <rect className="guitar__string-hover" fill="transparent" data-note="24" x="184.5" y="569.3" width="1740.7" height="13.2" />
              <line stroke="#E2D5C3" strokeWidth="2" x1="1925.2" y1="575.9" x2="183.6" y2="575.8" />
            </g>
            <g>
              <rect className="guitar__string-hover" fill="transparent" data-note="29" x="184.5" y="590.5" width="1740.7" height="13.2" />
              <line stroke="#E2D5C3" strokeWidth="2" x1="1925.2" y1="597.5" x2="183.6" y2="597.4" />
            </g>
            <g>
              <rect className="guitar__string-hover" fill="transparent" data-note="34" x="184.5" y="612.5" width="1740.7" height="13.2" />
              <line stroke="#E2D5C3" strokeWidth="2" x1="1925.2" y1="619.1" x2="183.6" y2="619" />
            </g>
            <g>
              <rect className="guitar__string-hover" fill="transparent" data-note="38" x="184.5" y="634.1" width="1740.7" height="13.2" />
              <line stroke="#E2D5C3" strokeWidth="2" x1="1925.2" y1="640.7" x2="183.6" y2="640.6" />
            </g>
            <g>
              <rect className="guitar__string-hover" fill="transparent" data-note="43" x="184.5" y="655.7" width="1740.7" height="13.2" />
              <line stroke="#E2D5C3" strokeWidth="2" x1="1925.2" y1="662.3" x2="183.6" y2="662.2" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
