"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Wrench } from "lucide-react";
import { Input } from "../ui/Input";
import { Checkbox } from "../ui/Checkbox";
import { RadioGroup } from "../ui/RadioGroup";
import { Button } from "../ui/Button";
import { validatePhone } from "../../lib/utils/validatePhone";

type Role = "owner" | "technician";

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [location, setLocation] = useState("");
  const [sameAsWhatsApp, setSameAsWhatsApp] = useState(false);
  const [role, setRole] = useState<Role | "">("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!whatsappNumber.trim() || !validatePhone(whatsappNumber)) {
      newErrors.whatsappNumber = "Enter a valid WhatsApp number.";
    }
    if (!contactNumber.trim() || !validatePhone(contactNumber)) {
      newErrors.contactNumber = "Enter a valid contact number.";
    }
    if (!location.trim()) newErrors.location = "Location is required.";
    if (!role) newErrors.role = "Select a role.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          whatsappNumber,
          contactNumber,
          location,
          role
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // store basic info in session for later steps
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          "automind:user",
          JSON.stringify({
            userId: data.userId,
            fullName,
            whatsappNumber,
            contactNumber,
            location,
            role
          })
        );
      }

      router.push(`/payment?role=${role}&userId=${data.userId}`);
    } catch (error) {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {errors.form && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          {errors.form}
        </p>
      )}
      <Input
        label="Full Name"
        id="fullName"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        error={errors.fullName}
        placeholder="Enter your full name"
      />
      <Input
        label="WhatsApp Number"
        id="whatsappNumber"
        value={whatsappNumber}
        onChange={(e) => {
          setWhatsappNumber(e.target.value);
          if (sameAsWhatsApp) {
            setContactNumber(e.target.value);
          }
        }}
        error={errors.whatsappNumber}
        placeholder="e.g. 0805 555 5555"
      />
      <div className="space-y-2">
        <Input
          label="Contact Number"
          id="contactNumber"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          error={errors.contactNumber}
          placeholder="Phone number for calls"
        />
        <Checkbox
          checked={sameAsWhatsApp}
          onChange={(e) => {
            const checked = e.target.checked;
            setSameAsWhatsApp(checked);
            if (checked) setContactNumber(whatsappNumber);
          }}
          label="Same as WhatsApp number"
        />
      </div>
      <Input
        label="Location"
        id="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        error={errors.location}
        placeholder="City, State"
      />
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Register as</p>
        <RadioGroup
          name="role"
          value={role}
          onChange={(value) => setRole(value as Role)}
          options={[
            {
              label: "Vehicle Owner",
              value: "owner",
              description: "Get expert guidance and support for your vehicle."
            },
            {
              label: "Technician",
              value: "technician",
              description: "Offer your expertise to verified vehicle owners."
            }
          ]}
        />
        {errors.role && (
          <p className="text-xs text-red-600">{errors.role}</p>
        )}
      </div>
      <Button type="submit" loading={loading} className="w-full">
        Continue to Payment
      </Button>
      <p className="text-xs text-slate-500">
        Owners pay ₦5,000. Technicians pay ₦10,000. One-time registration fee.
      </p>
    </form>
  );
}

