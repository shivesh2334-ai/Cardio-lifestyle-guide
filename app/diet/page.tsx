"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Disclaimer from "@/components/Disclaimer";
import { DIET_FEATURES, scoreDiet } from "@/lib/calculations";

export default function DietPage() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const result = scoreDiet(answers);

  const tierTone =
    result.tier === "excellent" ? "success" : result.tier === "good" ? "warning" : "danger";

  const tierLabel =
    result.tier === "excellent"
      ? "Excellent — closely aligned with heart-healthy patterns"
      : result.tier === "good"
      ? "Good — some room for improvement"
      : "Needs improvement";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Diet &amp; Nutrition</h1>
        <p className="text-slate-600 text-sm mt-1">
          Based on Lichtenstein AH et al. &ldquo;2021 Dietary Guidance to Improve
          Cardiovascular Health: A Scientific Statement From the American Heart
          Association&rdquo;, Circulation 2021;144:e472-e487.
        </p>
      </div>

      <Card title="Score your current eating pattern">
        <div className="space-y-3">
          {DIET_FEATURES.map((f) => (
            <label key={f.key} className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={!!answers[f.key]}
                onChange={(e) =>
                  setAnswers({ ...answers, [f.key]: e.target.checked })
                }
              />
              <span className="text-slate-700">{f.label}</span>
            </label>
          ))}
        </div>
        <button
          onClick={() => setSubmitted(true)}
          className="mt-4 bg-rose-600 text-white px-4 py-2 rounded-md font-medium hover:bg-rose-700"
        >
          See my score
        </button>
      </Card>

      {submitted && (
        <Card title={`Score: ${result.score} / ${result.total}`} tone={tierTone}>
          <p className="text-sm font-medium text-slate-800 mb-3">{tierLabel}</p>
          {result.gaps.length > 0 && (
            <div>
              <strong className="text-sm text-slate-800">
                Areas to focus on first:
              </strong>
              <ul className="list-disc list-inside text-sm text-slate-700 mt-1 space-y-1">
                {result.gaps.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      <Card title="The 10 features of a heart-healthy dietary pattern (AHA 2021)">
        <ol className="list-decimal list-inside text-sm text-slate-700 space-y-1.5">
          <li>Adjust energy intake and expenditure to achieve/maintain a healthy weight</li>
          <li>Eat plenty and a variety of fruits and vegetables</li>
          <li>Choose whole-grain foods over refined grains</li>
          <li>
            Choose healthy protein sources — mostly plants (legumes, nuts), regular
            fish/seafood, low-fat or fat-free dairy, and lean, unprocessed meat/poultry
            if desired
          </li>
          <li>Use liquid plant oils rather than tropical oils, animal fats, or partially hydrogenated fats</li>
          <li>Choose minimally processed foods instead of ultra-processed foods</li>
          <li>Minimise beverages and foods with added sugars</li>
          <li>Choose and prepare foods with little to no salt</li>
          <li>
            If you drink alcohol, keep intake low (the AHA does not recommend
            starting alcohol for cardiovascular benefit)
          </li>
          <li>Follow this guidance consistently — at home, at work, and eating out</li>
        </ol>
      </Card>

      <Card title="Practical starting points">
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>Build meals around vegetables, legumes, and whole grains, with fish or lean poultry rather than red/processed meat as the main protein.</li>
          <li>Swap ghee/butter or coconut oil for liquid vegetable oils (e.g. mustard, groundnut, olive) where possible.</li>
          <li>Cut back on packaged snacks, sweets, and sugar-sweetened drinks — replace with fruit, nuts, or plain water/tea.</li>
          <li>Cook with less added salt, and rely more on herbs/spices for flavour.</li>
          <li>These same habits also improve blood pressure, cholesterol, and blood sugar — the same changes benefit multiple risk factors at once.</li>
        </ul>
      </Card>

      <Disclaimer />
    </div>
  );
}
