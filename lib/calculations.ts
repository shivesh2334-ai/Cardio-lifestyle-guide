// Core clinical calculation engines
// Sources: Myers J. Circulation. 2003;107:e2-e5 | Tonstad S. Heart. 2009;95:1635-1640 |
// Levine GN et al. Circulation. 2012;125:1058-1072 (AHA Sexual Activity & CVD) |
// 2018 Physical Activity Guidelines for Americans (HHS) |
// Lichtenstein AH et al. Circulation. 2021;144:e472-e487 (AHA Dietary Guidance)

export interface HeartRateResult {
  maxHR: number;
  hrr: number;
  trainingLow: number;
  trainingHigh: number;
  targetLow: number;
  targetHigh: number;
}

/**
 * Karvonen (Heart Rate Reserve) method, as presented in Myers 2003.
 * Target HR = ((HRmax - HRrest) x %intensity) + HRrest
 */
export function calculateTargetHeartRate(
  age: number,
  restingHR: number,
  intensityLow = 0.6,
  intensityHigh = 0.75
): HeartRateResult {
  const maxHR = 220 - age;
  const hrr = maxHR - restingHR;
  const trainingLow = Math.round(hrr * intensityLow + restingHR);
  const trainingHigh = Math.round(hrr * intensityHigh + restingHR);
  return {
    maxHR,
    hrr,
    trainingLow,
    trainingHigh,
    targetLow: trainingLow,
    targetHigh: trainingHigh,
  };
}

export interface ActivityProfile {
  hasKnownCVD: boolean;
  age: number;
  riskFactorCount: number; // family hx <55, smoking, HTN, dyslipidaemia, diabetes, sedentary, obesity
  currentActivityMinutesPerWeek: number;
  currentlySedentary: boolean;
}

export interface ActivityRecommendation {
  needsPhysicianClearance: boolean;
  weeklyModerateTarget: string;
  weeklyVigorousTarget: string;
  message: string;
  startingAdvice: string[];
}

/**
 * Physical activity triage, based on Myers 2003 "How Should You Begin" section
 * and the 2018 Physical Activity Guidelines for Americans (150-300 min moderate
 * or 75-150 min vigorous per week, plus 2+ days/week muscle strengthening).
 */
export function assessPhysicalActivity(p: ActivityProfile): ActivityRecommendation {
  const needsPhysicianClearance =
    p.hasKnownCVD || (p.age > 45 && p.riskFactorCount >= 2);

  const startingAdvice: string[] = [];
  if (p.currentlySedentary || p.currentActivityMinutesPerWeek < 30) {
    startingAdvice.push(
      "Start with short, accumulated bouts (e.g. 10 minutes at a time) rather than a full 30 minutes at once."
    );
    startingAdvice.push(
      "Build up gradually — the largest mortality benefit comes from moving from sedentary to moderately active, not from moderate to very active."
    );
  }
  startingAdvice.push(
    "Work activity into daily routines: stairs instead of the lift, walking instead of short drives."
  );
  startingAdvice.push(
    "Include muscle-strengthening activity on 2 or more days per week for all major muscle groups."
  );

  const message = needsPhysicianClearance
    ? "Because of existing cardiovascular disease or multiple risk factors, a clinical evaluation (and possibly exercise stress testing) is advised before starting or significantly increasing an exercise programme."
    : "Most adults can safely begin a moderate walking-based programme without further testing.";

  return {
    needsPhysicianClearance,
    weeklyModerateTarget: "150–300 minutes/week of moderate-intensity aerobic activity (e.g. brisk walking 3–4 mph)",
    weeklyVigorousTarget: "or 75–150 minutes/week of vigorous-intensity activity, or an equivalent combination",
    message,
    startingAdvice,
  };
}

