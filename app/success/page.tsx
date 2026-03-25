"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { formatWhatsAppMessage, WhatsAppPayload } from "../../lib/utils/formatWhatsAppMessage";

interface StoredUser {
  userId: string;
  fullName: string;
  whatsappNumber: string;
  contactNumber: string;
  location: string;
  role: "owner" | "technician";
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
      const form = formString ? JSON.parse(formString) : {};

      if (user.role === "technician") {
        setPayload({
          fullName: form.technicianName || user.fullName,
          role: user.role,
          contactNumber: form.phoneNumber || user.contactNumber,
          whatsappNumber: user.whatsappNumber,
          location: form.location || user.location,
          businessName: form.businessName || null,
          specializedVehicle: form.specializedVehicle || null,
          vehicleMake: null,
          vehicleModel: null,
          vehicleYear: null
        });
        return;
      }

      setPayload({
        fullName: user.fullName,
        role: user.role,
        contactNumber: user.contactNumber,
        whatsappNumber: user.whatsappNumber,
        location: user.location,
        vehicleMake: form.vehicleMake || null,
        vehicleModel: form.vehicleModel || null,
        vehicleYear: form.vehicleYear || null
      });
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleWhatsApp = () => {
    if (!payload) return;
    const text = formatWhatsAppMessage(payload);
    const url = `https://wa.me/2348055906616?text=${text}`;
    window.open(url, "_blank");
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
            You are now ready to connect with AutoMind Ventures on WhatsApp.
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
          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-left text-xs text-slate-600">
            <p className="mb-1 font-semibold text-slate-700">Summary</p>
            <p>Name: {payload.fullName}</p>
            <p>Role: {payload.role === "owner" ? "Vehicle Owner" : "Technician"}</p>
            <p>WhatsApp: {payload.whatsappNumber}</p>
            <p>Contact: {payload.contactNumber}</p>
            <p>Location: {payload.location}</p>
            {payload.role === "technician" && (
              <>
                <p>Business: {payload.businessName || "N/A"}</p>
                <p>Specialized Vehicle: {payload.specializedVehicle || "N/A"}</p>
              </>
            )}
          </div>
        )}
      </Card>
      <button
        onClick={() => router.push("/")}
        className="mx-auto block text-xs font-medium text-slate-500 hover:text-primary-600"
      >
        Back to home
      </button>
    </div>
  );
}

