const fs = require('fs');

const path = 'D:/musicox/musicox-app/components/InstrumentLab.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacements = {
  '"#A78BFA"': '"var(--purple-light)"',
  '"#fff"': '"var(--text-primary)"',
  '"#ffffff"': '"var(--text-primary)"',
  '"#0D0D1A"': '"var(--bg-primary)"',
  '"#080812"': '"var(--bg-secondary)"',
  '"#12122A"': '"var(--bg-secondary)"',
  '"#6B7280"': '"var(--text-secondary)"',
  '"#9CA3AF"': '"var(--text-muted)"',
  '"#4B5563"': '"var(--text-muted)"',
  '"#555"': '"var(--text-muted)"',
  '"#666"': '"var(--text-secondary)"',
  '"#7C3AED"': '"var(--purple)"',
  '"rgba(255,255,255,0.03)"': '"var(--card-bg)"',
  '"rgba(255,255,255,0.02)"': '"var(--card-bg)"',
  '"rgba(255,255,255,0.05)"': '"var(--card-bg)"',
  '"rgba(255,255,255,0.06)"': '"var(--border-color)"',
  '"rgba(255,255,255,0.08)"': '"var(--border-color)"',
  '"rgba(255,255,255,0.1)"': '"var(--border-color)"',
  '"linear-gradient(135deg, #7C3AED, #EC4899)"': '"linear-gradient(135deg, var(--purple), var(--pink))"'
};

for (const [key, value] of Object.entries(replacements)) {
  content = content.split(key).join(value);
}

fs.writeFileSync(path, content);
console.log('Colors replaced successfully.');
