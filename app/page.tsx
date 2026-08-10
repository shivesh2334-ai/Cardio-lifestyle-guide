import Link from "next/link";
import Card from "@/components/Card";
import Disclaimer from "@/components/Disclaimer";

const modules = [
  {
    href: "/physical-activity",
    icon: "🏃",
    title: "Physical Activity",
    desc: "Get a personalised activity plan and see whether medical clearance is advised before you start.",
  },
  {
    href: "/heart-rate",
    icon: "💓",
    title: "Target Exercise Heart Rate",
    desc: "Calculate your training heart-rate zone using the heart-rate-reserve (Karvonen) method.",
  },
  {
    href: "/sexual-health",
    icon: "💗",
    title: "Sexual Health & Heart Disease",
    desc: "A confidential risk assessment based on the AHA Scientific Statement on sexual activity and CVD.",
  },
  {
    href: "/smoking-cessation",
    icon: "🚭",
    title: "Smoking Cessation",
    desc: "Assess dependence and get a 5 A's quit plan with pharmacotherapy options.",
  },
  {
    href: "/diet",
    icon: "🥗",
    title: "Diet & Nutrition",
    desc: "Score your eating pattern against the AHA's heart-healthy dietary features.",
  },
];

export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Cardiovascular Lifestyle Advisor
        </h1>
        <p className="text-slate-600 max-w-2xl">
          Evidence-based, guideline-informed tools covering exercise, heart-rate
          training zones, sexual health, smoking cessation, and diet — built for
          patients recovering from or living with cardiovascular disease.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {modules.map((m) => (
          <Link key={m.href} href={m.href}>
            <Card>
              <div className="flex items-start gap-3">
                <span className="text-3xl">{m.icon}</span>
                <div>
                  <h2 className="font-semibold text-slate-800">{m.title}</h2>
                  <p className="text-sm text-slate-600 mt-1">{m.desc}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Disclaimer />
    </div>
  );
}
