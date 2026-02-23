import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import AIChatBot from './components/AIChatBot';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import AboutSection from './components/AboutSection';
import ComparisonModal from './components/ComparisonModal';
import TeamSection from './components/TeamSection';
import StoreLocator from './pages/StoreLocator';
import TechGuides from './pages/TechGuides';
import Support from './pages/Support';
import TopUp from './pages/TopUp';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES, FEATURED_SERVICES, TEAM_MEMBERS } from './constants';
import { Product, CartItem, User, UserRole } from './types';
import { Search, X, ArrowRight } from 'lucide-react';

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [allProducts, setAllProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [showFloatingButtons, setShowFloatingButtons] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCartItems(JSON.parse(saved));
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedProducts = localStorage.getItem('inventory');
    if (savedProducts) setAllProducts(JSON.parse(savedProducts));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(allProducts));
  }, [allProducts]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Intersection Observer for hero and footer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const heroIntersecting = entries.find(e => e.target === heroRef.current)?.isIntersecting;
        const footerIntersecting = entries.find(e => e.target === footerRef.current)?.isIntersecting;
        setShowFloatingButtons(!heroIntersecting && !footerIntersecting);
      },
      { threshold: 0, rootMargin: '0px' }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (footerRef.current) observer.observe(footerRef.current);

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  const handleLogin = (name: string, role: UserRole, email: string) => {
    const newUser: User = { id: '1', name, email, role };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => setCartItems(prev => prev.filter(item => item.id !== id));
  const updateCartQty = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const addProduct = (p: Product) => setAllProducts(prev => [p, ...prev]);
  const toggleCompare = (id: string) => setCompareIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const filteredProducts = useMemo(() => {
    const query = debouncedSearch.toLowerCase();
    return allProducts.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      Object.values(p.specs || {}).some(v => String(v).toLowerCase().includes(query))
    );
  }, [allProducts, debouncedSearch]);

  const compareProducts = useMemo(() => allProducts.filter(p => compareIds.includes(p.id)), [allProducts, compareIds]);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-cyan-100 selection:text-cyan-900 bg-slate-50">
      <Navbar
        cartCount={cartCount}
        onSearch={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 space-y-16 md:space-y-24">
        <div ref={heroRef}>
          <Hero />
        </div>

        {/* Feature Matrix with React Icons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-8">
          {FEATURED_SERVICES.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 md:p-8 bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 hover:border-cyan-200 hover:shadow-xl transition-all duration-500 group cursor-default">
              <div className="text-4xl md:text-5xl mb-4 text-cyan-600 group-hover:scale-110 transition-transform">
                <s.icon />
              </div>
              <h5 className="text-slate-900 font-black text-[9px] md:text-[10px] uppercase tracking-wider mb-2">{s.title}</h5>
              <p className="text-slate-400 text-[8px] md:text-[9px] font-black leading-tight uppercase tracking-widest">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Catalog & Side Context */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <aside className="hidden lg:block w-80 shrink-0 space-y-12">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-blue-600" />
              <h3 className="font-black text-xs uppercase tracking-[0.5em] text-slate-400 mb-8">Directives</h3>
              <ul className="space-y-2">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <li key={cat.id}>
                      <button
                        onClick={() => setSearchQuery(cat.name)}
                        className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-cyan-600 font-black text-[10px] uppercase tracking-widest transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <Icon className="text-2xl group-hover:rotate-12 transition-transform" />
                          {cat.name}
                        </div>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-3xl overflow-hidden aspect-[4/5] bg-slate-950 shadow-2xl group relative border border-white/5">
              <img src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000" alt="Cyber Promo" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-transparent">
                <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Nexus Access
                </span>
                <h4 className="text-3xl font-black text-white leading-tight mb-6 tracking-tighter">Accelerate <br/>Your Workflow.</h4>
                <a href="/top-up" className="bg-white text-slate-950 px-6 py-3 rounded-xl text-[10px] font-black tracking-widest hover:bg-cyan-400 transition-all self-start shadow-2xl">
                  REQUEST QUOTE
                </a>
              </div>
            </div>
          </aside>

          <div className="flex-1 space-y-12">
            {user?.role === 'admin' && (
              <AdminPanel
                onAdd={addProduct}
                totalProducts={allProducts.length}
                lowStockCount={allProducts.filter(p => p.stock < 5).length}
                newProductsCount={allProducts.filter(p => p.isNew).length}
              />
            )}

            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-10 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/20" />
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tighter">PRIMARY DATASET</h2>
                    <p className="text-[9px] md:text-[10px] text-slate-400 font-black tracking-[0.4em] uppercase">Active Search: {searchQuery || 'Global Repository'}</p>
                  </div>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      isComparing={compareIds.includes(product.id)}
                      onToggleCompare={toggleCompare}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Search size={32} className="text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-black text-xs uppercase tracking-[0.4em]">Zero matches in current sectors</p>
                </div>
              )}
            </section>

            {/* "View All Products" link */}
            <div className="text-center">
              <a href="/products" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-black text-xs tracking-widest hover:bg-cyan-500 hover:text-slate-900 transition-all shadow-xl">
                EXPLORE ALL PRODUCTS <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <TeamSection members={TEAM_MEMBERS} />

        <AboutSection />

        {/* Global Access Banner */}
        <div className="bg-slate-950 rounded-3xl md:rounded-[4rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl border border-white/5">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 space-y-4 text-center md:text-left">
            <h3 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter">Scale Your <br/><span className="text-cyan-400">Ambition.</span></h3>
            <p className="text-slate-400 text-lg max-w-sm font-medium leading-relaxed">Join the inner circle of tech procurement. Exclusive memos sent weekly.</p>
          </div>
          <div className="relative z-10 flex w-full md:w-auto">
            <div className="bg-white/5 border border-white/10 p-2 rounded-full flex w-full backdrop-blur-3xl shadow-2xl">
              <input
                type="email"
                placeholder="Secure email portal"
                className="flex-1 bg-transparent px-6 py-3 focus:outline-none text-white font-bold placeholder:text-slate-600 text-sm"
              />
              <button className="bg-cyan-500 text-slate-950 px-8 py-3 rounded-full font-black text-xs hover:bg-white transition-all uppercase tracking-widest shadow-xl active:scale-95">
                Initialize
              </button>
            </div>
          </div>
        </div>
      </main>

      <div ref={footerRef}>
        <Footer />
      </div>

      {/* Floating UI Elements */}
      {showFloatingButtons && (
        <>
          <AIChatBot />
          <WhatsAppButton />
        </>
      )}

      {/* Comparison Floating Bar */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 duration-500 w-[90%] md:w-auto">
          <div className="bg-slate-950 text-white p-3 md:p-4 rounded-2xl md:rounded-[2rem] shadow-2xl border border-white/10 flex flex-wrap items-center justify-center gap-3 md:gap-6 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-slate-900 font-black text-xs">
                {compareIds.length}
              </div>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Selected</span>
            </div>
            <div className="hidden md:block h-6 w-px bg-white/10" />
            <button
              onClick={() => setIsComparisonOpen(true)}
              className="bg-white text-slate-900 px-5 py-2 md:px-8 md:py-3 rounded-xl font-black text-[9px] md:text-[10px] tracking-widest hover:bg-cyan-500 transition-all shadow-lg uppercase"
            >
              Cross-Reference
            </button>
            <button
              onClick={() => setCompareIds([])}
              className="p-2 text-slate-500 hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modals & Overlays */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQty={updateCartQty}
      />
      <ComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        products={compareProducts}
        onRemove={toggleCompare}
      />
    </div>
  );
}

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AppContent />} />
      <Route path="/store-locator" element={<StoreLocator />} />
      <Route path="/tech-guides" element={<TechGuides />} />
      <Route path="/support" element={<Support />} />
      <Route path="/top-up" element={<TopUp />} />
      <Route path="/products" element={<div>All Products Page (coming soon)</div>} />
      <Route path="/privacy" element={<div>Privacy Policy (coming soon)</div>} />
      <Route path="/terms" element={<div>Terms of Service (coming soon)</div>} />
      <Route path="/refund" element={<div>Refund Policy (coming soon)</div>} />
      <Route path="/shipping" element={<div>Shipping Info (coming soon)</div>} />
      <Route path="/affiliate" element={<div>Affiliate Program (coming soon)</div>} />
    </Routes>
  </BrowserRouter>
);

export default App;
