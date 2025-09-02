// src/pages/ExcelAnalyticsDashboard.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { Menu } from "lucide-react";
import InsightsCard from "../components/InsightsCard";
import { motion } from "framer-motion";

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

export default function ExcelAnalyticsDashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useTheme();
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

  const [filterField, setFilterField] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState([]);

  const insightsRef = useRef(null);
  const scrollToInsights = () => {
    insightsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (!sidebarOpen) setSidebarOpen(true);
  };

  useEffect(() => {
    setXField((k) => (headers.includes(k) ? k : headers[0] || ""));
    setYFields((ys) => ys.filter((y) => headers.includes(y)).slice(0, 3));
  }, [headers]);

  useEffect(() => {
    setPreviewData(rawData.slice(0, 5));
  }, [rawData]);

  const filteredData = useMemo(() => {
    if (!filterField || filterValue === "") return rawData;
    return rawData.filter(
      (row) => String(row[filterField]) === String(filterValue)
    );
  }, [rawData, filterField, filterValue]);

  const generateBasicInsights = (data, columns) => {
    return {
      rowCount: data.length,
      columnCount: columns.length,
      columns: columns,
    };
  };

  const generateColumnInsights = (data, columns) => {
    return columns.map((col) => {
      const values = data
        .map((row) => row[col])
        .filter((v) => v !== null && v !== undefined);

      let type = "text";
      if (values.every((v) => !isNaN(Number(v)))) type = "numeric";

      let insight = {
        column: col,
        type,
        uniqueCount: new Set(values).size,
        sampleValues: values.slice(0, 5),
      };

      if (type === "numeric") {
        const nums = values.map(Number);
        nums.sort((a, b) => a - b);
        const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
        const median =
          nums.length % 2 === 0
            ? (nums[nums.length / 2 - 1] + nums[nums.length / 2]) / 2
            : nums[Math.floor(nums.length / 2)];
        const variance =
          nums.reduce((acc, val) => acc + (val - mean) ** 2, 0) / nums.length;
        const stdDev = Math.sqrt(variance);

        insight.min = Math.min(...nums);
        insight.max = Math.max(...nums);
        insight.mean = mean.toFixed(2);
        insight.median = median.toFixed(2);
        insight.stdDev = stdDev.toFixed(2);
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
    () => generateBasicInsights(filteredData, headers),
    [filteredData, headers]
  );
  const columnInsights = useMemo(
    () => generateColumnInsights(filteredData, headers),
    [filteredData, headers]
  );

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "info" }),
      4000
    );
  };

  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(file.type)) {
      showToast("Invalid file type. Please upload an Excel file (.xls or .xlsx).", "error");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("File too large. Max 5MB allowed.", "error");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setUploading(true);
        setUploadProgress(0);

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
        const fileName = res.data?.fileName;

        if (!data.length) throw new Error("No rows found in uploaded sheet.");

        setRawData(data);
        localStorage.setItem("uploadedData", JSON.stringify({ data, fileName, uploadedAt: new Date().toISOString() }));
        setDatasetName(fileName ? fileName.replace(/\.(xlsx|xls)$/i, "") : "Uploaded Dataset");
        setUploadedFile(file);
        addHistory(fileName || "Uploaded Dataset", data.length);
        showToast("File uploaded successfully!", "success");
      } catch (err) {
        console.error("Upload failed:", err);
        showToast(err.response?.data?.message || err.message || "Upload failed.", "error");
      } finally {
        setUploading(false);
        setUploadProgress(0);
        e.target.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem("uploadedData");
      const savedCharts = localStorage.getItem("chartSettings");
      const savedFilters = localStorage.getItem("filters");

      if (saved) {
        const parsed = JSON.parse(saved);
        setRawData(parsed.data || []);
        setDatasetName(parsed.fileName ? parsed.fileName.replace(/\.(xlsx|xls)$/i, "") : "Uploaded Dataset");
      }

      if (savedCharts) {
        const parsed = JSON.parse(savedCharts);
        if (parsed.chartType) setChartType(parsed.chartType);
        if (parsed.xField) setXField(parsed.xField);
        if (parsed.yFields) setYFields(parsed.yFields);
      }

      if (savedFilters) {
        const parsed = JSON.parse(savedFilters);
        setFilterField(parsed.filterField || "");
        setFilterValue(parsed.filterValue || "");
      }

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

  useEffect(() => {
    localStorage.setItem("chartSettings", JSON.stringify({ chartType, xField, yFields }));
  }, [chartType, xField, yFields]);

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

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        theme={theme}
        setTheme={setTheme}
        onUpload={onUpload}
        uploading={uploading}
        uploadProgress={uploadProgress}
        handleLogout={handleLogout}
        onClearData={handleClearData}
        onShowInsights={scrollToInsights}
      />

      {/* Main content */}
      <main
        className={`flex-1 p-4 lg:p-6 transition-all duration-300 overflow-auto ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {!sidebarOpen && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-gray-800 rounded-full shadow-lg border border-gray-700 text-gray-300"
          >
            <Menu className="h-5 w-5" />
          </motion.button>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6"
        >
          {/* Left column */}
          <div className="xl:col-span-1 space-y-4 lg:space-y-6">
            <motion.div variants={cardVariants}>
              <DataCard
                fileName={uploadedFile ? uploadedFile.name : datasetName}
                rows={rawData.length}
                onReplace={onUpload}
                uploading={uploading}
                progress={uploadProgress}
              />
            </motion.div>
            <motion.div variants={cardVariants}>
              <ChartCard
                chartType={chartType}
                setChartType={setChartType}
                xField={xField}
                setXField={setXField}
                yFields={yFields}
                setYFields={setYFields}
                columns={headers}
                numericColumns={numericHeaders}
              />
            </motion.div>
            <motion.div variants={cardVariants}>
              <FilterCard
                filterField={filterField}
                setFilterField={setFilterField}
                filterValue={filterValue}
                setFilterValue={setFilterValue}
                columns={headers}
                data={rawData}
              />
            </motion.div>
            <motion.div variants={cardVariants}>
              <HistoryCard history={history} onDelete={deleteHistory} />
            </motion.div>
          </div>

          {/* Right column */}
          <div className="xl:col-span-3 space-y-4 lg:space-y-6">
            <motion.div variants={cardVariants}>
              <ChartPanel
                type={chartType}
                data={filteredData}
                xKey={xField}
                yKeys={yFields}
                theme={theme}
              />
            </motion.div>

            <motion.section
              variants={cardVariants}
              className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 lg:p-5"
            >
              <header className="flex items-center justify-between mb-3">
                <h3 className="text-base lg:text-lg font-semibold">
                  Data Preview
                </h3>
                {previewData.length > 0 && (
                  <span className="text-xs lg:text-sm text-gray-500">
                    Previewing first {previewData.length} rows
                  </span>
                )}
              </header>
              <DataPreview
                data={previewData.length ? previewData : filteredData.slice(0, 5)}
                columns={headers}
              />
            </motion.section>

            <motion.div ref={insightsRef} variants={cardVariants}>
              <InsightsCard
                basic={basicInsights}
                columnInsights={columnInsights}
                datasetName={datasetName}
              />
            </motion.div>
          </div>
        </motion.div>

        <div className="mt-6 lg:mt-10 text-center text-xs text-gray-500">
          Built with React · Tailwind · Recharts · Framer Motion
        </div>
      </main>

      {/* Toast */}
      <Toast toast={toast} setToast={setToast} />
    </div>
  );
}

// A tutorial for building a responsive React admin dashboard can provide helpful insights and code examples for your project.

// [Build a COMPLETE React Admin Dashboard App | React, Material UI, Data Grid, Light & Dark Mode](https://www.youtube.com/watch?v=wYpCWwD1oz0)
// http://googleusercontent.com/youtube_content/0