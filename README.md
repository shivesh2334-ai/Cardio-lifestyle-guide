# Cardio Lifestyle Advisor

A clinician-informed Next.js web app providing patient-facing lifestyle advice across five domains, built from AHA/ACC scientific statements and related literature:

1. **Physical Activity** — activity triage + MET/calorie reference (Myers J, *Circulation* 2003;107:e2-e5; 2018 Physical Activity Guidelines for Americans)
2. **Target Exercise Heart Rate** — Karvonen (heart-rate-reserve) calculator (Myers 2003)
3. **Sexual Health & CVD** — risk-stratified assessment (Levine GN et al, AHA Scientific Statement, *Circulation* 2012;125:1058-1072)
4. **Smoking Cessation** — dependence assessment + 5 A's quit plan (Tonstad S, *Heart* 2009;95:1635-1640)
5. **Diet & Nutrition** — scored against the AHA's 10 heart-healthy dietary features (Lichtenstein AH et al, *Circulation* 2021;144:e472-e487)

This is patient education tooling, **not a diagnostic device**, and does not replace clinical judgement.

## Stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- All assessment logic is deterministic and client-side (`lib/calculations.ts`) — no data leaves the browser, no backend/database required
- Deploy target: Vercel

## Local development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel, "Add New Project" → import the GitHub repo.
3. Framework preset: Next.js (auto-detected). No environment variables required.
4. Recommended region: `bom1` (Mumbai) — set under Project Settings → Functions → Region if you want to pin it.
5. Deploy.

## Project structure

```
app/
  page.tsx                  Home / module picker
  physical-activity/        Activity triage + MET table
  heart-rate/                Karvonen target HR calculator
  sexual-health/              AHA 2012 risk-stratified assessment
  smoking-cessation/          5 A's + dependence assessment
  diet/                       AHA 2021 dietary pattern scorer
components/
  Header.tsx, Card.tsx, Disclaimer.tsx
lib/
  calculations.ts            All clinical logic, fully typed and testable
```

## Sources

- Myers J. Exercise and Cardiovascular Health. *Circulation*. 2003;107:e2-e5.
- Tonstad S. Smoking cessation: how to advise the patient. *Heart*. 2009;95:1635-1640.
- Levine GN, Steinke EE, Bakaeen FG, et al. Sexual Activity and Cardiovascular Disease: A Scientific Statement From the American Heart Association. *Circulation*. 2012;125:1058-1072.
- 2018 Physical Activity Guidelines for Americans, 2nd edition. US Department of Health and Human Services.
- Lichtenstein AH, Appel LJ, Vadiveloo M, et al. 2021 Dietary Guidance to Improve Cardiovascular Health: A Scientific Statement From the American Heart Association. *Circulation*. 2021;144:e472-e487.

## Disclaimer

This tool provides general, guideline-informed education only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified physician before making changes to activity, medication, or lifestyle — particularly with known cardiovascular disease.
