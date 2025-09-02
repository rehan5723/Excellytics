// src/components/Select.jsx
import React from "react";
import { ChevronDown } from "lucide-react";

/**
 * Select component
 *
 * Props:
 * - value: current selected value
 * - onChange: callback when value changes
 * - options: array of options (strings or numbers)
 * - placeholder: optional placeholder shown as the first empty option
 * - label: optional label displayed above the select
 * - id: optional id for accessibility
 */
export default function Select({ value, onChange, options = [], placeholder, label, id }) {
  return (
    <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-200 w-full">
      {/* Label above select */}
      {label && <span className="block mb-1">{label}</span>}

      <div className="relative">
        <select
          id={id}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 
                     bg-white/70 dark:bg-gray-900/60 backdrop-blur px-3 py-2 pr-10 
                     text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none 
                     focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 
                     transition-colors duration-150"
        >
          {/* Optional placeholder */}
          {placeholder && <option value="">{placeholder}</option>}

          {/* Render options */}
          {options.map((opt) => (
            <option key={String(opt)} value={opt}>
              {String(opt)}
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
