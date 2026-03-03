import React from 'react';
import { BookOpen, Cpu, Battery, HardDrive, Camera, Wifi, Shield, Smartphone } from 'lucide-react';
import Footer from'../components/Footer.tsx';
import Navbar from'../components/Navbar.tsx';
const guides = [
  { icon: <Cpu size={40} />, title: "How to choose the right processor", desc: "Understand cores, threads, and clock speeds for your needs." },
  { icon: <Battery size={40} />, title: "Maximizing battery life", desc: "Tips to keep your devices running longer between charges." },
  { icon: <HardDrive size={40} />, title: "SSD vs HDD: Which one do you need?", desc: "Speed vs capacity explained for gamers and professionals." },
  { icon: <Camera size={40} />, title: "Ultimate smartphone photography guide", desc: "Master pro modes, composition, and editing." },
  { icon: <Wifi size={40} />, title: "Home networking essentials", desc: "How to set up a fast and secure Wi-Fi network." },
  { icon: <Shield size={40} />, title: "Cybersecurity basics", desc: "Protect your devices from malware and hackers." },
  { icon: <Smartphone size={40} />, title: "Smartphone maintenance", desc: "Keep your phone running like new for years." },
  { icon: <BookOpen size={40} />, title: "Understanding warranty & support", desc: "What to do when your device needs repair." },
];

const TechGuides: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar cartCount={0} onSearch={() => {}} onOpenCart={() => {}} onOpenAuth={() => {}} user={null} onLogout={() => {}} />
      <main className="max-w-7xl mx-auto px-4 py-16">
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
      </main>
      <Footer />
    </div>
  );
};

export default TechGuides;
