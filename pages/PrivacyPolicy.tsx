import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar cartCount={0} onSearch={() => {}} onOpenCart={() => {}} onOpenAuth={() => {}} user={null} onLogout={() => {}} />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-slate">
          <p>Last updated: March 2026</p>
          <p>Home of Electronics ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your personal information when you visit our website or make a purchase.</p>
          <h2>Information We Collect</h2>
          <p>We collect information you provide directly, such as when you create an account, place an order, or contact us. This may include your name, email, phone number, and payment details.</p>
          <h2>How We Use Your Information</h2>
          <p>We use your information to process orders, communicate with you, improve our services, and comply with legal obligations.</p>
          <h2>Sharing Your Information</h2>
          <p>We do not sell your personal information. We may share it with third-party service providers who assist us in operating our website and conducting our business.</p>
          <h2>Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. Contact us at privacy@homeofelectronics.rw for assistance.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
