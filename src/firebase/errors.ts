
'use client';
import { Auth, User } from 'firebase/auth';

// This file is being simplified.
// The custom FirestorePermissionError was causing persistent issues with race conditions
// during error creation, leading to unhelpful empty error objects.
// We are now relying on the standard FirestoreError from the Firebase SDK,
// which is more stable.

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};
