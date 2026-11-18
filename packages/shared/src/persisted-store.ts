import { useSyncExternalStore } from 'react';

import { storage } from './storage';

/**
 * A tiny global store persisted as JSON under one storage key. Every screen
 * that reads it re-renders when any screen writes to it.
 */
export interface PersistedStore<T> {
  get(): T;
  set(next: T | ((prev: T) => T)): void;
  subscribe(listener: () => void): () => void;
}

export function createPersistedStore<T>(key: string, fallback: T): PersistedStore<T> {
  let state: T | undefined;
  const listeners = new Set<() => void>();

  function read(): T {
    try {
      const raw = storage.getItem(key);
      return raw == null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  }

  return {
    get() {
      if (state === undefined) state = read();
      return state;
    },
    set(next) {
      const prev = this.get();
      state = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
      storage.setItem(key, JSON.stringify(state));
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useStore<T>(store: PersistedStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
