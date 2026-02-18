
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-24 bg-white rounded-[4rem] px-8 md:px-20 shadow-2xl border border-slate-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 opacity-50 pointer-events-none -skew-x-12 translate-x-1/2" />
      
      <div className="max-w-4xl mx-auto text-center mb-24 relative z-10">
        <span className="text-cyan-600 font-black text-xs uppercase tracking-[0.5em] mb-6 block">The Tech Protocol</span>
        <h2 className="text-4xl md:text-6xl font-black text-slate-950 mb-8 tracking-tighter leading-tight">Elevating Human <br/>Performance Through Hardware.</h2>
        <p className="text-slate-500 text-xl leading-relaxed font-medium">
          Home of Electronics is Rwanda's premium gateway to the global technology landscape. We specialize in sourcing, verifying, and supporting high-end digital architecture for creators and enterprises.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
        <div className="space-y-8 group">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-500 shadow-xl group-hover:-rotate-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
          </div>
          <h3 className="text-2xl font-black text-slate-950 tracking-tight">Verified Engineering</h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">Every component passes a 48-point diagnostic protocol before certification. We only stock the world's most stable hardware.</p>
        </div>
        
        <div className="space-y-8 group">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-500 shadow-xl group-hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
          </div>
          <h3 className="text-2xl font-black text-slate-950 tracking-tight">Direct Factory Logic</h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">By bypassing local intermediaries, we provide direct access to the supply chains of Silicon Valley and Tokyo at unbeatable rates.</p>
        </div>

        <div className="space-y-8 group">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-500 shadow-xl group-hover:rotate-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          </div>
          <h3 className="text-2xl font-black text-slate-950 tracking-tight">Lifetime Support</h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">Our senior engineers provide 24/7 technical oversight for your hardware. We are your partners in digital performance.</p>
        </div>
      </div>

      <div className="mt-24 rounded-[3rem] overflow-hidden h-80 relative group">
        <img 
          src="https://images.unsplash.com/photo-1451187534959-5356ed564bb7?auto=format&fit=crop&q=80&w=1200" 
          alt="Tech Future" 
          className="w-full h-full object-cover transition-transform duration-[5000ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center">
           <div className="text-center space-y-4">
              <p className="text-cyan-400 text-xs font-black uppercase tracking-[0.5em]">Global Infrastructure</p>
              <h4 className="text-white text-3xl font-black tracking-tighter">Connected To Every Tech Hub.</h4>
           </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
