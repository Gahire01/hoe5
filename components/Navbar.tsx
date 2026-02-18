
import React from 'react';

const Navbar: React.FC = () => {
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
        <div className="flex gap-6 font-bold tracking-widest uppercase">
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Support</span>
          <span className="hover:text-cyan-400 cursor-pointer transition-colors font-black text-amber-500">Holiday Deals Live</span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="bg-slate-900 text-white shadow-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg group-hover:-rotate-6 transition-transform">
              H
            </div>
            <div className="leading-tight">
              <h1 className="text-xl font-black tracking-tighter">HOME OF ELECTRONICS</h1>
              <p className="text-[10px] text-cyan-400 tracking-[0.3em] uppercase font-bold">The Tech Authority</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl w-full relative">
            <div className="flex bg-slate-800 rounded-2xl shadow-inner border border-slate-700 overflow-hidden p-1 group focus-within:ring-2 focus-within:ring-cyan-500/50 transition-all">
              <select className="hidden lg:block bg-slate-900 text-slate-400 text-xs px-4 py-2 border-r border-slate-700 focus:outline-none cursor-pointer hover:text-white transition-colors">
                <option>Catalog</option>
                <option>Mobile</option>
                <option>Laptops</option>
                <option>Gaming</option>
              </select>
              <input 
                type="text" 
                placeholder="Search precision hardware..." 
                className="flex-1 px-4 py-2 text-white text-sm focus:outline-none bg-transparent placeholder:text-slate-600 font-medium"
              />
              <button className="bg-cyan-500 text-slate-950 px-6 py-2 rounded-xl hover:bg-cyan-400 transition-all flex items-center gap-2 shadow-lg active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <span className="hidden sm:inline font-black text-xs uppercase tracking-widest">Search</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-8">
            <div className="hidden xl:flex flex-col items-end cursor-pointer group">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Membership</span>
              <span className="text-sm font-black group-hover:text-cyan-400 transition-colors">Sign In</span>
            </div>
            <div className="flex items-center gap-5">
              <div className="relative cursor-pointer hover:scale-110 transition-transform text-slate-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-sm">0</span>
              </div>
              <div className="relative cursor-pointer hover:scale-110 transition-transform text-slate-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                <span className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-sm">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
