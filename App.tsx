
import React, { useState, useEffect, useMemo } from 'react';
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
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES, FEATURED_SERVICES } from './constants';
import { Product, CartItem, User, UserRole } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Inventory Management
  const [allProducts, setAllProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');

  // Comparison State
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

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

  const addProduct = (p: Product) => {
    setAllProducts(prev => [p, ...prev]);
  };

  const toggleCompare = (id: string) => {
    setCompareIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      Object.values(p.specs || {}).some(v => String(v).toLowerCase().includes(query))
    );
  }, [allProducts, searchQuery]);

  const compareProducts = useMemo(() => {
    return allProducts.filter(p => compareIds.includes(p.id));
  }, [allProducts, compareIds]);

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

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 space-y-24">
        
        <Hero />

        {/* Feature Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {FEATURED_SERVICES.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center p-12 bg-white rounded-[3rem] shadow-sm border border-slate-100 hover:border-cyan-200 hover:shadow-2xl transition-all duration-500 group cursor-default">
              <span className="text-5xl mb-8 group-hover:scale-125 transition-transform duration-500 drop-shadow-sm">{s.icon}</span>
              <h5 className="text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] mb-3">{s.title}</h5>
              <p className="text-slate-400 text-[9px] font-black leading-tight uppercase tracking-widest">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Catalog & Side Context */}
        <div className="flex flex-col lg:flex-row gap-16">
          <aside className="hidden lg:block w-80 shrink-0 space-y-12">
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-blue-600" />
               <h3 className="font-black text-xs uppercase tracking-[0.5em] text-slate-400 mb-10">Directives</h3>
              <ul className="space-y-4">
                {CATEGORIES.map(cat => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => setSearchQuery(cat.name)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 text-slate-500 hover:text-cyan-600 font-black text-[10px] uppercase tracking-widest transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <span className="text-2xl group-hover:rotate-12 transition-transform drop-shadow-sm">{cat.icon}</span>
                        {cat.name}
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="rounded-[3rem] overflow-hidden aspect-[4/5] bg-slate-950 shadow-2xl group relative border border-white/5">
              <img src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000" alt="Cyber Promo" />
              <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-transparent">
                <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                   Nexus Access
                </span>
                <h4 className="text-4xl font-black text-white leading-tight mb-8 tracking-tighter">Accelerate <br/>Your Workflow.</h4>
                <button className="bg-white text-slate-950 px-8 py-4 rounded-[1.5rem] text-[10px] font-black tracking-widest hover:bg-cyan-400 transition-all self-start shadow-2xl">
                  REQUEST QUOTE
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1 space-y-16">
            {user?.role === 'admin' && <AdminPanel onAdd={addProduct} />}

            <section>
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                  <div className="w-2.5 h-12 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/20" />
                  <div>
                    <h2 className="text-4xl font-black text-slate-950 tracking-tighter">PRIMARY DATASET</h2>
                    <p className="text-[10px] text-slate-400 font-black tracking-[0.4em] uppercase">Active Search: {searchQuery || 'Global Repository'}</p>
                  </div>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-12">
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
                <div className="py-24 text-center bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </div>
                  <p className="text-slate-400 font-black text-xs uppercase tracking-[0.4em]">Zero matches in current sectors</p>
                </div>
              )}
            </section>
          </div>
        </div>

        <AboutSection />

        {/* Global Access Banner */}
        <div className="bg-slate-950 rounded-[4rem] p-16 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group shadow-[0_40px_100px_-15px_rgba(0,0,0,0.5)] border border-white/5">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 space-y-8 text-center md:text-left">
            <h3 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tighter">Scale Your <br/><span className="text-cyan-400">Ambition.</span></h3>
            <p className="text-slate-400 text-xl max-w-sm font-medium leading-relaxed">Join the inner circle of tech procurement. Exclusive memos sent weekly.</p>
          </div>
          <div className="relative z-10 flex w-full md:w-auto">
            <div className="bg-white/5 border border-white/10 p-2.5 rounded-[3rem] flex w-full backdrop-blur-3xl shadow-2xl">
              <input 
                type="email" 
                placeholder="Secure email portal" 
                className="flex-1 bg-transparent px-8 py-4 focus:outline-none text-white font-bold placeholder:text-slate-600"
              />
              <button className="bg-cyan-500 text-slate-950 px-12 py-4 rounded-[2.5rem] font-black text-xs hover:bg-white transition-all uppercase tracking-widest shadow-xl active:scale-95">
                Initialize
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Floating UI Elements */}
      <AIChatBot />
      <WhatsAppButton />
      
      {/* Comparison Floating Bar */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-slate-950 text-white p-4 rounded-[2rem] shadow-2xl border border-white/10 flex items-center gap-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 pl-2">
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-slate-900 font-black text-xs">
                {compareIds.length}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Items Selected</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <button 
              onClick={() => setIsComparisonOpen(true)}
              className="bg-white text-slate-900 px-8 py-3 rounded-xl font-black text-[10px] tracking-widest hover:bg-cyan-500 transition-all shadow-lg uppercase"
            >
              Cross-Reference Specs
            </button>
            <button 
              onClick={() => setCompareIds([])}
              className="p-3 text-slate-500 hover:text-red-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
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
};

export default App;
