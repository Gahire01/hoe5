import React, { useState } from 'react';
import { X } from 'lucide-react';
import { auth, googleProvider, db } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
}

const AuthModal: React.FC<Props> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        console.log('Attempting login with:', email);
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        console.log('Login successful:', userCred.user);

        const user = userCred.user;

        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        let role = 'user';

        if (userDoc.exists()) {
          role = userDoc.data().role;
          console.log('User role from Firestore:', role);
        } else {
          // Create user document if it doesn't exist
          await setDoc(doc(db, 'users', user.uid), {
            name: user.displayName || email.split('@')[0],
            email: user.email,
            role: 'user',
            createdAt: new Date()
          });
          console.log('Created new user document');
        }

        onLogin({
          uid: user.uid,
          name: user.displayName || email.split('@')[0],
          email: user.email,
          role
        });
        onClose();
      } else {
        // SIGN UP
        console.log('Attempting signup with:', email);
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Signup successful:', userCred.user);

        const user = userCred.user;

        // Update profile with name
        await updateProfile(user, { displayName: name || email.split('@')[0] });

        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          name: name || email.split('@')[0],
          email: user.email,
          role: 'user', // Default role
          createdAt: new Date()
        });
        console.log('Created user document in Firestore');

        // Send email verification (optional)
        // await sendEmailVerification(user);

        onLogin({
          uid: user.uid,
          name: name || email.split('@')[0],
          email: user.email,
          role: 'user'
        });
        onClose();
      }
    } catch (err: any) {
      console.error('Auth error:', err);

      // Handle specific error codes
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No user found with this email. Please sign up first.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/email-already-in-use':
          setError('Email already in use. Please log in instead.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection.');
          break;
        default:
          setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      console.log('Attempting Google sign-in');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign-in successful:', result.user);

      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        // Create user document
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          role: 'user',
          createdAt: new Date()
        });
        console.log('Created user document for Google user');
      } else {
        console.log('User already exists in Firestore');
      }

      // Get role (from existing doc or default)
      const role = userDoc.exists() ? userDoc.data().role : 'user';

      onLogin({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        role
      });
      onClose();
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 bg-slate-200/50 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 hover:bg-cyan-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="bg-slate-900 p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500 blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500 blur-[80px]" />
          </div>
          <div className="w-20 h-20 bg-white/10 rounded-[2.5rem] mx-auto flex items-center justify-center mb-6 relative z-10 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
            </svg>
          </div>
          <h2 className="text-3xl font-black tracking-tighter relative z-10 leading-none">
            {isLogin ? 'AUTHENTICATE' : 'INITIALIZE PROFILE'}
          </h2>
          <p className="text-slate-500 text-[10px] mt-4 font-black uppercase tracking-[0.3em] relative z-10">
            Secured Access Layer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-bold">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {!isLogin && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-bold placeholder:text-slate-400"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
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
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-black text-xs tracking-[0.2em] transition-all shadow-xl active:scale-95 uppercase flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                PROCESSING...
              </>
            ) : (
              <>
                {isLogin ? 'Enter Workspace' : 'Initialize Account'}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </>
            )}
          </button>

          <div className="space-y-6">
            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Social Link Protocols</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="h-14 bg-slate-50 rounded-2xl flex items-center justify-center gap-3 hover:bg-white border border-slate-100 transition-all hover:shadow-md hover:-translate-y-1 group disabled:opacity-50"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {loading ? 'Processing...' : 'Sign in with Google'}
                </span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-cyan-600 transition-colors"
            >
              {isLogin ? "JOIN THE NEXUS NETWORK" : "RETURN TO ACCESS POINT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
