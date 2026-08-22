"use client";

import Image from "next/image";

// Social Icons (inline SVG — lucide-react v3 removed brand icons)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const NAV_LINKS = [
  { label: "Home",        href: "#hero" },
  { label: "Instruments", href: "#instruments" },
  { label: "Courses",     href: "#courses" },
  { label: "About",       href: "#about" },
  { label: "Contact",     href: "#contact" },
];

const SOCIAL_LINKS = [
  { icon: <InstagramIcon />, label: "Instagram", href: "#" }, // PLACEHOLDER href
  { icon: <YoutubeIcon />,   label: "YouTube",   href: "#" }, // PLACEHOLDER href
  { icon: <FacebookIcon />,  label: "Facebook",  href: "#" }, // PLACEHOLDER href
];

export default function Footer() {
  return (
    <footer
      style={{ backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--border-color)" }}
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Top row */}
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Image
              src="/logo.png"
              alt="Musicox Logo"
              width={130}
              height={44}
              className="h-10 w-auto mb-4"
            />
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: "var(--text-secondary)", fontFamily: "'Inter', sans-serif", maxWidth: "280px" }}
            >
              Professional music education for all ages. Guitar, Piano, Drums, Violin & more —
              taught with passion by expert instructors.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-muted)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--purple-light)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--purple)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div
              className="text-xs font-medium tracking-widest uppercase mb-4"
              style={{ color: "var(--purple-light)", fontFamily: "'Inter', sans-serif" }}
            >
              Quick Links
            </div>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:opacity-80"
                    style={{ color: "var(--text-secondary)", fontFamily: "'Inter', sans-serif" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <div
              className="text-xs font-medium tracking-widest uppercase mb-4"
              style={{ color: "var(--purple-light)", fontFamily: "'Inter', sans-serif" }}
            >
              Contact
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-xs mb-0.5" style={{ color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
                  Address
                </div>
                <div className="text-sm" style={{ color: "var(--text-secondary)", fontFamily: "'Inter', sans-serif" }}>
                  Pacific Pride Apartment, First Floor
                  {/* PLACEHOLDER — replace with actual address */}
                </div>
              </div>
              <div>
                <div className="text-xs mb-0.5" style={{ color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
                  Phone
                </div>
                <a
                  href="tel:+917411656532"  // PLACEHOLDER
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: "var(--purple-light)", fontFamily: "'Inter', sans-serif" }}
                >
                  +91 74116 56532
                </a>
              </div>
              <div>
                <div className="text-xs mb-0.5" style={{ color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
                  Email
                </div>
                <a
                  href="mailto:info@musicox.in"  // PLACEHOLDER
                  className="text-sm transition-colors hover:opacity-80"
                  style={{ color: "var(--purple-light)", fontFamily: "'Inter', sans-serif" }}
                >
                  info@musicox.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--border-color)", marginBottom: "24px" }} />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
            © 2025 Musicox. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
            Made by beshu
          </p>
          <div className="flex gap-5">
            <a href="#" className="text-xs transition-colors hover:opacity-80" style={{ color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
              Privacy Policy
            </a>
            <a href="#" className="text-xs transition-colors hover:opacity-80" style={{ color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
