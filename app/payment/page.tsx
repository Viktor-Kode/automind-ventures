"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export default function PaymentPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [role, setRole] = useState<"owner" | "technician">("owner");
  const [userId, setUserId] = useState<string | null>(null);
  const [storedName, setStoredName] = useState<string>("");
  const [storedPhone, setStoredPhone] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const r = params.get("role");
    const id = params.get("userId");
    if (r === "technician" || r === "owner") setRole(r);
    if (id) setUserId(id);
  }, [params]);

  useEffect(() => {
    const loadScript = () => {
      const existing = document.getElementById("flutterwave-checkout-script");
      if (existing) return;
      const script = document.createElement("script");
      script.id = "flutterwave-checkout-script";
      script.src = "https://checkout.flutterwave.com/v3.js";
      script.async = true;
      document.body.appendChild(script);
    };

    loadScript();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const userString = window.sessionStorage.getItem("automind:user");
    if (!userString) return;
    try {
      const parsed = JSON.parse(userString) as {
        fullName?: string;
        contactNumber?: string;
      };
      setStoredName(parsed.fullName || "");
      setStoredPhone(parsed.contactNumber || "");
    } catch {
      // ignore
    }
  }, []);

  const amount = role === "owner" ? 5000 : 10000;

  const handlePay = async () => {
    if (!userId) {
      setError("We could not find your registration. Please start again.");
      return;
    }
    const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;
    if (!publicKey) {
      setError(
        "Flutterwave public key is missing. Add NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY to .env.local."
      );
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const txRef = `AUTOMIND-${role}-${userId}-${Date.now()}`;
      const redirectUrl = `${window.location.origin}/payment/callback`;
      const cleanedPhone = (storedPhone || "").replace(/\D/g, "");

      const flutterwaveCheckout = (window as any).FlutterwaveCheckout;
      if (typeof flutterwaveCheckout !== "function") {
        throw new Error("Flutterwave checkout script not loaded yet. Please try again.");
      }

      flutterwaveCheckout({
        public_key: publicKey,
        tx_ref: txRef,
        amount,
        currency: "NGN",
        redirect_url: redirectUrl,
        payment_options: "card, mobilemoney, ussd",
        customer: {
          email: "customer@example.com",
          phone_number: cleanedPhone || undefined,
          name: storedName || "AutoMind User"
        },
        customizations: {
          title: "AutoMind Ventures",
          description:
            role === "owner"
              ? "Vehicle Owner registration"
              : "Technician registration"
        },
        meta: {
          user_id: userId,
          role
        },
        onclose: () => {
          setLoading(false);
        }
      });
    } catch (err) {
      setLoading(false);
      setError("Payment failed. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Complete payment</h1>
          <p className="text-xs text-slate-500">
            Secure, one-time registration fee for your AutoMind access.
          </p>
        </div>
      </div>
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">
              {role === "owner" ? "Vehicle Owner" : "Technician"} registration
            </p>
            <p className="text-xs text-slate-500">
              Pay once to join the AutoMind network.
            </p>
          </div>
          <p className="text-lg font-semibold text-slate-900">
            ₦{amount.toLocaleString()}
          </p>
        </div>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}
        <Button onClick={handlePay} loading={loading} className="w-full">
          Pay Now
        </Button>
        <p className="text-[11px] text-slate-500">
          You will be redirected back to finish registration after payment.
        </p>
      </Card>
    </div>
  );
}

