'use client';

import { useMemo } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '../firestore/use-doc';

/**
 * Hook to determine if the current user is an administrator.
 * 
 * It checks for the existence of a document in the `/roles_admin` collection
 * that matches the current user's UID.
 * 
 * @returns An object containing:
 *  - `isAdmin`: A boolean that is true if the user is an admin.
 *  - `loading`: A boolean that is true while the user's auth state or admin status is being determined.
 */
export function useAdmin() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const adminRoleRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'roles_admin', user.uid);
  }, [firestore, user]);

  const { data: adminDoc, isLoading: isAdminDocLoading } = useDoc(adminRoleRef);
  
  const isAdmin = useMemo(() => !!adminDoc, [adminDoc]);

  return {
    isAdmin,
    loading: isUserLoading || (!!user && isAdminDocLoading),
  };
}
