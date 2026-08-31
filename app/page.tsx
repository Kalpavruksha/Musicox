import Navbar        from "@/components/Navbar";
import Hero          from "@/components/Hero";
import InstrumentLab from "@/components/InstrumentLab";
import Courses       from "@/components/Courses";
import About         from "@/components/About";
import Contact       from "@/components/Contact";
import Footer        from "@/components/Footer";
import ParallaxDivider from "@/components/ParallaxDivider";
import QuoteWave       from "@/components/QuoteWave";
import CodropsGuitar   from "@/components/CodropsGuitar";
import CodropsMic      from "@/components/CodropsMic";
    
export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0D0D1A" }}>
      <Navbar />
      <Hero />
      <ParallaxDivider image="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1600&q=80" text="Feel The Music" />
      <InstrumentLab />
      <ParallaxDivider image="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=1600&q=80" text="Master Your Craft" />
      <Courses />
      <ParallaxDivider image="https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=1600&q=80" text="Learn Together" />
      <About />
      <ParallaxDivider image="https://images.unsplash.com/photo-1501612780327-45045538702b?w=1600&q=80" text="Take The Stage" />
      <CodropsGuitar />
      <CodropsMic />
      <QuoteWave />
      <Contact />
      <Footer />
    </main>
  );
}
