
import React, { useState, useEffect } from 'react';
import { CONTACT_INFO } from '../constants';

interface NavbarProps {
  cartCount: number;
  onSearch: (query: string) => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onSearch, onOpenCart, onOpenAuth, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [offer, setOffer] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    if (month === 2 && day <= 14) {
      setOffer('St Valentin Special: 15% Off on All Accessories! ❤️');
    } else if (month === 12) {
      setOffer('Christmas & New Year Mega Sale Live! 🎄');
    } else {
      setOffer('Tech Week: Exclusive Deals on Smartphones! 🚀');
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Banner */}
      <div className="bg-slate-950 text-slate-400 text-[11px] py-1.5 px-6 hidden md:flex justify-between items-center border-b border-white/5">
        <div className="flex gap-4 font-bold tracking-widest uppercase">
          <span className="flex items-center gap-1 hover:text-cyan-400 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            Store Locator
          </span>
          <span className="flex items-center gap-1 hover:text-cyan-400 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Tech Guides
          </span>
        </div>
        <div className="flex gap-6 font-bold tracking-widest uppercase items-center">
          <span className="text-cyan-400 animate-pulse">{offer}</span>
          <div className="h-3 w-px bg-slate-800" />
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Support</span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="bg-slate-900 text-white shadow-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isMenuOpen ? <path d="M18 6 6 18M6 6l12 12"/> : <path d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-500 rounded-xl flex items-center justify-center text-slate-950 font-black text-xl md:text-2xl shadow-lg group-hover:-rotate-6 transition-transform">
              H
            </div>
            <div className="leading-tight hidden sm:block">
              <h1 className="text-lg md:text-xl font-black tracking-tighter">HOME OF ELECTRONICS</h1>
              <p className="text-[9px] md:text-[10px] text-cyan-400 tracking-[0.3em] uppercase font-bold">The Tech Authority</p>
            </div>
          </div>

          {/* Search Bar - Hidden on small mobile, shown on md+ */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
            <div className="flex w-full bg-slate-800 rounded-2xl shadow-inner border border-slate-700 overflow-hidden p-1 group focus-within:ring-2 focus-within:ring-cyan-500/50 transition-all">
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search precision hardware..." 
                className="flex-1 px-4 py-2 text-white text-sm focus:outline-none bg-transparent placeholder:text-slate-600 font-medium"
              />
              <button type="submit" className="bg-cyan-500 text-slate-950 px-6 py-2 rounded-xl hover:bg-cyan-400 transition-all flex items-center gap-2 shadow-lg active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <span className="hidden lg:inline font-black text-xs uppercase tracking-widest">Search</span>
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden xl:flex flex-col items-end cursor-pointer group" onClick={user ? onLogout : onOpenAuth}>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{user ? 'Account' : 'Membership'}</span>
              <span className="text-sm font-black group-hover:text-cyan-400 transition-colors">{user ? `Hi, ${user.name.split(' ')[0]}` : 'Sign In'}</span>
            </div>
            <div className="flex items-center gap-3 md:gap-5">
              <div 
                onClick={onOpenCart}
                className="relative cursor-pointer hover:scale-110 transition-transform text-slate-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <a 
                href={`https://wa.me/${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="text-green-500 hover:scale-110 transition-transform"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/><path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/><path d="M9.5 13a3.5 3.5 0 0 0 5 0"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-white/5 p-6 space-y-6 animate-in slide-in-from-top duration-300">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..." 
                className="w-full bg-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none border border-slate-700"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
            </form>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={onOpenAuth} className="bg-slate-800 p-4 rounded-2xl text-center">
                <span className="block text-[10px] text-slate-500 uppercase font-black mb-1">Account</span>
                <span className="text-sm font-black">{user ? 'Profile' : 'Sign In'}</span>
              </button>
              <button onClick={onOpenCart} className="bg-slate-800 p-4 rounded-2xl text-center">
                <span className="block text-[10px] text-slate-500 uppercase font-black mb-1">Cart</span>
                <span className="text-sm font-black">{cartCount} Items</span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                Store Locator
              </div>
              <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                Tech Guides
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 text-center">
              <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest">{offer}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
