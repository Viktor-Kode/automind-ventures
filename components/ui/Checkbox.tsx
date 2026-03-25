"use client";

import { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils/cn";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className="inline-flex items-center space-x-2 text-sm text-slate-700">
      <input
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500",
          className
        )}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
}

