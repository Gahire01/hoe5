import React from 'react';
import { Headset, Mail, MessageCircle, Phone } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

const Support: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <Headset size={60} className="mx-auto text-cyan-500 mb-6" />
        <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">24/7 Tech Support</h1>
        <p className="text-xl text-slate-500 mb-12">Our engineers are standing by to assist you with any technical issues.</p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100">
            <Phone size={40} className="text-cyan-500 mb-4 mx-auto" />
            <h3 className="text-2xl font-black mb-2">Call Us</h3>
            <p className="text-slate-500 mb-4">{CONTACT_INFO.phone}</p>
            <p className="text-xs text-slate-400">Available 24/7</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100">
            <Mail size={40} className="text-cyan-500 mb-4 mx-auto" />
            <h3 className="text-2xl font-black mb-2">Email</h3>
            <p className="text-slate-500 mb-4">{CONTACT_INFO.email}</p>
            <p className="text-xs text-slate-400">Response within 2 hours</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 md:col-span-2">
            <MessageCircle size={40} className="text-cyan-500 mb-4 mx-auto" />
            <h3 className="text-2xl font-black mb-2">WhatsApp Business</h3>
            <p className="text-slate-500 mb-4">{CONTACT_INFO.phone}</p>
            <a
              href={`https://wa.me/${CONTACT_INFO.phone.replace(/\s+/g, '').replace('+', '')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-emerald-600 transition"
            >
              Chat Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
