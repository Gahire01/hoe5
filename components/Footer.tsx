import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, SUPPLIERS } from '../constants';
import { Facebook, Instagram, Mail, MessageCircle, MapPin, Phone } from 'lucide-react';
import { FaTiktok, FaTwitter } from 'react-icons/fa';
import PaymentIcons from './PaymentIcons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8 md:pt-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Suppliers Section with React Icons */}
        <div className="mb-16 md:mb-24">
          <h3 className="text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-8 md:mb-12">Authorized Global Partners</h3>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-60 hover:opacity-100 transition-opacity duration-700">
            {SUPPLIERS.map((s, i) => {
              const Icon = s.logo;
              return (
                <div key={i} className="flex flex-col items-center group">
                  <Icon size={32} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  <span className="text-[8px] mt-1 text-slate-500 group-hover:text-cyan-400">{s.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16 mb-16">
          {/* Logo Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Home of Electronics" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
              <div className="leading-tight">
                <h2 className="text-lg md:text-xl font-black tracking-tighter">HOME OF ELECTRONICS</h2>
                <p className="text-[8px] md:text-[10px] text-cyan-400 tracking-[0.3em] uppercase font-bold">The Tech Authority</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Your premier destination for the world's most innovative electronics. We bridge the gap between imagination and reality with cutting-edge tech in Rwanda.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all">
                <FaTwitter size={18} />
              </a>
              <a href="https://tiktok.com/@homeofelectronics" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all">
                <FaTiktok size={18} />
              </a>
              <a href={`https://wa.me/${CONTACT_INFO.phone.replace(/\s+/g, '')}`} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Quick Shop */}
          <div>
            <h3 className="text-xs font-black mb-6 text-cyan-400 uppercase tracking-widest">Quick Shop</h3>
            <ul className="space-y-3 text-sm text-slate-400 font-bold">
              <li><Link to="/products?category=smartphone" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-cyan-500 group-hover:w-2 transition-all rounded-full"></span>Latest Smartphones</Link></li>
              <li><Link to="/products?category=accessories" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-cyan-500 group-hover:w-2 transition-all rounded-full"></span>Pro Accessories</Link></li>
              <li><Link to="/products?category=watches" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-cyan-500 group-hover:w-2 transition-all rounded-full"></span>Watches & Wearables</Link></li>
              <li><Link to="/products?category=gaming" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-cyan-500 group-hover:w-2 transition-all rounded-full"></span>Gaming Setup</Link></li>
              <li><Link to="/products?sort=new" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-cyan-500 group-hover:w-2 transition-all rounded-full"></span>New Arrivals</Link></li>
            </ul>
          </div>

          {/* Legal Info */}
          <div>
            <h3 className="text-xs font-black mb-6 text-cyan-400 uppercase tracking-widest">Legal Info</h3>
            <ul className="space-y-3 text-sm text-slate-400 font-bold">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/affiliate" className="hover:text-white transition-colors">Affiliate Program</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest">Contact Us</h3>
            <div className="space-y-4 text-sm text-slate-400 font-medium">
              <p className="flex items-start gap-3">
                <MapPin size={18} className="text-cyan-500 shrink-0 mt-1" />
                {CONTACT_INFO.location}
              </p>
              <p className="flex items-center gap-3">
                <Phone size={18} className="text-cyan-500 shrink-0" />
                {CONTACT_INFO.phone}
              </p>
              <p className="flex items-center gap-3">
                <Mail size={18} className="text-cyan-500 shrink-0" />
                {CONTACT_INFO.email}
              </p>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-2">Offline Stores</h4>
                <p className="text-xs text-slate-500">Visit us at Makuza Peace Plaza, Kigali Mall, First Floor, Unit 12B</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-10">
          <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-4">We Accept</h3>
          <PaymentIcons />
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
            © 2026 <span className="text-white">Home of Electronics</span>. All rights reserved.
          </p>
          <p className="text-slate-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
            Developed by <a href="https://gahire.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:text-white transition-colors">GTRwanda</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
