// src/pages/ExcelAnalyticsDashboard.jsx
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import useTheme from "../hooks/useTheme";
import useHistory from "../hooks/useHistory";
import DataCard from "../components/DataCard";
import ChartCard from "../components/ChartCard";
import FilterCard from "../components/FilterCard";
import HistoryCard from "../components/HistoryCard";
import DataPreview from "../components/DataPreview";
import ChartPanel from "../components/ChartPanel";
import Sidebar from "../components/Sidebar";
import Toast from "../components/Toast";
import API from "../api";
import { Menu, Sun, Moon } from "lucide-react";
import InsightsCard from "../components/InsightsCard";
import { motion } from "framer-motion";
import { validateDatasetInsights } from "../utils/helpers";

// Sample dataset
const sampleData = [
  { Quarter: "Q1", Sales: 120, Profit: 32, Region: "East" },
  { Quarter: "Q2", Sales: 180, Profit: 54, Region: "West" },
  { Quarter: "Q3", Sales: 140, Profit: 43, Region: "North" },
  { Quarter: "Q4", Sales: 210, Profit: 76, Region: "South" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

// Supported file types for validation
const SUPPORTED_MIME_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
  "text/csv", // .csv
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ExcelAnalyticsDashboard() {
  const navigate = useNavigate();
  const [theme, toggleTheme] = useTheme();
  const { history, addHistory, deleteHistory } = useHistory();

  const [rawData, setRawData] = useState(sampleData);
  const [datasetName, setDatasetName] = useState("Sample Dataset");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const headers = useMemo(
    () => (rawData.length ? Object.keys(rawData[0]) : []),
    [rawData]
  );
  const numericHeaders = useMemo(
    () => headers.filter((h) => rawData.some((r) => typeof r[h] === "number")),
    [headers, rawData]
  );

  const [chartType, setChartType] = useState("line");
  const [xField, setXField] = useState("");
  const [yFields, setYFields] = useState([]);
  const [chartColor, setChartColor] = useState("#6366f1"); // Default Indigo

  const [filterField, setFilterField] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const insightsRef = useRef(null);
  const scrollToInsights = () => {
    insightsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (!sidebarOpen) setSidebarOpen(true);
  };

  // Auto-set X/Y fields when headers change
  useEffect(() => {
    if (headers.length > 0) {
      setXField((prev) => (headers.includes(prev) ? prev : headers[0]));
      setYFields((prev) => {
        const valid = prev.filter((y) => headers.includes(y));
        if (valid.length > 0) return valid.slice(0, 3);
        // Auto-select first numeric column if nothing valid
        const firstNumeric = headers.find((h) =>
          rawData.some((r) => typeof r[h] === "number")
        );
        return firstNumeric ? [firstNumeric] : [];
      });
    }
  }, [headers, rawData]);

  // Filtered data based on selected filter
  const filteredData = useMemo(() => {
    if (!filterField || filterValue === "") return rawData;
    return rawData.filter(
      (row) => String(row[filterField]) === String(filterValue)
    );
  }, [rawData, filterField, filterValue]);

  // Generate basic insights
  const generateBasicInsights = (data, columns) => {
    return {
      rowCount: data.length,
      columnCount: columns.length,
      columns: columns,
    };
  };

  // Generate per-column insights with proper numeric types
  const generateColumnInsights = (data, columns) => {
    return columns.map((col) => {
      const values = data
        .map((row) => row[col])
        .filter((v) => v !== null && v !== undefined);

      let type = "text";
      const numericValues = values.filter((v) => !isNaN(Number(v)) && v !== "");
      if (numericValues.length > 0 && numericValues.length >= values.length * 0.5) {
        type = "numeric";
      }

      let insight = {
        column: col,
        type,
        uniqueCount: new Set(values).size,
        sampleValues: values.slice(0, 5),
      };

      if (type === "numeric") {
        const nums = numericValues.map(Number);
        const sorted = [...nums].sort((a, b) => a - b);
        const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
        const median =
          sorted.length % 2 === 0
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)];
        const variance =
          nums.reduce((acc, val) => acc + (val - mean) ** 2, 0) / nums.length;
        const stdDev = Math.sqrt(variance);

        // Store as numbers, not strings, to fix validation comparisons
        insight.min = Math.min(...nums);
        insight.max = Math.max(...nums);
        insight.mean = parseFloat(mean.toFixed(2));
        insight.median = parseFloat(median.toFixed(2));
        insight.stdDev = parseFloat(stdDev.toFixed(2));
      } else {
        const freq = {};
        values.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
        const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
        insight.topValue = sorted[0] ? sorted[0][0] : null;
      }
      return insight;
    });
  };

  const basicInsights = useMemo(
    () => ({
      ...generateBasicInsights(filteredData, headers),
      fileName: datasetName
    }),
    [filteredData, headers, datasetName]
  );
  const columnInsights = useMemo(
    () => generateColumnInsights(filteredData, headers),
    [filteredData, headers]
  );

  const insightsValidation = useMemo(
    () =>
      validateDatasetInsights({
        data: filteredData,
        columns: headers,
        basicInsights,
        columnInsights,
      }),
    [filteredData, headers, basicInsights, columnInsights]
  );

  const showToast = useCallback((message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "info" }),
      4000
    );
  }, []);

  // Parse file locally using XLSX (client-side fallback)
  const parseFileLocally = async (file) => {
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data, { type: "array" });
    const sheetName = wb.SheetNames[0];
    const ws = wb.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(ws, { defval: null });
    return json;
  };

  // Handle file upload – tries backend first, falls back to client-side parsing
  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type by extension (more reliable than MIME type)
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext)) {
      showToast("Invalid file type. Please upload .xlsx, .xls, or .csv files.", "error");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showToast("File too large. Max 10MB allowed.", "error");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Try backend upload first
      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      const data = res.data?.data || [];
      const fileName = res.data?.fileName || file.name;

      if (!data.length) throw new Error("No rows found in uploaded sheet.");

      setRawData(data);
      localStorage.setItem("uploadedData", JSON.stringify({ data, fileName, uploadedAt: new Date().toISOString() }));
      setDatasetName(fileName.replace(/\.(xlsx|xls|csv)$/i, ""));
      setUploadedFile(file);
      addHistory(fileName, data.length);
      showToast(`File uploaded successfully! (${data.length} rows)`, "success");
    } catch (apiErr) {
      // Fallback to client-side parsing if backend is unavailable
      console.warn("Backend upload failed, trying client-side parsing:", apiErr.message);

      try {
        setUploadProgress(50);
        const localData = await parseFileLocally(file);

        if (!localData.length) {
          showToast("No rows found in uploaded file.", "error");
          return;
        }

        setRawData(localData);
        localStorage.setItem("uploadedData", JSON.stringify({
          data: localData,
          fileName: file.name,
          uploadedAt: new Date().toISOString()
        }));
        setDatasetName(file.name.replace(/\.(xlsx|xls|csv)$/i, ""));
        setUploadedFile(file);
        addHistory(file.name, localData.length);
        setUploadProgress(100);
        showToast(`File parsed locally! (${localData.length} rows)`, "success");
      } catch (parseErr) {
        console.error("Client-side parsing also failed:", parseErr);
        showToast("Failed to parse file. Please check the format.", "error");
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = "";
    }
  }

  // Restore saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("uploadedData");
      const savedCharts = localStorage.getItem("chartSettings");
      const savedFilters = localStorage.getItem("filters");

      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data && Array.isArray(parsed.data) && parsed.data.length > 0) {
          setRawData(parsed.data);
          setDatasetName(parsed.fileName ? parsed.fileName.replace(/\.(xlsx|xls|csv)$/i, "") : "Uploaded Dataset");
        }
      }

      if (savedCharts) {
        const parsed = JSON.parse(savedCharts);
        if (parsed.chartType) setChartType(parsed.chartType);
        if (parsed.xField) setXField(parsed.xField);
        if (Array.isArray(parsed.yFields)) setYFields(parsed.yFields);
      }

      if (savedFilters) {
        const parsed = JSON.parse(savedFilters);
        setFilterField(parsed.filterField || "");
        setFilterValue(parsed.filterValue || "");
      }

      // If no local data, try fetching latest from backend
      if (!saved) {
        (async () => {
          try {
            const res = await API.get("/files/latest");
            if (res.data?.data?.length) {
              setRawData(res.data.data);
              setDatasetName(res.data.fileName || "Latest Dataset");
            }
          } catch (err) {
            console.log("No dataset found in DB yet.");
          }
        })();
      }
    } catch (err) {
      console.warn("Failed to parse saved settings:", err);
    }
  }, []);

  // Persist chart settings
  useEffect(() => {
    localStorage.setItem("chartSettings", JSON.stringify({ chartType, xField, yFields }));
  }, [chartType, xField, yFields]);

  // Persist filter settings
  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify({ filterField, filterValue }));
  }, [filterField, filterValue]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    showToast("Logged out successfully", "info");
  };

  const handleClearData = () => {
    localStorage.removeItem("uploadedData");
    localStorage.removeItem("chartSettings");
    localStorage.removeItem("filters");
    setRawData(sampleData);
    setDatasetName("Sample Dataset");
    setUploadedFile(null);
    setChartType("line");
    setXField("");
    setYFields([]);
    setFilterField("");
    setFilterValue("");
    showToast("Dashboard reset to sample dataset", "info");
  };

  const handleSelectHistory = (item) => {
    showToast(`Exploring ${item.fileName}...`, "info");
  };

  return (
    <div className="flex min-h-screen bg-[#F2F2F7] dark:bg-[#000000] relative overflow-hidden transition-colors duration-700">
      {/* Dynamic Background Blobs for Glassmorphism pop */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] right-[15%] w-[30%] h-[30%] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[110px] animate-blob animation-delay-4000"></div>
      </div>

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onUpload={onUpload}
        uploading={uploading}
        uploadProgress={uploadProgress}
        onShowInsights={scrollToInsights}
        onClearData={handleClearData}
        history={history}
        onSelectHistory={handleSelectHistory}
        onDeleteHistory={deleteHistory}
      />

      <main className={`flex-1 transition-all duration-500 ease-in-out ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-20 glass border-b border-[#D1D1D6] dark:border-[#38383A] flex items-center justify-between px-8 transition-all">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#007AFF] hover:scale-105 transition-all lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#007AFF] hover:scale-105 transition-all shadow-sm"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-[#000000] dark:text-white tracking-tight">
                  Dashboard
                </h1>
                <p className="text-[11px] text-[#8E8E93] font-medium tracking-tight">
                  Modern Data Intelligence
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* iOS Style Quick Stats */}
            <div className="hidden sm:flex items-center gap-5">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider">Rows</span>
                <span className="text-sm font-semibold text-[#000000] dark:text-white tabular-nums">{rawData.length.toLocaleString()}</span>
              </div>
              <div className="w-[1px] h-6 bg-[#D1D1D6] dark:bg-[#38383A]"></div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider">Cols</span>
                <span className="text-sm font-semibold text-[#000000] dark:text-white tabular-nums">{headers.length}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-8 max-w-[1600px] mx-auto space-y-8 relative z-10"
        >
          {/* Top Section: Upload and Filters */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-1">
              <motion.div variants={cardVariants} className="h-full">
                <DataCard
                  fileName={uploadedFile ? uploadedFile.name : datasetName}
                  rows={rawData.length}
                  onReplace={onUpload}
                />
              </motion.div>
            </div>

            <div className="xl:col-span-3">
              <motion.div variants={cardVariants} className="h-full">
                <FilterCard
                  columns={headers}
                  filterField={filterField}
                  setFilterField={setFilterField}
                  filterValue={filterValue}
                  setFilterValue={setFilterValue}
                  data={rawData}
                />
              </motion.div>
            </div>
          </div>

          {/* Middle Section: Chart Configuration and Main Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <motion.div variants={cardVariants} className="h-full">
                <ChartCard
                  chartType={chartType}
                  setChartType={setChartType}
                  chartColor={chartColor}
                  setChartColor={setChartColor}
                  xField={xField}
                  setXField={setXField}
                  yFields={yFields}
                  setYFields={setYFields}
                  columns={headers}
                  numericColumns={numericHeaders}
                />
              </motion.div>
            </div>

            <div className="lg:col-span-3">
              <motion.div variants={cardVariants} className="h-full">
                <ChartPanel
                  data={filteredData}
                  type={chartType}
                  xKey={xField}
                  yKeys={yFields}
                  theme={theme}
                  baseColor={chartColor}
                />
              </motion.div>
            </div>
          </div>

          {/* Lower Section: AI Insights and Performance Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={cardVariants}>
              <div ref={insightsRef}>
                <InsightsCard
                  basic={basicInsights}
                  columnInsights={columnInsights}
                  validation={insightsValidation}
                />
              </div>
            </motion.div>

            <motion.div variants={cardVariants}>
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-6 backdrop-blur-sm shadow-xl transition-all">
                <header className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Data Preview</h3>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase border border-gray-200 dark:border-gray-700">
                    {filteredData.length} total rows
                  </span>
                </header>
                <DataPreview data={filteredData} columns={headers} />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Global Toast Notification */}
        {toast.show && (
          <Toast
            toast={toast}
            setToast={setToast}
          />
        )}
      </main>
    </div>
  );
}