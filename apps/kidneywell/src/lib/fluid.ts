/**
 * Fluid intake log.
 *
 * There is deliberately no default daily goal: people on dialysis or with
 * advanced kidney disease are often told to *restrict* fluids, while people
 * with kidney stones are told to drink more. The goal must come from the
 * user's care team, so the app only tracks against a goal the user sets.
 */

export interface FluidEntry {
  id: string;
  amountMl: number;
  /** ISO 8601 timestamp of when the drink was logged. */
  at: string;
}

export const FLUID_QUICK_ADD_ML = [150, 250, 330, 500] as const;
export const FLUID_MAX_ENTRY_ML = 2000;
export const FLUID_MIN_GOAL_ML = 250;
export const FLUID_MAX_GOAL_ML = 6000;

/** Local calendar day as YYYY-MM-DD. */
export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function entriesForDay(entries: readonly FluidEntry[], day: Date): FluidEntry[] {
  const key = dayKey(day);
  return entries
    .filter((entry) => dayKey(new Date(entry.at)) === key)
    .sort((a, b) => b.at.localeCompare(a.at));
}

export function totalForDay(entries: readonly FluidEntry[], day: Date): number {
  return entriesForDay(entries, day).reduce((sum, entry) => sum + entry.amountMl, 0);
}

/** Fraction of the goal reached, clamped to 0–1. Null when no goal is set. */
export function goalProgress(totalMl: number, goalMl: number | null): number | null {
  if (goalMl == null || goalMl <= 0) return null;
  return Math.min(Math.max(totalMl / goalMl, 0), 1);
}

export function isValidEntryAmount(amountMl: number): boolean {
  return Number.isFinite(amountMl) && amountMl > 0 && amountMl <= FLUID_MAX_ENTRY_ML;
}

export function isValidGoal(goalMl: number): boolean {
  return Number.isFinite(goalMl) && goalMl >= FLUID_MIN_GOAL_ML && goalMl <= FLUID_MAX_GOAL_ML;
}

/**
 * Keeps today plus the previous `days` whole calendar days, so local storage
 * stays small without cutting a day's log in half.
 */
export function pruneOlderThan(entries: readonly FluidEntry[], now: Date, days: number): FluidEntry[] {
  const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days);
  return entries.filter((entry) => new Date(entry.at) >= cutoff);
}
