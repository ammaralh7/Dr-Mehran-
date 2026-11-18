/**
 * Blood pressure categories from the 2025 AHA/ACC high blood pressure
 * guideline (unchanged from 2017), for adults:
 *
 *   Normal     systolic < 120   and  diastolic < 80
 *   Elevated   systolic 120–129 and  diastolic < 80
 *   Stage 1    systolic 130–139 or   diastolic 80–89
 *   Stage 2    systolic ≥ 140   or   diastolic ≥ 90
 *   Severe     systolic > 180   and/or diastolic > 120
 *
 * When the two numbers fall in different categories, the higher one wins.
 * A diagnosis uses the average of several readings on different days, so
 * the app labels single readings as "this reading", never as a diagnosis.
 */

export type BpCategory = 'normal' | 'elevated' | 'stage1' | 'stage2' | 'severe';

export interface BpValues {
  systolic: number;
  diastolic: number;
}

export interface BpReading extends BpValues {
  id: string;
  /** Beats per minute, if the monitor showed it. */
  pulse: number | null;
  /** ISO 8601 timestamp of when the reading was taken. */
  at: string;
}

export const BP_LIMITS = {
  systolic: { min: 60, max: 300 },
  diastolic: { min: 30, max: 200 },
  pulse: { min: 25, max: 250 },
} as const;

const ORDER: BpCategory[] = ['normal', 'elevated', 'stage1', 'stage2', 'severe'];

function systolicCategory(systolic: number): BpCategory {
  if (systolic > 180) return 'severe';
  if (systolic >= 140) return 'stage2';
  if (systolic >= 130) return 'stage1';
  if (systolic >= 120) return 'elevated';
  return 'normal';
}

function diastolicCategory(diastolic: number): BpCategory {
  if (diastolic > 120) return 'severe';
  if (diastolic >= 90) return 'stage2';
  if (diastolic >= 80) return 'stage1';
  return 'normal';
}

/** Category for a reading or an average. Values are rounded first, as monitors show whole numbers. */
export function classifyBp({ systolic, diastolic }: BpValues): BpCategory {
  const s = systolicCategory(Math.round(systolic));
  const d = diastolicCategory(Math.round(diastolic));
  return ORDER.indexOf(s) >= ORDER.indexOf(d) ? s : d;
}

export const BP_CATEGORY_LABELS: Record<BpCategory, string> = {
  normal: 'Normal',
  elevated: 'Elevated',
  stage1: 'Stage 1 high blood pressure',
  stage2: 'Stage 2 high blood pressure',
  severe: 'Severe high blood pressure',
};

/** How strongly the UI should draw attention to a category. */
export function bpSeverity(category: BpCategory): 'ok' | 'caution' | 'urgent' {
  switch (category) {
    case 'normal':
    case 'elevated':
      return 'ok';
    case 'stage1':
    case 'stage2':
      return 'caution';
    case 'severe':
      return 'urgent';
  }
}

export interface BpInput {
  systolic: number;
  diastolic: number;
  /** NaN when left empty. */
  pulse: number;
}

/** Human-readable problems with a typed reading; empty when it can be saved. */
export function validateBpInput({ systolic, diastolic, pulse }: BpInput): string[] {
  const errors: string[] = [];
  const { systolic: sLimit, diastolic: dLimit, pulse: pLimit } = BP_LIMITS;

  const systolicOk = Number.isFinite(systolic) && systolic >= sLimit.min && systolic <= sLimit.max;
  const diastolicOk = Number.isFinite(diastolic) && diastolic >= dLimit.min && diastolic <= dLimit.max;

  if (!systolicOk) {
    errors.push(`Enter the top number (systolic) between ${sLimit.min} and ${sLimit.max}.`);
  }
  if (!diastolicOk) {
    errors.push(`Enter the bottom number (diastolic) between ${dLimit.min} and ${dLimit.max}.`);
  }
  if (systolicOk && diastolicOk && systolic <= diastolic) {
    errors.push(
      'The top number (systolic) should be higher than the bottom number. Check they are not swapped.',
    );
  }
  if (!Number.isNaN(pulse) && !(Number.isFinite(pulse) && pulse >= pLimit.min && pulse <= pLimit.max)) {
    errors.push(`Enter a pulse between ${pLimit.min} and ${pLimit.max}, or leave it empty.`);
  }
  return errors;
}

export interface BpAverage extends BpValues {
  count: number;
}

/** Mean of the readings taken on or after `since`, rounded to whole mmHg. */
export function averageSince(readings: readonly BpReading[], since: Date): BpAverage | null {
  const recent = readings.filter((reading) => new Date(reading.at) >= since);
  if (recent.length === 0) return null;
  const sum = recent.reduce(
    (acc, reading) => ({
      systolic: acc.systolic + reading.systolic,
      diastolic: acc.diastolic + reading.diastolic,
    }),
    { systolic: 0, diastolic: 0 },
  );
  return {
    systolic: Math.round(sum.systolic / recent.length),
    diastolic: Math.round(sum.diastolic / recent.length),
    count: recent.length,
  };
}

/** Start of the local day `days` days before `now` (so "7 days" means today plus the 6 days before). */
export function daysAgo(now: Date, days: number): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1));
}

export function formatBp({ systolic, diastolic }: BpValues): string {
  return `${Math.round(systolic)}/${Math.round(diastolic)}`;
}
