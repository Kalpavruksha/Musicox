"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Music2, Guitar, Piano, Drum, ArrowRight } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const COURSES = [
  {
    id:       "beginner",
    title:    "Beginner Batch",
    subtitle: "Start from scratch",
    details:  ["Ages 6–12", "3 months", "Mon to Friday 5pm to 8pm"],
    cta:      "Enroll Now",
    emoji:    "🌱",
    icon:     <Music2 size={20} />,
    gradient: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
    border:   "rgba(124,58,237,0.4)",
    badge:    "Most Popular",
    badgeBg:  "rgba(245,158,11,0.2)",
    badgeTxt: "#F59E0B",
  },
  {
    id:       "teen",
    title:    "Teen Program",
    subtitle: "Build real skills",
    details:  ["Ages 13–17", "6 months", "Mon to Friday 5pm to 8pm"],
    cta:      "Enroll Now",
    emoji:    "⚡",
    icon:     <Guitar size={20} />,
    gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    border:   "rgba(245,158,11,0.4)",
    badge:    "Trending",
    badgeBg:  "rgba(124,58,237,0.2)",
    badgeTxt: "#A78BFA",
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Courses() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const handleEnroll = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="courses"
      ref={sectionRef}
      className="relative py-24 bg-fixed bg-center bg-cover"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1600&q=80')",
        backgroundColor: "var(--bg-primary)" 
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 backdrop-blur-sm pointer-events-none" style={{ backgroundColor: "var(--overlay-bg)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-widest uppercase mb-3"
            style={{ color: "var(--purple-light)", fontFamily: "'Inter', sans-serif" }}
          >
            Programs
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}
          >
            Our Programs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 max-w-lg mx-auto text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)", fontFamily: "'Inter', sans-serif" }}
          >
            Structured learning paths for every age and skill level. Choose the program that fits your life.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {COURSES.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: "var(--card-bg)",
                border: `1px solid ${course.border}`,
                minHeight: "360px",
              }}
            >
              {/* Gradient top bar */}
              <div className="h-1.5 w-full" style={{ background: course.gradient }} />

              {/* Card body */}
              <div className="flex flex-col flex-1 p-6">
                {/* Badge */}
                {course.badge && (
                  <div className="mb-4">
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{
                        background: course.badgeBg,
                        color: course.badgeTxt,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {course.badge}
                    </span>
                  </div>
                )}

                {/* Emoji + Icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl text-white"
                    style={{ background: course.gradient }}
                  >
                    {course.icon}
                  </div>
                  <span className="text-2xl">{course.emoji}</span>
                </div>

                {/* Title */}
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}
                >
                  {course.title}
                </h3>
                <p
                  className="text-xs mb-4"
                  style={{ color: "var(--text-secondary)", fontFamily: "'Inter', sans-serif" }}
                >
                  {course.subtitle}
                </p>

                {/* Details */}
                <ul className="flex flex-col gap-1.5 mb-5 flex-1">
                  {course.details.map((d) => (
                    <li
                      key={d}
                      className="flex items-center gap-2 text-xs"
                      style={{ color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}
                    >
                      <span
                        className="w-1 h-1 rounded-full flex-shrink-0"
                        style={{ background: "var(--purple)" }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>


                {/* CTA */}
                <button
                  id={`enroll-${course.id}`}
                  onClick={handleEnroll}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90"
                  style={{
                    background: course.gradient,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {course.cta}
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}

      </div>
    </section>
  );
}
