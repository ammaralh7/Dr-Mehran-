/**
 * Estimated glomerular filtration rate (eGFR) from serum creatinine.
 *
 * Uses the race-free CKD-EPI 2021 creatinine equation (Inker et al.,
 * NEJM 2021), which is the equation recommended by the NKF-ASN Task Force
 * and reported by most US laboratories:
 *
 *   eGFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^-1.200 × 0.9938^age × 1.012 [if female]
 *
 *   κ = 0.7 (female) / 0.9 (male)
 *   α = -0.241 (female) / -0.302 (male)
 *   Scr in mg/dL, age in years, result in mL/min/1.73 m²
 *
 * The equation is validated for adults (18+) with stable kidney function.
 * It is not reliable during acute kidney injury, pregnancy, or at extremes
 * of muscle mass, and the app must say so wherever a result is shown.
 */

export type Sex = 'female' | 'male';
export type CreatinineUnit = 'mg/dL' | 'umol/L';

/** µmol/L of creatinine per mg/dL. */
export const CREATININE_UMOL_PER_MG = 88.4;

export const EGFR_MIN_AGE = 18;
export const EGFR_MAX_AGE = 110;
/** Plausible serum creatinine range in mg/dL; outside it we assume a typo. */
export const CREATININE_MIN_MG_DL = 0.1;
export const CREATININE_MAX_MG_DL = 25;

export interface EgfrInput {
  creatinine: number;
  unit: CreatinineUnit;
  age: number;
  sex: Sex;
}

export type GfrCategory = 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5';

export function toMgPerDl(value: number, unit: CreatinineUnit): number {
  return unit === 'mg/dL' ? value : value / CREATININE_UMOL_PER_MG;
}

/**
 * Returns a list of human-readable problems with the input, or an empty list
 * if it can be used to calculate eGFR.
 */
export function validateEgfrInput(input: EgfrInput): string[] {
  const errors: string[] = [];

  if (!Number.isFinite(input.age)) {
    errors.push('Enter your age in years.');
  } else if (input.age < EGFR_MIN_AGE) {
    errors.push(`This calculator is only valid for adults aged ${EGFR_MIN_AGE} and over.`);
  } else if (input.age > EGFR_MAX_AGE) {
    errors.push(`Enter an age of ${EGFR_MAX_AGE} or below.`);
  }

  if (!Number.isFinite(input.creatinine) || input.creatinine <= 0) {
    errors.push('Enter your creatinine result from your lab report.');
  } else {
    const mgDl = toMgPerDl(input.creatinine, input.unit);
    if (mgDl < CREATININE_MIN_MG_DL || mgDl > CREATININE_MAX_MG_DL) {
      const hint =
        input.unit === 'mg/dL'
          ? 'If your report shows a value like 88, switch the unit to µmol/L.'
          : 'If your report shows a value like 1.0, switch the unit to mg/dL.';
      errors.push(`That creatinine value looks out of range. ${hint}`);
    }
  }

  return errors;
}

/**
 * Calculates eGFR (mL/min/1.73 m²), unrounded. Throws if the input is
 * invalid; call `validateEgfrInput` first to show friendly messages.
 */
export function calculateEgfr(input: EgfrInput): number {
  const errors = validateEgfrInput(input);
  if (errors.length > 0) {
    throw new Error(errors.join(' '));
  }

  const scr = toMgPerDl(input.creatinine, input.unit);
  const female = input.sex === 'female';
  const kappa = female ? 0.7 : 0.9;
  const alpha = female ? -0.241 : -0.302;
  const ratio = scr / kappa;

  return (
    142 *
    Math.min(ratio, 1) ** alpha *
    Math.max(ratio, 1) ** -1.2 *
    0.9938 ** input.age *
    (female ? 1.012 : 1)
  );
}

/** KDIGO 2012/2024 GFR category for a rounded eGFR value. */
export function gfrCategory(egfr: number): GfrCategory {
  const value = Math.round(egfr);
  if (value >= 90) return 'G1';
  if (value >= 60) return 'G2';
  if (value >= 45) return 'G3a';
  if (value >= 30) return 'G3b';
  if (value >= 15) return 'G4';
  return 'G5';
}

export const GFR_CATEGORY_LABELS: Record<GfrCategory, string> = {
  G1: 'Normal or high',
  G2: 'Mildly decreased',
  G3a: 'Mildly to moderately decreased',
  G3b: 'Moderately to severely decreased',
  G4: 'Severely decreased',
  G5: 'Kidney failure range',
};

/** How strongly the UI should draw attention to a result. */
export function gfrCategorySeverity(category: GfrCategory): 'ok' | 'caution' | 'urgent' {
  switch (category) {
    case 'G1':
    case 'G2':
      return 'ok';
    case 'G3a':
    case 'G3b':
      return 'caution';
    case 'G4':
    case 'G5':
      return 'urgent';
  }
}
