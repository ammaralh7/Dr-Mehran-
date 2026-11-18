/**
 * Volume display units. Amounts are always stored in mL; these helpers only
 * convert for input and display. US users default to fluid ounces because
 * that is how most US care teams give fluid limits (e.g. "32 oz a day").
 */

export type VolumeUnit = 'oz' | 'ml';

export const DEFAULT_VOLUME_UNIT: VolumeUnit = 'oz';

/** Millilitres in one US fluid ounce. */
export const ML_PER_US_FL_OZ = 29.5735;

export const VOLUME_UNIT_LABEL: Record<VolumeUnit, string> = {
  oz: 'oz',
  ml: 'mL',
};

/** Quick-add sizes in each unit: half cup, cup, can, bottle. */
export const QUICK_ADD: Record<VolumeUnit, readonly number[]> = {
  oz: [4, 8, 12, 16],
  ml: [150, 250, 330, 500],
};

export function toMl(value: number, unit: VolumeUnit): number {
  return unit === 'ml' ? value : value * ML_PER_US_FL_OZ;
}

export function fromMl(ml: number, unit: VolumeUnit): number {
  return unit === 'ml' ? ml : ml / ML_PER_US_FL_OZ;
}

/** Whole-number amount in the user's unit, e.g. "64 oz" or "1,500 mL". */
export function formatVolume(ml: number, unit: VolumeUnit): string {
  return `${Math.round(fromMl(ml, unit)).toLocaleString('en-US')} ${VOLUME_UNIT_LABEL[unit]}`;
}

/**
 * The whole-number range, in the user's unit, that falls inside a range
 * defined in mL, so error messages never suggest a value that fails.
 */
export function rangeInUnit(minMl: number, maxMl: number, unit: VolumeUnit): { min: number; max: number } {
  return { min: Math.ceil(fromMl(minMl, unit)), max: Math.floor(fromMl(maxMl, unit)) };
}
