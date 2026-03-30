import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const Affiliate: React.FC = () => {
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
        <h1 className="text-4xl font-black text-slate-900 mb-8">Affiliate Program</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-700 mb-6">
            Join our affiliate program and earn commissions by referring customers to Home of Electronics.
          </p>
          <h2>How It Works</h2>
          <p>
            Share your unique affiliate link. When a customer makes a purchase through your link,
            you earn a 10% commission on the sale.
          </p>
          <h2>Commission Structure</h2>
          <ul>
            <li>10% on all products (excludes shipping and taxes)</li>
            <li>Payments made monthly via MOMO or bank transfer</li>
            <li>Minimum payout: 50,000 Rwf</li>
          </ul>
          <h2>Become an Affiliate</h2>
          <p>
            To join, send an email to <a href="mailto:affiliates@homeofelectronics.rw" className="text-cyan-600">affiliates@homeofelectronics.rw</a>
            with your name and website/social media links. We'll review your application and get back to you within 3 business days.
          </p>
          <h2>Resources</h2>
          <p>
            Approved affiliates receive marketing materials, tracking tools, and dedicated support to help you succeed.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Affiliate;
