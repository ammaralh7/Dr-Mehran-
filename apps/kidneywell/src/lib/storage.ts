/**
 * On-device key-value storage (iOS/Android), backed by SQLite.
 *
 * Phase 1 keeps all health data on the device only — nothing is sent to a
 * server. Before any cloud sync or provider sharing ships, this must move to
 * an encrypted store (e.g. SQLCipher) and a HIPAA-eligible backend.
 */
import Storage from 'expo-sqlite/kv-store';

export interface SyncStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const storage: SyncStorage = {
  getItem: (key) => Storage.getItemSync(key),
  setItem: (key, value) => Storage.setItemSync(key, value),
  removeItem: (key) => {
    Storage.removeItemSync(key);
  },
};
