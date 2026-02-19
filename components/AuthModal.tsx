
import React, { useState } from 'react';
import { UserRole } from '../types';
import { CONTACT_INFO } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string, role: UserRole, email: string) => void;
}

const AuthModal: React.FC<Props> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === CONTACT_INFO.adminEmail && password === CONTACT_INFO.adminPassword) {
      onLogin("Admin Specialist", 'admin', email);
    } else if (email && password) {
      onLogin(email.split('@')[0], 'user', email);
    } else {
      setError('Please provide valid credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="bg-slate-900 p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500 blur-[80px]" />
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500 blur-[80px]" />
          </div>
          <div className="w-20 h-20 bg-white/10 rounded-[2.5rem] mx-auto flex items-center justify-center mb-6 relative z-10 shadow-inner">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
          </div>
          <h2 className="text-3xl font-black tracking-tighter relative z-10 leading-none">{isLogin ? 'AUTHENTICATE' : 'INITIALIZE PROFILE'}</h2>
          <p className="text-slate-500 text-[10px] mt-4 font-black uppercase tracking-[0.3em] relative z-10">Secured Access Layer</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-6">
            {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">{error}</p>}

            <div className="space-y-4">
               <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Identifier"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-bold placeholder:text-slate-400"
                  />
               </div>
               <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Access Token"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-bold placeholder:text-slate-400"
                  />
               </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-black text-xs tracking-[0.2em] transition-all shadow-xl active:scale-95 uppercase flex items-center justify-center gap-3"
          >
            {isLogin ? 'Enter Workspace' : 'Initialize Account'}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>

          <div className="space-y-6">
            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Social Link Protocols</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Google */}
              <button type="button" className="h-14 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-white border border-slate-100 transition-all hover:shadow-md hover:-translate-y-1 group">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              {/* Facebook */}
              <button type="button" className="h-14 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-white border border-slate-100 transition-all hover:shadow-md hover:-translate-y-1 group">
                <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              {/* Instagram */}
              <button type="button" className="h-14 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-white border border-slate-100 transition-all hover:shadow-md hover:-translate-y-1 group">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <radialGradient id="rg" r="150%" cx="37%" cy="100%">
                    <stop stopColor="#fed373" offset="0%"/>
                    <stop stopColor="#f15245" offset="25%"/>
                    <stop stopColor="#d92e7f" offset="50%"/>
                    <stop stopColor="#9b36b7" offset="75%"/>
                    <stop stopColor="#515ecf" offset="100%"/>
                  </radialGradient>
                  <path fill="url(#rg)" d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.012 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.012 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.335.935 20.666.522 19.874.217 19.11.025 18.24.015 17.053.015c-1.28-.057-1.687-.072-4.947-.072zm0 2.16c3.203 0 3.58.016 4.85.074 1.17.054 1.8.249 2.223.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.05.413 2.22.057 1.27.073 1.646.073 4.853s-.017 3.582-.074 4.852c-.054 1.17-.248 1.798-.415 2.22-.217.56-.477.96-.896 1.382-.42.419-.819.679-1.381.896-.422.164-1.05.36-2.22.413-1.27.057-1.647.072-4.853.072s-3.582-.015-4.852-.072c-1.17-.054-1.798-.248-2.22-.415-.56-.217-.96-.477-1.382-.896-.419-.42-.679-.819-.896-1.381-.164-.422-.36-1.05-.413-2.22-.057-1.27-.072-1.647-.072-4.853s.015-3.582.072-4.852c.054-1.17.248-1.798.415-2.22.217-.56.477-.96.896-1.382.42-.419.819-.679 1.381-.896.422-.164 1.05-.36 2.22-.413 1.27-.057 1.647-.072 4.853-.072zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-cyan-600 transition-colors"
            >
              {isLogin ? "JOIN THE NEXUS NETWORK" : "RETURN TO ACCESS POINT"}
            </button>
          </div>
        </form>
      </div>
    </div>
    // Inside the modal container, after the header or in the header
<div className="relative w-full max-w-md bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
  <button
    onClick={onClose}
    className="absolute top-6 right-6 z-20 w-10 h-10 bg-slate-200/50 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 hover:bg-cyan-500 hover:text-white transition-colors"
  >
    <X size={20} />
  </button>
  {/* rest of modal */}
</div>
  );
};

export default AuthModal;
