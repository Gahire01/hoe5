import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const Shipping: React.FC = () => {
  const { cartCount } = useCart();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        cartCount={cartCount}
        onSearch={() => {}}
        onOpenCart={() => {}}
        onOpenAuth={() => {}}
        user={user}
        onLogout={() => {}}
      />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Shipping Information</h1>
        <div className="prose prose-slate max-w-none">
          <h2>Delivery Areas</h2>
          <p>
            We ship nationwide across Rwanda. International shipping is currently not available.
          </p>
          <h2>Processing Time</h2>
          <p>
            Orders are processed within 1‑2 business days. You will receive a confirmation email with tracking details.
          </p>
          <h2>Shipping Methods & Costs</h2>
          <ul>
            <li><strong>Standard Delivery:</strong> 2‑5 business days – 2,000 Rwf</li>
            <li><strong>Express Delivery:</strong> 1‑2 business days – 5,000 Rwf</li>
            <li><strong>Free Shipping:</strong> On orders above 500,000 Rwf</li>
          </ul>
          <h2>Store Pickup</h2>
          <p>
            You can also collect your order from our flagship store at Makuza Peace Plaza, Kigali, free of charge.
            Please wait for a “Ready for Pickup” email before visiting.
          </p>
          <h2>Tracking Your Order</h2>
          <p>
            Once your order ships, you will receive a tracking link via email. If you have any questions,
            contact us at <a href="mailto:homeofelectronics20@gmail.com" className="text-cyan-600">homeofelectronics20@gmail.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shipping;
