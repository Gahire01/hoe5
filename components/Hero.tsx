import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const SLIDES = [
  {
    tag: "Next-Gen Mobile",
    title: "Precision in Your Hand",
    desc: "Experience the ultimate iPhone architecture. Titanium strength meets pro-grade photography for Rwanda's modern professionals.",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=2200",
    color: "from-blue-900"
  },
  {
    tag: "Pro Computing",
    title: "Power Without Limits",
    desc: "The new M3 Max architecture. Built for those who architect the future and demand peak operational performance.",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=2200",
    color: "from-slate-900"
  },
  {
    tag: "Smart Wearables",
    title: "The Future of Time",
    desc: "Advanced sensors and aerospace-grade materials. Your ultimate health and productivity partner on the go.",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=2200",
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
    <div className="relative w-full h-[400px] sm:h-[520px] md:h-[620px] lg:h-[700px] rounded-2xl md:rounded-3xl lg:rounded-[3rem] overflow-hidden bg-slate-900 shadow-2xl group">
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-linear"
            style={{
              backgroundImage: `url('${slide.img}')`,
              transform: index === current ? 'scale(1.1)' : 'scale(1)'
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} via-slate-900/50 to-transparent opacity-90`} />

          <div className="relative h-full flex flex-col justify-center px-6 md:px-14 lg:px-24 max-w-4xl">
            <span className="inline-block px-4 py-1.5 bg-cyan-500 text-slate-900 text-[9px] md:text-xs font-black uppercase tracking-[0.3em] rounded-full mb-6 w-fit animate-in fade-in slide-in-from-left-4 duration-700">
              {slide.tag}
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] mb-5 drop-shadow-2xl tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-1000">
              {slide.title.split(' ').map((word, i) => (
                <span key={i} className={i === slide.title.split(' ').length - 1 ? "text-cyan-400 block" : ""}>{word} </span>
              ))}
            </h1>
            <p className="text-slate-200 text-sm md:text-lg lg:text-xl mb-8 font-medium leading-relaxed max-w-xl drop-shadow-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              {slide.desc}
            </p>
            <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
              <Link to="/products" className="bg-white hover:bg-cyan-400 text-slate-950 px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black text-xs md:text-sm tracking-widest transition-all shadow-2xl hover:-translate-y-1 active:scale-95 flex items-center gap-3 group">
                EXPLORE CATALOG <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-8 md:bottom-12 right-8 md:right-16 flex items-end gap-3 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="group py-4 flex items-center"
          >
            <div className={`h-1.5 rounded-full transition-all duration-700 ${i === current ? 'w-12 bg-cyan-400' : 'w-4 bg-white/20 group-hover:bg-white/40'}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Hero;
