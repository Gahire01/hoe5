import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};
