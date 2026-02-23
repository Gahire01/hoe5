import React from 'react';
import { FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import { MdPayments } from 'react-icons/md';
import { SiVisa, SiMastercard, SiPaypal } from 'react-icons/si';

const PaymentIcons: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
        <MdPayments className="text-lg" /> MOMO
      </div>
      <div className="flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">
        <FaMoneyBillWave className="text-lg" /> Airtel
      </div>
      <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
        <SiVisa className="text-lg" /> Visa
      </div>
      <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold">
        <SiMastercard className="text-lg" /> Mastercard
      </div>
      <div className="flex items-center gap-1 bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-xs font-bold">
        <SiPaypal className="text-lg" /> PayPal
      </div>
    </div>
  );
};

export default PaymentIcons;
