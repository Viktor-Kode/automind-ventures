"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { FileUpload } from "../ui/FileUpload";
import { uploadReceipt } from "../../lib/upload/uploadReceipt";

type Role = "owner" | "technician";

interface StoredUser {
  userId: string;
  fullName: string;
  whatsappNumber: string;
  contactNumber: string;
  location: string;
  role: Role;
}

export function VehicleForm() {
  const router = useRouter();
  const [stored, setStored] = useState<StoredUser | null>(null);
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const userString = window.sessionStorage.getItem("automind:user");
    if (!userString) {
      router.replace("/register");
      return;
    }
    try {
      setStored(JSON.parse(userString) as StoredUser);
    } catch {
      router.replace("/register");
    }
  }, [router]);

  const role = stored?.role ?? "owner";
  const userId = stored?.userId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!stored || !userId) {
      newErrors.form = "We could not find your registration details. Please start again.";
      setErrors(newErrors);
      return;
    }

    if (role === "owner") {
      if (!vehicleMake.trim()) newErrors.vehicleMake = "Vehicle make is required.";
      if (!vehicleModel.trim()) {
        newErrors.vehicleModel = "Vehicle model is required.";
      }
      const yearNum = Number(vehicleYear);
      const currentYear = new Date().getFullYear() + 1;
      if (
        !vehicleYear ||
        !Number.isInteger(yearNum) ||
        yearNum < 1900 ||
        yearNum > currentYear
      ) {
        newErrors.vehicleYear = "Enter a valid 4-digit year.";
      }
    }

    if (!receiptFile) {
      newErrors.receipt = "Upload a screenshot of your payment receipt.";
    } else if (!receiptFile.type.startsWith("image/")) {
      newErrors.receipt = "Receipt must be an image file.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      const receiptUrl = await uploadReceipt(receiptFile!);

      const yearNum =
        role === "owner" && vehicleYear ? Number(vehicleYear) : undefined;

      const res = await fetch("/api/form/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          role,
          vehicleMake: role === "owner" ? vehicleMake : undefined,
          vehicleModel: role === "owner" ? vehicleModel : undefined,
          vehicleYear: yearNum,
          technicianSpecialization:
            role === "technician" ? specialization.trim() || undefined : undefined,
          receiptUrl
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Could not save your submission");
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          "automind:form",
          JSON.stringify({
            vehicleMake: role === "owner" ? vehicleMake : null,
            vehicleModel: role === "owner" ? vehicleModel : null,
            vehicleYear: role === "owner" && vehicleYear ? Number(vehicleYear) : null,
            technicianSpecialization:
              role === "technician" ? specialization.trim() || null : null,
            receiptUrl
          })
        );
      }

      router.push("/success");
    } catch {
      setErrors({
        form: "Something went wrong. Please check your connection and try again."
      });
    } finally {
      setLoading(false);
    }
  };

  if (!stored) {
    return (
      <p className="text-sm text-slate-600">Loading your details...</p>
    );
  }

  const title =
    role === "owner" ? "Vehicle & receipt" : "Receipt & optional details";
  const description =
    role === "owner"
      ? "Enter your vehicle details and upload proof of payment."
      : "Upload your payment receipt. You may add an optional area of specialization.";

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {errors.form && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          {errors.form}
        </p>
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>

      {role === "owner" ? (
        <>
          <Input
            label="Vehicle Make"
            id="vehicleMake"
            value={vehicleMake}
            onChange={(e) => setVehicleMake(e.target.value)}
            error={errors.vehicleMake}
            placeholder="e.g. Toyota, Honda"
          />
          <Input
            label="Vehicle Model"
            id="vehicleModel"
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            error={errors.vehicleModel}
            placeholder="e.g. Corolla, Civic"
          />
          <Input
            label="Vehicle Year"
            id="vehicleYear"
            value={vehicleYear}
            onChange={(e) => setVehicleYear(e.target.value)}
            error={errors.vehicleYear}
            placeholder="e.g. 2018"
            inputMode="numeric"
            maxLength={4}
          />
        </>
      ) : (
        <Input
          label="Specialization (optional)"
          id="specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          error={errors.specialization}
          placeholder="e.g. European vehicles, diagnostics"
        />
      )}

      <FileUpload
        label="Payment receipt"
        value={receiptFile}
        onChange={setReceiptFile}
        error={errors.receipt}
        disabled={loading}
      />

      <Button type="submit" loading={loading} className="w-full">
        Submit and finish
      </Button>
    </form>
  );
}
