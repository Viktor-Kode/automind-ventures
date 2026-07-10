import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111827] border-t border-white/10 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#F5A623] rounded-lg flex items-center justify-center">
                <Wrench className="w-3.5 h-3.5 text-[#0A0F1E]" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-white">
                Automind<span className="text-[#F5A623]">ventures</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm text-center md:text-left max-w-xs">
              Professional Toyota/Lexus gearbox repair training. 2 days
              hands-on. Certified.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex items-center gap-5">
              <Link
                href="/apply"
                className="text-white/60 hover:text-[#F5A623] text-sm transition-colors"
              >
                Apply Now
              </Link>
              <Link
                href="/terms"
                className="text-white/60 hover:text-[#F5A623] text-sm transition-colors"
              >
                Terms & Conditions
              </Link>
            </div>
            <p className="text-white/30 text-xs">
              © {year} GearboxTraining. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
