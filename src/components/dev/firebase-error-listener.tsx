
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';
import { FirestoreError } from 'firebase/firestore';

// This component centralizes the handling of Firestore permission errors
// by listening for a custom event and displaying a user-friendly toast.
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError | FirestoreError) => {
      // Check if it's our custom, detailed error
      if (error instanceof FirestorePermissionError) {
        // Log the detailed request object to the console for debugging.
        console.error('Firestore Permission Error:', error.request);
      } else {
        // Log the generic Firebase error
        console.error('Firestore Error:', error.message);
      }

      // Display a user-friendly toast notification.
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description:
          'You do not have permission to perform this action. Please contact an administrator if you believe this is an error.',
      });
    };

    errorEmitter.on('permission-error', handleError);

    // Clean up the listener when the component unmounts
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null; // This component does not render anything
}
