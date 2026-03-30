import { useState, useEffect, useCallback } from 'react';
import { User as SBUser, Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { User, UserRole } from '../types';

// ─── helpers ──────────────────────────────────────────────────────────────────
function sbUserToLocal(u: SBUser): User {
  const m = u.user_metadata ?? {};
  return {
    id:     u.id,
    name:   m.name ?? m.full_name ?? u.email?.split('@')[0] ?? 'User',
    email:  u.email ?? '',
    role:   (m.role as UserRole) ?? 'user',
    avatar: m.avatar_url ?? m.avatar ?? '',
    phone:  m.phone ?? '',
  };
}

async function loadProfile(u: SBUser): Promise<User> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id,name,email,role,avatar,phone')
      .eq('id', u.id)
      .maybeSingle();         // maybeSingle never throws on 0 rows

    if (error) throw error;

    if (data) {
      return {
        id:     data.id,
        name:   data.name   ?? sbUserToLocal(u).name,
        email:  data.email  ?? u.email ?? '',
        role:   (data.role  as UserRole) ?? 'user',
        avatar: data.avatar ?? '',
        phone:  data.phone  ?? '',
      };
    }
  } catch {
    // DB unreachable or row missing — fall through to JWT fallback
  }
  return sbUserToLocal(u);
}

// Fire-and-forget profile upsert so the row always stays in sync
function syncProfile(u: SBUser, profile: User) {
  supabase.from('users').upsert(
    {
      id:         u.id,
      name:       profile.name,
      email:      profile.email,
      role:       profile.role,
      avatar:     profile.avatar ?? '',
      phone:      profile.phone  ?? '',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  ).then(({ error }) => {
    if (error) console.warn('Profile sync failed (non-critical):', error.message);
  });
}

// ─── hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const [user,    setUser   ] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback(async (session: Session | null) => {
    if (!session?.user) {
      setUser(null);
      setLoading(false);
      return;
    }
    const profile = await loadProfile(session.user);
    setUser(profile);
    setLoading(false);
    syncProfile(session.user, profile);
  }, []);

  useEffect(() => {
    // 1. Restore session from storage immediately (synchronous read, no lock)
    supabase.auth.getSession().then(({ data: { session } }) => {
      applySession(session);
    }).catch(() => setLoading(false));

    // 2. React to future sign-in / sign-out / token-refresh events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => { applySession(session); }
    );

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);   // run once — applySession is stable (useCallback with no deps)

  // ── actions ────────────────────────────────────────────────────────────────
  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name, role: 'user' } },
    });
    if (error) throw error;
    return data;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options:  { redirectTo: window.location.origin },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) throw new Error('Not signed in');
    const next = { ...user, ...updates };
    setUser(next);
    await supabase.from('users').update({
      name:   next.name,
      phone:  next.phone,
      avatar: next.avatar,
    }).eq('id', user.id);
    await supabase.auth.updateUser({
      data: { name: next.name, avatar: next.avatar },
    });
  }, [user]);

  return { user, loading, signIn, signUp, signInWithGoogle, signOut, updateProfile };
}
