"use client";

import { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils/cn";

interface Option {
  label: string;
  value: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
}

export function RadioGroup({ name, options, value, onChange }: RadioGroupProps) {
  return (
    <div className="space-y-2">
      {options.map((option) => {
        const checked = option.value === value;
        return (
          <label
            key={option.value}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors",
              checked
                ? "border-primary-500 bg-primary-50"
                : "border-slate-200 bg-white hover:border-primary-300"
            )}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange?.(option.value)}
                className="h-4 w-4 border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <p className="font-medium text-slate-900">{option.label}</p>
                {option.description && (
                  <p className="text-xs text-slate-500">{option.description}</p>
                )}
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}

