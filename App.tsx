import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import StoreLocator from './pages/StoreLocator';
import TechGuides from './pages/TechGuides';
import Support from './pages/Support';
import TopUp from './pages/TopUp';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Refund from './pages/Refund';
import Shipping from './pages/Shipping';
import Affiliate from './pages/Affiliate';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/store-locator" element={<StoreLocator />} />
      <Route path="/tech-guides" element={<TechGuides />} />
      <Route path="/support" element={<Support />} />
      <Route path="/top-up" element={<TopUp />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/refund" element={<Refund />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/affiliate" element={<Affiliate />} />
    </Routes>
  </BrowserRouter>
);

export default App;
