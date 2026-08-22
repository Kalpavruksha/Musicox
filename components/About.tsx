"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CREDENTIALS = [
  "Played in churches, events, and functions by sir and former students",
  "Teaches students from 5 years old up to any age",
  "Specialized in 3 core instruments: Guitar, Drums, and Piano",
];

const INSTRUMENTS = [
  { emoji: "🎸", name: "Guitar" },
  { emoji: "🎹", name: "Piano" },
  { emoji: "🥁", name: "Drums" },
];

const STATS = [
  { value: "500+", label: "Happy Students", color: "#7C3AED" },
  { value: "10+",  label: "Years Teaching",  color: "#F59E0B" },
  { value: "3",    label: "Core Instruments",color: "#10B981" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden:   { opacity: 0, y: 24 },
    visible:  { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24"
      style={{ backgroundColor: "#FFF8F0" }}
      aria-label="About Musicox"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div
            className="text-xs font-medium tracking-widest uppercase mb-3"
            style={{ color: "#7C3AED", fontFamily: "'Inter', sans-serif" }}
          >
            Our Story
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a2e" }}
          >
            Passionate About{" "}
            <span style={{ color: "#7C3AED" }}>Music Education</span>
          </h2>
          <p
            className="mt-5 max-w-2xl mx-auto text-base leading-relaxed"
            style={{ color: "#6B7280", fontFamily: "'Inter', sans-serif" }}
          >
            At <strong>Musicox</strong>, we believe music transforms lives. Founded with a simple mission — to make
            professional music education accessible, joyful, and deeply personal for every student.
          </p>
        </motion.div>

        {/* ── Stats ────────────────────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-3 gap-4 mb-16"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="text-center rounded-2xl py-6 px-4"
              style={{
                background: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <div
                className="text-3xl font-bold leading-none mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: stat.color }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs tracking-wider uppercase"
                style={{ color: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Two-column layout ────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEFT — Story text + Teacher card */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            {/* Story */}
            <div className="mb-10">
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a2e" }}
              >
                Our Journey
              </h3>
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#6B7280", fontFamily: "'Inter', sans-serif" }}
              >
                {/* PLACEHOLDER — owner will fill in their school story */}
                At Musicox, music is not just taught — it is experienced. Founded by{" "}
                <strong style={{ color: "#1a1a2e" }}>John Victor</strong>, our school began
                with a simple belief: every person has music inside them. We are here to help
                it come out.
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: "#6B7280", fontFamily: "'Inter', sans-serif" }}
              >
                Students from 5 years old up to any age can learn to play Guitar, Drums, and Piano. 
                Our students have played in churches, events, and functions, showcasing the dedication 
                and passion we instill in every lesson. We are also open for events if needed to perform, 
                and we gladly welcome students to refer!
              </p>
            </div>

            {/* Teacher Card */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(124,58,237,0.2)",
                boxShadow: "0 4px 24px rgba(124,58,237,0.08)",
              }}
            >
              <div className="flex gap-5 items-start flex-wrap">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div
                    className="flex items-center justify-center text-3xl rounded-full"
                    style={{
                      width: "90px",
                      height: "90px",
                      background: "linear-gradient(135deg, #7C3AED, #EC4899)",
                      border: "3px solid rgba(124,58,237,0.4)",
                    }}
                  >
                    🎵
                  </div>
                  <div className="mt-2 text-center">
                    <span
                      className="inline-block px-2 py-0.5 rounded-lg text-xs font-medium"
                      style={{
                        background: "rgba(245,158,11,0.12)",
                        border: "1px solid rgba(245,158,11,0.3)",
                        color: "#F59E0B",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Lead Instructor
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div
                    className="text-xl font-bold mb-0.5"
                    style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a2e" }}
                  >
                    John Victor
                  </div>
                  <div
                    className="text-sm mb-4"
                    style={{ color: "#7C3AED", fontFamily: "'Inter', sans-serif" }}
                  >
                    Founder · Musicox School
                  </div>

                  {/* Credentials */}
                  <div className="flex flex-col gap-3">
                    {CREDENTIALS.map((cred, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 text-sm pb-3"
                        style={{
                          borderBottom: i < CREDENTIALS.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                          fontFamily: "'Inter', sans-serif",
                          color: "#4B5563",
                        }}
                      >
                        <CheckCircle2 size={16} color="#7C3AED" className="flex-shrink-0 mt-0.5" />
                        {cred}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Instruments grid */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <div className="mb-6">
              <div
                className="text-xs font-medium tracking-widest uppercase mb-3"
                style={{ color: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}
              >
                Instruments We Teach
              </div>
              <h3
                className="text-2xl font-bold"
                style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a2e" }}
              >
                Your Instrument,<br />Our Expertise
              </h3>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {INSTRUMENTS.map((inst) => (
                <motion.div
                  key={inst.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.04, y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center gap-2 py-5 px-3 rounded-xl cursor-default"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(124,58,237,0.15)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <span className="text-3xl">{inst.emoji}</span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "#4B5563", fontFamily: "'Inter', sans-serif" }}
                  >
                    {inst.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Quote box */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(236,72,153,0.06))",
                border: "1px solid rgba(124,58,237,0.15)",
              }}
            >
              <blockquote
                className="text-base italic leading-relaxed mb-3"
                style={{ color: "#4B5563", fontFamily: "'Playfair Display', serif" }}
              >
                &ldquo;[Add a short inspiring quote from your teaching philosophy — something that
                resonates with your students.]&rdquo;
              </blockquote>
              <cite
                className="text-xs font-medium not-italic"
                style={{ color: "#7C3AED", fontFamily: "'Inter', sans-serif" }}
              >
                — [Teacher Name], Founder
              </cite>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
