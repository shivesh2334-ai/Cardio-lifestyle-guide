import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Cardio Lifestyle Advisor",
  description:
    "Guideline-informed advice on physical activity, target heart rate, sexual health, smoking cessation, and diet for cardiovascular wellbeing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-slate-50 min-h-screen">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="text-center text-xs text-slate-400 py-8">
          Built for clinician-guided patient education • EMC Digitals
        </footer>
      </body>
    </html>
  );
}
