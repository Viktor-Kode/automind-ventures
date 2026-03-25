import Link from "next/link";
import { ArrowRight, ShieldCheck, Wrench, MessageCircle } from "lucide-react";
import { Card } from "../components/ui/Card";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
            <ShieldCheck className="h-4 w-4" />
            <span>Trusted WhatsApp-based auto support</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Connect with verified automobile experts via WhatsApp.
          </h1>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            AutoMind Ventures links vehicle owners with experienced technicians
            through a simple, paid WhatsApp channel. Register once and get
            quick, reliable help when you need it most.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center space-x-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <MessageCircle className="h-4 w-4" />
              <span>No groups. Direct expert conversations only.</span>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  For Vehicle Owners
                </p>
                <p className="text-xs text-slate-500">
                  Get help diagnosing issues, estimating repairs, and choosing the
                  right service.
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  For Technicians
                </p>
                <p className="text-xs text-slate-500">
                  Join a curated pool of professionals and get matched with real
                  vehicle owners.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

