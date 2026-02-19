import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

const StoreLocator: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-slate-900 mb-8 tracking-tighter">Store Locator</h1>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center text-slate-900">
                <MapPin size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black">Our Flagship Store</h3>
                <p className="text-slate-500">{CONTACT_INFO.location}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <Phone size={20} className="text-cyan-500" />
                <span>{CONTACT_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Mail size={20} className="text-cyan-500" />
                <span>{CONTACT_INFO.email}</span>
              </div>
            </div>
            <p className="text-slate-500">Visit us at Makuza Peace Plaza, Kigali Mall, First Floor, Unit 12B. Open Mon-Sat 9am-8pm, Sun 10am-6pm.</p>
          </div>
          <div className="rounded-[3rem] overflow-hidden h-[400px] shadow-2xl border-8 border-slate-50">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.503463665392!2d30.0594386!3d-1.9441112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca42978059047%3A0x6281096752398162!2sMakuza%20Peace%20Plaza!5e0!3m2!1sen!2srw!4v1700000000000!5m2!1sen!2srw"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-700"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
