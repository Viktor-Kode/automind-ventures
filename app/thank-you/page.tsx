import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Your application has been received successfully."
};

interface ThankYouProps {
  searchParams: Promise<{
    ref?: string;
    name?: string;
  }>;
}

export default async function ThankYouPage({ searchParams }: ThankYouProps) {
  const resolvedParams = await searchParams;
  const ref = resolvedParams.ref ?? "GBT-000";
  const name = resolvedParams.name ?? "Applicant";

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center">
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-400" />
      </div>
      
      <h1 className="text-3xl font-black text-white mb-3">Application Received!</h1>
      <p className="text-white/70 mb-2">
        Thank you, <span className="text-[#F5A623] font-bold">{name}</span>. Your application was successfully submitted.
      </p>
      
      <div className="bg-[#111827] border border-white/10 rounded-xl p-4 my-6">
        <p className="text-white/40 text-xs uppercase tracking-wider font-semibold">Your Reference Code</p>
        <p className="text-2xl font-black text-[#F5A623] font-mono mt-1">{ref}</p>
      </div>

      <p className="text-white/60 text-sm mb-8 leading-relaxed">
        We have saved your details to our system. We will contact you via WhatsApp to finalize your coordination details.
      </p>

      <div className="flex flex-col gap-3 justify-center">
        <Link
          href="/"
          className="btn-primary inline-flex items-center justify-center py-4 px-6 text-base font-bold"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
