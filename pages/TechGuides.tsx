import React from 'react';
import { BookOpen, Cpu, Battery, HardDrive } from 'lucide-react';

const guides = [
  { icon: <Cpu size={40} />, title: "How to choose the right processor", desc: "Understand cores, threads, and clock speeds." },
  { icon: <Battery size={40} />, title: "Maximizing battery life", desc: "Tips to keep your devices running longer." },
  { icon: <HardDrive size={40} />, title: "SSD vs HDD: Which one do you need?", desc: "Speed vs capacity explained." },
  { icon: <BookOpen size={40} />, title: "Ultimate smartphone photography guide", desc: "Master pro modes and composition." },
];

const TechGuides: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Tech Guides</h1>
        <p className="text-xl text-slate-500 mb-16 max-w-2xl">Expert advice to help you make informed decisions and get the most from your gear.</p>
        <div className="grid md:grid-cols-2 gap-8">
          {guides.map((g, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 hover:shadow-2xl transition flex gap-6 items-start group">
              <div className="text-cyan-500 group-hover:scale-110 transition-transform">{g.icon}</div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{g.title}</h3>
                <p className="text-slate-500">{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechGuides;
