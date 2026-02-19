
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

      <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-950 tracking-tight">Visit Our Store</h4>
              <p className="text-slate-500 text-sm font-medium">Around Makuza Peace Plaza, Kigali, Rwanda</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-950 tracking-tight">Call For Support</h4>
              <p className="text-slate-500 text-sm font-medium">+250 780 615 795</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-950 tracking-tight">Email Us</h4>
              <p className="text-slate-500 text-sm font-medium">homeofelectronics20@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="rounded-[3rem] overflow-hidden h-[400px] shadow-2xl border-8 border-slate-50 relative group">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.503463665392!2d30.0594386!3d-1.9441112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca42978059047%3A0x6281096752398162!2sMakuza%20Peace%20Plaza!5e0!3m2!1sen!2srw!4v1700000000000!5m2!1sen!2srw" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale group-hover:grayscale-0 transition-all duration-700"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
