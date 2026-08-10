"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Disclaimer from "@/components/Disclaimer";
import { assessSexualHealth, SexualHealthProfile, SexualHealthResult } from "@/lib/calculations";

const toneForTier: Record<string, "success" | "warning" | "danger"> = {
  low: "success",
  intermediate: "warning",
  high: "danger",
  defer: "danger",
};

export default function SexualHealthPage() {
  const [form, setForm] = useState({
    unstableOrDecompensated: false,
    hadMI: false,
    recentMIWeeks: "",
    hadCABG: false,
    recentCABGWeeks: "",
    hadPCI: false,
    recentPCIDays: "",
    nyhaClass: "",
    anginaClass: "",
    canExercise3to5METs: "",
    hasSevereValveDisease: false,
    hasUncontrolledArrhythmia: false,
    hasICDMultipleShocks: false,
    onNitrates: false,
    wantsPDE5Inhibitor: false,
  });
  const [result, setResult] = useState<SexualHealthResult | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const profile: SexualHealthProfile = {
      unstableOrDecompensated: form.unstableOrDecompensated,
      recentMIWeeks: form.hadMI && form.recentMIWeeks !== "" ? Number(form.recentMIWeeks) : null,
      recentCABGWeeks:
        form.hadCABG && form.recentCABGWeeks !== "" ? Number(form.recentCABGWeeks) : null,
      recentPCIDays: form.hadPCI && form.recentPCIDays !== "" ? Number(form.recentPCIDays) : null,
      nyhaClass: form.nyhaClass ? (Number(form.nyhaClass) as 1 | 2 | 3 | 4) : null,
      anginaClass: form.anginaClass ? (Number(form.anginaClass) as 1 | 2 | 3 | 4) : null,
      canExercise3to5METs:
        form.canExercise3to5METs === "" ? null : form.canExercise3to5METs === "yes",
      hasSevereValveDisease: form.hasSevereValveDisease,
      hasUncontrolledArrhythmia: form.hasUncontrolledArrhythmia,
      hasICDMultipleShocks: form.hasICDMultipleShocks,
      onNitrates: form.onNitrates,
      wantsPDE5Inhibitor: form.wantsPDE5Inhibitor,
    };
    setResult(assessSexualHealth(profile));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Sexual Health &amp; Heart Disease
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Based on Levine GN et al. &ldquo;Sexual Activity and Cardiovascular Disease: A
          Scientific Statement From the American Heart Association&rdquo;, Circulation
          2012;125:1058-1072. This is a private, confidential self-assessment.
        </p>
      </div>

      <Card title="Context: sexual activity and cardiac workload">
        <p className="text-sm text-slate-700">
          Sexual activity with a usual partner is comparable to mild-to-moderate
          physical activity (about 3–5 METs — similar to climbing two flights of
          stairs or brisk walking) for a short duration. If a patient can achieve 3–5
          METs on exercise testing without angina, ischaemic ECG changes, excessive
          breathlessness, low blood pressure, or arrhythmia, the risk of a cardiac
          event during sexual activity is low.
        </p>
      </Card>

      <Card title="Your assessment">
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.unstableOrDecompensated}
              onChange={(e) =>
                setForm({ ...form, unstableOrDecompensated: e.target.checked })
              }
            />
            I currently have unstable angina, decompensated heart failure, an
            uncontrolled arrhythmia, or severe symptomatic valve disease
          </label>

          <div className="border-t pt-4">
            <label className="flex items-center gap-2 text-sm mb-2">
              <input
                type="checkbox"
                checked={form.hadMI}
                onChange={(e) => setForm({ ...form, hadMI: e.target.checked })}
              />
              I have had a heart attack (MI)
            </label>
            {form.hadMI && (
              <input
                type="number"
                min={0}
                placeholder="Weeks since MI"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={form.recentMIWeeks}
                onChange={(e) => setForm({ ...form, recentMIWeeks: e.target.value })}
              />
            )}
          </div>

          <div className="border-t pt-4">
            <label className="flex items-center gap-2 text-sm mb-2">
              <input
                type="checkbox"
                checked={form.hadCABG}
                onChange={(e) => setForm({ ...form, hadCABG: e.target.checked })}
              />
              I have had open-heart surgery (CABG / valve surgery)
            </label>
            {form.hadCABG && (
              <input
                type="number"
                min={0}
                placeholder="Weeks since surgery"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={form.recentCABGWeeks}
                onChange={(e) => setForm({ ...form, recentCABGWeeks: e.target.value })}
              />
            )}
          </div>

          <div className="border-t pt-4">
            <label className="flex items-center gap-2 text-sm mb-2">
              <input
                type="checkbox"
                checked={form.hadPCI}
                onChange={(e) => setForm({ ...form, hadPCI: e.target.checked })}
              />
              I have had a coronary stent (PCI)
            </label>
            {form.hadPCI && (
              <input
                type="number"
                min={0}
                placeholder="Days since PCI"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={form.recentPCIDays}
                onChange={(e) => setForm({ ...form, recentPCIDays: e.target.value })}
              />
            )}
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Heart failure symptom class (NYHA), if applicable
            </label>
            <select
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={form.nyhaClass}
              onChange={(e) => setForm({ ...form, nyhaClass: e.target.value })}
            >
              <option value="">Not applicable / no heart failure</option>
              <option value="1">Class I — no symptom limitation</option>
              <option value="2">Class II — mild limitation</option>
              <option value="3">Class III — marked limitation</option>
              <option value="4">Class IV — symptoms at rest</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Angina class (CCS), if applicable
            </label>
            <select
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={form.anginaClass}
              onChange={(e) => setForm({ ...form, anginaClass: e.target.value })}
            >
              <option value="">Not applicable / no angina</option>
              <option value="1">Class I — angina only with strenuous exertion</option>
              <option value="2">Class II — slight limitation of ordinary activity</option>
              <option value="3">Class III — marked limitation of ordinary activity</option>
              <option value="4">Class IV — unable to do any activity without angina</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Can you exercise to 3–5 METs (e.g. brisk walk, climb 2 flights of stairs)
              without chest pain, breathlessness, dizziness, or palpitations?
            </label>
            <select
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={form.canExercise3to5METs}
              onChange={(e) => setForm({ ...form, canExercise3to5METs: e.target.value })}
            >
              <option value="">Not sure</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="border-t pt-4 space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.hasSevereValveDisease}
                onChange={(e) =>
                  setForm({ ...form, hasSevereValveDisease: e.target.checked })
                }
              />
              I have severe or significantly symptomatic valve disease
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.hasUncontrolledArrhythmia}
                onChange={(e) =>
                  setForm({ ...form, hasUncontrolledArrhythmia: e.target.checked })
                }
              />
              I have a poorly controlled or symptomatic arrhythmia
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.hasICDMultipleShocks}
                onChange={(e) =>
                  setForm({ ...form, hasICDMultipleShocks: e.target.checked })
                }
              />
              I have an ICD and have received multiple shocks recently
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.onNitrates}
                onChange={(e) => setForm({ ...form, onNitrates: e.target.checked })}
              />
              I currently take nitrate medication
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.wantsPDE5Inhibitor}
                onChange={(e) =>
                  setForm({ ...form, wantsPDE5Inhibitor: e.target.checked })
                }
              />
              I&apos;m interested in medication for erectile dysfunction (PDE5 inhibitors)
            </label>
          </div>

          <button
            type="submit"
            className="bg-rose-600 text-white px-4 py-2 rounded-md font-medium hover:bg-rose-700"
          >
            Get my assessment
          </button>
        </form>
      </Card>

      {result && (
        <Card
          title={`Assessment: ${result.tier === "defer" ? "Defer sexual activity" : result.tier + " risk"}`}
          tone={toneForTier[result.tier]}
        >
          <p className="text-sm font-medium text-slate-800 mb-3">{result.summary}</p>
          {result.cautions.length > 0 && (
            <div className="mb-3">
              <strong className="text-sm text-rose-800">Important cautions:</strong>
              <ul className="list-disc list-inside text-sm text-rose-800 mt-1 space-y-1">
                {result.cautions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <strong className="text-sm text-slate-800">Recommendations:</strong>
            <ul className="list-disc list-inside text-sm text-slate-700 mt-1 space-y-1">
              {result.recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      <Card title="Talking with your doctor">
        <p className="text-sm text-slate-700">
          Anxiety about resuming sexual activity is very common after a cardiac event
          and is rarely discussed unless the patient or partner raises it. Studies show
          most patients want more information than they receive. It is entirely
          appropriate — and encouraged — to raise this topic directly with your
          cardiologist.
        </p>
      </Card>

      <Disclaimer />
    </div>
  );
}
