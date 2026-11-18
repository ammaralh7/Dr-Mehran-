/**
 * Patient-facing medical wording.
 *
 * DRAFT — every string in this file must be reviewed and approved by
 * Dr. Mehran (or another licensed clinician) before release. Keeping it in
 * one place makes that review a single-file job.
 */
import type { GfrCategory } from '@/lib/egfr';

export const DISCLAIMER =
  'KidneyWell is for information and self-tracking. It does not diagnose conditions or replace advice from your doctor. In an emergency, call your local emergency number.';

export const EGFR_GUIDANCE: Record<GfrCategory, string> = {
  G1: 'This is in the normal range. eGFR alone does not rule out kidney disease. Your doctor may also check your urine for protein (albumin).',
  G2: 'This is mildly below the typical range, which is common with age. Your doctor may also check your urine for protein (albumin) to get the full picture.',
  G3a: 'This is moderately decreased. Talk to your doctor about this result, especially if it is new or lower than before.',
  G3b: 'This is moderately to severely decreased. Talk to your doctor about this result soon, especially if it is new or lower than before.',
  G4: 'This is severely decreased. If your doctor has not already discussed this result with you, contact them promptly.',
  G5: 'This is in the kidney failure range. If your doctor has not already discussed this result with you, contact them promptly.',
};

export const EGFR_LIMITATIONS =
  'Estimated with the CKD-EPI 2021 creatinine equation for adults. It is less accurate during a sudden illness, in pregnancy, and for people with very high or very low muscle mass. A single result does not diagnose chronic kidney disease; that needs results over at least 3 months.';

export const FLUID_GOAL_NOTE =
  'Use the goal your care team gives you. Some people with kidney disease, especially on dialysis, need to limit fluids, while others need to drink more.';

export interface LearnTopic {
  title: string;
  summary: string;
}

/** Planned education topics. Full articles will be written with Dr. Mehran. */
export const LEARN_TOPICS: LearnTopic[] = [
  {
    title: 'What your kidneys do',
    summary: 'How kidneys filter blood, balance fluids and minerals, and help control blood pressure.',
  },
  {
    title: 'Understanding eGFR and urine albumin',
    summary: 'The two tests used to check kidney health, and what the stages mean.',
  },
  {
    title: 'Blood pressure, diabetes and your kidneys',
    summary: 'The two most common causes of kidney disease and how managing them protects your kidneys.',
  },
  {
    title: 'Eating for kidney health',
    summary:
      'Sodium, potassium, phosphorus and protein: what to watch, and why it differs from person to person.',
  },
  {
    title: 'Medicines and your kidneys',
    summary: 'Common medicines, including some pain relievers, that can affect kidney function.',
  },
  {
    title: 'When to call your doctor',
    summary:
      'Symptoms such as swelling, changes in urination, or shortness of breath that need medical advice.',
  },
];
