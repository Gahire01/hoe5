import React, { useState } from 'react';
import { X, Eye, EyeOff, Phone, Mail, WifiOff, Loader2, Clock3 } from 'lucide-react';
import { supabase } from '../supabase';

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
            data: { 
              name: name || email.split('@')[0],
              role: email === 'homeofelectronics20@gmail.com' ? 'admin' : 'user'
            },
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

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <Clock3 size={14} />
              Social Sign-In Coming Soon
            </p>
            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
              Google, Facebook, Instagram, and TikTok login will be added soon.  
              For now, use email or phone sign-in.
            </p>
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
