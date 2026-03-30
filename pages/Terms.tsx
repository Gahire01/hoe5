import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const Terms: React.FC = () => {
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
        <h1 className="text-4xl font-black text-slate-900 mb-8">Terms of Service</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-slate-500 mb-6">Last updated: March 2026</p>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Home of Electronics website, you agree to be bound by these Terms of Service.
            If you do not agree, please do not use our services.
          </p>
          <h2>2. Products and Pricing</h2>
          <p>
            All product descriptions, images, and prices are subject to change without notice.
            We strive to display accurate information but cannot guarantee that errors will not occur.
          </p>
          <h2>3. Orders and Payments</h2>
          <p>
            By placing an order, you confirm that you are authorized to use the selected payment method.
            We reserve the right to cancel any order due to suspected fraud or stock unavailability.
          </p>
          <h2>4. Shipping and Delivery</h2>
          <p>
            Delivery times are estimates and may vary. We are not liable for delays caused by third-party carriers
            or events beyond our control.
          </p>
          <h2>5. Returns and Refunds</h2>
          <p>
            Please refer to our <a href="/refund" className="text-cyan-600">Refund Policy</a> for detailed information.
          </p>
          <h2>6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Home of Electronics shall not be liable for any indirect,
            incidental, or consequential damages arising from the use of our products or services.
          </p>
          <h2>7. Governing Law</h2>
          <p>
            These terms are governed by the laws of Rwanda. Any disputes shall be resolved in the courts of Kigali.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
