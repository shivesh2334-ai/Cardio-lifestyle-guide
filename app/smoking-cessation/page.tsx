"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Disclaimer from "@/components/Disclaimer";
import { assessSmoking, SmokingProfile, SmokingResult } from "@/lib/calculations";

export default function SmokingCessationPage() {
  const [form, setForm] = useState({
    cigarettesPerDay: "",
    minutesToFirstCigarette: "",
    hasCVD: false,
    readyToQuitWithin30Days: true,
    previousQuitAttempts: "0",
  });
  const [result, setResult] = useState<SmokingResult | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const profile: SmokingProfile = {
      cigarettesPerDay: Number(form.cigarettesPerDay) || 0,
      minutesToFirstCigarette: Number(form.minutesToFirstCigarette) || 999,
      hasCVD: form.hasCVD,
      readyToQuitWithin30Days: form.readyToQuitWithin30Days,
      previousQuitAttempts: Number(form.previousQuitAttempts) || 0,
    };
    setResult(assessSmoking(profile));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Smoking Cessation</h1>
        <p className="text-slate-600 text-sm mt-1">
          Based on Tonstad S. &ldquo;Smoking cessation: how to advise the patient&rdquo;,
          Heart 2009;95:1635-1640 — the 5 A&rsquo;s framework endorsed by the European
          Society of Cardiology.
        </p>
      </div>

      <Card title="A quick note on why this matters">
        <p className="text-sm text-slate-700">
          Smoking cessation reduces the risk of recurrence and premature death by
          roughly 50% in patients with cardiovascular disease — larger than the effect
          of most single medications. Yet only about a third to a half of smokers who
          have a heart attack manage to quit.
        </p>
      </Card>

      <Card title="Assess your dependence">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              How many cigarettes do you smoke per day?
            </label>
            <input
              type="number"
              required
              min={0}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.cigarettesPerDay}
              onChange={(e) => setForm({ ...form, cigarettesPerDay: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              How long after waking do you smoke your first cigarette? (minutes)
            </label>
            <input
              type="number"
              required
              min={0}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.minutesToFirstCigarette}
              onChange={(e) =>
                setForm({ ...form, minutesToFirstCigarette: e.target.value })
              }
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.hasCVD}
              onChange={(e) => setForm({ ...form, hasCVD: e.target.checked })}
            />
            I have known cardiovascular disease
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.readyToQuitWithin30Days}
              onChange={(e) =>
                setForm({ ...form, readyToQuitWithin30Days: e.target.checked })
              }
            />
            I&apos;m willing to try quitting within the next 30 days
          </label>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Previous quit attempts
            </label>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.previousQuitAttempts}
              onChange={(e) =>
                setForm({ ...form, previousQuitAttempts: e.target.value })
              }
            />
            <p className="text-xs text-slate-500 mt-1">
              Multiple quit attempts predict eventual success — don&rsquo;t be
              discouraged by past relapses.
            </p>
          </div>
          <button
            type="submit"
            className="bg-rose-600 text-white px-4 py-2 rounded-md font-medium hover:bg-rose-700"
          >
            Get my quit plan
          </button>
        </form>
      </Card>

      {result && (
        <Card
          title={`Dependence level: ${result.dependenceLevel}`}
          tone={
            result.dependenceLevel === "high"
              ? "danger"
              : result.dependenceLevel === "moderate"
              ? "warning"
              : "success"
          }
        >
          <p className="text-sm text-slate-700 mb-3">{result.message}</p>

          {result.pharmacotherapyRecommended && (
            <div className="mb-3">
              <strong className="text-sm text-slate-800">
                Pharmacotherapy options to discuss with your doctor:
              </strong>
              <ul className="list-disc list-inside text-sm text-slate-700 mt-1 space-y-1">
                {result.recommendedClasses.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <strong className="text-sm text-slate-800">Your 5 A&rsquo;s quit plan:</strong>
            <div className="mt-2 space-y-2">
              {result.fiveAs.map((step) => (
                <div key={step.step} className="flex gap-3 text-sm">
                  <span className="font-semibold text-rose-600 w-16 shrink-0">
                    {step.step}
                  </span>
                  <span className="text-slate-700">{step.action}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      <Card title="What to expect">
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
          <li>Withdrawal symptoms peak in the first week and settle by 2–4 weeks.</li>
          <li>Craving can last longer but gradually becomes less intense.</li>
          <li>
            Typical weight gain after quitting is modest (about 3–8 kg) — far
            outweighed by the cardiovascular benefit of stopping.
          </li>
          <li>
            Most people who quit relapse at least once — this is normal, and each
            attempt improves the odds of long-term success.
          </li>
          <li>
            If irritability, low mood, or suicidal thoughts occur on medication,
            contact your doctor immediately.
          </li>
        </ul>
      </Card>

      <Disclaimer />
    </div>
  );
}
