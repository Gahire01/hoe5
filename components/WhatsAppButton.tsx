import React from 'react';
import { CONTACT_INFO } from '../constants';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton: React.FC = () => {
  const message = encodeURIComponent("Hello Home of Electronics! I'm interested in your products.");
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${message}`;

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-3">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-emerald-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all animate-bounce"
        aria-label="Contact us on WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>
    </div>
  );
};

export default WhatsAppButton;
