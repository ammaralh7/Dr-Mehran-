# KidneyWell

Kidney health app for iOS and Android, built with Expo (React Native + TypeScript).

## What works today (Phase 1 foundation)

| Tab | Feature |
| --- | --- |
| **Today** | Dashboard: today's fluid total and goal progress, latest eGFR with its stage |
| **Track** | Fluid log in ounces (default, for the US) or mL, with quick-add, a custom amount, a goal set by the user's care team, and a daily log |
| **Kidney** | eGFR calculator (CKD-EPI 2021, mg/dL or µmol/L), KDIGO stage, guidance, saved history |
| **Learn** | Planned education topics (articles still to be written with Dr. Mehran) |

All data stays **on the device** (SQLite). Nothing is sent to a server yet.

## Run it

```bash
npm install
npx expo start        # scan the QR code with Expo Go, or press i / a for a simulator
```

A browser preview (`npx expo start --web`) is available for quick checks. The app itself ships to iOS and Android only.

## Checks

```bash
npm test              # unit tests (eGFR equation, fluid log, unit conversion)
npm run typecheck
npm run lint
```

## Where things live

```
src/app/          screens (one file per tab; Expo Router)
src/components/   shared UI: Screen, Card, Button, inputs, tab bar
src/content/      ALL patient-facing medical wording, for clinical review
src/lib/          logic: egfr.ts, fluid.ts, local storage and stores
```

## Clinical review needed before release

- `src/content/copy.ts`: every guidance string, the disclaimer and the education topics.
- `src/lib/egfr.test.ts`: spot-check the expected eGFR values against the NKF calculator.
- The decision that the app never suggests a default fluid goal (see `src/lib/fluid.ts`).

## Not set yet

- iOS bundle identifier and Android package name (need the publisher's domain or company name).
- App icon, splash and brand colors (current ones are placeholders).
