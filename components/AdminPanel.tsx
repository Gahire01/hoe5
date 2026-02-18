
import React, { useState } from 'react';
import { Product } from '../types';

interface Props {
  onAdd: (p: Product) => void;
}

const AdminPanel: React.FC<Props> = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
    stock: '10'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const newProduct: Product = {
      id: `p-${Date.now()}`,
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      image: formData.image,
      stock: Number(formData.stock),
      rating: 5,
      isNew: true
    };

    onAdd(newProduct);
    setFormData({ ...formData, name: '', price: '' });
  };

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 border border-slate-800 shadow-2xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
      </div>
      
      <div className="flex items-center gap-6 mb-10 relative z-10">
        <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </div>
        <div>
          <h2 className="text-white font-black text-2xl tracking-tighter">DATASET INJECTION</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Publish Live Product Protocol</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
             Model Designation
          </label>
          <input 
            type="text" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold transition-all"
            placeholder="e.g. RTX 5090 Ti"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
             Valuation (Rwf)
          </label>
          <input 
            type="number" 
            value={formData.price}
            onChange={e => setFormData({...formData, price: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold transition-all"
            placeholder="0"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
             Directives
          </label>
          <select 
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none font-bold appearance-none cursor-pointer"
          >
            <option>Smartphone</option>
            <option>Audio</option>
            <option>Watches</option>
            <option>Computer & Laptop</option>
            <option>Games & Consoles</option>
          </select>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
             Quantity
          </label>
          <input 
            type="number" 
            value={formData.stock}
            onChange={e => setFormData({...formData, stock: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold transition-all"
          />
        </div>
        <div className="flex items-end">
          <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 h-[56px] rounded-2xl font-black text-xs tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
            INJECT UNIT
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPanel;
