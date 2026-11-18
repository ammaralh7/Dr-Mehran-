import { createPersistedStore, newId } from '@dr-mehran/shared';

import type { BpReading } from './bp';

/** All blood pressure readings on the device, newest first. */
export const bpReadingsStore = createPersistedStore<BpReading[]>('bp.readings.v1', []);

export function addReading(reading: Omit<BpReading, 'id' | 'at'>, at = new Date()): BpReading {
  const saved: BpReading = { ...reading, id: newId(), at: at.toISOString() };
  bpReadingsStore.set((readings) => [saved, ...readings].sort((a, b) => b.at.localeCompare(a.at)));
  return saved;
}

export function removeReading(id: string) {
  bpReadingsStore.set((readings) => readings.filter((reading) => reading.id !== id));
}
