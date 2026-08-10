"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/physical-activity", label: "Physical Activity" },
  { href: "/heart-rate", label: "Target Heart Rate" },
  { href: "/sexual-health", label: "Sexual Health" },
  { href: "/smoking-cessation", label: "Smoking Cessation" },
  { href: "/diet", label: "Diet" },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">❤️</span>
          <span className="font-semibold text-slate-800">Cardio Lifestyle Advisor</span>
        </Link>
        <nav className="flex flex-wrap gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                pathname === l.href
                  ? "bg-rose-600 text-white"
                  : "text-slate-600 hover:bg-rose-50 hover:text-rose-700"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
