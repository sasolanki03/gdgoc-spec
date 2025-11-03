
// This file implements a simple event emitter.
// We are not using a third-party library to keep the bundle size small.
type Listener<T> = (data: T) => void;

class EventEmitter<T> {
  private listeners: Map<string, Set<Listener<T>>> = new Map();

  on(event: string, listener: Listener<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  off(event: string, listener: Listener<T>) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(listener);
    }
  }

  emit(event: string, data: T) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach((listener) => listener(data));
    }
  }
}

// We will use this to emit Firestore permission errors globally.
export const errorEmitter = new EventEmitter<any>();
