
import React, { useState } from 'react';
import { Product } from '../types';
import { getProductSuggestion } from '../services/geminiService';

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
    setAiInsight(suggestion || "Highly recommended for professional use.");
    setIsLoadingAi(false);
  };

  return (
    <div className={`group bg-white rounded-[3rem] border transition-all duration-700 relative flex flex-col h-full ${isComparing ? 'border-cyan-500 shadow-2xl scale-[1.02]' : 'border-slate-100 shadow-sm hover:shadow-2xl'}`}>
      {/* Badges */}
      <div className="absolute top-8 left-8 z-20 flex flex-col gap-3">
        {product.isNew && (
          <span className="bg-emerald-500 text-white text-[10px] font-black px-5 py-2 rounded-full shadow-lg uppercase tracking-widest border border-emerald-400">Stable</span>
        )}
        {product.badge && (
          <span className="bg-slate-900 text-cyan-400 text-[10px] font-black px-5 py-2 rounded-full shadow-lg uppercase tracking-widest border border-white/10">{product.badge}</span>
        )}
      </div>

      {/* Action Controls */}
      <div className="absolute top-8 right-8 z-20 flex flex-col gap-3">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(product.id);
          }}
          className={`w-12 h-12 backdrop-blur-xl border rounded-2xl transition-all shadow-xl flex items-center justify-center group/comp ${isComparing ? 'bg-cyan-500 border-cyan-400 text-slate-900' : 'bg-white/10 border-white/20 text-white hover:bg-cyan-500 hover:text-slate-950 opacity-0 group-hover:opacity-100'}`}
          title="Compare Product"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M21 16v5h-5"/><path d="M3 16v5h5"/><path d="M10 8H8v4h4v-2"/><path d="M16 14h-2v4h4v-2"/></svg>
        </button>
        <button 
          onClick={handleGetAiInsight}
          className={`w-12 h-12 ${aiInsight ? 'bg-cyan-500 text-slate-950' : 'bg-white/10 text-white'} backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-cyan-500 hover:text-slate-950 transition-all shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-500 flex items-center justify-center`}
          title="AI Suggestion"
        >
          {isLoadingAi ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12L2.1 12.1"/><path d="M12 12l9.9-0.1"/><path d="M12 12l-5.9 8.1"/><path d="M12 12l5.9 8.1"/></svg>
          )}
        </button>
      </div>

      {/* Image */}
      <div className="aspect-[4/3] bg-slate-50 overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-125"
        />
        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/10 transition-colors duration-500" />
      </div>

      {/* Content */}
      <div className="p-10 flex flex-col flex-1 space-y-6">
        <div className="flex justify-between items-center">
           <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">{product.category}</p>
           <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{product.stock} Units</span>
           </div>
        </div>
        
        <h3 className="text-slate-950 font-black text-xl leading-snug group-hover:text-cyan-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* AI Insight Overlay */}
        {aiInsight && (
          <div className="bg-cyan-50 p-4 rounded-2xl border border-cyan-100 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs">🤖</span>
              <span className="text-[9px] font-black text-cyan-700 uppercase tracking-widest">AI Recommendation</span>
            </div>
            <p className="text-[11px] text-cyan-900 font-medium leading-relaxed italic">"{aiInsight}"</p>
          </div>
        )}
        
        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" height="14" 
                viewBox="0 0 24 24" 
                fill={i < Math.floor(product.rating) ? "#f59e0b" : "none"} 
                stroke={i < Math.floor(product.rating) ? "#f59e0b" : "#e2e8f0"} 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
          </div>
          <span className="text-[10px] text-slate-400 font-black tracking-widest ml-1 uppercase">Rel: {product.rating}</span>
        </div>

        {/* Pricing */}
        <div className="pt-8 border-t border-slate-50 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-slate-400 text-xs line-through mb-1 font-bold">{product.originalPrice.toLocaleString()} Rwf</span>
            )}
            <span className="text-slate-950 font-black text-2xl tracking-tighter">{product.price.toLocaleString()} Rwf</span>
          </div>
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-slate-950 text-white p-5 rounded-[1.5rem] hover:bg-cyan-500 hover:text-slate-950 transition-all shadow-xl active:scale-95 group/btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:rotate-12 transition-transform"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
