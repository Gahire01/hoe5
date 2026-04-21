import React, { useState } from 'react';
import { Smartphone, RefreshCw, Award, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopUpModal from '../components/TopUpModal';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TopUp: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-cyan-600 font-bold text-sm transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">
          Trade‑In & Upgrade
        </h1>
        <p className="text-xl text-slate-500 mb-16 max-w-2xl">
          Get the best value for your old device. Send us photos of your phone,
          and we’ll give you an instant quote.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 text-center">
            <RefreshCw size={48} className="mx-auto text-cyan-500 mb-4" />
            <h3 className="text-2xl font-black mb-2">Trade‑In</h3>
            <p className="text-slate-500">
              Get up to 50% off a new phone when you trade in your old one.
            </p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 text-center">
            <Smartphone size={48} className="mx-auto text-cyan-500 mb-4" />
            <h3 className="text-2xl font-black mb-2">Battery Replacement</h3>
            <p className="text-slate-500">
              Extend your phone's life with a new battery, installed in under an hour.
            </p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 text-center">
            <Award size={48} className="mx-auto text-cyan-500 mb-4" />
            <h3 className="text-2xl font-black mb-2">Screen Repair</h3>
            <p className="text-slate-500">
              Cracked screen? We use genuine parts and offer a warranty.
            </p>
          </div>
        </div>
        <div className="text-center mt-16">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-cyan-500 text-slate-900 px-12 py-5 rounded-2xl font-black text-sm tracking-widest hover:bg-cyan-400 transition shadow-xl"
          >
            REQUEST TRADE‑IN NOW
          </button>
        </div>
      </div>
      <TopUpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
      />
      </div>
      <Footer />
    </div>
  );
};

export default TopUp;
