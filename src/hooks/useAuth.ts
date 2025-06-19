import { useState, useEffect, useMemo } from 'react';
import type { User } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = useMemo(() => async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setError(null); // Clear any previous errors
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to sign in with Google');
      console.error('Error signing in with Google:', err);
      setError(err);
    }
  }, []);

  const signOutUser = useMemo(() => async (): Promise<void> => {
    try {
      await signOut(auth);
      setError(null); // Clear any previous errors
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to sign out');
      console.error('Error signing out:', err);
      setError(err);
    }
  }, []);

  return useMemo(() => ({
    user,
    loading,
    error,
    signInWithGoogle,
    signOutUser
  }), [user, loading, error, signInWithGoogle, signOutUser]);
}
