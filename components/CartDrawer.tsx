
import React from 'react';
import { CartItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
}

const CartDrawer: React.FC<Props> = ({ isOpen, onClose, items, onRemove, onUpdateQty }) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const orderViaWhatsApp = () => {
    const phoneNumber = "250788881444";
    const orderItems = items.map(i => `- ${i.name} x${i.quantity} (${(i.price * i.quantity).toLocaleString()} Rwf)`).join('%0A');
    const message = `*NEW ORDER - HOME OF ELECTRONICS*%0A%0A*Items:*%0A${orderItems}%0A%0A*Total Amount:* ${subtotal.toLocaleString()} Rwf%0A%0A_Please confirm my order. Thank you!_`;
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">SHOPPING BAG</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{items.length} Unique Items</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
              <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center text-6xl">🛒</div>
              <div>
                <p className="font-black text-slate-900 text-lg">Your bag is empty.</p>
                <p className="text-sm text-slate-500 mt-2">The future is waiting for you.</p>
              </div>
              <button onClick={onClose} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs tracking-widest">START EXPLORING</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-6 group">
                <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-slate-800 text-sm leading-tight pr-4">{item.name}</h3>
                    <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                  <p className="text-cyan-600 font-black text-sm">{item.price.toLocaleString()} Rwf</p>
                  <div className="flex items-center gap-4 bg-slate-50 w-fit p-1 rounded-xl">
                    <button onClick={() => onUpdateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg transition-all text-slate-900 font-black">-</button>
                    <span className="text-xs font-black w-6 text-center">{item.quantity}</span>
                    <button onClick={() => onUpdateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg transition-all text-slate-900 font-black">+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 border-t border-slate-100 bg-slate-50/50 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                <span>Estimated Subtotal</span>
                <span className="text-slate-900">{subtotal.toLocaleString()} Rwf</span>
              </div>
              <div className="flex justify-between items-center text-slate-900 font-black text-2xl tracking-tighter">
                <span>Order Total</span>
                <span className="text-cyan-600">{subtotal.toLocaleString()} Rwf</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={orderViaWhatsApp}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                ORDER VIA WHATSAPP
              </button>
              <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black text-xs tracking-widest transition-all">
                SECURE CHECKOUT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
