import Link from "next/link";
import { Car, MessageCircle } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Car className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">
              AutoMind Ventures
            </p>
            <p className="text-xs text-slate-500">
              Smart auto support via WhatsApp
            </p>
          </div>
        </Link>
        <a
          href="https://wa.me/2348055906616"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center space-x-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-primary-400 hover:text-primary-700"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Contact support</span>
        </a>
      </div>
    </header>
  );
}

