import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { Filter, X, Search } from 'lucide-react';
import { CATEGORIES } from '../constants';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest' | 'rating'>('newest');

  const { products, loading } = useProducts();
  const { cartItems, addToCart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen } = useCart();

  // URL sync
  useEffect(() => {
    if (selectedCategory) setSearchParams({ category: selectedCategory });
    else setSearchParams({});
  }, [selectedCategory, setSearchParams]);

  // Search suggestions
  useEffect(() => {
    if (searchQuery.length > 1) {
      const matches = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => p.name).slice(0, 5);
      setSuggestions(matches);
    } else setSuggestions([]);
  }, [searchQuery, products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (selectedCategory) {
      const selected = selectedCategory.toLowerCase();
      const cat = CATEGORIES.find(c => c.id === selected || c.name.toLowerCase() === selected);
      if (cat) {
        filtered = filtered.filter(p => p.category.toLowerCase() === cat.name.toLowerCase());
      } else {
        filtered = filtered.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === selected);
      }
    }
    if (searchQuery) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    switch (sortBy) {
      case 'price-asc': filtered.sort((a,b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a,b) => b.price - a.price); break;
      case 'rating': filtered.sort((a,b) => b.rating - a.rating); break;
      default: filtered.sort((a,b) => Number(b.isNew) - Number(a.isNew));
    }
    return filtered;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const clearFilters = () => { setSelectedCategory(null); setSearchQuery(''); setSortBy('newest'); };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      {suggestions.length > 0 && (
        <div className="absolute top-[92px] left-1/2 -translate-x-1/2 w-full max-w-xl z-40">
          <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            {suggestions.map((name, idx) => (
              <div key={idx} className="px-4 py-3 text-sm cursor-pointer hover:bg-slate-100" onClick={() => { setSearchQuery(name); setSuggestions([]); }}>{name}</div>
            ))}
          </div>
        </div>
      )}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="flex-1 w-full max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter mb-6 uppercase">
              Hardware <span className="text-cyan-500">Catalog</span>
            </h1>
            <div className="relative group">
              <input
                type="text"
                placeholder="Search models, categories, or specs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl px-12 py-4 text-sm font-bold shadow-sm focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-cyan-500 transition-colors" size={20} />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-64 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 sticky top-28">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex justify-between">Categories <Filter size={16} /></h3>
              <ul className="space-y-2">
                <li><button onClick={() => setSelectedCategory(null)} className={`w-full px-3 py-2 rounded-xl text-sm font-bold ${!selectedCategory ? 'bg-cyan-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>All Products</button></li>
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <li key={cat.id}>
                      <button onClick={() => setSelectedCategory(cat.id)} className={`w-full px-3 py-2 rounded-xl flex gap-3 text-sm font-bold ${selectedCategory === cat.id ? 'bg-cyan-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                        <Icon size={18} /> {cat.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 pt-4 border-t">
                <label className="text-[10px] uppercase font-black text-slate-400">Sort By</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="w-full mt-2 px-4 py-3 rounded-xl border">
                  <option value="newest">Newest</option><option value="price-asc">Price: Low → High</option><option value="price-desc">Price: High → Low</option><option value="rating">Top Rated</option>
                </select>
              </div>
              {(selectedCategory || searchQuery) && <button onClick={clearFilters} className="mt-6 w-full flex justify-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-cyan-600"><X size={14} /> Clear Filters</button>}
            </div>
          </aside>
          <section className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
                {loading ? 'Scanning Database...' : `${filteredProducts.length} Units Detected`}
              </p>
            </div>
            
            {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[2rem] h-[400px] animate-pulse border border-slate-100" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-100">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Search size={40} />
                </div>
                <p className="text-slate-500 font-black uppercase tracking-widest text-sm mb-4">No Products Found</p>
                <button onClick={clearFilters} className="text-cyan-600 font-black text-xs uppercase tracking-widest hover:underline">Clear all filters</button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={addToCart} 
                    isComparing={false} 
                    onToggleCompare={()=>{}} 
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onRemove={removeFromCart} onUpdateQty={updateQuantity} />
    </div>
  );
};

export default ProductsPage;
