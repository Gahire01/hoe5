import React from 'react';

const PaymentIcons: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* MOMO Pay (MTN) */}
      <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
        <span className="text-lg">📱</span> MOMO
      </div>
      {/* Airtel Money */}
      <div className="flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">
        <span className="text-lg">💸</span> Airtel
      </div>
      {/* Visa */}
      <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
        <span className="text-lg">💳</span> Visa
      </div>
      {/* Mastercard */}
      <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold">
        <span className="text-lg">💳</span> Mastercard
      </div>
      {/* PayPal */}
      <div className="flex items-center gap-1 bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-xs font-bold">
        <span className="text-lg">🅿️</span> PayPal
      </div>
    </div>
  );
};

export default PaymentIcons;
