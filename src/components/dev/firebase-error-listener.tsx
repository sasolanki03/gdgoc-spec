
'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { PermissionErrorDisplay } from '@/components/dev/permission-error-display';

/**
 * An invisible component that listens for globally emitted 'permission-error' events.
 * It catches the error and renders a developer-friendly display instead of crashing the app.
 */
export function FirebaseErrorListener() {
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // Set error in state to trigger a re-render and display the error component.
      setError(error);
    };

    errorEmitter.on('permission-error', handleError);

    // Unsubscribe on unmount to prevent memory leaks.
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  // If an error exists, render the display component with the error details.
  if (error) {
    return <PermissionErrorDisplay error={error} />;
  }

  // This component renders nothing if there is no error.
  return null;
}
