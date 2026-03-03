import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

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
import TopUpModal from './components/TopUpModal';

import StoreLocator from './pages/StoreLocator';
import TechGuides from './pages/TechGuides';
import Support from './pages/Support';
import TopUp from './pages/TopUp';

import {
  PRODUCTS as INITIAL_PRODUCTS,
  CATEGORIES,
  FEATURED_SERVICES,
  TEAM_MEMBERS,
} from './constants';

import { Product, CartItem, User } from './types';
import { Search, X, ArrowRight } from 'lucide-react';

// Simple Category Sidebar Component
const CategorySidebar: React.FC<{
  categories: typeof CATEGORIES;
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  onClearSearch: () => void;
}> = ({ categories, selectedCategory, onSelectCategory, onClearSearch }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 sticky top-28">
      <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Categories</h3>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
              selectedCategory === null ? 'bg-cyan-500 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Products
          </button>
        </li>
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <li key={cat.id}>
              <button
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-3 ${
                  selectedCategory === cat.id ? 'bg-cyan-500 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={18} />
                {cat.name}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 pt-4 border-t border-slate-100">
        <button
          onClick={onClearSearch}
          className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-cyan-600 transition-colors"
        >
          Clear Search
        </button>
      </div>
    </div>
  );
};

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [showFloatingButtons, setShowFloatingButtons] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }

      let role: 'admin' | 'user' = 'user';

      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          role = userDoc.data().role || 'user';
        }
      } catch (error) {
        console.warn('Firestore unavailable, using default role');
      }

      setUser({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
        email: firebaseUser.email || '',
        role,
        avatar: firebaseUser.photoURL || undefined,
      });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const prods: Product[] = [];
        snapshot.forEach((d) =>
          prods.push({ id: d.id, ...d.data() } as Product)
        );
        setAllProducts(prods.length ? prods : INITIAL_PRODUCTS);
      } catch (error) {
        console.error('Error fetching products, using initial data:', error);
        setAllProducts(INITIAL_PRODUCTS);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const heroVisible = entries.find(
        (e) => e.target === heroRef.current
      )?.isIntersecting;
      const footerVisible = entries.find(
        (e) => e.target === footerRef.current
      )?.isIntersecting;
      setShowFloatingButtons(!heroVisible && !footerVisible);
    });

    heroRef.current && observer.observe(heroRef.current);
    footerRef.current && observer.observe(footerRef.current);

    return () => observer.disconnect();
  }, []);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;
    const q = debouncedSearch.toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) {
      const cat = CATEGORIES.find(c => c.id === selectedCategory);
      if (cat) {
        filtered = filtered.filter(p => p.category.toLowerCase() === cat.name.toLowerCase());
      }
    }
    return filtered;
  }, [allProducts, debouncedSearch, selectedCategory]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        cartCount={cartItems.reduce((a, c) => a + c.quantity, 0)}
        onSearch={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onLogout={() => auth.signOut()}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 space-y-24">
        <div ref={heroRef}>
          <Hero />
        </div>

        {user?.role === 'admin' && (
          <AdminPanel
            onAdd={(p) => setAllProducts((prev) => [p, ...prev])}
            totalProducts={allProducts.length}
            lowStockCount={allProducts.filter((p) => p.stock < 5).length}
            newProductsCount={allProducts.filter((p) => p.isNew).length}
            userRole={user.role}
          />
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <CategorySidebar
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onClearSearch={handleClearSearch}
            />
          </aside>

          {/* Products Grid */}
          <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                isComparing={compareIds.includes(product.id)}
                onToggleCompare={(id) => {
                  setCompareIds(prev =>
                    prev.includes(id)
                      ? prev.filter(i => i !== id)
                      : prev.length < 3 ? [...prev, id] : prev
                  );
                }}
              />
            ))}
          </section>
        </div>

        <TeamSection members={TEAM_MEMBERS} />
        <AboutSection />
      </main>

      <div ref={footerRef}>
        <Footer />
      </div>

      {showFloatingButtons && (
        <>
          <AIChatBot />
          <WhatsAppButton />
        </>
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={setUser}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={(id) =>
          setCartItems((prev) => prev.filter((i) => i.id !== id))
        }
        onUpdateQty={(id, delta) =>
          setCartItems((prev) =>
            prev.map((i) =>
              i.id === id
                ? { ...i, quantity: Math.max(1, i.quantity + delta) }
                : i
            )
          )
        }
      />

      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        user={user}
      />

      <ComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        products={allProducts.filter(p => compareIds.includes(p.id))}
        onRemove={(id) => setCompareIds(prev => prev.filter(i => i !== id))}
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
      <Route path="/top-up" element={<TopUp user={null} />} />
    </Routes>
  </BrowserRouter>
);

export default App;
