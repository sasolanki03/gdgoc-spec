'use client';
import { Auth, User } from 'firebase/auth';

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

/**
 * A custom error class for Firestore permission errors.
 * It captures detailed context about the failed operation, which is invaluable
 * for debugging security rules during development.
 */
export class FirestorePermissionError extends Error {
  // Public properties for easy access in error overlays or logs
  public readonly path: string;
  public readonly operation: SecurityRuleContext['operation'];
  public readonly requestResourceData?: any;
  public readonly auth: (User | null);

  constructor(context: SecurityRuleContext, auth: Auth | null = null) {
    // Construct the detailed error message
    const message = `Firestore Permission Denied: The following request was denied by Firestore security rules.`;
    
    super(message);
    this.name = 'FirestorePermissionError';
    
    // Assign context properties to the error object
    this.path = context.path;
    this.operation = context.operation;
    this.requestResourceData = context.requestResourceData;
    this.auth = auth?.currentUser || null;

    // This helps in restoring the prototype chain
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }
}
