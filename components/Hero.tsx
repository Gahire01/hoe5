
import React, { useState, useEffect } from 'react';

const SLIDES = [
  {
    tag: "Next-Gen Computing",
    title: "Power Without Limits",
    desc: "Experience the new M3 Max architecture. Built for those who create the future.",
    img: "https://images.unsplash.com/photo-1517336714481-489a2013cc01?auto=format&fit=crop&q=80&w=1200",
    color: "from-blue-900"
  },
  {
    tag: "Immersive Audio",
    title: "Hear the Unheard",
    desc: "Active noise cancellation redesigned. Pure sound, zero distractions.",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200",
    color: "from-slate-900"
  },
  {
    tag: "Smart Living",
    title: "Precision On Your Wrist",
    desc: "The toughest Galaxy Watch ever made. Your health, mastered.",
    img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=1200",
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
    <div className="relative w-full h-[550px] rounded-[3rem] overflow-hidden bg-slate-900 shadow-2xl group">
      {SLIDES.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center scale-110 transition-transform duration-[6000ms] ease-linear"
            style={{ 
              backgroundImage: `url('${slide.img}')`,
              transform: index === current ? 'scale(1)' : 'scale(1.1)'
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} via-transparent to-transparent opacity-90`} />
          
          <div className="relative h-full flex flex-col justify-center px-12 md:px-20 max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-cyan-500 text-slate-900 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 animate-pulse">
              {slide.tag}
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 drop-shadow-lg">
              {slide.title.split(' ').map((word, i) => (
                <span key={i} className={i === slide.title.split(' ').length - 1 ? "text-cyan-400" : ""}>{word} </span>
              ))}
            </h1>
            <p className="text-slate-300 text-lg mb-10 font-medium leading-relaxed max-w-md">
              {slide.desc}
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-10 py-4 rounded-2xl font-black text-xs tracking-widest transition-all shadow-xl hover:-translate-y-1 active:scale-95 flex items-center gap-3">
                EXPLORE NOW
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-10 right-20 flex gap-3">
        {SLIDES.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-12 bg-cyan-400' : 'w-4 bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
