// src/components/DataPreview.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from "lucide-react";

/**
 * DataPreview component – Bulletproof paginated table with full dataset browsing.
 * Completely rebuilt from scratch for reliability.
 */
export default function DataPreview({ data = [], columns = [], rowsPerPage = 25 }) {
  const [currentPage, setCurrentPage] = useState(1);

  // ============================================
  // COMPUTED VALUES
  // ============================================
  const totalRows = Array.isArray(data) ? data.length : 0;
  const totalPages = totalRows > 0 ? Math.ceil(totalRows / rowsPerPage) : 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
  const displayedRows = data.slice(startIndex, endIndex);

  // ============================================
  // EFFECTS
  // ============================================
  // Reset page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [totalRows, columns?.length]);

  // ============================================
  // EVENT HANDLERS - COMPLETELY EXPLICIT
  // ============================================
  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    if (safeCurrentPage > 1) {
      setCurrentPage(safeCurrentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (safeCurrentPage < totalPages) {
      setCurrentPage(safeCurrentPage + 1);
    }
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleDirectPageInput = (e) => {
    const val = e.target.value;
    if (val === "") {
      return;
    }
    const pageNum = parseInt(val, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // ============================================
  // RENDER - NO DATA
  // ============================================
  if (totalRows === 0) {
    return (
      <div className="flex items-center justify-center p-12 text-center text-sm text-gray-400 rounded-xl border border-gray-800 bg-gray-900/60 shadow-lg">
        <div>
          <p className="font-medium">No data available</p>
          <p className="text-xs mt-1">Upload an Excel file to see the data preview</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER - WITH DATA AND PAGINATION
  // ============================================
  return (
    <div className="flex flex-col border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 rounded-xl shadow-lg overflow-hidden">
      {/* CUSTOM SCROLLBAR STYLES */}
      <style>{`
        .table-container::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .table-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .table-container::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        .table-container::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>

      {/* TABLE SECTION */}
      <div className="table-container overflow-auto flex-1">
        <table className="w-full text-sm border-collapse">
          {/* HEADER */}
          <thead className="bg-gray-100/90 dark:bg-gray-800/90 sticky top-0 z-10">
            <tr>
              {columns && columns.length > 0 ? (
                columns.map((col) => (
                  <th
                    key={`header-${col}`}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))
              ) : (
                <th className="px-4 py-3 text-gray-400">(no columns)</th>
              )}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {displayedRows && displayedRows.length > 0 ? (
              displayedRows.map((row, rowIdx) => (
                <tr
                  key={`row-${startIndex + rowIdx}`}
                  className={`${
                    rowIdx % 2 === 0
                      ? "bg-gray-900/30 hover:bg-gray-800/40"
                      : "bg-gray-950/30 hover:bg-gray-800/40"
                  } transition-colors duration-150`}
                >
                  {columns.map((col) => (
                    <td
                      key={`cell-${startIndex + rowIdx}-${col}`}
                      className="px-4 py-2.5 text-gray-600 dark:text-gray-300 text-xs whitespace-nowrap"
                    >
                      {row && row[col] !== undefined && row[col] !== null
                         ? String(row[col])
                        : "–"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-gray-500 text-xs"
                >
                  No rows on this page
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        {/* Info Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-200">
              {totalRows === 0 ? "0" : startIndex + 1}–{endIndex}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-200">{totalRows}</span>{" "}
            rows
          </div>
          <div className="text-xs text-gray-400">
            Page{" "}
            <span className="font-semibold text-gray-200">
              {safeCurrentPage}/{totalPages}
            </span>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-center gap-1.5">
          {/* First Page Button */}
          <button
            onClick={goToFirstPage}
            disabled={safeCurrentPage === 1}
            type="button"
            className={`flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-all ${
              safeCurrentPage === 1
                 ? "border-gray-200 dark:border-gray-700/50 text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-gray-900/20 cursor-not-allowed"
                : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:border-gray-400 dark:hover:border-gray-500 active:scale-95"
            }`}
            title="First page"
          >
            <SkipBack size={14} />
          </button>

          {/* Previous Page Button */}
          <button
            onClick={goToPreviousPage}
            disabled={safeCurrentPage === 1}
            type="button"
            className={`flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-all ${
              safeCurrentPage === 1
                ? "border-gray-700/50 text-gray-600 bg-gray-900/20 cursor-not-allowed"
                : "border-gray-600 text-gray-300 bg-gray-800/40 hover:bg-gray-700/50 hover:border-gray-500 active:scale-95"
            }`}
            title="Previous page"
          >
            <ChevronLeft size={14} />
          </button>

          {/* Page Divider */}
          <div className="h-6 w-px bg-gray-700/50" />

          {/* Page Input */}
          <input
            type="number"
            min="1"
            max={totalPages}
            value={safeCurrentPage}
            onChange={handleDirectPageInput}
            className="w-12 h-9 px-2 py-1 text-xs text-center bg-gray-800 border border-gray-600 rounded-lg text-gray-200 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none transition"
            title="Go to page"
          />

          <span className="text-xs text-gray-500 font-medium">/ {totalPages}</span>

          {/* Page Divider */}
          <div className="h-6 w-px bg-gray-700/50" />

          {/* Next Page Button */}
          <button
            onClick={goToNextPage}
            disabled={safeCurrentPage >= totalPages}
            type="button"
            className={`flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-all ${
              safeCurrentPage >= totalPages
                ? "border-gray-700/50 text-gray-600 bg-gray-900/20 cursor-not-allowed"
                : "border-gray-600 text-gray-300 bg-gray-800/40 hover:bg-gray-700/50 hover:border-gray-500 active:scale-95"
            }`}
            title="Next page"
          >
            <ChevronRight size={14} />
          </button>

          {/* Last Page Button */}
          <button
            onClick={goToLastPage}
            disabled={safeCurrentPage >= totalPages}
            type="button"
            className={`flex items-center justify-center w-9 h-9 rounded-lg border text-sm font-medium transition-all ${
              safeCurrentPage >= totalPages
                ? "border-gray-700/50 text-gray-600 bg-gray-900/20 cursor-not-allowed"
                : "border-gray-600 text-gray-300 bg-gray-800/40 hover:bg-gray-700/50 hover:border-gray-500 active:scale-95"
            }`}
            title="Last page"
          >
            <SkipForward size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}


// ============================================
// PROPTYPES VALIDATION
// ============================================
DataPreview.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.string),
  rowsPerPage: PropTypes.number,
};

// ============================================
// DEFAULT PROPS
// ============================================
DataPreview.defaultProps = {
  data: [],
  columns: [],
  rowsPerPage: 25,
};
