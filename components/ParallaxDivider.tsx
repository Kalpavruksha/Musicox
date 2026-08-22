import React from 'react';

interface ParallaxDividerProps {
  image: string;
  height?: string;
  text?: string;
}

export default function ParallaxDivider({ image, height = "400px", text }: ParallaxDividerProps) {
  return (
    <div 
      className="relative w-full bg-fixed bg-center bg-cover flex items-center justify-center"
      style={{ backgroundImage: `url('${image}')`, height }}
    >
      <div className="absolute inset-0 bg-black/40" />
      {text && (
        <h3 
          className="relative z-10 text-3xl md:text-5xl font-bold text-white tracking-widest uppercase opacity-90 text-center px-4" 
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {text}
        </h3>
      )}
    </div>
  );
}
