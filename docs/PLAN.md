# Build plan: KidneyWell and Hypertension Hub

Both concept documents list about 12 features each, and roughly half are the same in both apps. The plan is to ship a small, useful, low-risk version of each first, then add the features that need servers, accounts and compliance work.

## Phases

### Phase 1: on-device apps (no server)

All health data stays on the phone. That keeps the first release out of server-side HIPAA scope, needs no hosting, and gets real apps in front of Dr. Mehran and test patients quickly.

| | KidneyWell | Hypertension Hub |
| --- | --- | --- |
| Core measurement | eGFR calculator + history ✅ | Blood pressure log (manual entry) with trend chart |
| Daily tracking | Fluid log ✅, then sodium and potassium | Home BP averages (e.g. 7-day), DASH and sodium habits |
| Shared | Medication list and reminders · symptom diary with "contact your doctor" prompts · education articles · local notifications | ← same |
| Visit report | PDF summary to show or send to the doctor | ← same |

### Phase 2: accounts, sync and sharing with doctors

- User accounts and encrypted cloud backup across devices.
- Sharing data with a healthcare provider, either a live link or a report.
- Subscriptions or other payments (see decisions below).
- **Requires** a HIPAA-eligible backend with a signed Business Associate Agreement (BAA), encryption at rest and in transit, audit logging, and a privacy policy reviewed by a lawyer.

### Phase 3: integrations and community

- Apple Health / Google Health Connect (activity, weight, blood pressure).
- Bluetooth blood pressure monitors (Hypertension Hub).
- Community forum and live Q&A with clinicians. These need moderation and clear rules on giving medical advice.
- Food database with sodium and potassium values (USDA FoodData Central is free to use).

## Shared code

When Hypertension Hub starts, move the code both apps use (UI components, theme, local storage, medications, reminders, symptom diary, education, reports) into shared packages under `packages/`, with each app in `apps/`. Each app keeps its own name, branding and store listing.

## Clinical safety rules (apply to both apps)

1. **All patient-facing medical wording lives in one file per app** (`src/content/copy.ts`) and is signed off by Dr. Mehran before release.
2. **The app never sets a medical target on its own.** Fluid, sodium, potassium and blood pressure goals come from the user's care team. For example, someone on dialysis may need to *restrict* fluids, so the app has no default fluid goal.
3. **Alerts send people to a professional.** They never tell them to change a medication. Hypertension Hub needs a clear emergency path for severe readings (for example above 180/120), especially when the person also has symptoms. Dr. Mehran confirms the exact thresholds and wording.
4. **Every calculation is unit-tested** against hand-checked values (see `apps/kidneywell/src/lib/egfr.test.ts`).

## Decisions needed

| # | Decision | Why it matters |
| --- | --- | --- |
| 1 | **Country or countries of launch** | Sets privacy law (HIPAA/FTC in the US, GDPR in the EU/UK), lab units (mg/dL vs µmol/L) and which blood pressure guideline applies (US ACC/AHA vs European ESC/ESH thresholds). |
| 2 | **How the apps make money**: paid download, subscription, free for Dr. Mehran's patients, or freemium | Digital subscriptions must go through Apple and Google in-app purchase. That shapes Phase 2. |
| 3 | **Who publishes the apps** | Apple requires healthcare apps to be submitted by the legal entity providing the service (App Store Review Guideline 5.1.1), so the developer accounts should belong to Dr. Mehran's practice or company, not an individual. |
| 4 | **Agreement between you and Dr. Mehran** | Scope, price, who owns the code, who pays for hosting and store fees, and ongoing maintenance. Worth writing down, even between friends. |
| 5 | **Branding** | App icons, colors, and the bundle IDs (e.g. `com.<company>.kidneywell`). |
| 6 | **Regulatory check before launch** | Calculators and general-wellness tracking are usually low-risk, but personalised alerts can move an app toward being regulated medical device software (FDA in the US). A short consult before launch is worth it. |
