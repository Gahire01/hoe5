import React, { useState } from 'react';
import { Product } from '../types';
import { getProductSuggestion } from '../services/geminiService';
import { ShoppingCart, GitCompare, Cpu, Star, Flame, ShieldCheck } from 'lucide-react';

interface Props {
  product: Product;
  onAddToCart: (p: Product) => void;
  isComparing: boolean;
  onToggleCompare: (id: string) => void;
}

const ProductCard: React.FC<Props> = ({ product, onAddToCart, isComparing, onToggleCompare }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleGetAiInsight = async () => {
    if (aiInsight) {
      setAiInsight(null);
      return;
    }
    setIsLoadingAi(true);
    const suggestion = await getProductSuggestion(product.name, product.specs);
    setAiInsight(suggestion || "Verified for peak operational performance.");
    setIsLoadingAi(false);
  };

  const discount = product.originalPrice ? ((product.originalPrice - product.price) / product.originalPrice) * 100 : 0;

  return (
    <div className={`group bg-white rounded-[1.5rem] border transition-all duration-500 relative flex flex-col h-full ${isComparing ? 'border-cyan-500 shadow-xl scale-[1.01]' : 'border-slate-100 shadow-sm hover:shadow-xl'}`}>
      {/* Badges */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-emerald-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest border border-emerald-400 flex items-center gap-1">
            <Cpu size={10} /> Stable
          </span>
        )}
        {product.badge && (
          <span className="bg-slate-900 text-cyan-400 text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest border border-white/10">{product.badge}</span>
        )}
        {discount > 20 && (
          <span className="bg-orange-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest border border-orange-400 flex items-center gap-1">
            <Flame size={10} /> Hot
          </span>
        )}
        {product.rating >= 4.8 && !(discount > 20) && (
          <span className="bg-amber-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest border border-amber-400 flex items-center gap-1">
            <Star size={10} fill="white" /> Top Rated
          </span>
        )}
      </div>

      {/* Action Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(product.id);
          }}
          className={`w-9 h-9 backdrop-blur-xl border rounded-xl transition-all shadow-lg flex items-center justify-center group/comp ${isComparing ? 'bg-cyan-500 border-cyan-400 text-slate-900' : 'bg-slate-900/75 border-slate-800 text-white hover:bg-cyan-500 hover:text-slate-950 opacity-90 group-hover:opacity-100'}`}
          title="Compare Product"
        >
          <GitCompare size={18} />
        </button>
        <button
          onClick={handleGetAiInsight}
          className={`w-9 h-9 ${aiInsight ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900/75 text-white'} backdrop-blur-xl border border-slate-800 rounded-xl hover:bg-cyan-500 hover:text-slate-950 transition-all shadow-lg opacity-90 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 duration-500 flex items-center justify-center`}
          title="Tech Verdict"
        >
          {isLoadingAi ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <ShieldCheck size={18} />
          )}
        </button>
      </div>

      {/* Image */}
      <div className="aspect-[4/3] bg-slate-50 overflow-hidden relative rounded-t-[1.5rem]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 space-y-4">
        <div className="flex justify-between items-center">
           <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.3em]">{product.category}</p>
           <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 rounded-lg">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{product.stock} Units</span>
           </div>
        </div>

        <h3 className="text-slate-950 font-black text-lg leading-snug group-hover:text-cyan-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* AI Insight Overlay */}
        {aiInsight && (
          <div className="bg-cyan-50 p-4 rounded-2xl border border-cyan-100 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={14} className="text-cyan-600" />
              <span className="text-[9px] font-black text-cyan-700 uppercase tracking-widest">Tech Verdict</span>
            </div>
            <p className="text-[11px] text-cyan-900 font-medium leading-relaxed italic">"{aiInsight}"</p>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(product.rating) ? "#f59e0b" : "none"}
                stroke={i < Math.floor(product.rating) ? "#f59e0b" : "#e2e8f0"}
                strokeWidth={2}
              />
            ))}
          </div>
          <span className="text-[8px] text-slate-400 font-black tracking-widest ml-1 uppercase">Rel: {product.rating}</span>
        </div>

        {/* Pricing */}
        <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-slate-400 text-[10px] line-through mb-0.5 font-bold">{product.originalPrice.toLocaleString()} Rwf</span>
            )}
            <span className="text-slate-950 font-black text-xl tracking-tighter">{product.price.toLocaleString()} Rwf</span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-slate-950 text-white p-4 rounded-xl hover:bg-cyan-500 hover:text-slate-950 transition-all shadow-lg active:scale-95 group/btn"
          >
            <ShoppingCart size={18} className="group-hover/btn:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