export const MET_TABLE: { activity: string; mets: number; calPerHour: number }[] = [
  { activity: "Walking 2.0 mph", mets: 2.5, calPerHour: 175 },
  { activity: "Walking 3.0 mph", mets: 3.5, calPerHour: 245 },
  { activity: "Golf (with cart)", mets: 2.5, calPerHour: 175 },
  { activity: "Golf (without cart)", mets: 4.9, calPerHour: 340 },
  { activity: "Calisthenics (no weights)", mets: 4.0, calPerHour: 280 },
  { activity: "Gardening", mets: 4.4, calPerHour: 310 },
  { activity: "Cycling (leisurely)", mets: 4.0, calPerHour: 280 },
  { activity: "Cycling (moderately)", mets: 5.7, calPerHour: 400 },
  { activity: "Swimming (slowly)", mets: 4.5, calPerHour: 315 },
  { activity: "Swimming (fast)", mets: 7.0, calPerHour: 490 },
  { activity: "Climbing hills (no load)", mets: 6.9, calPerHour: 480 },
  { activity: "Tennis (singles)", mets: 7.5, calPerHour: 525 },
  { activity: "Tennis (doubles)", mets: 6.0, calPerHour: 420 },
  { activity: "Running (10 min/mile)", mets: 10.2, calPerHour: 710 },
  { activity: "Running (7.5 min/mile)", mets: 13.2, calPerHour: 930 },
  { activity: "Sexual activity (usual partner)", mets: 4, calPerHour: 280 },
];

// ---------------------- Sexual health / CVD risk stratification ----------------------
// Based on Levine GN et al. 2012 AHA Scientific Statement, "Sexual Activity and CVD"

export interface SexualHealthProfile {
  unstableOrDecompensated: boolean; // unstable angina, decompensated HF, uncontrolled arrhythmia, severe symptomatic valve dz
  recentMIWeeks: number | null; // weeks since MI, null if N/A
  recentCABGWeeks: number | null; // weeks since CABG/open heart surgery, null if N/A
  recentPCIDays: number | null; // days since PCI, null if N/A
  nyhaClass: 1 | 2 | 3 | 4 | null;
  anginaClass: 1 | 2 | 3 | 4 | null; // CCS class
  canExercise3to5METs: boolean | null; // known exercise capacity without symptoms
  hasSevereValveDisease: boolean;
  hasUncontrolledArrhythmia: boolean;
  hasICDMultipleShocks: boolean;
  onNitrates: boolean;
  wantsPDE5Inhibitor: boolean;
}

export type RiskTier = "low" | "intermediate" | "high" | "defer";

export interface SexualHealthResult {
  tier: RiskTier;
  summary: string;
  recommendations: string[];
  cautions: string[];
}

