"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, CreditCard, RefreshCcw } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

type PaymentVerifyResponse = {
  success: boolean;
  role: "owner" | "technician";
  userId: string;
};

function PaymentCallbackPageInner() {
  const router = useRouter();
  const params = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params) {
      setError("Missing payment details. Please try again.");
      setLoading(false);
      return;
    }

    const status = params.get("status");
    const txRef = params.get("tx_ref");

    const run = async () => {
      if (!txRef) {
        setError("Missing payment reference. Please try again.");
        setLoading(false);
        return;
      }

      // Flutterwave sometimes provides status=cancelled for user abort.
      if (status && status !== "successful") {
        setError("Payment was cancelled or not completed. Please try again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tx_ref: txRef })
        });

        const data = (await res.json()) as Partial<PaymentVerifyResponse> & {
          message?: string;
        };

        if (!res.ok || !data.success || !data.role || !data.userId) {
          throw new Error(data.message || "Payment verification failed.");
        }

        router.replace(`/form?role=${data.role}&userId=${data.userId}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Payment verification failed.");
        setLoading(false);
      }
    };

    run();
  }, [params, router]);

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Verifying payment
          </h1>
          <p className="text-xs text-slate-500">
            Please wait a moment while we confirm your transaction.
          </p>
        </div>
      </div>

      <Card className="space-y-4 text-center">
        {loading ? (
          <p className="text-sm text-slate-600">Checking transaction status...</p>
        ) : error ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-red-700">{error}</p>
            <Button
              onClick={() => router.push("/payment")}
              loading={false}
              className="inline-flex w-full items-center justify-center space-x-2"
            >
              <RefreshCcw className="h-4 w-4" />
              <span>Retry payment</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
            <p className="text-sm text-slate-600">
              Payment verified. Redirecting...
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md space-y-6">
          <Card className="space-y-4 p-6 text-center">
            <p className="text-sm text-slate-600">
              Verifying payment...
            </p>
          </Card>
        </div>
      }
    >
      <PaymentCallbackPageInner />
    </Suspense>
  );
}

