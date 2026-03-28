"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, MessageCircle, Receipt } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { type WhatsAppPayload } from "../../lib/utils/formatWhatsAppMessage";
import { openWhatsAppWithRegistration } from "../../lib/utils/shareToWhatsApp";
import { siteUrl, whatsappBusinessNumber } from "../../lib/config/public";

interface StoredUser {
  userId: string;
  fullName: string;
  whatsappNumber: string;
  contactNumber: string;
  location: string;
  role: "owner" | "technician";
}

interface StoredForm {
  vehicleMake?: string | null;
  vehicleModel?: string | null;
  vehicleYear?: number | null;
  receiptUrl?: string | null;
}

export default function SuccessPage() {
  const router = useRouter();
  const [payload, setPayload] = useState<WhatsAppPayload | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const userString = window.sessionStorage.getItem("automind:user");
    const formString = window.sessionStorage.getItem("automind:form");
    if (!userString) return;

    try {
      const user = JSON.parse(userString) as StoredUser;
      const form: StoredForm = formString ? JSON.parse(formString) : {};

      setPayload({
        fullName: user.fullName,
        role: user.role,
        contactNumber: user.contactNumber,
        whatsappNumber: user.whatsappNumber,
        location: user.location,
        vehicleMake: form.vehicleMake ?? null,
        vehicleModel: form.vehicleModel ?? null,
        vehicleYear: form.vehicleYear ?? null,
        receiptUrl: form.receiptUrl ?? null
      });
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleWhatsApp = () => {
    if (!payload) return;
    const origin =
      typeof window !== "undefined" ? window.location.origin : siteUrl;
    openWhatsAppWithRegistration({
      payload,
      origin,
      whatsappNumber: whatsappBusinessNumber
    });
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <Card className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-slate-900">
            Registration complete
          </h1>
          <p className="text-sm text-slate-500">
            Opens WhatsApp with your details ready to send. If you have a receipt image, attach
            it in the chat after it opens.
          </p>
        </div>
        <Button
          onClick={handleWhatsApp}
          className="mt-2 inline-flex w-full items-center justify-center space-x-2"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Chat on WhatsApp</span>
        </Button>
        {payload && (
          <div className="mt-4 space-y-2 rounded-lg bg-slate-50 p-3 text-left text-xs text-slate-600">
            <p className="font-semibold text-slate-700">Summary</p>
            <p>Name: {payload.fullName}</p>
            <p>Role: {payload.role === "owner" ? "Vehicle Owner" : "Technician"}</p>
            <p>WhatsApp: {payload.whatsappNumber}</p>
            <p>Phone: {payload.contactNumber}</p>
            <p>Location: {payload.location}</p>
            {payload.role === "owner" ? (
              <>
                <p>Vehicle: {payload.vehicleMake || "—"} {payload.vehicleModel || ""}</p>
                <p>Year: {payload.vehicleYear ?? "—"}</p>
              </>
            ) : null}
            {payload.receiptUrl && (
              <div className="space-y-2 pt-1">
                <p className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Receipt className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  Receipt
                </p>
                {payload.receiptUrl.startsWith("data:image/") ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={payload.receiptUrl}
                      alt="Payment receipt"
                      className="mx-auto max-h-40 rounded border border-slate-200 object-contain"
                    />
                    <p className="text-[11px] text-slate-500">
                      Use this preview if you need to attach the screenshot again in WhatsApp.
                    </p>
                  </>
                ) : (
                  <p className="break-all text-[11px]">
                    {payload.receiptUrl.startsWith("http")
                      ? payload.receiptUrl
                      : `${typeof window !== "undefined" ? window.location.origin : ""}${payload.receiptUrl}`}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Card>
      <button
        type="button"
        onClick={() => router.push("/")}
        className="mx-auto block text-xs font-medium text-slate-500 hover:text-primary-600"
      >
        Back to home
      </button>
    </div>
  );
}
