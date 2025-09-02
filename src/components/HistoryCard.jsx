// src/components/HistoryCard.jsx
import React from "react";
import PropTypes from "prop-types";
import { History as HistoryIcon, Trash2 } from "lucide-react";

/**
 * Card component – reusable container for consistent styling
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
              <h3 className="text-lg font-semibold text-gray-100">
                {title}
              </h3>
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
 * HistoryCard component – displays a list of uploaded files with row count
 * and allows deleting individual items.
 *
 * Props:
 * - history (array of objects): Uploaded files with `fileName` and `rows`
 * - onDelete (func): Callback to delete a file by index
 */
export default function HistoryCard({ history, onDelete }) {
  return (
    <Card title="History" icon={HistoryIcon}>
      <ul className="divide-y divide-gray-700">
        {history.length === 0 ? (
          <li className="py-6 text-center text-sm text-gray-500 italic">
            No uploads yet.
          </li>
        ) : (
          history.map((h, i) => (
            <li
              key={i}
              className="py-3 flex items-center justify-between gap-3 group transition-colors duration-200 
                hover:bg-gray-800/40 rounded-lg -mx-2 px-2"
            >
              {/* File info */}
              <div className="min-w-0 flex-1">
                <div
                  className="font-medium text-sm break-words text-gray-100 group-hover:text-purple-300 transition-colors"
                  title={h.fileName}
                >
                  {h.fileName}
                </div>
                <div className="text-xs text-gray-500">{h.rows} rows</div>
              </div>

              {/* Delete button */}
              <button
                onClick={() => onDelete(i)}
                className="p-2 rounded-full border border-transparent transition-colors duration-200 
                  hover:bg-gray-700/60 dark:hover:bg-gray-900/40"
                title="Remove"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4 text-gray-500 group-hover:text-red-400 transition-colors" />
              </button>
            </li>
          ))
        )}
      </ul>
    </Card>
  );
}

HistoryCard.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      fileName: PropTypes.string.isRequired,
      rows: PropTypes.number.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};
