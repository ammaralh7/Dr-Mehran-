# Dr. Mehran apps

Two patient-facing health apps for Dr. Mehran, launching in the US.

| App | Folder | Status |
| --- | --- | --- |
| **KidneyWell**: kidney health tracking and education | [`apps/kidneywell`](apps/kidneywell) | Phase 1 foundation built |
| **Hypertension Hub**: blood pressure tracking and management | [`apps/hypertension-hub`](apps/hypertension-hub) | Phase 1 foundation built |
| Shared UI kit, theming and storage | [`packages/shared`](packages/shared) | Used by both apps |

Both are Expo (React Native + TypeScript) apps for iOS and Android, kept in one npm workspace so they share code. See [`docs/PLAN.md`](docs/PLAN.md) for the build plan and the decisions still open.

## Getting started

```bash
npm install                     # once, from this folder
cd apps/kidneywell              # or apps/hypertension-hub
npx expo start
```

## Checks (all workspaces)

```bash
npm test
npm run typecheck
npm run lint
npm run format:check
```
