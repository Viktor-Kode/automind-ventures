"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Landmark, User as UserIcon, Wallet, ArrowRight } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

type Role = "owner" | "technician";

interface StoredUser {
  userId: string;
  fullName: string;
  whatsappNumber: string;
  contactNumber: string;
  location: string;
  role: Role;
}

const BANK = {
  name: "FCMB",
  accountNumber: "7614830019",
  accountName: "TRUST AUTOMIND VENTURE"
} as const;

export default function PaymentDetailsPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.sessionStorage.getItem("automind:user");
    if (!raw) {
      router.replace("/register");
      return;
    }
    try {
      setUser(JSON.parse(raw) as StoredUser);
    } catch {
      router.replace("/register");
    }
  }, [router]);

  if (!user) {
    return (
      <div className="mx-auto max-w-md">
        <Card className="p-6">
          <p className="text-sm text-slate-600">Loading payment details...</p>
        </Card>
      </div>
    );
  }

  const amount = user.role === "owner" ? 10000 : 20000;
  const roleLabel = user.role === "owner" ? "Vehicle Owner" : "Technician";

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
          <Landmark className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Bank payment</h1>
          <p className="text-xs text-slate-500">
            Transfer the registration fee, then continue to upload your receipt.
          </p>
        </div>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
          <span className="text-xs font-medium text-slate-600">Your role</span>
          <span className="text-sm font-semibold text-slate-900">{roleLabel}</span>
        </div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-700">
            <Wallet className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-medium">Amount to pay</span>
          </div>
          <p className="text-lg font-semibold text-slate-900">
            ₦{amount.toLocaleString()}
          </p>
        </div>
        <dl className="space-y-3 text-sm">
          <div className="flex items-start justify-between gap-4">
            <dt className="flex items-center gap-2 text-slate-500">
              <Building2 className="h-4 w-4 shrink-0" />
              Bank name
            </dt>
            <dd className="text-right font-medium text-slate-900">{BANK.name}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="flex items-center gap-2 text-slate-500">
              <Landmark className="h-4 w-4 shrink-0" />
              Account number
            </dt>
            <dd className="font-mono text-right font-medium tracking-wide text-slate-900">
              {BANK.accountNumber}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="flex items-center gap-2 text-slate-500">
              <UserIcon className="h-4 w-4 shrink-0" />
              Account name
            </dt>
            <dd className="text-right font-medium text-slate-900">{BANK.accountName}</dd>
          </div>
        </dl>
        <div className="rounded-lg border border-amber-100 bg-amber-50/80 px-3 py-2 text-xs leading-relaxed text-amber-950">
          Make payment to the account above. After payment, tap &quot;I have paid&quot; to
          upload your receipt and finish registration.
        </div>
        <Button
          type="button"
          className="w-full"
          onClick={() => router.push("/form")}
        >
          <span>I have paid</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Card>
    </div>
  );
}
