"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

// Social Icons
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

const INFO_ITEMS = [
  { icon: "MapPin", label: "Our Location",     title: "Pacific Pride Apartment",  sub: "First Floor, Last shop from the front facing\nHubli 580020, Karnataka",  href: null },
  { icon: "Phone",  label: "Call Us",           title: "+91 74116 56532",          sub: "Mon-Sat, 9 AM - 8 PM IST",                                               href: "tel:+917411656532" },
  { icon: "Mail",   label: "Email",             title: "info@musicox.in",          sub: "We reply within 24 hours",                                                href: "mailto:info@musicox.in" },
  { icon: "Clock",  label: "Class Hours (IST)", title: "Mon - Fri",                sub: "5:00 PM - 6:00 PM",                                                       href: null },
];

export default function Contact() {
  const icons: Record<string, React.ReactNode> = {
    MapPin: <MapPin size={20} />,
    Phone:  <Phone  size={20} />,
    Mail:   <Mail   size={20} />,
    Clock:  <Clock  size={20} />,
  };

  return (
    <section id="contact" className="py-24" style={{ backgroundColor: "var(--bg-primary)" }} aria-label="Contact Musicox">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--purple-light)", fontFamily: "'Inter', sans-serif" }}>
            Get In Touch
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
            Start Your{" "}
            <span style={{ background: "linear-gradient(135deg, var(--purple-light), var(--pink))", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Musical Journey
            </span>
          </motion.h2>
        </div>

        {/* Two-column grid */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* LEFT — Contact info card */}
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="rounded-2xl p-8 flex flex-col" style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}>

            {/* Shop heading */}
            <div className="mb-6 pb-6" style={{ borderBottom: "1px solid var(--border-color)" }}>
              <div className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--purple-light)", fontFamily: "'Inter', sans-serif" }}>Find Us</div>
              <h3 className="text-3xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>MUSICOX</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)", fontFamily: "'Inter', sans-serif" }}>Music School &amp; Academy — Hubli, Karnataka</p>
            </div>

            {/* 4 info rows */}
            <div className="flex flex-col">
              {INFO_ITEMS.map((item, i) => (
                <div key={i} className="flex items-start gap-4 py-4" style={{ borderBottom: i < INFO_ITEMS.length - 1 ? "1px solid var(--border-color)" : "none" }}>
                  <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: "44px", height: "44px", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", color: "var(--purple-light)" }}>
                    {icons[item.icon]}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-semibold leading-snug hover:opacity-80 transition-opacity block" style={{ color: "var(--purple-light)", fontFamily: "'Inter', sans-serif" }}>{item.title}</a>
                    ) : (
                      <div className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)", fontFamily: "'Inter', sans-serif" }}>{item.title}</div>
                    )}
                    <div className="text-xs mt-0.5 leading-relaxed whitespace-pre-line" style={{ color: "var(--text-secondary)", fontFamily: "'Inter', sans-serif" }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp + Socials */}
            <div className="mt-6 pt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center" style={{ borderTop: "1px solid var(--border-color)" }}>
              <a id="contact-whatsapp" href="https://wa.me/917411656532" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:opacity-90" style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", fontFamily: "'Inter', sans-serif" }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Chat on WhatsApp
              </a>
              <div className="flex gap-3">
                {[{ icon: <InstagramIcon />, label: "Instagram", href: "#" }, { icon: <YoutubeIcon />, label: "YouTube", href: "#" }, { icon: <FacebookIcon />, label: "Facebook", href: "#" }].map((social) => (
                  <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 hover:scale-110" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)", color: "var(--text-muted)" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--purple-light)"; (e.currentTarget as HTMLElement).style.color = "var(--purple-light)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Map + CTA */}
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.1 }} className="flex flex-col gap-6">
            <div className="rounded-2xl overflow-hidden w-full" style={{ height: "380px", border: "1px solid var(--border-color)" }}>
              <iframe src="https://maps.google.com/maps?q=15.3588569,75.1587954&z=17&output=embed" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <div className="rounded-2xl p-6 text-center" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.1))", border: "1px solid rgba(124,58,237,0.25)" }}>
              <div className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)", fontFamily: "'Playfair Display', serif" }}>🎵 First Trial Class is Free!</div>
              <p className="text-sm mb-5" style={{ color: "var(--text-secondary)", fontFamily: "'Inter', sans-serif" }}>Book your free session today and experience the joy of music. No commitment required.</p>
              <a href="https://wa.me/917411656532?text=Hi%2C%20I%27d%20like%20to%20book%20a%20free%20trial%20class%20at%20Musicox!" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-105" style={{ background: "linear-gradient(135deg, var(--purple), var(--purple-light))", fontFamily: "'Inter', sans-serif" }}>
                Book Free Trial →
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
