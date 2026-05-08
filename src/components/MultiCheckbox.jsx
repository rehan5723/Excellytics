// src/components/MultiCheckbox.jsx
import React from "react";

/**
 * MultiCheckbox component
 * 
 * Props:
 * - values: array of currently selected values (strings)
 * - onChange: callback invoked with updated values when a toggle happens
 * - options: array of all available options (strings or {label, value} objects)
 */
export default function MultiCheckbox({ values = [], onChange, options = [] }) {
  // Normalize options to plain strings
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "object" && opt !== null && "value" in opt) {
      return String(opt.value);
    }
    return String(opt);
  });

  // Toggle a value on/off
  const toggle = (val) => {
    const updated = values.includes(val)
      ? values.filter((v) => v !== val)
      : [...values, val];
    onChange(updated);
  };

  if (!normalizedOptions.length) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        No numeric columns available.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {normalizedOptions.map((opt) => {
        const selected = values.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            aria-pressed={selected}
            className={`px-3 py-1.5 rounded-full border text-sm shadow-sm transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500
              ${
                selected
                  ? "bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500"
                  : "bg-white/70 dark:bg-gray-900/60 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
