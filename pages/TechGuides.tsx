import React from 'react';
import { BookOpen, Cpu, Battery, HardDrive, Camera, Wifi, Shield, Smartphone, Zap, Search, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const guides = [
  { 
    icon: <Cpu size={32} />, 
    title: "The 2024 Processor Protocol", 
    desc: "A deep dive into N3B architecture and why it matters for your next workstation.",
    tag: "Hardware"
  },
  { 
    icon: <Battery size={32} />, 
    title: "Battery Health Optimization", 
    desc: "Advanced cycle management techniques to preserve lithium-ion longevity.",
    tag: "Maintenance"
  },
  { 
    icon: <HardDrive size={32} />, 
    title: "High-Speed Storage Systems", 
    desc: "Comparing NVMe Gen5 vs Gen4 speeds for professional 8K video workflows.",
    tag: "Performance"
  },
  { 
    icon: <Camera size={32} />, 
    title: "Pro-Grade Mobile Optics", 
    desc: "Mastering periscope zoom and computational photography in modern flagships.",
    tag: "Photography"
  },
  { 
    icon: <Wifi size={32} />, 
    title: "Wi-Fi 7: The New Standard", 
    desc: "Everything you need to know about the 6GHz band and ultra-low latency.",
    tag: "Networking"
  },
  { 
    icon: <Shield size={32} />, 
    title: "Biometric Data Security", 
    desc: "How FaceID and Fingerprint sensors protect your digital identity at the hardware level.",
    tag: "Security"
  },
  {
    icon: <Smartphone size={32} />,
    title: "Choosing the Right Flagship Phone",
    desc: "How to compare camera performance, battery endurance, chipset efficiency, and long-term software support.",
    tag: "Buying Guide"
  },
  {
    icon: <Zap size={32} />,
    title: "Fast Charging Safety Guide",
    desc: "Understand wattage, thermal protection, and charging habits that keep your battery healthy over years.",
    tag: "Charging"
  },
  {
    icon: <Cpu size={32} />,
    title: "Laptop for Students vs Professionals",
    desc: "Recommended specs for office work, coding, design, and high-performance editing on different budgets.",
    tag: "Laptops"
  },
  {
    icon: <Battery size={32} />,
    title: "Power Bank and Adapter Compatibility",
    desc: "How to match voltage and protocols like PD or QC for stable and safe device charging.",
    tag: "Accessories"
  },
];

const TechGuides: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 md:mb-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-cyan-400 shadow-xl">
                <BookOpen size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Knowledge Base</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-950 tracking-tighter leading-[0.9]">
              Tech <span className="text-cyan-500">Guides</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 mt-8 font-medium leading-relaxed">
              Technical documentation and architectural insights to help you architect your ideal digital environment.
            </p>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <input 
              type="text" 
              placeholder="Search documentation..." 
              className="w-full bg-white border border-slate-200 rounded-2xl px-12 py-5 text-sm font-bold shadow-sm focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-cyan-500 transition-colors" size={20} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((g, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full group">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 group-hover:bg-slate-950 group-hover:text-cyan-400 transition-all duration-500 shadow-inner">
                  {g.icon}
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 group-hover:bg-cyan-500/10 group-hover:text-cyan-600 group-hover:border-cyan-500/20 transition-all">
                  {g.tag}
                </span>
              </div>
              
              <h3 className="text-2xl font-black text-slate-950 mb-4 leading-tight group-hover:text-cyan-600 transition-colors">
                {g.title}
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-1">
                {g.desc}
              </p>
              
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-950 transition-all">
                Read Protocol <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TechGuides;
