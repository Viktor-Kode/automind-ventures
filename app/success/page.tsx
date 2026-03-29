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
  technicianSpecialization?: string | null;
  receiptUrl?: string | null;
}

export default function SuccessPage() {
  const router = useRouter();
  const [payload, setPayload] = useState<WhatsAppPayload | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [whatsappNotice, setWhatsappNotice] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const userString = window.sessionStorage.getItem("automind:user");
    const formString = window.sessionStorage.getItem("automind:form");
    if (!userString) return;

    try {
      const user = JSON.parse(userString) as StoredUser;
      const form: StoredForm = formString ? JSON.parse(formString) : {};

      setUserId(user.userId);
      setPayload({
        fullName: user.fullName,
        role: user.role,
        contactNumber: user.contactNumber,
        whatsappNumber: user.whatsappNumber,
        location: user.location,
        vehicleMake: form.vehicleMake ?? null,
        vehicleModel: form.vehicleModel ?? null,
        vehicleYear: form.vehicleYear ?? null,
        technicianSpecialization: form.technicianSpecialization ?? null,
        receiptUrl: form.receiptUrl ?? null
      });
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleWhatsApp = async () => {
    if (!payload) return;
    const origin =
      typeof window !== "undefined" ? window.location.origin : siteUrl;
    setWhatsappNotice(null);

    let effective: WhatsAppPayload = payload;
    const receipt = payload.receiptUrl;

    if (
      receipt?.startsWith("data:image/") &&
      userId &&
      typeof window !== "undefined"
    ) {
      setWhatsappLoading(true);
      try {
        const comma = receipt.indexOf(",");
        const meta = receipt.slice(0, comma);
        const base64 = receipt.slice(comma + 1);
        const mimeMatch = meta.match(/^data:(image\/[^;]+)/);
        const receiptMimeType = mimeMatch?.[1] || "image/jpeg";

        const res = await fetch("/api/receipt/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            receiptBase64: base64,
            receiptMimeType
          })
        });
        const data = (await res.json()) as { message?: string; url?: string };

        if (res.ok && typeof data.url === "string") {
          effective = { ...payload, receiptUrl: data.url };
          setPayload(effective);
          const formString = window.sessionStorage.getItem("automind:form");
          if (formString) {
            try {
              const form = JSON.parse(formString) as StoredForm;
              window.sessionStorage.setItem(
                "automind:form",
                JSON.stringify({ ...form, receiptUrl: data.url })
              );
            } catch {
              // ignore
            }
          }
        } else if (data.message) {
          setWhatsappNotice(data.message);
        }
      } catch {
        setWhatsappNotice(
          "Could not upload the receipt for a link. Your message will still open; attach the image in WhatsApp if needed."
        );
      } finally {
        setWhatsappLoading(false);
      }
    }

    openWhatsAppWithRegistration({
      payload: effective,
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
            Opens WhatsApp with your registration details. If your receipt is hosted
            online, the message includes a link so WhatsApp can show a preview (not an
            uploaded file).
          </p>
        </div>
        {whatsappNotice ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-left text-xs text-amber-900">
            {whatsappNotice}
          </p>
        ) : null}
        <Button
          onClick={handleWhatsApp}
          loading={whatsappLoading}
          disabled={!payload || whatsappLoading}
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
            ) : (
              <p>
                Specialization:{" "}
                {(payload.technicianSpecialization ?? "").trim() || "—"}
              </p>
            )}
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
                      If receipt hosting is not configured, attach this image manually in
                      WhatsApp after the chat opens.
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
