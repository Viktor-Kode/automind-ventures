import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ShieldAlert, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for Toyota/Lexus Gearbox Repair Training."
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-28 md:pb-16">
      <Link
        href="/apply"
        className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Application
      </Link>

      <div className="card space-y-6 p-6 sm:p-8 border-t-4 border-[#F5A623]">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <ShieldAlert className="w-8 h-8 text-[#F5A623]" />
          <h1 className="text-2xl sm:text-3xl font-black text-white">Terms & Conditions</h1>
        </div>

        <p className="text-white/70 text-sm leading-relaxed">
          Please read these terms carefully before applying for the Toyota/Lexus Gearbox Repair Training. By applying and participating, you agree to comply with the rules and regulations stated below.
        </p>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">1. Intellectual Property & Confidentiality</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            All training materials, including but not limited to videos, handouts, checklists, and guides, are confidential and protected by intellectual property laws.
          </p>
          <ul className="list-disc pl-5 text-white/60 text-sm space-y-2">
            <li><strong>No Sharing or Forwarding:</strong> You are strictly prohibited from sharing, forwarding, or sending training videos or materials to anyone else.</li>
            <li><strong>No Recording:</strong> You must not screen record, photograph, or duplicate any parts of the training materials.</li>
            <li><strong>No Reposting:</strong> You are not permitted to repost training content or videos on social media platforms or public forums.</li>
          </ul>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 space-y-2">
          <h3 className="text-red-400 font-bold text-sm">2. Violations and Penalties</h3>
          <p className="text-white/70 text-sm leading-relaxed">
            Any violation of the confidentiality terms listed above will lead to immediate expulsion from the training without refund, revocation of certificate, and a legal penalty of <strong>₦200,000</strong>.
          </p>
        </div>

        <div className="border-t border-white/10 pt-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          <p className="text-white/50 text-xs leading-relaxed">
            These terms represent a legally binding agreement between you and AutoMind Ventures. Legal action will be pursued to enforce copyright laws and protect our proprietary training methodologies.
          </p>
        </div>
      </div>
    </div>
  );
}
