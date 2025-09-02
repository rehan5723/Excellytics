import { useEffect, useState } from "react";

/**
 * Keeps a simple upload history in localStorage.
 * Each entry: { fileName, rows }
 */
export default function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("uploadHistory")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("uploadHistory", JSON.stringify(history));
  }, [history]);

  const addHistory = (fileName, rows) => {
    setHistory((prev) => [{ fileName, rows }, ...prev].slice(0, 10));
  };

  const deleteHistory = (index) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
  };

  return { history, addHistory, deleteHistory };
}
