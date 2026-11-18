# Hypertension Hub

Blood pressure tracking app for iOS and Android, built with Expo (React Native + TypeScript). It shares its UI kit, theming and on-device storage with KidneyWell through `packages/shared`.

## What works today (Phase 1 foundation)

| Tab | Feature |
| --- | --- |
| **Today** | Latest reading with its category, 7-day average, and the severe-reading steps when the latest reading is above 180/120 |
| **Readings** | Log systolic, diastolic and pulse; instant category and guidance; tips for measuring correctly; full history (this is also the chart's table view) |
| **Trends** | Chart of systolic and diastolic over 7, 30 or 90 days with the 130/80 stage 1 lines, tap to inspect any reading, and the average for the period |
| **Learn** | Planned education topics (articles still to be written with Dr. Mehran) |

Categories follow the 2025 AHA/ACC guideline: normal, elevated, stage 1, stage 2, and severe (above 180/120). A severe reading shows steps to re-measure and contact a doctor, plus a **Call 911** button for anyone who also has symptoms.

All data stays **on the device** (SQLite). Nothing is sent to a server yet.

## Run it

From the repository root:

```bash
npm install
cd apps/hypertension-hub
npx expo start        # scan the QR code with Expo Go, or press i / a for a simulator
```

## Checks

From the repository root, for both apps and the shared package:

```bash
npm test
npm run typecheck
npm run lint
npm run format:check
```

## Where things live

```
src/app/          screens (one file per tab; Expo Router)
src/components/   tab bar, blood pressure chart, severe-reading alert
src/content/      ALL patient-facing medical wording, for clinical review
src/lib/          logic: bp.ts (categories, validation, averages), chart.ts, stores
```

## Clinical review needed before release

- `src/content/copy.ts`: every guidance string, the severe-reading steps, measuring tips, the disclaimer and the education topics.
- `src/lib/bp.test.ts`: the category boundaries, especially that exactly 180 or 120 is stage 2 and only *above* is severe.
- When the Today screen shows the severe-reading alert: currently while the latest reading is severe and less than 24 hours old.
