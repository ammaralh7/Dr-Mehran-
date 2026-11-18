import type { BpReading } from './bp';

/** Stage 1 thresholds drawn as reference lines on the chart. */
export const STAGE1_SYSTOLIC = 130;
export const STAGE1_DIASTOLIC = 80;

export interface YScale {
  min: number;
  max: number;
  ticks: number[];
}

/**
 * Y range in mmHg: always includes 60–160 so the 130/80 reference lines
 * are visible, widens in 20 mmHg steps to fit every reading with headroom.
 */
export function yScale(readings: readonly BpReading[]): YScale {
  let min = 60;
  let max = 160;
  for (const reading of readings) {
    min = Math.min(min, Math.floor((reading.diastolic - 10) / 20) * 20);
    max = Math.max(max, Math.ceil((reading.systolic + 10) / 20) * 20);
  }
  min = Math.max(min, 20);
  const step = (max - min) / 20 > 6 ? 40 : 20;
  const ticks: number[] = [];
  for (let tick = Math.ceil(min / step) * step; tick <= max; tick += step) {
    ticks.push(tick);
  }
  return { min, max, ticks };
}

/** Readings inside [from, to], oldest first, ready to plot left to right. */
export function readingsInRange(readings: readonly BpReading[], from: Date, to: Date): BpReading[] {
  return readings
    .filter((reading) => {
      const at = new Date(reading.at);
      return at >= from && at <= to;
    })
    .sort((a, b) => a.at.localeCompare(b.at));
}

/** Index of the point whose x position is closest to `x`. */
export function nearestIndex(xs: readonly number[], x: number): number {
  let best = 0;
  for (let i = 1; i < xs.length; i++) {
    if (Math.abs(xs[i] - x) < Math.abs(xs[best] - x)) best = i;
  }
  return best;
}
