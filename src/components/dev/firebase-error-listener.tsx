
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestoreError } from 'firebase/firestore';

// This component centralizes the handling of Firestore permission errors
// by listening for a custom event and displaying a user-friendly toast.
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestoreError) => {
      // Log the generic Firebase error. It contains the useful message.
      console.error('Firestore Permission Error:', error.message);

      // Display a user-friendly toast notification.
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description:
          'You do not have permission to perform this action. Check the console for more details.',
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
