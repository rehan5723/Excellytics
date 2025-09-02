// src/components/DataPreview.jsx
import React from "react";
import PropTypes from "prop-types";

/**
 * DataPreview component – displays a table preview of uploaded dataset.
 * Supports dark mode and scrollable large tables.
 *
 * Props:
 * - data (array of objects): Dataset rows
 * - columns (array of strings): Column headers to display
 */
export default function DataPreview({ data, columns }) {
  // Early return if no data
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center p-8 text-center text-sm text-gray-400 rounded-xl border border-gray-800 bg-gray-900/60 shadow-lg">
        No data preview. Please upload a file to get started.
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-xl border border-gray-800 shadow-lg">
      {/* Custom scrollbar for dark mode */}
      <style>{`
        .overflow-auto::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .overflow-auto::-webkit-scrollbar-thumb {
          background-color: #4a5568; /* Tailwind gray-600 */
          border-radius: 10px;
          border: 2px solid transparent;
        }
        .overflow-auto::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>

      <table className="min-w-full text-sm">
        {/* Table Header */}
        <thead className="bg-gray-800/80 sticky top-0 backdrop-blur z-10">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                scope="col"
                className="px-4 py-3 text-left font-medium text-gray-200 whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-800">
          {data.slice(0, 50).map((row, i) => (
            <tr
              key={i}
              className={`transition-colors duration-150 hover:bg-gray-800/50 ${
                i % 2 === 0 ? "bg-gray-900/40" : "bg-gray-950/40"
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col}
                  className="px-4 py-2 text-gray-300 whitespace-nowrap"
                >
                  {row[col] !== undefined && row[col] !== null
                    ? String(row[col])
                    : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="text-xs text-gray-500 bg-gray-900/40 p-3 text-center border-t border-gray-800">
        Showing up to 50 rows.
      </div>
    </div>
  );
}

// ---------------------------
// PropTypes validation
// ---------------------------
DataPreview.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object), // Array of row objects
  columns: PropTypes.arrayOf(PropTypes.string).isRequired, // Required column headers
};

// ---------------------------
// Default props
// ---------------------------
DataPreview.defaultProps = {
  data: [], // Default to empty array if no data
};
