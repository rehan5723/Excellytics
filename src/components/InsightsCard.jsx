// src/components/InsightsCard.jsx
import React from "react";
import PropTypes from "prop-types";
import { FileText, Download, BarChart2 } from "lucide-react";
import jsPDF from "jspdf"

/**
 * Reusable Card wrapper component for consistent styling
 */
function Card({ title, icon: Icon, children, actions, className = "" }) {
  return (
    <section
      aria-label={title || "Card"}
      className={`rounded-2xl border border-gray-800 
          bg-gray-900/60 backdrop-blur shadow-xl p-5 
          transition-colors duration-200 hover:bg-gray-800/60 
          ${className}`}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-gray-500" />}
            {title && (
              <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
            )}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.elementType,
  children: PropTypes.node,
  actions: PropTypes.node,
  className: PropTypes.string,
};

/**
 * InsightsCard component – displays dataset summary and column insights.
 * Provides TXT/PDF download functionality for dataset insights.
 *
 * Props:
 * - basic: Object with dataset summary (rows, columns, fileName, uploadedAt)
 * - columnInsights: Array of column-level insights (type, unique count, sample values, stats)
 */
export default function InsightsCard({ basic, columnInsights }) {
  if (!basic) return null;

  // Format dataset insights into plain text
  const formatInsightsText = () => {
    let text = `Dataset Insights\n\n`;
    text += `Rows: ${basic.rowCount}\n`;
    text += `Columns: ${basic.columnCount}\n`;
    if (basic.fileName) text += `File: ${basic.fileName}\n`;
    if (basic.uploadedAt) text += `Uploaded At: ${basic.uploadedAt}\n`;
    text += `\nColumns:\n- ${basic.columns.join(", ")}\n\n`;

    columnInsights.forEach((ci) => {
      text += `Column: ${ci.column}\n`;
      text += `Type: ${ci.type}\n`;
      text += `Unique Values: ${ci.uniqueCount}\n`;

      if (ci.type === "numeric") {
        text += `Min: ${ci.min}, Max: ${ci.max}, Mean: ${ci.mean}\n`;
      } else {
        text += `Most Frequent: ${ci.topValue}\n`;
      }

      text += `Sample Values: ${ci.sampleValues.join(", ")}\n\n`;
    });

    return text;
  };

  // Download as plain TXT file
  const handleDownloadTxt = () => {
    const text = formatInsightsText();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "dataset_insights.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  // Download as PDF using global jsPDF
const handleDownloadPdf = () => {
  if (typeof jsPDF !== "undefined") {
    const doc = new jsPDF();

    // Set font (options: "helvetica", "times", "courier") and style ("normal", "bold", "italic", "bolditalic")
    doc.setFont("helvetica", "normal");

    const text = formatInsightsText();
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
    const splitText = doc.splitTextToSize(text, pageWidth);

    doc.text(splitText, margin, 20);
    doc.save("dataset_insights.pdf");
  } else {
    console.error("jsPDF is not defined. Please ensure the library is loaded.");
  }
};


  return (
    <Card
      title="Dataset Insights"
      icon={BarChart2}
      className="mt-6 rounded-2xl shadow-md border border-gray-800"
      actions={
        <div className="flex gap-2">
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border text-gray-400 border-gray-700 hover:bg-gray-700/50 hover:text-white transition"
          >
            <FileText className="w-4 h-4" />
            TXT
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border text-gray-400 border-gray-700 hover:bg-gray-700/50 hover:text-white transition"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      }
    >
      {/* Basic dataset info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-6 text-gray-400">
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 shadow-inner">
          <div className="font-semibold text-gray-200">Rows</div>
          <div>{basic.rowCount}</div>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 shadow-inner">
          <div className="font-semibold text-gray-200">Columns</div>
          <div>{basic.columnCount}</div>
        </div>
        {basic.fileName && (
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 shadow-inner col-span-2">
            <div className="font-semibold text-gray-200">File</div>
            <div className="truncate">{basic.fileName}</div>
          </div>
        )}
      </div>

      {/* Column insights */}
      <div className="space-y-4">
        {columnInsights.map((ci) => (
          <div
            key={ci.column}
            className="p-4 rounded-lg border border-gray-800 bg-gray-950/50 shadow-sm transition-all duration-200 hover:bg-gray-800/50"
          >
            <h3 className="font-semibold text-gray-100 flex items-center gap-2">
              {ci.column}{" "}
              <span className="text-xs font-normal text-gray-400">({ci.type})</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Unique Values:{" "}
              <span className="text-gray-300 font-medium">{ci.uniqueCount}</span>
            </p>

            {ci.type === "numeric" ? (
              <p className="text-sm text-gray-300 mt-2">
                <span className="font-medium">Min:</span> {ci.min},{" "}
                <span className="font-medium">Max:</span> {ci.max},{" "}
                <span className="font-medium">Mean:</span> {ci.mean}
              </p>
            ) : (
              <p className="text-sm text-gray-300 mt-2">
                <span className="font-medium">Top Value:</span> {ci.topValue || "N/A"}
              </p>
            )}

            <p className="text-xs text-gray-500 mt-2">
              <span className="font-medium text-gray-400">Sample:</span>{" "}
              {ci.sampleValues.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

InsightsCard.propTypes = {
  basic: PropTypes.shape({
    rowCount: PropTypes.number.isRequired,
    columnCount: PropTypes.number.isRequired,
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    fileName: PropTypes.string,
    uploadedAt: PropTypes.string,
  }),
  columnInsights: PropTypes.arrayOf(
    PropTypes.shape({
      column: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      uniqueCount: PropTypes.number.isRequired,
      sampleValues: PropTypes.array,
      min: PropTypes.number,
      max: PropTypes.number,
      mean: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      topValue: PropTypes.string,
    })
  ).isRequired,
};
