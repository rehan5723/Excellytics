// src/components/Select.jsx
import React from "react";
import { ChevronDown } from "lucide-react";

/**
 * Select component – works with both plain string arrays and {label, value} object arrays.
 *
 * Props:
 * - value: current selected value
 * - onChange: callback when value changes
 * - options: array of strings/numbers OR array of { label, value } objects
 * - placeholder: optional placeholder shown as the first empty option
 * - label: optional label displayed above the select
 * - id: optional id for accessibility
 */
export default function Select({ value, onChange, options = [], placeholder, label, id }) {
  // Normalize options to always be { label, value } objects
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "object" && opt !== null && "value" in opt) {
      return { label: opt.label || String(opt.value), value: opt.value };
    }
    return { label: String(opt), value: opt };
  });

  return (
    <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-200 w-full">
      {/* Label above select */}
      {label && <span className="block mb-1">{label}</span>}

      <div className="relative">
        <select
          id={id}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border-none 
                     bg-[#E5E5EA] dark:bg-[#1C1C1E] px-3 py-2.5 pr-10 
                     text-[#000000] dark:text-white shadow-none focus:outline-none 
                     focus:ring-2 focus:ring-[#007AFF]/50 
                     transition-all duration-200"
        >
          {/* Optional placeholder */}
          {placeholder && <option value="">{placeholder}</option>}

          {/* Render options */}
          {normalizedOptions.map((opt) => (
            <option key={String(opt.value)} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Down arrow icon */}
        <ChevronDown 
          className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" 
        />
      </div>
    </label>
  );
}
