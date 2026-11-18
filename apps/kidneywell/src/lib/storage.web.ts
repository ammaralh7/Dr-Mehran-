/**
 * Web fallback used only for previewing the app in a browser during
 * development. SQLite on the web needs cross-origin isolation headers, so
 * the preview uses localStorage instead.
 */
import type { SyncStorage } from './storage';

function local(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

export const storage: SyncStorage = {
  getItem: (key) => local()?.getItem(key) ?? null,
  setItem: (key, value) => {
    try {
      local()?.setItem(key, value);
    } catch {
      // Storage full or blocked (private mode): keep working in memory.
    }
  },
  removeItem: (key) => local()?.removeItem(key),
};
