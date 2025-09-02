// src/components/Toast.jsx
import React from "react";
import { X, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function Toast({ toast, onClose }) {
  const getIcon = () => {
    switch (toast.type) {
      case "success": return <CheckCircle className="h-5 w-5" />;
      case "error": return <XCircle className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-100 border-green-400 text-green-800 dark:bg-green-900 dark:border-green-600 dark:text-green-200";
      case "error":
        return "bg-red-100 border-red-400 text-red-800 dark:bg-red-900 dark:border-red-600 dark:text-red-200";
      default:
        return "bg-blue-100 border-blue-400 text-blue-800 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-200";
    }
  };

  if (!toast.show) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg border shadow-lg ${getBgColor()} transition-all duration-300`}
    >
      {getIcon()}
      <span className="text-sm font-medium">{toast.message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-70 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
