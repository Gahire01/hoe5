import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, ShoppingCart, User, LogOut, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Top-Up', path: '/top-up' },
  { label: 'Store Locator', path: '/store-locator' },
  { label: 'Tech Guides', path: '/tech-guides' },
  { label: 'Support', path: '/support' },
];

const Navbar: React.FC = () => {
  const { user, logout, openAuthModal } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  const isAdmin = user?.role === 'admin' || user?.email === 'homeofelectronics20@gmail.com';

  const isHome = location.pathname === '/';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/30'
            : 'bg-slate-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-18">
            <div className="flex items-center gap-4">
              {location.pathname !== '/' && (
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition group"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
              )}
              <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-1 shadow-lg group-hover:scale-105 transition-transform border border-slate-100">
                <img src="/logo.png" alt="HOE" className="w-full h-full object-contain" />
              </div>
              <div className="hidden sm:block leading-none">
                <h1 className="text-xl font-black tracking-tighter text-white">
                  HOME<span className="text-cyan-400">OF</span>ELECTRONICS
                </h1>
                <p className="text-[7px] text-slate-400 tracking-[0.4em] uppercase font-black mt-0.5">
                  The Tech Authority
                </p>
              </div>
            </Link>
            </div>

            {/* Desktop Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive(path)
                      ? 'text-cyan-400'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                  {isActive(path) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cyan-400 text-slate-900 text-[10px] font-black rounded-full flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* Auth */}
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
                    <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-slate-900 text-[10px] font-black">
                        {user.name?.[0]?.toUpperCase() ?? 'U'}
                      </span>
                    </div>
                    <span className="text-white text-sm font-semibold max-w-[80px] truncate">
                      {user.name}
                    </span>
                  </div>
                  {isAdmin && !isActive('/admin') && (
                    <Link
                      to="/admin"
                      className="text-xs font-bold text-slate-900 bg-cyan-400 px-3 py-1.5 rounded-lg hover:bg-cyan-300 transition shrink-0 inline-flex items-center gap-1.5"
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-white/10 rounded-xl transition-all"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 bg-cyan-400 px-3 sm:px-4 py-2 rounded-lg hover:bg-cyan-300 transition shadow-lg shadow-cyan-500/20 shrink-0"
                >
                  <User size={14} className="sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Login</span>
                </button>
              )}

              {/* Hamburger (mobile) */}
              <button
                onClick={() => setOpen((v) => !v)}
                className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
                aria-label="Toggle menu"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          open ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-slate-900 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-cyan-400 rounded-lg flex items-center justify-center">
                <Zap size={14} className="text-slate-900" strokeWidth={3} />
              </div>
              <span className="text-white font-black text-sm">HoE</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
            >
              <X size={20} />
            </button>
          </div>

          {user && (
            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-900 font-black">
                    {user.name?.[0]?.toUpperCase() ?? 'U'}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold truncate">{user.name}</p>
                  <p className="text-slate-400 text-xs truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {NAV_LINKS.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  isActive(path)
                    ? 'bg-cyan-400/15 text-cyan-400 border border-cyan-400/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
                {isActive(path) && (
                  <span className="ml-auto w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                )}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  isActive('/admin')
                    ? 'bg-cyan-400/15 text-cyan-400 border border-cyan-400/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Admin Panel
              </Link>
            )}
          </nav>

          <div className="px-4 py-5 border-t border-white/10 space-y-2">
            {user ? (
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-400/30 text-red-400 font-semibold text-sm hover:bg-red-400/10 transition"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => { openAuthModal(); setOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-400 text-slate-900 font-black text-sm hover:bg-cyan-300 transition shadow-lg"
              >
                <User size={15} />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="h-16 sm:h-18" />
    </>
  );
};

export default Navbar;
