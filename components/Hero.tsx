import React, { useState, useEffect } from 'react';

const SLIDES = [
  {
    tag: "Next-Gen Computing",
    title: "Power Without Limits",
    desc: "Experience the new M3 Max architecture. Built for those who create the future.",
    img: "https://images.unsplash.com/photo-1517336714481-489a2013cc01?auto=format&fit=crop&q=80&w=1600",
    color: "from-blue-900"
  },
  {
    tag: "Immersive Audio",
    title: "Hear the Unheard",
    desc: "Active noise cancellation redesigned. Pure sound, zero distractions.",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1600",
    color: "from-slate-900"
  },
  {
    tag: "Mobile Excellence",
    title: "The Future in Your Hand",
    desc: "Titanium strength meets pro-grade photography. The ultimate iPhone experience.",
    img: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=1600",
    color: "from-cyan-900"
  }
];

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] rounded-[2rem] md:rounded-[4rem] overflow-hidden bg-slate-900 shadow-2xl group">
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[8000ms] ease-linear"
            style={{
              backgroundImage: `url('${slide.img}')`,
              transform: index === current ? 'scale(1)' : 'scale(1.05)'
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} via-slate-900/40 to-transparent opacity-90`} />

          <div className="relative h-full flex flex-col justify-center px-8 md:px-24 max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-cyan-500 text-slate-900 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 animate-bounce">
              {slide.tag}
            </span>
            <h1 className="text-4xl md:text-8xl font-black text-white leading-[1] mb-6 drop-shadow-2xl tracking-tighter">
              {slide.title.split(' ').map((word, i) => (
                <span key={i} className={i === slide.title.split(' ').length - 1 ? "text-cyan-400" : ""}>{word} </span>
              ))}
            </h1>
            <p className="text-slate-200 text-base md:text-xl mb-10 font-medium leading-relaxed max-w-lg drop-shadow-md">
              {slide.desc}
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white hover:bg-cyan-400 text-slate-950 px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black text-xs tracking-widest transition-all shadow-2xl hover:-translate-y-1 active:scale-95 flex items-center gap-3 group">
                EXPLORE CATALOG
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 md:left-auto md:right-24 flex gap-3 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-12 bg-cyan-400' : 'w-4 bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
