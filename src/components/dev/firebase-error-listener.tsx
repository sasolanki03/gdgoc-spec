
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';

// This component centralizes the handling of Firestore permission errors
// by listening for a custom event and displaying a user-friendly toast.
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      console.error('Firestore Permission Error:', error.toContextObject());

      // In a real app, you might log this to a service like Sentry or Bugsnag
      // Sentry.captureException(error);

      // Display a toast to the user
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description:
          'You do not have permission to perform this action. Please contact an administrator if you believe this is an error.',
      });

      // You could also throw the error to be caught by Next.js's error boundary
      // in development for a better debugging experience.
      if (process.env.NODE_ENV === 'development') {
        // This will show the error overlay in Next.js
        throw error;
      }
    };

    errorEmitter.on('permission-error', handleError);

    // Clean up the listener when the component unmounts
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null; // This component does not render anything
}
