import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const Refund: React.FC = () => {
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
        <h1 className="text-4xl font-black text-slate-900 mb-8">Refund Policy</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-slate-500 mb-6">Last updated: March 2026</p>
          <h2>30-Day Satisfaction Guarantee</h2>
          <p>
            We want you to be completely satisfied with your purchase. If you are not happy for any reason,
            you may return the product within 30 days of delivery for a full refund or exchange.
          </p>
          <h2>Eligibility</h2>
          <ul>
            <li>Products must be unused, in original packaging, and with all accessories.</li>
            <li>Opened electronics may be subject to a restocking fee.</li>
            <li>Special orders or custom items are non-refundable.</li>
          </ul>
          <h2>How to Initiate a Return</h2>
          <p>
            Contact our support team at <a href="mailto:homeofelectronics20@gmail.com" className="text-cyan-600">homeofelectronics20@gmail.com</a>
            with your order number and reason for return. We will provide a return authorization and instructions.
          </p>
          <h2>Refund Processing</h2>
          <p>
            Refunds are processed within 5‑7 business days after we receive and inspect the returned item.
            The refund will be issued to the original payment method.
          </p>
          <h2>Shipping Costs</h2>
          <p>
            Customers are responsible for return shipping unless the return is due to a defect or error on our part.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Refund;
