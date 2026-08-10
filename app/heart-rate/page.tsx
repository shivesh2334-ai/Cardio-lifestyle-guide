"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Disclaimer from "@/components/Disclaimer";
import { calculateTargetHeartRate, HeartRateResult } from "@/lib/calculations";

export default function HeartRatePage() {
  const [age, setAge] = useState("");
  const [restingHR, setRestingHR] = useState("");
  const [intensity, setIntensity] = useState<"standard" | "gentle">("standard");
  const [result, setResult] = useState<HeartRateResult | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const low = intensity === "gentle" ? 0.4 : 0.6;
    const high = intensity === "gentle" ? 0.6 : 0.75;
    setResult(
      calculateTargetHeartRate(Number(age) || 0, Number(restingHR) || 0, low, high)
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Target Exercise Heart Rate
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Uses the heart-rate-reserve (Karvonen) method described in Myers J.
          Circulation 2003;107:e2-e5.
        </p>
      </div>

      <Card title="Enter your details">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Age (years)</label>
            <input
              type="number"
              required
              min={1}
              max={120}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Resting heart rate (beats/min)
            </label>
            <input
              type="number"
              required
              min={30}
              max={150}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={restingHR}
              onChange={(e) => setRestingHR(e.target.value)}
              placeholder="Measure first thing in the morning, before getting up"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Desired intensity
            </label>
            <select
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value as "standard" | "gentle")}
            >
              <option value="standard">Standard training zone (60–75% HRR)</option>
              <option value="gentle">Gentler zone — cardiac rehab / deconditioned (40–60% HRR)</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-rose-600 text-white px-4 py-2 rounded-md font-medium hover:bg-rose-700"
          >
            Calculate my target zone
          </button>
        </form>
      </Card>

      {result && (
        <Card title="Your target heart-rate zone" tone="success">
          <div className="grid grid-cols-2 gap-4 text-center mb-4">
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-3xl font-bold text-rose-600">
                {result.targetLow}–{result.targetHigh}
              </div>
              <div className="text-xs text-slate-500 mt-1">beats per minute</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-3xl font-bold text-slate-700">{result.maxHR}</div>
              <div className="text-xs text-slate-500 mt-1">
                estimated maximal HR (220 − age)
              </div>
            </div>
          </div>
          <ul className="text-sm text-slate-700 space-y-1">
            <li>Heart-rate reserve (HRR) = Max HR − resting HR = {result.hrr} bpm</li>
            <li>
              Target HR = (HRR × desired intensity) + resting HR
            </li>
          </ul>
          <p className="text-xs text-slate-500 mt-3">
            Note: the 220 − age formula is a commonly used estimate but is not very
            precise for individuals. Maximal heart rate can only be determined
            accurately from a maximal exercise test. It is not usually necessary for
            healthy adults to track heart rate diligently — substantial health benefits
            occur through modest levels of daily activity regardless of exact
            intensity.
          </p>
        </Card>
      )}

      <Card title="Worked example (from the source article)">
        <p className="text-sm text-slate-700">
          Maximal HR 150 − resting HR 70 = HRR 80. At 60% desired intensity: 80 × 0.60 =
          48, + resting HR 70 = training HR 118 bpm. A reasonable training zone for this
          person would be about 115–120 bpm.
        </p>
      </Card>

      <Disclaimer />
    </div>
  );
}
