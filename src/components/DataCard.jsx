// src/components/DataCard.jsx
import React from "react";
import PropTypes from "prop-types";
import Card from "./Card";
import { FileSpreadsheet, Upload } from "lucide-react";

/**
 * DataCard component – displays dataset info with file name, row count, and upload/replace functionality.
 * 
 * Props:
 * - fileName (string): Name of the currently uploaded file
 * - rows (number): Number of rows in the dataset
 * - onReplace (func): Callback function when a new file is selected
 */
export default function DataCard({ fileName, rows, onReplace }) {
  // Handle file input change and pass event to parent
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onReplace(e); // Parent handles file processing
    }
  };

  return (
    <Card title="Data" icon={FileSpreadsheet}>
      <div className="space-y-3">
        {/* Dataset label */}
        <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Dataset
        </div>

        {/* File info and upload button */}
        <div className="flex items-center justify-between gap-3">
          {/* Display file name or placeholder */}
          <div
            className="font-medium truncate max-w-[70%] text-gray-900 dark:text-gray-100"
            title={fileName || "No file uploaded"}
          >
            {fileName || "No file uploaded"}
          </div>

          {/* Upload/Replace button */}
          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/60 text-gray-800 dark:text-gray-100 cursor-pointer shadow-sm hover:shadow transition">
            <Upload className="h-4 w-4" />
            <span className="text-sm font-medium">
              {fileName ? "Replace" : "Upload"}
            </span>
            {/* Hidden file input */}
            <input
              type="file"
              accept=".xls,.xlsx"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Display row count */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Rows: {rows ?? 0}
        </div>
      </div>
    </Card>
  );
}

// ---------------------------
// Prop validation
// ---------------------------
DataCard.propTypes = {
  fileName: PropTypes.string,   // Optional file name
  rows: PropTypes.number,       // Optional row count
  onReplace: PropTypes.func.isRequired, // Required callback
};

// ---------------------------
// Default props
// ---------------------------
DataCard.defaultProps = {
  fileName: null,
  rows: 0,
};
