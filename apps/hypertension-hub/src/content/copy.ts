/**
 * Patient-facing medical wording.
 *
 * DRAFT: every string in this file must be reviewed and approved by
 * Dr. Mehran (or another licensed clinician) before release. Keeping it in
 * one place makes that review a single-file job.
 */
import type { BpCategory } from '@/lib/bp';

export const DISCLAIMER =
  'Hypertension Hub is for information and self-tracking. It does not diagnose conditions or replace advice from your doctor. In an emergency, call 911.';

export const BP_GUIDANCE: Record<BpCategory, string> = {
  normal: 'This reading is in the normal range.',
  elevated:
    'This reading is elevated. Healthy habits, such as less sodium, regular activity and the DASH eating plan, can help keep it from rising.',
  stage1:
    'This reading is in the stage 1 range. One reading is not a diagnosis. Keep measuring on different days and share your readings with your doctor.',
  stage2: 'This reading is in the stage 2 range. If your readings stay this high, talk to your doctor soon.',
  severe: 'This reading is very high. Follow the steps below.',
};

/** Based on American Heart Association advice for readings above 180/120. */
export const SEVERE_READING = {
  title: 'Your reading is very high',
  steps: [
    'Sit quietly for 5 minutes, then measure again.',
    'If it is still above 180/120, contact your doctor right away.',
  ],
  emergency:
    'Call 911 now if you also have chest pain, shortness of breath, back pain, numbness or weakness, a change in vision, or difficulty speaking.',
};

export const MEASURE_TIPS = [
  'Avoid caffeine, exercise and smoking for 30 minutes before.',
  'Sit with your back supported and feet flat for 5 minutes.',
  'Rest your arm on a table with the cuff at heart level, on bare skin.',
  'Take 2 readings, 1 minute apart, and log both.',
];

export const AVERAGE_NOTE =
  'Doctors look at the average of readings taken on several days, not at single readings.';

export interface LearnTopic {
  title: string;
  summary: string;
}

/** Planned education topics. Full articles will be written with Dr. Mehran. */
export const LEARN_TOPICS: LearnTopic[] = [
  {
    title: 'Measuring your blood pressure at home',
    summary: 'Choosing a validated monitor, getting the cuff size right, and when to measure.',
  },
  {
    title: 'Understanding your numbers',
    summary: 'What systolic and diastolic mean, and the normal, elevated, stage 1 and stage 2 ranges.',
  },
  {
    title: 'The DASH eating plan',
    summary: 'Eating more fruit, vegetables and low-fat dairy, and less sodium, to lower blood pressure.',
  },
  {
    title: 'Cutting back on sodium',
    summary: 'Where hidden salt comes from, reading food labels, and lower-sodium swaps.',
  },
  {
    title: 'Activity, sleep and stress',
    summary: 'How exercise, sleep and stress affect blood pressure, and simple changes that help.',
  },
  {
    title: 'Blood pressure medicines',
    summary: 'Common types of medicine, why taking them every day matters, and side effects to report.',
  },
  {
    title: 'When to seek emergency care',
    summary: 'Warning signs of a stroke or heart attack, and when a high reading needs 911.',
  },
];
