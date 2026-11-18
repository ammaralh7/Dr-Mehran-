# Build plan: KidneyWell and Hypertension Hub

Both concept documents list about 12 features each, and roughly half are the same in both apps. The plan is to ship a small, useful, low-risk version of each first, then add the features that need servers, accounts and compliance work.

## Phases

### Phase 1: on-device apps (no server)

All health data stays on the phone. That keeps the first release out of server-side HIPAA scope, needs no hosting, and gets real apps in front of Dr. Mehran and test patients quickly.

| | KidneyWell | Hypertension Hub |
| --- | --- | --- |
| Core measurement | eGFR calculator + history ✅ | Blood pressure log (manual entry) with ACC/AHA category and trend chart |
| Daily tracking | Fluid log in oz or mL ✅, then sodium and potassium | Home BP averages (e.g. 7-day), DASH and sodium habits |
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

## Decided

### Launch country: United States

**Units.** Creatinine defaults to mg/dL, with µmol/L kept for lab reports that use it. Fluids default to ounces, with mL as an option. Weight will use pounds.

**Blood pressure guideline.** Hypertension Hub follows the 2025 ACC/AHA guideline, which kept the 2017 categories. Dr. Mehran confirms the exact thresholds and wording before release.

| Category | Systolic (top) | | Diastolic (bottom) |
| --- | --- | --- | --- |
| Normal | under 120 | and | under 80 |
| Elevated | 120–129 | and | under 80 |
| Stage 1 | 130–139 | or | 80–89 |
| Stage 2 | 140 or higher | or | 90 or higher |
| Severe | over 180 | and/or | over 120 |

A severe reading should prompt the user to rest and re-measure, then contact their doctor. A severe reading *with* symptoms such as chest pain, shortness of breath, weakness, vision or speech changes should tell the user to **call 911**.

**Privacy law depends on how the apps are offered:**
- **Offered by Dr. Mehran's practice to its patients, with data shared back to the practice:** HIPAA applies. The practice is the covered entity, and whoever runs the backend signs a Business Associate Agreement.
- **Sold directly to consumers:** HIPAA usually does not apply, but the **FTC Health Breach Notification Rule** does. Since 2024 it explicitly covers health apps and treats sharing data without permission as a breach. State laws also apply. The broadest is **Washington's My Health My Data Act**, which requires explicit consent before collecting health data and a separate consumer health data privacy policy.
- **Either way:** Phase 1 keeps data on the phone. From Phase 2 we build to the HIPAA standard, send no health data to ad or analytics SDKs, and get the privacy policy reviewed by a lawyer.

**FDA.** Standard calculators and general wellness tracking are generally low-risk under the FDA's *General Wellness* and *Clinical Decision Support Software* guidance. Alerts that tell a patient what to do based on their own readings need care. Keep alerts to "contact your doctor or call 911", and get a short regulatory review before launch.

## Decisions needed

| # | Decision | Why it matters |
| --- | --- | --- |
| 1 | **How the apps are offered**: through Dr. Mehran's practice to his patients, or sold to anyone | Decides whether HIPAA applies (see above), and shapes pricing and marketing. |
| 2 | **How the apps make money**: paid download, subscription, free for Dr. Mehran's patients, or freemium | Digital subscriptions must go through Apple and Google in-app purchase. That shapes Phase 2. |
| 3 | **Who publishes the apps** | Apple requires healthcare apps to be submitted by the legal entity providing the service (App Store Review Guideline 5.1.1), so the developer accounts should belong to Dr. Mehran's practice or company, not an individual. |
| 4 | **Agreement between you and Dr. Mehran** | Scope, price, who owns the code, who pays for hosting and store fees, and ongoing maintenance. Worth writing down, even between friends. |
| 5 | **Branding** | App icons, colors, and the bundle IDs (e.g. `com.<company>.kidneywell`). |
