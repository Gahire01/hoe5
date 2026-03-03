import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  MapPin,
  BookOpen,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { CONTACT_INFO } from '../constants';

interface NavbarProps {
  cartCount: number;
  onSearch: (query: string) => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onSearch,
  onOpenCart,
  onOpenAuth,
  user,
  onLogout
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [offer, setOffer] = useState('');
  const [search, setSearch] = useState('');
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  useEffect(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    if (month === 2 && day <= 14) {
      setOffer('St Valentin Special: 15% Off on All Accessories! ❤️');
    } else if (month === 12) {
      setOffer('Christmas & New Year Mega Sale Live! 🎄');
    } else {
      setOffer('Tech Week: Exclusive Deals on Smartphones! 🚀');
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search);
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-transform duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Top Banner */}
      <div className="bg-slate-950 text-slate-400 text-[11px] py-1.5 px-6 hidden md:flex justify-between items-center border-b border-white/5">
        <div className="flex gap-4 font-bold tracking-widest uppercase">
          <Link
            to="/store-locator"
            className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
          >
            <MapPin size={12} />
            Store Locator
          </Link>
          <Link
            to="/tech-guides"
            className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
          >
            <BookOpen size={12} />
            Tech Guides
          </Link>
        </div>

        <div className="flex gap-6 font-bold tracking-widest uppercase items-center">
          <span className="text-cyan-400 animate-pulse">{offer}</span>
          <div className="h-3 w-px bg-slate-800" />
          <Link
            to="/support"
            className="hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <Phone size={12} /> Support
          </Link>
        </div>
      </div>

      {/* Main Nav */}
      <div className="bg-slate-900 text-white shadow-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center gap-6">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <img
              src="/logo.png"
              alt="Home of Electronics"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <div className="leading-tight hidden sm:block">
              <h1 className="text-lg md:text-xl font-black tracking-tighter">
                HOME OF ELECTRONICS
              </h1>
              <p className="text-[9px] md:text-[10px] text-cyan-400 tracking-[0.3em] uppercase font-bold">
                The Tech Authority
              </p>
            </div>
          </Link>

          {/* Quick Shop – Desktop */}
          <ul className="hidden lg:flex items-center gap-6 text-sm font-bold">
            {[
              'Smartphone',
              'Laptop',
              'Accessories',
              'Gaming'
            ].map((category) => (
              <li key={category}>
                <Link
                  to={`/products?category=${category}`}
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-cyan-500 group-hover:w-2 transition-all rounded-full" />
                  {category === 'Smartphone'
                    ? 'Latest Smartphones'
                    : category}
                </Link>
              </li>
            ))}
          </ul>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl relative ml-auto"
          >
            <div className="flex w-full bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden p-1 focus-within:ring-2 focus-within:ring-cyan-500/50">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search precision hardware..."
                className="flex-1 px-4 py-2 bg-transparent text-sm focus:outline-none placeholder:text-slate-600"
              />
              <button
                type="submit"
                className="bg-cyan-500 text-slate-950 px-6 rounded-xl hover:bg-cyan-400 transition-all flex items-center gap-2"
              >
                <Search size={18} />
                <span className="hidden lg:inline text-xs font-black uppercase tracking-widest">
                  Search
                </span>
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <div
              onClick={user ? onLogout : onOpenAuth}
              className="hidden xl:flex flex-col items-end cursor-pointer group"
            >
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black flex items-center gap-1">
                <User size={10} />
                {user ? 'Account' : 'Membership'}
              </span>
              <span className="text-sm font-black group-hover:text-cyan-400">
                {user ? `Hi, ${user.name.split(' ')[0]}` : 'Sign In'}
              </span>
            </div>

            <div
              onClick={onOpenCart}
              className="relative cursor-pointer text-slate-400 hover:text-white"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>

            <a
              href={`https://wa.me/${CONTACT_INFO.phone
                .replace(/\s+/g, '')
                .replace('+', '')}`}
              target="_blank"
              rel="noreferrer"
              className="text-green-500"
            >
              <Phone size={24} />
            </a>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-white/5 p-6 space-y-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none border border-slate-700"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500"
              >
                <Search size={20} />
              </button>
            </form>

            {/* Quick Shop – Mobile */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              {['Smartphone', 'Laptop', 'Accessories', 'Gaming'].map(
                (category) => (
                  <Link
                    key={category}
                    to={`/products?category=${category}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-slate-400 font-bold text-xs uppercase tracking-widest p-2 hover:text-white"
                  >
                    {category === 'Smartphone'
                      ? 'Latest Smartphones'
                      : category}
                  </Link>
                )
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-white/5">
              <Link to="/store-locator" className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase">
                <MapPin size={16} /> Store Locator
              </Link>
              <Link to="/tech-guides" className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase">
                <BookOpen size={16} /> Tech Guides
              </Link>
              <Link to="/support" className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase">
                <Phone size={16} /> Support
              </Link>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase"
              >
                <Mail size={16} /> {CONTACT_INFO.email}
              </a>
            </div>

            <p className="text-center text-[10px] text-cyan-400 font-black uppercase tracking-widest">
              {offer}
            </p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
