import type { Metadata } from "next";
import ApplyForm from "../../components/ApplyForm";
import { ChevronLeft, Shield, Clock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Apply for Training",
  description:
    "Apply for the Toyota/Lexus Gearbox Repair Training. Fill in your details to get started."
};

export default function ApplyPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 pb-28 md:pb-10">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="grid md:grid-cols-5 gap-8 items-start">
        {/* Left — Form */}
        <div className="md:col-span-3">
          <div className="mb-7">
            <h1 className="text-3xl font-black text-white mb-2">
              Apply for Training
            </h1>
            <p className="text-white/50">
              Complete the form below to apply for the professional automatic gearbox training.
            </p>
          </div>

          <div className="card">
            <ApplyForm />
          </div>
        </div>

        {/* Right — Info sidebar */}
        <aside className="md:col-span-2 space-y-4">
          {/* Process */}
          <div className="card">
            <h2 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              How It Works
            </h2>
            <ol className="space-y-4">
              {[
                { step: "1", title: "Fill Application", desc: "Takes about 2 minutes." },
                {
                  step: "2",
                  title: "Review Details",
                  desc: "We will contact you on WhatsApp to discuss your background."
                },
                {
                  step: "3",
                  title: "Attend Training",
                  desc: `2 days hands-on. Leave certified.`
                }
              ].map((item) => (
                <li key={item.step} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F5A623] text-[#0A0F1E] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{item.title}</p>
                    <p className="text-white/50 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Guarantees */}
          <div className="card space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
              <p className="text-white/60 text-sm">
                Your data is kept private and only used for training coordination.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
              <p className="text-white/60 text-sm">
                Training schedules and locations will be shared directly with you.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
