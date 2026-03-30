import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import AIChatBot from '../components/AIChatBot';
import WhatsAppButton from '../components/WhatsAppButton';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import AdminPanel from '../components/AdminPanel';
import AboutSection from '../components/AboutSection';
import ComparisonModal from '../components/ComparisonModal';
import TeamSection from '../components/TeamSection';
import TopUpModal from '../components/TopUpModal';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useEmployees } from '../hooks/useEmployees';
import { ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { cartItems, addToCart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen } = useCart();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [showFloatingButtons, setShowFloatingButtons] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { employees, loading: employeesLoading, addEmployee, updateEmployee, deleteEmployee } = useEmployees();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const heroVisible = entries.find(e => e.target === heroRef.current)?.isIntersecting;
      const footerVisible = entries.find(e => e.target === footerRef.current)?.isIntersecting;
      setShowFloatingButtons(!heroVisible && !footerVisible);
    });
    if (heroRef.current) observer.observe(heroRef.current);
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 space-y-24">
        <div ref={heroRef}><Hero /></div>

        {user?.role === 'admin' && (
          <AdminPanel
            products={products}
            onAdd={addProduct}
            onUpdate={updateProduct}
            onDelete={deleteProduct}
            totalProducts={products.length}
            lowStockCount={products.filter(p => p.stock < 5).length}
            newProductsCount={products.filter(p => p.isNew).length}
            userRole={user.role}
            employees={employees}
            onAddEmployee={addEmployee}
            onUpdateEmployee={updateEmployee}
            onDeleteEmployee={deleteEmployee}
            employeesLoading={employeesLoading}
          />
        )}

        <section className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black text-slate-900">Featured Products</h2>
            <Link to="/products" className="text-cyan-600 font-bold text-sm flex items-center gap-2 hover:underline">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                isComparing={compareIds.includes(product.id)}
                onToggleCompare={(id) => {
                  setCompareIds(prev =>
                    prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev
                  );
                }}
              />
            ))}
          </div>
        </section>

        <TeamSection employees={employees} />
        <AboutSection />
      </main>

      <div ref={footerRef}><Footer /></div>

      {showFloatingButtons && (
        <>
          <AIChatBot />
          <WhatsAppButton />
        </>
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQty={updateQuantity}
      />
      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} user={user} />
      <ComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        products={products.filter(p => compareIds.includes(p.id))}
        onRemove={(id) => setCompareIds(prev => prev.filter(i => i !== id))}
      />
    </div>
  );
};

export default HomePage;