export function assessSexualHealth(p: SexualHealthProfile): SexualHealthResult {
  const recommendations: string[] = [];
  const cautions: string[] = [];

  // Class III (defer) triggers
  if (
    p.unstableOrDecompensated ||
    p.hasUncontrolledArrhythmia ||
    p.hasICDMultipleShocks ||
    (p.anginaClass && p.anginaClass >= 3 && p.anginaClass !== undefined) ||
    (p.nyhaClass && p.nyhaClass >= 3)
  ) {
    recommendations.push(
      "Defer sexual activity until the underlying condition is stabilised and optimally managed (Class III recommendation)."
    );
    if (p.nyhaClass && p.nyhaClass >= 3) {
      cautions.push("NYHA class III–IV heart failure is not advised for sexual activity until compensated.");
    }
    if (p.hasICDMultipleShocks) {
      cautions.push("Recent multiple ICD shocks — the causative arrhythmia should be stabilised first.");
    }
    return {
      tier: "defer",
      summary: "Current status suggests deferring sexual activity until cardiac status is stabilised.",
      recommendations,
      cautions,
    };
  }

  if (p.recentMIWeeks !== null && p.recentMIWeeks < 1) {
    cautions.push(
      "Within 1 week of uncomplicated MI — resumption of sexual activity as early as 1 week has been supported in stable, asymptomatic patients, but individual clearance is advised."
    );
  }
  if (p.recentCABGWeeks !== null && p.recentCABGWeeks < 6) {
    cautions.push(
      "Sternotomy typically needs 6–8 weeks to heal; sexual activity is generally deferred until the sternal wound is well healed."
    );
  }
  if (p.recentPCIDays !== null && p.recentPCIDays < 2) {
    cautions.push(
      "Very recent PCI — resumption is reasonable within days if the vascular access site is without complication; confirm access-site healing first."
    );
  }
  if (p.hasSevereValveDisease) {
    cautions.push(
      "Severe or significantly symptomatic valvular disease should be treated/stabilised before resuming sexual activity."
    );
  }
  if (p.onNitrates && p.wantsPDE5Inhibitor) {
    cautions.push(
      "PDE5 inhibitors are an absolute contraindication with nitrate therapy — do not combine. Nitrates should not be given within 24h of sildenafil/vardenafil or 48h of tadalafil."
    );
  }

  // Determine risk tier by functional capacity / symptom class
  let tier: RiskTier = "intermediate";
  if (
    (p.anginaClass === 1 || p.anginaClass === 2 || p.anginaClass === null) &&
    (p.nyhaClass === 1 || p.nyhaClass === 2 || p.nyhaClass === null) &&
    (p.canExercise3to5METs === true)
  ) {
    tier = "low";
    recommendations.push(
      "Low cardiovascular risk profile — sexual activity is considered reasonable (Class IIa)."
    );
  } else if (p.canExercise3to5METs === false) {
    tier = "intermediate";
    recommendations.push(
      "Exercise capacity below 3–5 METs without symptoms is uncertain for safety — exercise stress testing is reasonable before resuming sexual activity."
    );
  } else {
    tier = "intermediate";
    recommendations.push(
      "Risk is not clearly low — a clinical evaluation (history, exam, and possibly exercise stress testing) is reasonable before resuming or increasing sexual activity."
    );
  }

  recommendations.push(
    "General measures: be well rested, avoid unfamiliar partners/surroundings and heavy meals or alcohol beforehand, and use a position that doesn't restrict breathing."
  );
  recommendations.push(
    "Anxiety and depression related to resuming sexual activity should be actively asked about and addressed — these are common and treatable."
  );

  if (p.wantsPDE5Inhibitor && !p.onNitrates) {
    recommendations.push(
      "PDE5 inhibitors (sildenafil, tadalafil, vardenafil) are generally safe and effective for erectile dysfunction in stable CVD, provided nitrates are not used."
    );
  }

  return {
    tier,
    summary:
      tier === "low"
        ? "Low estimated cardiovascular risk with sexual activity."
        : "Intermediate risk — further evaluation or optimisation is reasonable before resuming full activity.",
    recommendations,
    cautions,
  };
}

// ---------------------- Smoking cessation ----------------------
// Based on Tonstad S. Heart. 2009;95:1635-1640 (5 A's framework, Fagerström-lite items)

export interface SmokingProfile {
  cigarettesPerDay: number;
  minutesToFirstCigarette: number; // time after waking to first cigarette
  hasCVD: boolean;
  readyToQuitWithin30Days: boolean;
  previousQuitAttempts: number;
}

export interface SmokingResult {
  dependenceLevel: "low" | "moderate" | "high";
  pharmacotherapyRecommended: boolean;
  recommendedClasses: string[];
  fiveAs: { step: string; action: string }[];
  message: string;
}

