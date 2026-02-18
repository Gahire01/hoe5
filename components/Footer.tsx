
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-red-700 font-black text-2xl">H</div>
              <h2 className="text-xl font-bold tracking-tight">HOME OF ELECTRONICS</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your premier destination for the world's most innovative electronics. We bridge the gap between imagination and reality with cutting-edge tech.
            </p>
            <div className="flex gap-4">
              {['FB', 'TW', 'IG', 'LI'].map(social => (
                <div key={social} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-700 hover:border-red-700 transition-all cursor-pointer group">
                  <span className="text-xs font-bold group-hover:scale-110 transition-transform">{social}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h3 className="text-lg font-bold mb-6 text-red-500">Quick Shop</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              {['Latest Smartphones', 'Pro Accessories', 'Watches & Wearables', 'Gaming Setup', 'New Arrivals'].map(link => (
                <li key={link} className="hover:text-white transition-colors cursor-pointer flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-red-700 group-hover:w-3 transition-all duration-300"></span>
                  {link}
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-red-500">Legal Info</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Shipping Info', 'Affiliate Program'].map(link => (
                <li key={link} className="hover:text-white transition-colors cursor-pointer">{link}</li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-red-500">Contact Us</h3>
            <div className="space-y-4 text-sm text-slate-400">
              <p className="flex items-start gap-3">
                <span className="text-red-700">📍</span>
                Makuza Peace Plaza, KN 84 Street, Kigali, Rwanda
              </p>
              <p className="flex items-center gap-3">
                <span className="text-red-700">📞</span>
                +250 788 881 444
              </p>
              <p className="flex items-center gap-3 underline decoration-red-700 underline-offset-4">
                <span className="text-red-700">✉️</span>
                sales@homeofelectronics.com
              </p>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="text-white text-xs font-black uppercase mb-2">Offline Stores</h4>
                <p className="text-[11px]">Visit us at Kigali Mall, First Floor, Unit 12B</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs">
            © 2024 <span className="text-white font-bold">Home of Electronics</span>. All rights reserved. Made for greatness.
          </p>
          <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-5" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
