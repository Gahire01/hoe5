import React from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';
import { MdPayments } from 'react-icons/md';
import { SiVisa, SiMastercard } from 'react-icons/si';

const PaymentIcons: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:border-yellow-500/50 transition-colors group">
        <MdPayments className="text-xl text-yellow-500" /> 
        <span className="group-hover:text-white transition-colors">MoMo Pay</span>
      </div>
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:border-red-500/50 transition-colors group">
        <FaMoneyBillWave className="text-xl text-red-500" /> 
        <span className="group-hover:text-white transition-colors">Airtel Money</span>
      </div>
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:border-blue-500/50 transition-colors group">
        <SiVisa className="text-xl text-blue-500" /> 
        <span className="group-hover:text-white transition-colors">Visa</span>
      </div>
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:border-orange-500/50 transition-colors group">
        <SiMastercard className="text-xl text-orange-500" /> 
        <span className="group-hover:text-white transition-colors">Mastercard</span>
      </div>
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:border-emerald-500/50 transition-colors group">
        <FaMoneyBillWave className="text-xl text-emerald-500" /> 
        <span className="group-hover:text-white transition-colors">Cash</span>
      </div>
    </div>
  );
};

export default PaymentIcons;
