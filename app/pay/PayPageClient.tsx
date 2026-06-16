"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import PaymentCard from "../../components/PaymentCard";
import {
  Clock,
  Upload,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

function Countdown({ targetMs }: { targetMs: number }) {
  const [timeLeft, setTimeLeft] = useState<number>(targetMs - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      const remaining = targetMs - Date.now();
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  if (timeLeft <= 0)
    return <span className="text-red-400 font-bold text-sm">Slot expired</span>;

  const hours = Math.floor(timeLeft / 3_600_000);
  const minutes = Math.floor((timeLeft % 3_600_000) / 60_000);
  const seconds = Math.floor((timeLeft % 60_000) / 1_000);

  return (
    <span className="font-mono font-bold text-[#F5A623]">
      {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </span>
  );
}

export default function PayPageClient() {
  const params = useSearchParams();
  const ref = params?.get("ref") ?? "GBT-000";
  const name = params?.get("name") ?? "there";

  const targetMs = useRef(Date.now() + 24 * 60 * 60 * 1000).current;

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(f.type)) {
      setError("Only JPG, PNG, WEBP, or PDF files are accepted.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.");
      return;
    }
    setFile(f);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please attach your payment receipt.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/upload-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ref,
          fileBase64: base64,
          fileName: file.name,
          mimeType: file.type
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Upload failed. Please try again.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===== SUCCESS SCREEN =====
  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 pb-28 md:pb-16 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
        <h1 className="text-2xl font-black text-white mb-3">Receipt Submitted!</h1>
        <p className="text-white/60 mb-2">
          We&apos;ll confirm your payment within{" "}
          <span className="text-white font-semibold">2 hours</span>.
        </p>
        <p className="text-white/60 mb-8">
          Watch your WhatsApp —{" "}
          <strong className="text-white font-mono">{ref}</strong> is your reference.
        </p>

      </div>
    );
  }

  // ===== PAYMENT SCREEN =====
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 pb-28 md:pb-10">
      <Link
        href="/apply"
        className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Application
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">Hi {name} 👋</h1>
        <p className="text-white/60">
          Your slot reference is{" "}
          <span className="text-[#F5A623] font-bold font-mono text-lg">{ref}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Left — Bank details */}
        <div className="space-y-4">
          <PaymentCard refCode={ref} />

          {/* Countdown */}
          <div className="card flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F5A623]/10 rounded-lg flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#F5A623]" />
            </div>
            <div>
              <p className="text-white/50 text-xs">Slot held for</p>
              <div className="flex items-center gap-2">
                <Countdown targetMs={targetMs} />
                <span className="text-white/50 text-sm">remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Receipt upload */}
        <div className="card">
          <h2 className="text-white font-bold text-lg mb-1">Upload Payment Receipt</h2>
          <p className="text-white/50 text-sm mb-5">
            After making the transfer, upload your bank receipt or screenshot below.
          </p>

          <form id="receipt-upload-form" onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* File input */}
            <div>
              <label htmlFor="receipt-file" className="form-label">
                Receipt File <span className="text-[#F5A623]">*</span>
              </label>
              <label
                htmlFor="receipt-file"
                className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${
                  file
                    ? "border-[#F5A623]/60 bg-[#F5A623]/5"
                    : "border-white/20 hover:border-white/40 bg-white/[0.02]"
                }`}
              >
                <Upload className={`w-8 h-8 ${file ? "text-[#F5A623]" : "text-white/30"}`} />
                <div className="text-center">
                  {file ? (
                    <>
                      <p className="text-[#F5A623] text-sm font-medium">{file.name}</p>
                      <p className="text-white/40 text-xs mt-0.5">
                        {(file.size / 1024).toFixed(1)} KB — Click to change
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-white/60 text-sm">Click to upload receipt</p>
                      <p className="text-white/30 text-xs mt-0.5">JPG, PNG, PDF — Max 5MB</p>
                    </>
                  )}
                </div>
                <input
                  id="receipt-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>



            <button
              id="submit-receipt-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading Receipt...
                </>
              ) : (
                "I've Paid — Submit Receipt →"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
