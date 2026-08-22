"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ChevronDown, Play } from "lucide-react";

// ─── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedStat({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1200;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="text-center px-4 py-3"
    >
      <div
        className="text-3xl font-bold leading-none mb-1"
        style={{ fontFamily: "'Playfair Display', serif", color: "var(--purple-light)" }}
      >
        {isInView ? count : 0}
        {suffix}
      </div>
      <div
        className="text-xs tracking-widest uppercase"
        style={{ color: "var(--text-secondary)", fontFamily: "'Inter', sans-serif" }}
      >
        {label}
      </div>
    </motion.div>
  );
}

// ─── Particle CSS ─────────────────────────────────────────────────────────────
const PARTICLE_STYLE = `
  @keyframes drift {
    0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.6; }
    100% { transform: translateY(-120vh) translateX(var(--dx)) scale(0.5); opacity: 0; }
  }
  .particle {
    position: absolute;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background: var(--text-primary);
    animation: drift var(--dur) ease-in infinite;
    animation-delay: var(--delay);
    left: var(--x);
    bottom: -10px;
    pointer-events: none;
    will-change: transform, opacity;
  }
`;

// ─── Particles (Generated on Client) ──────────────────────────────────────────

// ─── Animated sound bars ──────────────────────────────────────────────────────
const BARS = [0.3, 0.7, 1, 0.6, 0.9, 0.4, 0.8, 0.5, 0.95, 0.35, 0.75, 0.55];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Hero() {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setParticles(
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        size: `${1 + Math.random() * 2.5}px`,
        dur: `${8 + Math.random() * 14}s`,
        delay: `${Math.random() * 12}s`,
        dx: `${(Math.random() - 0.5) * 80}px`,
        opacity: 0.1 + Math.random() * 0.4,
      }))
    );
  }, []);

  const handleStartLearning = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHearStudents = () => {
    setAudioPlaying((v) => !v);
    // Audio demo placeholder — will wire to audio engine in InstrumentLab
    document.getElementById("instruments")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollDown = () => {
    document.getElementById("instruments")?.scrollIntoView({ behavior: "smooth" });
  };

  // Stagger variants
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };
  const itemVariants = {
    hidden:   { opacity: 0, y: 32 },
    visible:  { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  };

  return (
    <>
      {/* Inject particle CSS */}
      <style>{PARTICLE_STYLE}</style>

      <section
        id="hero"
        ref={sectionRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ backgroundColor: "var(--bg-primary)" }}
        aria-label="Hero section"
      >
        {/* ── Particle Field ───────────────────────────────────────────────── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle"
              style={{
                "--x":     p.x,
                "--size":  p.size,
                "--dur":   p.dur,
                "--delay": p.delay,
                "--dx":    p.dx,
                opacity:   p.opacity,
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* ── Subtle grid overlay ──────────────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* ── Hero Image (full width desktop) ─────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <Image
            src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1600&q=80"
            alt="Guitarist performing"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Gradient overlay — dark on left for text, transparent on right */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, var(--overlay-bg) 0%, var(--glass-bg) 45%, transparent 100%)",
            }}
          />
          {/* Bottom gradient fade */}
          <div
            className="absolute inset-x-0 bottom-0 h-48"
            style={{ background: "linear-gradient(to top, var(--bg-primary), transparent)" }}
          />
        </div>

        {/* ── Purple glow ──────────────────────────────────────────────────── */}
        <div
          className="absolute pointer-events-none"
          aria-hidden="true"
          style={{
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
            top: "50%",
            left: "-10%",
            transform: "translateY(-50%)",
          }}
        />

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32 lg:py-40">
          <div className="lg:w-3/5 xl:w-1/2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6"
            >
              {/* Eyebrow */}
              <motion.div variants={itemVariants} className="flex items-center gap-3">
                {/* Animated sound bars */}
                <div className="flex items-end gap-0.5 h-5" aria-hidden="true">
                  {BARS.map((h, i) => (
                    <div
                      key={i}
                      className="sound-bar"
                      style={{
                        height: `${h * 20}px`,
                        animationDelay: `${i * 0.1}s`,
                        background: "linear-gradient(to top, var(--purple), var(--purple-light))",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="text-xs font-medium tracking-widest uppercase"
                  style={{ color: "var(--purple-light)", fontFamily: "'Inter', sans-serif" }}
                >
                  MUSICOX ACADEMY
                </span>
              </motion.div>

              {/* Headline */}
              <motion.div variants={itemVariants}>
                <h1
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(2.5rem, 6vw, 5rem)",
                    fontWeight: 900,
                    lineHeight: 1.08,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Where{" "}
                  <span
                    className="shimmer-text"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, var(--purple) 0%, var(--gold) 40%, var(--pink) 70%, var(--purple) 100%)",
                      backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      animation: "shimmer 3s ease-in-out infinite",
                    }}
                  >
                    Music
                  </span>
                  <br />
                  Comes Alive
                </h1>
              </motion.div>

              {/* Subheadline */}
              <motion.p
                variants={itemVariants}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(1rem, 2vw, 1.2rem)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  maxWidth: "520px",
                }}
              >
                Welcome to Musicox. Professional music training for all ages — guitar, piano, drums, violin, and more.
                Learn from expert instructors in a joyful, structured environment.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 items-center">
                <motion.button
                  id="hero-start-learning"
                  onClick={handleStartLearning}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-full font-semibold text-white text-base transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, var(--purple), var(--pink))",
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: "0 0 30px rgba(124,58,237,0.45)",
                  }}
                >
                  Start Learning
                </motion.button>

                <motion.button
                  id="hero-hear-students"
                  onClick={handleHearStudents}
                  whileHover={{ scale: 1.04, borderColor: "var(--purple-light)" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all duration-200"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    border: "1px solid var(--border-color)",
                    color: "var(--purple-light)",
                    background: "transparent",
                  }}
                >
                  <Play size={16} fill="currentColor" />
                  Try Our Instruments
                </motion.button>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap mt-4"
                style={{ borderTop: "1px solid var(--border-color)", borderLeft: "none" }}
              >
                {([
                  { value: 500, suffix: "+", label: "Students" },
                  { value: 10,  suffix: "+", label: "Years Teaching" },
                  { value: 15,  suffix: "+", label: "Instruments" },
                  { value: 98,  suffix: "%", label: "Satisfaction" },
                ] as const).map((stat, i) => (
                  <AnimatedStat key={stat.label} {...stat} delay={i * 0.1} />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ── Scroll Indicator ─────────────────────────────────────────────── */}
        <motion.button
          onClick={handleScrollDown}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          aria-label="Scroll to instruments section"
        >
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}
          >
            Explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} color="#6B7280" />
          </motion.div>
        </motion.button>
      </section>
    </>
  );
}
