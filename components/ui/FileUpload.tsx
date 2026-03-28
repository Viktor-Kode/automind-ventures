"use client";

import { useCallback, useId, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "../../lib/utils/cn";

interface FileUploadProps {
  id?: string;
  label: string;
  accept?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
}

export function FileUpload({
  id,
  label,
  accept = "image/*",
  value,
  onChange,
  error,
  disabled
}: FileUploadProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [preview, setPreview] = useState<string | null>(null);

  const revoke = useCallback(() => {
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  const handleFile = (file: File | null) => {
    revoke();
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
    onChange(file);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <div
        className={cn(
          "relative rounded-lg border border-dashed border-slate-300 bg-white p-4 transition-colors",
          error && "border-red-300",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        <input
          id={inputId}
          type="file"
          accept={accept}
          disabled={disabled}
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            handleFile(f);
          }}
        />
        {!value ? (
          <label
            htmlFor={inputId}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 py-6 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <ImagePlus className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-slate-800">
              Tap to upload receipt
            </span>
            <span className="text-xs text-slate-500">PNG, JPG, or WEBP</span>
          </label>
        ) : (
          <div className="space-y-3">
            <div className="relative mx-auto max-h-56 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview ?? ""}
                alt="Receipt preview"
                className="max-h-56 w-full object-contain"
              />
              <button
                type="button"
                onClick={() => {
                  handleFile(null);
                }}
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-white transition hover:bg-slate-900"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="truncate text-center text-xs text-slate-600">{value.name}</p>
            <label htmlFor={inputId}>
              <span className="block cursor-pointer text-center text-xs font-medium text-primary-600 hover:text-primary-700">
                Choose a different image
              </span>
            </label>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
