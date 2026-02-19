import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, SUPPLIERS } from '../constants';
import { Facebook, Instagram, Mail, MessageCircle, MapPin, Phone, Twitter } from 'lucide-react';
import PaymentIcons from './PaymentIcons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Suppliers Section */}
        <div className="mb-24">
          <h3 className="text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-12">Authorized Global Partners</h3>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 hover:opacity-100 transition-opacity duration-700 grayscale hover:grayscale-0">
            {SUPPLIERS.map((s, i) => (
              <img key={i} src={s.logo} alt={s.name} className="h-8 md:h-12 w-auto object-contain" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Logo Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Home of Electronics" className="w-12 h-12 object-contain" />
              <div className="leading-tight">
                <h2 className="text-xl font-black tracking-tighter">HOME OF ELECTRONICS</h2>
                <p className="text-[10px] text-cyan-400 tracking-[0.3em] uppercase font-bold">The Tech Authority</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Your premier destination for the world's most innovative electronics. We bridge the gap between imagination and reality with cutting-edge tech in Rwanda.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-500 transition-all cursor-pointer group">
                <Facebook size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-500 transition-all cursor-pointer group">
                <Instagram size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-500 transition-all cursor-pointer group">
                <Twitter size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://tiktok.com/@homeofelectronics" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-500 transition-all cursor-pointer group">
                <span className="text-lg">🎵</span>
              </a>
              <a href={`https://wa.me/${CONTACT_INFO.phone.replace(/\s+/g, '')}`} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-500 transition-all cursor-pointer group">
                <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Shop */}
          <div className="lg:pl-8">
            <h3 className="text-xs font-black mb-8 text-cyan-400 uppercase tracking-widest">Quick Shop</h3>
            <ul className="space-y-4 text-sm text-slate-400 font-bold">
              <li><Link to="/products?category=smartphone" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-cyan-500 group-hover:w-3 transition-all duration-300 rounded-full"></span>Latest Smartphones</Link></li>
              <li><Link to="/products?category=accessories" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-cyan-500 group-hover:w-3 transition-all duration-300 rounded-full"></span>Pro Accessories</Link></li>
              <li><Link to="/products?category=watches" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-cyan-500 group-hover:w-3 transition-all duration-300 rounded-full"></span>Watches & Wearables</Link></li>
              <li><Link to="/products?category=gaming" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-cyan-500 group-hover:w-3 transition-all duration-300 rounded-full"></span>Gaming Setup</Link></li>
              <li><Link to="/products?sort=new" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-cyan-500 group-hover:w-3 transition-all duration-300 rounded-full"></span>New Arrivals</Link></li>
            </ul>
          </div>

          {/* Legal Info */}
          <div>
            <h3 className="text-xs font-black mb-8 text-cyan-400 uppercase tracking-widest">Legal Info</h3>
            <ul className="space-y-4 text-sm text-slate-400 font-bold">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/affiliate" className="hover:text-white transition-colors">Affiliate Program</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-8">
            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest">Contact Us</h3>
            <div className="space-y-5 text-sm text-slate-400 font-medium">
              <p className="flex items-start gap-4">
                <MapPin size={18} className="text-cyan-500 shrink-0 mt-1" />
                {CONTACT_INFO.location}
              </p>
              <p className="flex items-center gap-4">
                <Phone size={18} className="text-cyan-500 shrink-0" />
                {CONTACT_INFO.phone}
              </p>
              <p className="flex items-center gap-4">
                <Mail size={18} className="text-cyan-500 shrink-0" />
                {CONTACT_INFO.email}
              </p>
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 mt-6">
                <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-2">Offline Stores</h4>
                <p className="text-[11px] text-slate-500">Visit us at Makuza Peace Plaza, Kigali Mall, First Floor, Unit 12B</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-12">
          <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-6">We Accept</h3>
          <PaymentIcons />
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
              © 2026 <span className="text-white">Home of Electronics</span>. All rights reserved.
            </p>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
              Developed by <a href="#" className="text-cyan-500 hover:text-white transition-colors">GTRwanda</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
