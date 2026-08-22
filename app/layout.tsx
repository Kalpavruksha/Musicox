import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Musicox — Music School | Guitar, Piano & Drums Lessons",
  description:
    "Musicox is a premier music school offering professional guitar, piano, drums, violin, and vocal lessons for all ages. Book your free trial class today.",
  keywords: "music school, guitar lessons, piano lessons, drum lessons, music education, India",
  openGraph: {
    title: "Musicox — Music School",
    description: "Professional music education for all ages. Guitar, Piano, Drums & more.",
    type: "website",
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
