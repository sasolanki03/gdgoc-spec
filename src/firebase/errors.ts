
export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

/**
 * A custom error class for Firestore permission errors that includes
 * rich context about the failed request.
 */
export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;
  private authUser: any; // In a real app, you would get the current user

  constructor(context: SecurityRuleContext) {
    const defaultMessage = `Firestore Permission Denied on ${context.operation} at path ${context.path}`;
    super(defaultMessage);

    this.name = 'FirestorePermissionError';
    this.context = context;

    // In a real application, you would capture the authenticated user state here.
    // For this example, we'll use a placeholder.
    this.authUser =
      typeof window !== 'undefined'
        ? (window as any).__FIREBASE_AUTH_USER__
        : null;

    // This is for V8 environments (like Chrome) to capture the stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FirestorePermissionError);
    }
  }

  /**
   * Returns a JSON object with all the context needed to debug
   * the security rule failure.
   */
  toContextObject() {
    return {
      message: this.message,
      auth: this.authUser, // The user object at the time of the error
      request: {
        path: this.context.path,
        method: this.context.operation,
        resource: {
          data: this.context.requestResourceData,
        },
      },
    };
  }
}
