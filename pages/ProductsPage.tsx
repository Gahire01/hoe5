import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import CartDrawer from '../components/CartDrawer';
import { User } from '../types';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { Filter, X } from 'lucide-react';
import { CATEGORIES } from '../constants';

const ProductsPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  );
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest' | 'rating'>('newest');

  const { products } = useProducts();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartCount,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, firebaseUser => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
          email: firebaseUser.email || '',
          role: 'user',
        });
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  /* ---------------- URL SYNC ---------------- */
  useEffect(() => {
    if (selectedCategory) {
      setSearchParams({ category: selectedCategory });
    } else {
      setSearchParams({});
    }
  }, [selectedCategory, setSearchParams]);

  /* ---------------- SEARCH SUGGESTIONS ---------------- */
  useEffect(() => {
    if (searchQuery.length > 1) {
      const q = searchQuery.toLowerCase();
      const matches = products
        .filter(p => p.name.toLowerCase().includes(q))
        .map(p => p.name)
        .slice(0, 5);

      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, products]);

  /* ---------------- FILTER + SORT ---------------- */
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory) {
      const cat = CATEGORIES.find(c => c.id === selectedCategory);
      if (cat) {
        filtered = filtered.filter(
          p => p.category.toLowerCase() === cat.name.toLowerCase()
        );
      }
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    }

    return filtered;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        cartCount={cartCount}
        onSearch={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onLogout={() => auth.signOut()}
      />

      {/* 🔍 Search Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute top-[92px] left-1/2 -translate-x-1/2 w-full max-w-xl z-40">
          <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            {suggestions.map((name, idx) => (
              <div
                key={idx}
                className="px-4 py-3 text-sm cursor-pointer hover:bg-slate-100"
                onClick={() => {
                  setSearchQuery(name);
                  setSuggestions([]);
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-64 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 sticky top-28">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex justify-between">
                Categories <Filter size={16} />
              </h3>

              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full px-3 py-2 rounded-xl text-sm font-bold ${
                      !selectedCategory
                        ? 'bg-cyan-500 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    All Products
                  </button>
                </li>

                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <li key={cat.id}>
                      <button
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full px-3 py-2 rounded-xl flex gap-3 text-sm font-bold ${
                          selectedCategory === cat.id
                            ? 'bg-cyan-500 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Icon size={18} />
                        {cat.name}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 pt-4 border-t">
                <label className="text-[10px] uppercase font-black text-slate-400">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="w-full mt-2 px-4 py-3 rounded-xl border"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {(selectedCategory || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="mt-6 w-full flex justify-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-cyan-600"
                >
                  <X size={14} /> Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* Products */}
          <section className="flex-1">
            <p className="mb-6 text-sm text-slate-500">
              {filteredAndSortedProducts.length} product
              {filteredAndSortedProducts.length !== 1 && 's'} found
            </p>

            {filteredAndSortedProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center">
                <p className="text-slate-500">No products found.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 font-bold text-cyan-600 underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={setUser}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQty={updateQuantity}
      />
    </div>
  );
};

export default ProductsPage;
