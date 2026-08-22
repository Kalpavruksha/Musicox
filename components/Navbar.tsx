"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavLink {
  label: string;
  href: string;
  id: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS: NavLink[] = [
  { label: "Home",        href: "#hero",        id: "hero" },
  { label: "Instruments", href: "#instruments", id: "instruments" },
  { label: "Courses",     href: "#courses",     id: "courses" },
  { label: "About",       href: "#about",       id: "about" },
  { label: "Contact",     href: "#contact",     id: "contact" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [activeId, setActiveId]     = useState("hero");
  const { theme, setTheme }         = useTheme();
  const [mounted, setMounted]       = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect scroll to switch navbar from transparent → solid
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // IntersectionObserver to detect active section
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.id);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -59% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMenuOpen(false);
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    []
  );

  const handleBookTrial = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setMenuOpen(false);
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    []
  );

  return (
    <>
      {/* ── Main Navbar ─────────────────────────────────────────────────────── */}
      <motion.header
        id="navbar"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "var(--overlay-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border-color)" : "none",
        }}
      >
        <nav
          className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4"
          aria-label="Main navigation"
        >
          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="flex items-center gap-3 group flex-shrink-0"
            aria-label="Musicox — Go to homepage"
          >
            <Image
              src="/logo.png"
              alt="Musicox Logo"
              width={130}
              height={44}
              priority
              className="h-10 w-auto group-hover:opacity-90 transition-opacity duration-200"
            />
          </a>

          {/* ── Desktop Links ─────────────────────────────────────────────── */}
          <ul
            className="hidden md:flex items-center gap-6"
            role="list"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.id} className="relative">
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-2 py-2 text-sm font-medium transition-colors duration-200 flex items-center justify-center relative group"
                  style={{
                    color: activeId === link.id ? "var(--purple-light)" : "var(--text-secondary)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  aria-current={activeId === link.id ? "page" : undefined}
                >
                  {link.label}

                  {/* Active indicator dot */}
                  {activeId === link.id && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ backgroundColor: "var(--purple-light)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover underline */}
                  <span
                    className="absolute inset-x-3 bottom-0 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ backgroundColor: "var(--purple)" }}
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* ── Desktop CTA & Theme Toggle ─────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full transition-all duration-200 hover:bg-[var(--glass-bg)]"
                aria-label="Toggle theme"
                style={{ color: "var(--text-primary)" }}
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <button
              id="nav-book-trial"
              onClick={handleBookTrial}
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, var(--purple), var(--pink))",
                fontFamily: "'Inter', sans-serif",
                boxShadow: "0 0 20px rgba(124,58,237,0.35)",
              }}
            >
              Book Free Trial
            </button>
          </div>

          {/* ── Mobile Hamburger & Theme Toggle ──────────────────────────── */}
          <button
            id="nav-hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200"
            style={{ background: "rgba(255,255,255,0.06)" }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={20} color="#A78BFA" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={20} color="#A78BFA" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>

      {/* ── Mobile Full-Screen Overlay Menu ───────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(13,13,26,0.6)", backdropFilter: "blur(4px)" }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-in panel */}
            <motion.div
              id="mobile-menu"
              key="menu"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 md:hidden flex flex-col"
              style={{
                background: "rgba(13,13,26,0.98)",
                borderLeft: "1px solid rgba(124,58,237,0.2)",
                backdropFilter: "blur(20px)",
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              {/* Close button */}
              <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <Image src="/logo.svg" alt="Musicox" width={100} height={34} className="h-8 w-auto" />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                  aria-label="Close menu"
                >
                  <X size={18} color="#9CA3AF" />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 px-6 py-8" aria-label="Mobile navigation">
                <ul className="space-y-2" role="list">
                  {NAV_LINKS.map((link, i) => (
                    <motion.li
                      key={link.id}
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.05 + i * 0.06, duration: 0.25 }}
                    >
                      <a
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
                        style={{
                          color: activeId === link.id ? "#A78BFA" : "#9CA3AF",
                          background: activeId === link.id ? "rgba(124,58,237,0.12)" : "transparent",
                          fontFamily: "'Inter', sans-serif",
                        }}
                        aria-current={activeId === link.id ? "page" : undefined}
                      >
                        {activeId === link.id && (
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#7C3AED" }} />
                        )}
                        {link.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Mobile CTA */}
              <div className="px-6 pb-8">
                <button
                  id="mobile-book-trial"
                  onClick={handleBookTrial}
                  className="w-full py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-200 hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #EC4899)",
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: "0 0 24px rgba(124,58,237,0.4)",
                  }}
                >
                  Book Free Trial 🎵
                </button>
                <p className="text-center text-xs mt-3" style={{ color: "#4B5563" }}>
                  No payment required
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
