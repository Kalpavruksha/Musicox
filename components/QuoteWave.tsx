"use client";

import React, { useEffect, useRef } from "react";
import SiriWave from "siriwave";
import { motion } from "framer-motion";

export default function QuoteWave() {
  const containerRef = useRef<HTMLDivElement>(null);
  const siriwaveRef = useRef<SiriWave | null>(null);

  useEffect(() => {
    if (containerRef.current && !siriwaveRef.current) {
      siriwaveRef.current = new SiriWave({
        container: containerRef.current,
        width: window.innerWidth,
        height: 500,
        style: "ios9",
        speed: 0.05,
        amplitude: 1.5,
        color: "#7C3AED", // Match the brand purple
        autostart: true,
      });
    }

    const handleResize = () => {
      if (siriwaveRef.current && containerRef.current) {
        // SiriWave doesn't dynamically resize well, but we can recreate it or just leave it for now.
        // It's mostly visual background noise.
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (siriwaveRef.current && containerRef.current) {
        siriwaveRef.current.stop();
        containerRef.current.innerHTML = "";
        siriwaveRef.current = null;
      }
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden py-32 flex items-center justify-center min-h-[500px]" style={{ background: "var(--bg-primary)" }}>
      {/* SiriWave Container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 z-0 opacity-30 flex items-center justify-center pointer-events-none"
      />
      
      {/* Quote Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center pointer-events-none"
      >
        <p 
          className="text-2xl md:text-4xl italic font-medium leading-relaxed mb-6" 
          style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}
        >
          &ldquo;Where words fail, music speaks.&rdquo;
        </p>
        <footer 
          className="text-sm md:text-base font-semibold tracking-widest uppercase" 
          style={{ color: "var(--purple-light)", fontFamily: "'Inter', sans-serif" }}
        >
          — Hans Christian Andersen
        </footer>
      </motion.div>
    </section>
  );
}
