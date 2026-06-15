"use client";

import { useState } from "react";
import { Copy, Check, Building2, CreditCard, Hash, DollarSign } from "lucide-react";

interface PaymentCardProps {
  refCode: string;
}

export default function PaymentCard({ refCode }: PaymentCardProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const bankName = process.env.NEXT_PUBLIC_BANK_NAME ?? "—";
  const bankAccount = process.env.NEXT_PUBLIC_BANK_ACCOUNT ?? "—";
  const accountNumber = process.env.NEXT_PUBLIC_ACCOUNT_NUMBER ?? "—";

  const details = [
    { label: "Bank", value: bankName, icon: Building2, copyable: false },
    { label: "Account Name", value: bankAccount, icon: CreditCard, copyable: false },
    { label: "Account Number", value: accountNumber, icon: Hash, copyable: true },
    { label: "Amount", value: "₦2,000", icon: DollarSign, copyable: false },
    { label: "Narration", value: refCode, icon: Hash, copyable: true }
  ];

  const handleCopy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="card border border-[#F5A623]/30 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#F5A623]/10 border-b border-[#F5A623]/20 px-5 py-3">
        <p className="text-[#F5A623] font-bold text-sm uppercase tracking-wider">
          Bank Transfer Details
        </p>
        <p className="text-white/50 text-xs mt-0.5">
          Transfer exactly ₦2,000 — Application Fee
        </p>
      </div>

      {/* Details */}
      <div className="divide-y divide-white/5">
        {details.map((detail) => {
          const Icon = detail.icon;
          const isCopied = copied === detail.label;

          return (
            <div
              key={detail.label}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-white/2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-white/40 shrink-0" />
                <div>
                  <p className="text-white/50 text-xs">{detail.label}</p>
                  <p className="text-white font-semibold text-sm">{detail.value}</p>
                </div>
              </div>

              {detail.copyable && (
                <button
                  onClick={() => handleCopy(detail.value, detail.label)}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border transition-all duration-200 ${
                    isCopied
                      ? "border-green-500/40 text-green-400 bg-green-500/10"
                      : "border-white/20 text-white/50 hover:border-[#F5A623] hover:text-[#F5A623]"
                  }`}
                  title={`Copy ${detail.label}`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Alert */}
      <div className="bg-amber-500/5 border-t border-[#F5A623]/20 px-5 py-3">
        <p className="text-[#F5A623] text-xs font-medium">
          ⚠️ Use your reference code <strong>{refCode}</strong> as the transfer narration so we can identify your payment.
        </p>
      </div>
    </div>
  );
}
