import { ReactNode } from "react";

export default function Card({
  title,
  children,
  tone = "default",
}: {
  title?: string;
  children: ReactNode;
  tone?: "default" | "warning" | "success" | "danger";
}) {
  const toneClasses: Record<string, string> = {
    default: "border-slate-200 bg-white",
    warning: "border-amber-300 bg-amber-50",
    success: "border-emerald-300 bg-emerald-50",
    danger: "border-rose-300 bg-rose-50",
  };
  return (
    <div className={`rounded-xl border p-5 shadow-sm ${toneClasses[tone]}`}>
      {title && <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>}
      {children}
    </div>
  );
}
