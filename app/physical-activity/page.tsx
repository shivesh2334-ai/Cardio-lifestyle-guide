"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Disclaimer from "@/components/Disclaimer";
import {
  assessPhysicalActivity,
  ActivityProfile,
  ActivityRecommendation,
  MET_TABLE,
} from "@/lib/calculations";

export default function PhysicalActivityPage() {
  const [form, setForm] = useState({
    age: "",
    hasKnownCVD: false,
    riskFactorCount: "0",
    currentActivityMinutesPerWeek: "",
    currentlySedentary: false,
  });
  const [result, setResult] = useState<ActivityRecommendation | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const profile: ActivityProfile = {
      age: Number(form.age) || 0,
      hasKnownCVD: form.hasKnownCVD,
      riskFactorCount: Number(form.riskFactorCount) || 0,
      currentActivityMinutesPerWeek: Number(form.currentActivityMinutesPerWeek) || 0,
      currentlySedentary: form.currentlySedentary,
    };
    setResult(assessPhysicalActivity(profile));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Physical Activity Advice</h1>
        <p className="text-slate-600 text-sm mt-1">
          Based on Myers J. &ldquo;Exercise and Cardiovascular Health&rdquo;, Circulation
          2003;107:e2-e5, and the 2018 Physical Activity Guidelines for Americans.
        </p>
      </div>

      <Card title="Tell us about yourself">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Age</label>
            <input
              type="number"
              required
              min={1}
              max={120}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.hasKnownCVD}
              onChange={(e) => setForm({ ...form, hasKnownCVD: e.target.checked })}
            />
            I have known heart disease
          </label>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Number of these risk factors: family history of heart disease before age
              55, smoking, high blood pressure, abnormal cholesterol, diabetes, obesity
            </label>
            <select
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.riskFactorCount}
              onChange={(e) => setForm({ ...form, riskFactorCount: e.target.value })}
            >
              {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Current activity, minutes per week
            </label>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.currentActivityMinutesPerWeek}
              onChange={(e) =>
                setForm({ ...form, currentActivityMinutesPerWeek: e.target.value })
              }
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.currentlySedentary}
              onChange={(e) => setForm({ ...form, currentlySedentary: e.target.checked })}
            />
            I would describe myself as sedentary
          </label>

          <button
            type="submit"
            className="bg-rose-600 text-white px-4 py-2 rounded-md font-medium hover:bg-rose-700"
          >
            Get my activity plan
          </button>
        </form>
      </Card>

      {result && (
        <Card
          title="Your activity recommendation"
          tone={result.needsPhysicianClearance ? "warning" : "success"}
        >
          <p className="text-sm text-slate-700 mb-3">{result.message}</p>
          <ul className="text-sm space-y-1 text-slate-700">
            <li>
              <strong>Target:</strong> {result.weeklyModerateTarget}
            </li>
            <li>{result.weeklyVigorousTarget}</li>
          </ul>
          <div className="mt-3">
            <strong className="text-sm text-slate-800">Getting started:</strong>
            <ul className="list-disc list-inside text-sm text-slate-700 mt-1 space-y-1">
              {result.startingAdvice.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
          {result.needsPhysicianClearance && (
            <p className="text-sm text-amber-800 mt-3 font-medium">
              Please consult your physician before starting or significantly increasing
              your exercise programme.
            </p>
          )}
        </Card>
      )}

      <Card title="Benefits of regular exercise on cardiovascular risk factors">
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>Increase in exercise tolerance / aerobic capacity</li>
          <li>Reduction in body weight</li>
          <li>Reduction in blood pressure</li>
          <li>Reduction in LDL and total cholesterol</li>
          <li>Increase in HDL (&ldquo;good&rdquo;) cholesterol</li>
          <li>Increase in insulin sensitivity</li>
        </ul>
        <p className="text-xs text-slate-500 mt-3">
          For heart attack survivors who participate in a formal exercise programme,
          pooled data show a 20–25% reduction in death rate. Meeting activity
          recommendations could reduce cardiovascular events in the population by
          30–40%.
        </p>
      </Card>

      <Card title="Warning signs to stop and seek medical attention">
        <p className="text-sm text-slate-700">
          Chest discomfort (pain or pressure in the chest, jaw, neck, shoulder, arm, or
          back), unusual shortness of breath, dizziness or light-headedness, or heart
          rhythm abnormalities (skipping, palpitations, thumping).
        </p>
      </Card>

      <Card title="Common activities: METs and calories">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-1 pr-4">Activity</th>
                <th className="py-1 pr-4">METs</th>
                <th className="py-1">Cal/hour</th>
              </tr>
            </thead>
            <tbody>
              {MET_TABLE.map((row) => (
                <tr key={row.activity} className="border-b border-slate-100">
                  <td className="py-1 pr-4 text-slate-700">{row.activity}</td>
                  <td className="py-1 pr-4 text-slate-700">{row.mets}</td>
                  <td className="py-1 text-slate-700">{row.calPerHour}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Disclaimer />
    </div>
  );
}
