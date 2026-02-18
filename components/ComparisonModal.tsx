
import React from 'react';
import { Product } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemove: (id: string) => void;
}

const ComparisonModal: React.FC<Props> = ({ isOpen, onClose, products, onRemove }) => {
  if (!isOpen) return null;

  // Fix: Explicitly type allSpecKeys as string[] to ensure 'key' in map is correctly typed for indexing
  const allSpecKeys: string[] = Array.from(new Set(
    products.flatMap(p => Object.keys(p.specs || {}))
  ));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
        <div className="bg-slate-900 p-8 flex justify-between items-center text-white border-b border-white/5">
          <div>
            <h2 className="text-3xl font-black tracking-tighter">DATASET COMPARISON</h2>
            <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Cross-Reference Technical Metrics</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-x-auto p-8">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr>
                <th className="w-48 text-left p-4 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">Metric</th>
                {products.map(product => (
                  <th key={product.id} className="p-4 border-b border-slate-100 text-left min-w-[200px]">
                    <div className="flex flex-col gap-4">
                      <div className="relative group">
                        <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-2xl" />
                        <button 
                          onClick={() => onRemove(product.id)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-white text-red-600 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                      </div>
                      <span className="text-slate-900 font-black text-sm leading-tight line-clamp-2">{product.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Core Specs */}
              <tr>
                <td className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">Valuation</td>
                {products.map(p => (
                  <td key={p.id} className="p-4 font-black text-cyan-600 text-lg">{p.price.toLocaleString()} Rwf</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">Stability</td>
                {products.map(p => (
                  <td key={p.id} className="p-4 font-bold text-slate-900">
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      {p.rating}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">Inventory</td>
                {products.map(p => (
                  <td key={p.id} className="p-4 font-bold text-slate-500">{p.stock} Units</td>
                ))}
              </tr>
              
              {/* Dynamic Technical Specs */}
              {allSpecKeys.map(key => (
                <tr key={key}>
                  <td className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">{key}</td>
                  {products.map(p => (
                    <td key={p.id} className="p-4 text-sm font-medium text-slate-700">
                      {/* Fix: Accessing specs with 'key' which is now correctly inferred as 'string' */}
                      {p.specs?.[key] || <span className="text-slate-300">N/A</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-cyan-500 hover:text-slate-900 transition-all shadow-xl"
          >
            DISMISS COMPARISON
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
