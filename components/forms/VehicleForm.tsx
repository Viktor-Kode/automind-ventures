"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { validatePhone } from "../../lib/utils/validatePhone";

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
  const params = useSearchParams();
  const [stored, setStored] = useState<StoredUser | null>(null);
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [technicianName, setTechnicianName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [techLocation, setTechLocation] = useState("");
  const [specializedVehicle, setSpecializedVehicle] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const userString = window.sessionStorage.getItem("automind:user");
    if (userString) {
      try {
        const parsed = JSON.parse(userString) as StoredUser;
        setStored(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  const roleFromParams = params?.get("role") as Role | null;
  const userIdFromParams = params?.get("userId") || null;

  const role = roleFromParams || stored?.role || "owner";
  const userId = userIdFromParams || stored?.userId;

  useEffect(() => {
    if (!stored) return;
    if (role !== "technician") return;

    setTechnicianName(stored.fullName ?? "");
    setPhoneNumber(stored.contactNumber ?? "");
    setTechLocation(stored.location ?? "");
  }, [stored, role]);

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
    } else {
      if (!technicianName.trim()) newErrors.technicianName = "Name is required.";
      if (!businessName.trim()) newErrors.businessName = "Business name is required.";
      if (!phoneNumber.trim() || !validatePhone(phoneNumber)) {
        newErrors.phoneNumber = "Enter a valid phone number.";
      }
      if (!techLocation.trim()) newErrors.techLocation = "Location is required.";
      if (!specializedVehicle.trim()) newErrors.specializedVehicle = "Specialized vehicle is required.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          "automind:form",
          JSON.stringify({
            // Owner fields
            vehicleMake: role === "owner" ? vehicleMake : null,
            vehicleModel: role === "owner" ? vehicleModel : null,
            vehicleYear: role === "owner" && vehicleYear ? Number(vehicleYear) : null,

            // Technician fields
            technicianName: role === "technician" ? technicianName : null,
            businessName: role === "technician" ? businessName : null,
            phoneNumber: role === "technician" ? phoneNumber : null,
            location: role === "technician" ? techLocation : null,
            specializedVehicle: role === "technician" ? specializedVehicle : null
          })
        );
      }

      router.push("/success");
    } catch (error) {
      setErrors({
        form: "Something went wrong. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const title =
    role === "owner" ? "Vehicle information" : "Technician details";
  const description =
    role === "owner"
      ? "Help us understand your vehicle so we can match you with the right support."
      : "Share your business details so vehicle owners can reach the right technician.";

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
        <>
          <Input
            label="Name"
            id="technicianName"
            value={technicianName}
            onChange={(e) => setTechnicianName(e.target.value)}
            error={errors.technicianName}
            placeholder="Enter your name"
          />
          <Input
            label="Name of Business"
            id="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            error={errors.businessName}
            placeholder="e.g. Kemi Auto Repairs"
          />
          <Input
            label="Phone Number"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            error={errors.phoneNumber}
            placeholder="e.g. 0805 555 5555"
            inputMode="numeric"
          />
          <Input
            label="Location"
            id="techLocation"
            value={techLocation}
            onChange={(e) => setTechLocation(e.target.value)}
            error={errors.techLocation}
            placeholder="City, State"
          />
          <Input
            label="Specialized Vehicle"
            id="specializedVehicle"
            value={specializedVehicle}
            onChange={(e) => setSpecializedVehicle(e.target.value)}
            error={errors.specializedVehicle}
            placeholder="e.g. Toyota vehicles, engine diagnostics"
          />
        </>
      )}

      <Button type="submit" loading={loading} className="w-full">
        Complete Registration
      </Button>
    </form>
  );
}

