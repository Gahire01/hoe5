import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Package, Tag, DollarSign, Layers, Image as ImageIcon, Cpu, BarChart } from 'lucide-react';

interface Props {
  onAdd: (p: Product) => void;
  totalProducts: number;
  lowStockCount: number;
  newProductsCount: number;
}

const AdminPanel: React.FC<Props> = ({ onAdd, totalProducts, lowStockCount, newProductsCount }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
    stock: '10',
    isNew: false,
    badge: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const newProduct: Product = {
      id: `p-${Date.now()}`,
      name: formData.name,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      category: formData.category,
      image: formData.image,
      stock: Number(formData.stock),
      rating: 5,
      isNew: formData.isNew,
      badge: formData.badge || undefined,
      specs: {}
    };

    onAdd(newProduct);
    setFormData({ ...formData, name: '', price: '', originalPrice: '', badge: '' });
  };

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 border border-slate-800 shadow-2xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
        <Package size={120} stroke="white" strokeWidth={1} />
      </div>

      <div className="flex items-center gap-6 mb-10 relative z-10">
        <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg">
          <Cpu size={28} />
        </div>
        <div>
          <h2 className="text-white font-black text-2xl tracking-tighter">DATASET INJECTION</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Publish Live Product Protocol</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8 relative z-10">
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-[10px] uppercase font-black flex items-center gap-1">
            <BarChart size={12} /> Total Products
          </p>
          <p className="text-white text-2xl font-black">{totalProducts}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-[10px] uppercase font-black">Low Stock (&lt;5)</p>
          <p className="text-white text-2xl font-black">{lowStockCount}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-[10px] uppercase font-black">New This Month</p>
          <p className="text-white text-2xl font-black">{newProductsCount}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Tag size={12} /> Model Designation
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold transition-all"
            placeholder="e.g. RTX 5090 Ti"
            required
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <DollarSign size={12} /> Price (Rwf)
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={e => setFormData({...formData, price: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold transition-all"
            placeholder="0"
            required
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <DollarSign size={12} /> Discount (Original Price)
          </label>
          <input
            type="number"
            value={formData.originalPrice}
            onChange={e => setFormData({...formData, originalPrice: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold transition-all"
            placeholder="Optional"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Layers size={12} /> Category
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
            <ImageIcon size={12} /> Image URL
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={e => setFormData({...formData, image: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold transition-all"
            placeholder="https://..."
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Package size={12} /> Stock Quantity
          </label>
          <input
            type="number"
            value={formData.stock}
            onChange={e => setFormData({...formData, stock: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold transition-all"
          />
        </div>
        <div className="space-y-3 flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isNew}
              onChange={e => setFormData({...formData, isNew: e.target.checked})}
              className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
            />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stable (New)</span>
          </label>
          <input
            type="text"
            value={formData.badge}
            onChange={e => setFormData({...formData, badge: e.target.value})}
            placeholder="Badge (e.g., Best Seller)"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold transition-all"
          />
        </div>
        <div className="col-span-full flex justify-end">
          <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-12 py-4 rounded-2xl font-black text-xs tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center gap-2">
            <Plus size={16} /> INJECT UNIT
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPanel;
