
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
      // Log the detailed request object to the console for debugging.
      // This will now reliably contain auth information.
      console.error('Firestore Permission Error:', error.request);

      // In a real app, you might log this to a service like Sentry or Bugsnag
      // Sentry.captureException(error);

      // Display a user-friendly toast notification.
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description:
          'You do not have permission to perform this action. Please contact an administrator if you believe this is an error.',
      });

      // We no longer throw the error here to prevent the Next.js error overlay
      // from showing a potentially unhelpful stack trace for a handled error.
      // The console error and toast are sufficient for debugging and user feedback.
    };

    errorEmitter.on('permission-error', handleError);

    // Clean up the listener when the component unmounts
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null; // This component does not render anything
}