export function assessSmoking(p: SmokingProfile): SmokingResult {
  let dependenceScore = 0;
  if (p.minutesToFirstCigarette <= 5) dependenceScore += 3;
  else if (p.minutesToFirstCigarette <= 30) dependenceScore += 2;
  else if (p.minutesToFirstCigarette <= 60) dependenceScore += 1;

  if (p.cigarettesPerDay >= 21) dependenceScore += 3;
  else if (p.cigarettesPerDay >= 11) dependenceScore += 2;
  else if (p.cigarettesPerDay >= 3) dependenceScore += 1;

  let dependenceLevel: "low" | "moderate" | "high" = "low";
  if (dependenceScore >= 5) dependenceLevel = "high";
  else if (dependenceScore >= 3) dependenceLevel = "moderate";

  const pharmacotherapyRecommended = !(p.cigarettesPerDay <= 2 && dependenceScore <= 1);

  const recommendedClasses: string[] = [];
  if (pharmacotherapyRecommended) {
    recommendedClasses.push(
      "Nicotine replacement therapy (patch ± ad libitum gum/lozenge/inhalator) — safe in stable CVD; caution advised until 2 weeks after an acute event."
    );
    recommendedClasses.push(
      "Varenicline — more effective than bupropion in head-to-head trials; shown safe and effective in patients with stable cardiovascular, cerebrovascular or peripheral vascular disease."
    );
    recommendedClasses.push(
      "Bupropion SR — an alternative, effective and safe option in stable CVD (usual course 7–9 weeks)."
    );
  }

  const fiveAs = [
    { step: "Ask", action: "Systematically identify and document smoking status at every visit." },
    { step: "Assess", action: "Gauge dependence (cigarettes/day, time to first cigarette) and readiness to quit." },
    { step: "Advise", action: "Give clear, personalised, direct advice to quit, tied to the patient's own condition." },
    { step: "Assist", action: "Offer pharmacotherapy and behavioural support; set a quit date within the next few weeks." },
    { step: "Arrange", action: "Schedule follow-up — face-to-face, phone, or nurse-led — ideally within a week of the quit date." },
  ];

  const message = p.readyToQuitWithin30Days
    ? "Patient is ready to make a quit attempt — offer medication, brief counselling, and arrange follow-up now."
    : "Patient is not yet ready — use motivational interviewing (explore ambivalence, express empathy, avoid arguments) rather than pushing pharmacotherapy immediately.";

  return { dependenceLevel, pharmacotherapyRecommended, recommendedClasses, fiveAs, message };
}

// ---------------------- Diet ----------------------
// Based on the AHA 2021 "10 features" dietary guidance to improve cardiovascular health

export const DIET_FEATURES: { key: string; label: string }[] = [
  { key: "energyBalance", label: "I try to balance the calories I eat with activity to reach/maintain a healthy weight" },
  { key: "fruitsVeg", label: "I eat a variety of fruits and vegetables most days" },
  { key: "wholeGrains", label: "I choose whole-grain foods over refined grains most of the time" },
  { key: "healthyProtein", label: "I get most of my protein from plants, fish/seafood, or low-fat dairy rather than red/processed meat" },
  { key: "liquidOils", label: "I cook mostly with liquid plant oils rather than butter, ghee, or tropical oils" },
  { key: "minimallyProcessed", label: "I choose minimally processed foods over ultra-processed foods most of the time" },
  { key: "lowSugar", label: "I minimise sugar-sweetened beverages and added sugars" },
  { key: "lowSalt", label: "I choose and prepare foods with little to no added salt" },
  { key: "lowAlcohol", label: "I keep alcohol intake low (or don't drink)" },
  { key: "consistentEverywhere", label: "I try to follow these habits whether eating at home, work, or out" },
];

export function scoreDiet(answers: Record<string, boolean>): {
  score: number;
  total: number;
  tier: "needs-improvement" | "good" | "excellent";
  gaps: string[];
} {
  const total = DIET_FEATURES.length;
  let score = 0;
  const gaps: string[] = [];
  for (const f of DIET_FEATURES) {
    if (answers[f.key]) score += 1;
    else gaps.push(f.label);
  }
  let tier: "needs-improvement" | "good" | "excellent" = "needs-improvement";
  if (score >= 9) tier = "excellent";
  else if (score >= 6) tier = "good";
  return { score, total, tier, gaps };
}
