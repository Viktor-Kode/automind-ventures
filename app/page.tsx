import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  MapPin,
  ChevronRight,
  Wrench,
  Award,
  Clock
} from "lucide-react";

export const metadata: Metadata = {
  title: "Toyota/Lexus Gearbox Repair Training — 2 Days Hands-On",
  description:
    "Join Nigeria's premier Toyota/Lexus automatic gearbox repair training. 2 days hands-on. Get certified."
};

const TRAINING_LOCATION = process.env.NEXT_PUBLIC_TRAINING_LOCATION ?? "TBD";

const LEARN_POINTS = [
  "How automatic gearboxes work — components, fluid circuits, and failure modes",
  "Disassembly, inspection, and rebuild of Toyota/Lexus U660E & A750E units",
  "Fault diagnosis using live data scanning and pressure testing",
  "Solenoid, valve body, and torque converter servicing",
  "Workshop safety, documentation, and customer pricing strategies"
];

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111827] via-[#0A0F1E] to-[#0A0F1E] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#F5A623]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-full px-4 py-1.5 mb-6">
            <Wrench className="w-3.5 h-3.5 text-[#F5A623]" />
            <span className="text-[#F5A623] text-sm font-semibold">Professional Certification Training</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-4 max-w-4xl mx-auto">
            Toyota/Lexus Gearbox Repair Training
            <br />
            <span className="text-[#F5A623]">2 Days. Hands-On. Certified.</span>
          </h1>

          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            Nigeria&apos;s most practical automatic transmission training — rebuild real gearboxes,
            diagnose faults, and leave with a recognized certification.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link
              href="/apply"
              id="hero-apply-btn"
              className="btn-primary flex items-center gap-2 px-8 py-4 text-lg w-full sm:w-auto"
            >
              Apply Now
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Hero image placeholder */}
          <div className="relative mx-auto max-w-3xl aspect-[16/7] bg-gradient-to-br from-[#1a2235] to-[#243047] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
            <div className="text-center">
              <Wrench className="w-16 h-16 text-[#F5A623]/30 mx-auto mb-3" />
              <p className="text-white/20 text-sm">Replace with hero.jpg in /public/images/</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRAINING INFO BAR ===== */}
      <section className="bg-[#111827] border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm">
            <div className="flex items-center gap-2 text-white/70">
              <MapPin className="w-4 h-4 text-[#F5A623]" />
              <span className="font-medium">{TRAINING_LOCATION}</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2 text-white/70">
              <Clock className="w-4 h-4 text-[#F5A623]" />
              <span className="font-medium">2 Days Intensive</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT YOU'LL LEARN ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="section-title mb-3">What You&apos;ll Learn</h2>
          <p className="text-white/50 max-w-xl mx-auto">
            A structured 2-day curriculum covering everything from theory to workshop-ready practice.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {LEARN_POINTS.map((point, i) => (
            <div
              key={i}
              className="flex items-start gap-3 card hover:border-[#F5A623]/30 transition-colors"
            >
              <div className="w-7 h-7 bg-[#F5A623]/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#F5A623]" />
              </div>
              <p className="text-white/80 text-sm leading-relaxed">{point}</p>
            </div>
          ))}

          {/* Certification callout */}
          <div className="flex items-start gap-3 card bg-[#F5A623]/5 border-[#F5A623]/30">
            <div className="w-7 h-7 bg-[#F5A623] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <Award className="w-4 h-4 text-[#0A0F1E]" />
            </div>
            <div>
              <p className="text-[#F5A623] font-bold text-sm">Certified Completion</p>
              <p className="text-white/60 text-sm leading-relaxed mt-0.5">
                Receive a recognized certificate on Day 2 that validates your gearbox repair skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="bg-gradient-to-r from-[#F5A623]/20 via-[#F5A623]/10 to-[#F5A623]/20 border-y border-[#F5A623]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            Ready to Start?
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Don&apos;t miss this training cycle. Applications close soon.
          </p>
          <Link
            href="/apply"
            id="final-apply-btn"
            className="btn-primary inline-flex items-center gap-2 px-10 py-4 text-lg"
          >
            Apply Now
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ===== STICKY MOBILE CTA ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0A0F1E]/95 backdrop-blur-sm border-t border-white/10 px-4 py-3">
        <Link
          href="/apply"
          id="sticky-mobile-apply-btn"
          className="btn-primary w-full text-center py-3.5 text-base flex items-center justify-center gap-2"
        >
          Apply Now →
        </Link>
      </div>
    </>
  );
}
