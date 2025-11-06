'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useAuth } from '../provider';

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setLoading] = useState(true);
  const [userError, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    };

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setError(null);
        setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth]);

  return { user, isUserLoading, userError };
}
