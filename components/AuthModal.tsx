import React, { useState } from 'react';
import { X, Eye, EyeOff, Phone, Mail, WifiOff, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  if (!isOpen) return null;

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+250${phone.replace(/\D/g, '')}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });
      if (error) throw error;
      setConfirmationResult({});
      setError('Code sent! Check your SMS.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+250${phone.replace(/\D/g, '')}`;
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: verificationCode,
        type: 'sms',
      });
      if (error) throw error;
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: name || email.split('@')[0] },
          },
        });
        if (error) throw error;
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500 max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 bg-slate-200/50 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 hover:bg-cyan-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="bg-slate-900 p-8 text-white text-center relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500 blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500 blur-[80px]" />
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-[2rem] mx-auto flex items-center justify-center mb-4 relative z-10 shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-cyan-400"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-tighter relative z-10 leading-none">
            {authMode === 'email'
              ? isLogin
                ? 'AUTHENTICATE'
                : 'INITIALIZE PROFILE'
              : 'PHONE VERIFICATION'}
          </h2>
          <p className="text-slate-500 text-[10px] mt-2 font-black uppercase tracking-[0.3em] relative z-10">
            Secured Access Layer
          </p>
        </div>

        <div className="flex border-b border-slate-100 flex-shrink-0">
          <button
            onClick={() => setAuthMode('email')}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors ${
              authMode === 'email' ? 'text-cyan-600 border-b-2 border-cyan-500' : 'text-slate-400'
            }`}
          >
            <Mail size={16} className="inline mr-2" /> Email
          </button>
          <button
            onClick={() => setAuthMode('phone')}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors ${
              authMode === 'phone' ? 'text-cyan-600 border-b-2 border-cyan-500' : 'text-slate-400'
            }`}
          >
            <Phone size={16} className="inline mr-2" /> Phone
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div
              className={`mb-4 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                error.includes('offline')
                  ? 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}
            >
              {error.includes('offline') && <WifiOff size={14} />}
              {error}
            </div>
          )}

          {authMode === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
              )}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xs tracking-widest hover:bg-slate-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    PROCESSING...
                  </>
                ) : isLogin ? (
                  'SIGN IN'
                ) : (
                  'SIGN UP'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              {!confirmationResult ? (
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  {!isLogin && (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                    />
                  )}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">+250</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="788 123 456"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-14 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cyan-500 text-white py-4 rounded-xl font-black text-xs tracking-widest hover:bg-cyan-600 transition disabled:opacity-50"
                  >
                    {loading ? 'SENDING CODE...' : 'SEND VERIFICATION CODE'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black text-xs tracking-widest hover:bg-emerald-600 transition disabled:opacity-50"
                  >
                    {loading ? 'VERIFYING...' : 'VERIFY & SIGN IN'}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-6">
            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">OR</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-black text-xs tracking-widest hover:bg-slate-50 transition disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button
                onClick={handleFacebookSignIn}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-[#1877f2] text-white py-3 rounded-xl font-black text-xs tracking-widest hover:bg-[#166fe5] transition disabled:opacity-50"
              >
                <FaFacebook size={18} />
                Facebook
              </button>
            </div>

            <div className="mt-6 flex justify-center gap-6 text-slate-400">
              <a
                href="https://instagram.com/homeofelectronics"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-600 transition text-2xl"
              >
                <FaInstagram />
              </a>
              <a
                href="https://tiktok.com/@homeofelectronics"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition text-2xl"
              >
                <FaTiktok />
              </a>
            </div>
          </div>

          {authMode === 'email' && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-cyan-600 transition-colors"
              >
                {isLogin ? 'CREATE NEW ACCOUNT' : 'BACK TO LOGIN'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
