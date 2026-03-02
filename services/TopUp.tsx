import React, { useState } from 'react';
import { Smartphone, RefreshCw, Award } from 'lucide-react';
import TopUpModal from '../components/TopUpModal';
import { User } from '../types';

interface Props {
  user: User | null;
}

const TopUp: React.FC<Props> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Phone Top-Up & Upgrade</h1>
        <p className="text-xl text-slate-500 mb-16 max-w-2xl">Trade in your old device and get credit toward a new one. We also offer battery replacements, screen repairs, and more.</p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 text-center">
            <RefreshCw size={48} className="mx-auto text-cyan-500 mb-4" />
            <h3 className="text-2xl font-black mb-2">Trade-In</h3>
            <p className="text-slate-500">Get up to 50% off a new phone when you trade in your old one.</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 text-center">
            <Smartphone size={48} className="mx-auto text-cyan-500 mb-4" />
            <h3 className="text-2xl font-black mb-2">Battery Replacement</h3>
            <p className="text-slate-500">Extend your phone's life with a new battery, installed in under an hour.</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 text-center">
            <Award size={48} className="mx-auto text-cyan-500 mb-4" />
            <h3 className="text-2xl font-black mb-2">Screen Repair</h3>
            <p className="text-slate-500">Cracked screen? We use genuine parts and offer a warranty.</p>
          </div>
        </div>
        <div className="text-center mt-16">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-cyan-500 text-slate-900 px-12 py-5 rounded-2xl font-black text-sm tracking-widest hover:bg-cyan-400 transition shadow-xl"
          >
            REQUEST TOP-UP NOW
          </button>
        </div>
      </div>
      <TopUpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} user={user} />
    </div>
  );
};

export default TopUp;
