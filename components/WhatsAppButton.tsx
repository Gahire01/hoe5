
import React from 'react';
import { CONTACT_INFO } from '../constants';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = CONTACT_INFO.phone.replace(/\s+/g, '').replace('+', '');
  const message = encodeURIComponent("Hello Home of Electronics! I'm interested in some products.");
  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-50 w-16 h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group border-4 border-white"
      title="Contact us on WhatsApp"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/><path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/><path d="M9.5 13a3.5 3.5 0 0 0 5 0"/></svg>
      <div className="absolute right-20 bg-white text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-4 group-hover:translate-x-0 whitespace-nowrap border border-emerald-100 uppercase tracking-widest">
        Direct Sales Access
      </div>
    </a>
  );
};

export default WhatsAppButton;
