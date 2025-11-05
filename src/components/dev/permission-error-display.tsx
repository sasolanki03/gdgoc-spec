'use client';

import { FirestorePermissionError } from '@/firebase/errors';

interface PermissionErrorDisplayProps {
  error: FirestorePermissionError;
}

export function PermissionErrorDisplay({ error }: PermissionErrorDisplayProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 p-4 sm:p-6 md:p-8">
      <div className="relative mx-auto mt-[10vh] max-w-3xl rounded-lg bg-background p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-destructive font-headline mb-2">Firestore Permission Error</h1>
        <p className="text-muted-foreground mb-4">
          A Firestore security rule prevented an operation. Use the details below to update your 
          <code className="bg-muted px-1 py-0.5 rounded-sm text-sm font-mono">firestore.rules</code> file.
        </p>
        
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <strong className="text-foreground col-span-1">Operation:</strong>
            <code className="col-span-2 bg-muted px-2 py-1 rounded-md font-mono">{error.operation}</code>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <strong className="text-foreground col-span-1">Path:</strong>
            <code className="col-span-2 bg-muted px-2 py-1 rounded-md font-mono">{error.path}</code>
          </div>
          
          {error.requestResourceData && (
            <div>
              <strong className="text-foreground">Request Data:</strong>
              <pre className="mt-1 w-full overflow-x-auto rounded-md bg-muted p-3 text-xs font-mono">
                {JSON.stringify(error.requestResourceData, null, 2)}
              </pre>
            </div>
          )}

          <div>
              <strong className="text-foreground">Authenticated User:</strong>
              <pre className="mt-1 w-full overflow-x-auto rounded-md bg-muted p-3 text-xs font-mono">
                {error.auth ? JSON.stringify(error.auth, null, 2) : 'null (Unauthenticated)'}
              </pre>
          </div>
        </div>
        
        <p className="mt-6 text-xs text-muted-foreground">
            This overlay is only shown in development. It is rendered by <code className="font-mono">PermissionErrorDisplay</code>.
        </p>
      </div>
    </div>
  );
}
