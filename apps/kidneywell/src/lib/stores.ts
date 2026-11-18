import { createPersistedStore, newId } from '@dr-mehran/shared';

import type { CreatinineUnit, Sex } from './egfr';
import { pruneOlderThan, type FluidEntry } from './fluid';
import { DEFAULT_VOLUME_UNIT, type VolumeUnit } from './units';

/** Fluid entries kept on the device. */
const FLUID_HISTORY_DAYS = 90;

export const fluidEntriesStore = createPersistedStore<FluidEntry[]>('fluid.entries.v1', []);
export const fluidGoalStore = createPersistedStore<number | null>('fluid.goalMl.v1', null);
export const volumeUnitStore = createPersistedStore<VolumeUnit>(
  'settings.volumeUnit.v1',
  DEFAULT_VOLUME_UNIT,
);

export function addFluid(amountMl: number, at = new Date()) {
  fluidEntriesStore.set((entries) =>
    pruneOlderThan([...entries, { id: newId(), amountMl, at: at.toISOString() }], at, FLUID_HISTORY_DAYS),
  );
}

export function removeFluid(id: string) {
  fluidEntriesStore.set((entries) => entries.filter((entry) => entry.id !== id));
}

export interface EgfrResult {
  id: string;
  /** Unrounded eGFR in mL/min/1.73 m². */
  egfr: number;
  creatinine: number;
  unit: CreatinineUnit;
  age: number;
  sex: Sex;
  /** ISO 8601 timestamp of when the result was saved. */
  at: string;
}

export const egfrResultsStore = createPersistedStore<EgfrResult[]>('egfr.results.v1', []);

export function saveEgfrResult(result: Omit<EgfrResult, 'id' | 'at'>, at = new Date()) {
  egfrResultsStore.set((results) => [{ ...result, id: newId(), at: at.toISOString() }, ...results]);
}

export function removeEgfrResult(id: string) {
  egfrResultsStore.set((results) => results.filter((result) => result.id !== id));
}
