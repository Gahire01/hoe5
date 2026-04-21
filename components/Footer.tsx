import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, SUPPLIERS } from '../constants';
import {
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
  MapPin,
  Phone,
  Zap
} from 'lucide-react';
import { FaTiktok, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import PaymentIcons from './PaymentIcons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-white pt-8 pb-5 md:pt-10 md:pb-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Suppliers Section */}
        <div className="mb-8 md:mb-10">
          <h3 className="text-center text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6 md:mb-8">
            Authorized Global Partners
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-5 md:gap-8 opacity-60 hover:opacity-100 transition-opacity duration-700">
            {SUPPLIERS.map((supplier, i) => {
              const Icon = supplier.icon;
              return (
                <div key={i} className="flex flex-col items-center group cursor-pointer">
                  <Icon
                    size={28}
                    className={`text-slate-500 transition-all duration-300 group-hover:scale-110 ${supplier.color || 'group-hover:text-cyan-400'}`}
                  />
                  <span className={`text-[7px] mt-1.5 text-slate-600 uppercase font-black tracking-tighter transition-colors ${supplier.color?.replace('hover:', 'group-hover:') || 'group-hover:text-cyan-400'}`}>
                    {supplier.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">

          {/* Logo Section */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 group cursor-pointer">
                <img 
                  src="/logo.png" 
                  alt="Home of Electronics" 
                  className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" 
                />
                <div className="leading-none">
                  <h2 className="text-lg font-black tracking-tighter text-white">
                    HOME<span className="text-cyan-400">OF</span>ELECTRONICS
                  </h2>
                  <p className="text-[7px] text-slate-500 tracking-[0.3em] uppercase font-black mt-0.5">
                    The Tech Authority
                  </p>
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              Rwanda's premium digital infrastructure partner. Sourcing high-end technology for creators and enterprises.
            </p>

            <div className="flex gap-2 flex-wrap">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: FaTwitter, href: "#" },
                { icon: FaTiktok, href: "https://tiktok.com/@homeofelectronics" },
                { icon: MessageCircle, href: `https://wa.me/${CONTACT_INFO.phone.replace(/\s+/g, '')}` }
              ].map((social, idx) => (
                <a key={idx} href={social.href} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all group">
                  <social.icon size={14} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Shop */}
          <div>
            <h3 className="text-xs font-black mb-6 text-cyan-400 uppercase tracking-widest">
              Quick Shop
            </h3>
            <ul className="space-y-3 text-sm text-slate-400 font-bold">
              <li>
                <Link to="/products?category=smartphone" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-500 group-hover:w-2 transition-all rounded-full" />
                  Latest Smartphones
                </Link>
              </li>
              <li>
                <Link to="/products?category=accessories" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-500 group-hover:w-2 transition-all rounded-full" />
                  Pro Accessories
                </Link>
              </li>
              <li>
                <Link to="/products?category=watches" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-500 group-hover:w-2 transition-all rounded-full" />
                  Watches & Wearables
                </Link>
              </li>
              <li>
                <Link to="/products?category=gaming" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-500 group-hover:w-2 transition-all rounded-full" />
                  Gaming Setup
                </Link>
              </li>
              <li>
                <Link to="/products?sort=new" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-cyan-500 group-hover:w-2 transition-all rounded-full" />
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Info */}
          <div>
            <h3 className="text-xs font-black mb-6 text-cyan-400 uppercase tracking-widest">
              Institutional
            </h3>
            <ul className="space-y-3 text-sm text-slate-400 font-bold">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Protocol</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Service Terms</Link></li>
              <li><Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Logistics & Shipping</Link></li>
              <li><Link to="/affiliate" className="hover:text-white transition-colors">Affiliate Network</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest">
              Contact Us
            </h3>
            <div className="space-y-3 text-sm text-slate-400 font-medium">
              <p className="flex items-start gap-3">
                <MapPin size={18} className="text-cyan-500 mt-1" />
                {CONTACT_INFO.location}
              </p>
              <p className="flex items-center gap-3">
                <Phone size={18} className="text-cyan-500" />
                {CONTACT_INFO.phone}
              </p>
              <p className="flex items-center gap-3">
                <Mail size={18} className="text-cyan-500" />
                {CONTACT_INFO.email}
              </p>
              <a 
                href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <FaWhatsapp size={18} className="text-emerald-500" />
                WhatsApp Business Chat
              </a>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-2">
                  Offline Stores
                </h4>
                <p className="text-xs text-slate-500">
                  Visit us at Makuza Peace Plaza, Kigali Mall, First Floor, Unit 12B
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="mb-6">
          <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-4">
            We Accept
          </h3>
          <PaymentIcons />
        </div>

        {/* Bottom */}
        <div className="pt-5 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
          <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
            © 2026 <span className="text-white">Home of Electronics</span>. All rights reserved.
          </p>
          <p className="text-slate-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
            Developed by{' '}
            <a
              href="https://gahire.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-500 hover:text-white transition-colors"
            >
              GTRwanda
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
