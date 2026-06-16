"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, GraduationCap, MessageSquare, Calendar, Loader2, AlertCircle } from "lucide-react";

const EXPERIENCE_OPTIONS = [
  { value: "", label: "Select your experience level" },
  { value: "None", label: "None — Complete beginner" },
  { value: "Apprentice", label: "Apprentice — Learning the trade" },
  { value: "Mechanic", label: "Mechanic — Working professional" },
  { value: "Car Owner", label: "Car Owner — Interested in maintenance" },
  { value: "Other", label: "Other" }
];

interface FormData {
  name: string;
  phone: string;
  location: string;
  experience: string;
  reason: string;
  canAttend: string;
}

export default function ApplyForm() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    location: "",
    experience: "",
    reason: "",
    canAttend: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return "Full name is required.";
    if (!form.phone.trim()) return "WhatsApp number is required.";
    if (!/^\d{7,15}$/.test(form.phone.replace(/\s/g, "")))
      return "Enter a valid phone number (digits only).";
    if (!form.location.trim()) return "Location is required.";
    if (!form.experience) return "Please select your experience level.";
    if (!form.canAttend) return "Please answer whether you can attend all 2 days.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/submit-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Submission failed. Please try again.");
      }

      const firstName = form.name.trim().split(" ")[0];
      router.push(`/pay?ref=${encodeURIComponent(data.refCode)}&name=${encodeURIComponent(firstName)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id="apply-form"
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
    >
      {/* Error toast */}
      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label htmlFor="name" className="form-label">
          Full Name <span className="text-[#F5A623]">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Abubakar Suleiman"
            value={form.name}
            onChange={handleChange}
            className="form-input pl-10"
            required
          />
        </div>
      </div>

      {/* WhatsApp Number */}
      <div>
        <label htmlFor="phone" className="form-label">
          WhatsApp Number <span className="text-[#F5A623]">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="e.g. 08012345678"
            value={form.phone}
            onChange={handleChange}
            className="form-input pl-10"
            inputMode="numeric"
            required
          />
        </div>
        <p className="text-white/40 text-xs mt-1">We&apos;ll send your confirmation here.</p>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="form-label">
          Location <span className="text-[#F5A623]">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            id="location"
            name="location"
            type="text"
            placeholder="e.g. Kano, Abuja, Lagos..."
            value={form.location}
            onChange={handleChange}
            className="form-input pl-10"
            required
          />
        </div>
      </div>

      {/* Experience */}
      <div>
        <label htmlFor="experience" className="form-label">
          Experience Level <span className="text-[#F5A623]">*</span>
        </label>
        <div className="relative">
          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <select
            id="experience"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            className="form-input pl-10 appearance-none cursor-pointer"
            required
          >
            {EXPERIENCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={!opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Why this training */}
      <div>
        <label htmlFor="reason" className="form-label">
          Why do you want this training?{" "}
          <span className="text-white/40 text-xs font-normal">(Optional)</span>
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-white/40" />
          <textarea
            id="reason"
            name="reason"
            rows={3}
            maxLength={200}
            placeholder="Tell us your motivation in up to 200 characters..."
            value={form.reason}
            onChange={handleChange}
            className="form-input pl-10 resize-none"

          />
        </div>
        <p className="text-white/40 text-xs mt-1 text-right">
          {form.reason.length}/200 characters
        </p>
      </div>

      {/* Can attend */}
      <div>
        <label className="form-label">
          Can you attend all 2 days?{" "}
          <span className="text-[#F5A623]">*</span>
        </label>
        <div className="flex gap-3">
          {["Yes", "No"].map((val) => (
            <label
              key={val}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border cursor-pointer transition-all duration-200 ${form.canAttend === val
                  ? "bg-[#F5A623]/20 border-[#F5A623] text-[#F5A623] font-semibold"
                  : "border-white/20 text-white/60 hover:border-white/40"
                }`}
            >
              <input
                type="radio"
                name="canAttend"
                value={val}
                checked={form.canAttend === val}
                onChange={handleChange}
                className="sr-only"
                id={`canAttend-${val}`}
              />
              <Calendar className="w-4 h-4" />
              {val}
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        id="apply-submit-btn"
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base mt-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting Application...
          </>
        ) : (
          "Submit Application →"
        )}
      </button>

      <p className="text-white/30 text-xs text-center">
        By submitting, you agree to be contacted on WhatsApp about your training slot.
      </p>
    </form>
  );
}
