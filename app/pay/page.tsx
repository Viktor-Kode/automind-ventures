import type { Metadata } from "next";
import { Suspense } from "react";
import PayPageClient from "./PayPageClient";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Complete Payment",
  description:
    "Pay your ₦2,000 application fee and upload your receipt to secure your GearboxTraining slot."
};

export default function PayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#F5A623] animate-spin" />
        </div>
      }
    >
      <PayPageClient />
    </Suspense>
  );
}
