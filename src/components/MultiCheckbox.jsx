// src/components/MultiCheckbox.jsx
import React from "react";

/**
 * MultiCheckbox component
 * 
 * Props:
 * - values: array of currently selected values
 * - onChange: callback invoked with updated values when a toggle happens
 * - options: array of all available options
 */
export default function MultiCheckbox({ values = [], onChange, options = [] }) {
  // Toggle a value on/off
  const toggle = (val) => {
    const updated = values.includes(val)
      ? values.filter((v) => v !== val)
      : [...values, val];
    onChange(updated);
  };

  if (!options.length) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        No options available.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = values.includes(opt);
        return (
          <button
            key={String(opt)}
            type="button"
            onClick={() => toggle(opt)}
            aria-pressed={selected}
            className={`px-3 py-1.5 rounded-full border text-sm shadow-sm transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500
              ${
                selected
                  ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                  : "bg-white/70 dark:bg-gray-900/60 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            {String(opt)}
          </button>
        );
      })}
    </div>
  );
}
