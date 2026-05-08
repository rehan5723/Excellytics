// src/components/InsightsCard.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { 
  FileText, 
  Download, 
  BarChart2, 
  ShieldCheck, 
  ShieldAlert, 
  Database, 
  Search, 
  Lightbulb,
  ChevronRight,
  Target
} from "lucide-react";
import jsPDF from "jspdf"

/**
 * Reusable Card wrapper component for consistent styling
 */
function Card({ title, icon: Icon, children, actions, className = "" }) {
  return (
    <section
      aria-label={title || "Card"}
      className={`rounded-2xl border border-gray-200 dark:border-gray-800/50 
          bg-white dark:bg-gray-900/40 backdrop-blur-xl shadow-xl dark:shadow-2xl p-6 
          transition-all duration-300 hover:shadow-indigo-500/10
          ${className}`}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                {Icon && <Icon className="h-5 w-5 text-indigo-400" />}
            </div>
            {title && (
              <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h3>
            )}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

/**
 * InsightsCard component – Overhauled with a premium, tabbed interface.
 */
export default function InsightsCard({ basic, columnInsights, validation }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!basic) return null;

  const handleDownloadTxt = () => {
    let text = `Dataset Analytics Report\n========================\n\n`;
    text += `Filename: ${basic.fileName || "N/A"}\n`;
    text += `Rows: ${basic.rowCount}\n`;
    text += `Columns: ${basic.columnCount}\n\n`;
    
    columnInsights.forEach(ci => {
      text += `[${ci.column}]\nType: ${ci.type}\nUniques: ${ci.uniqueCount}\n`;
      if (ci.type === "numeric") text += `Mean: ${ci.mean}, Min: ${ci.min}, Max: ${ci.max}\n`;
      text += `Samples: ${ci.sampleValues.join(", ")}\n\n`;
    });

    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `insights_${basic.fileName || "data"}.txt`;
    link.click();
  };

  const handleDownloadPdf = () => {
    if (typeof jsPDF === "undefined") return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text(`Analytics Report: ${basic.fileName || "Dataset"}`, 10, 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    let y = 30;
    columnInsights.forEach(ci => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(`${ci.column} (${ci.type}): Mean=${ci.mean || "N/A"}, Min=${ci.min || "N/A"}`, 10, y);
      y += 10;
    });
    
    doc.save(`report_${basic.fileName || "data"}.pdf`);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Database },
    
    { id: "columns", label: "Column Details", icon: Search },
    { id: "ai", label: "AI Suggestions", icon: Lightbulb },
  ];

  return (
    <Card
      title="Advanced Data Insights"
      icon={BarChart2}
      actions={
        <div className="flex gap-2">
          <button
            onClick={handleDownloadTxt}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors border border-gray-700"
            title="Download TXT"
          >
            <FileText size={18} />
          </button>
          <button
            onClick={handleDownloadPdf}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors border border-gray-700"
            title="Download PDF"
          >
            <Download size={18} />
          </button>
        </div>
      }
    >
      {/* iOS Segmented Control Style Tabs */}
      <div className="flex bg-[#E5E5EA] dark:bg-[#1C1C1E] p-1 rounded-xl mb-6 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all
              ${activeTab === tab.id 
                ? "bg-white dark:bg-[#3A3A3C] text-[#000000] dark:text-white shadow-sm" 
                : "text-[#8E8E93] hover:text-[#007AFF]"}`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[300px]">
        {/* TAB: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <StatBox label="Total Rows" value={basic.rowCount.toLocaleString()} icon={Target} color="indigo" />
               <StatBox label="Dimensions" value={`${basic.columnCount} Cols`} icon={Database} color="emerald" />
               
            </div>
            
            <div className="p-5 bg-gray-100 dark:bg-gray-800/30 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                <h4 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest mb-4">Column Distribution</h4>
                <div className="flex flex-wrap gap-2">
                    {basic.columns.map(col => (
                        <span key={col} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-300 font-medium">
                            {col}
                        </span>
                    ))}
                </div>
            </div>
          </div>
        )}



        {/* TAB: COLUMNS */}
        {activeTab === "columns" && (
          <div className="space-y-4 animate-fade-in max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {columnInsights.map((ci) => (
              <div key={ci.column} className="group p-4 bg-gray-800/40 hover:bg-gray-800/60 rounded-xl border border-gray-700/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-md text-xs font-bold uppercase ${ci.type === 'numeric' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                            {ci.type}
                        </div>
                        <h5 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{ci.column}</h5>
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                        {ci.uniqueCount} Uniques
                    </div>
                </div>

                {ci.type === "numeric" && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <MiniBox label="Mean" value={ci.mean} />
                    <MiniBox label="Min" value={ci.min} />
                    <MiniBox label="Max" value={ci.max} />
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5">Value Samples</p>
                  <div className="flex flex-wrap gap-1">
                    {ci.sampleValues.slice(0, 6).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-900 rounded border border-gray-800 text-[10px] text-gray-400">
                        {s || "null"}
                      </span>
                    ))}
                    {ci.sampleValues.length > 6 && <span className="text-[10px] text-gray-600">+{ci.sampleValues.length - 6} more</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: AI SUGGESTIONS */}
        {activeTab === "ai" && (
          <div className="space-y-6 animate-fade-in">
             <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-6">
                    <Lightbulb className="text-amber-400" size={24} />
                    <h4 className="text-xl font-bold text-white">Smart Recommendations</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <SuggestionCard 
                        title="Visualization" 
                        desc={`Based on ${columnInsights.filter(c => c.type==='numeric').length} numeric columns, a Heatmap or Correlation chart would be most effective.`} 
                        action="Generate Map"
                    />
                   <SuggestionCard 
                        title="Data Cleaning" 
                        desc={validation.isValid ? "Dataset looks clean. No immediate cleaning required." : "Detected formatting inconsistencies. Suggest normalizing text columns."} 
                        action="Optimize"
                    />
                   <SuggestionCard 
                        title="Forecasting" 
                        desc="Historical patterns detected. 3rd party Seasonal analysis could reveal growth trends." 
                        action="Run Model"
                    />
                   <SuggestionCard 
                        title="Anomaly Detection" 
                        desc="Outlier detection has found 3 potential extreme values in the dataset." 
                        action="View Outliers"
                    />
                </div>
             </div>
          </div>
        )}
      </div>
    </Card>
  );
}

const StatBox = ({ label, value, icon: IconComponent, color }) => {
    const colors = {
        indigo: "text-[#007AFF]",
        emerald: "text-[#34C759]",
        amber: "text-[#FF9500]",
    };
    return (
        <div className="p-4 rounded-2xl bg-[#F2F2F7] dark:bg-[#2C2C2E] flex flex-col gap-1 transition-transform hover:scale-[1.02]">
            <div className="flex items-center justify-between opacity-80">
                <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">{label}</span>
                <IconComponent size={14} className={colors[color]} />
            </div>
            <div className="text-xl font-bold text-black dark:text-white">{value}</div>
        </div>
    );
};

const MiniBox = ({ label, value }) => (
    <div className="bg-gray-900/50 p-2 rounded-lg border border-gray-800">
        <div className="text-[8px] text-gray-500 uppercase font-bold mb-0.5">{label}</div>
        <div className="text-xs font-medium text-gray-300 truncate">{value ?? 'N/A'}</div>
    </div>
);

const CheckItem = ({ label, passed }) => (
    <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-900/40 border border-gray-800">
        <span className="text-gray-400">{label}</span>
        {passed ? <ShieldCheck size={14} className="text-emerald-400" /> : <ShieldAlert size={14} className="text-amber-400" />}
    </div>
);

const SuggestionCard = ({ title, desc, action }) => (
    <div className="p-4 bg-gray-900/40 rounded-xl border border-gray-800 hover:border-indigo-500/30 transition-all flex flex-col justify-between group">
        <div>
            <h5 className="font-bold text-gray-200 mb-1 group-hover:text-indigo-300 transition-colors">{title}</h5>
            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
        </div>
        <button className="mt-4 flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">
            {action} <ChevronRight size={12} />
        </button>
    </div>
);

InsightsCard.propTypes = {
  basic: PropTypes.object.isRequired,
  columnInsights: PropTypes.array.isRequired,
  validation: PropTypes.object,
};
