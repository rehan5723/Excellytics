import React, { useState, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import {
  FileSpreadsheet,
  Upload,
  LogOut,
  Menu,
  X,
  Home,
  User,
  BarChart2,
  Trash2,
} from "lucide-react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  onUpload,
  uploading,
  uploadProgress = 0,
  onShowInsights,
  onClearData,
  history = [],
  onSelectHistory,
  onDeleteHistory,
}) {
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const toggleProfile = useCallback(() => setShowProfile((prev) => !prev), []);

  const navButtonBaseClass = `flex items-center gap-4 rounded-2xl transition-all duration-300
    px-4 py-3 text-sm font-semibold
    hover:bg-[#E5E5EA] dark:hover:bg-[#2C2C2E] hover:text-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]`;

  const navButtonCollapsedClass = `w-12 h-12 mx-auto flex items-center justify-center rounded-2xl transition-all duration-300
    hover:bg-[#E5E5EA] dark:hover:bg-[#2C2C2E] hover:scale-105 hover:text-[#007AFF]`;

  const handleLogout = () => {
    logout("/login");
  };

  return (
    <>
      <aside
        className={`flex flex-col justify-between fixed top-0 left-0 h-screen z-40
          glass border-r border-[#D1D1D6] dark:border-[#38383A]
          transition-all duration-500 transform
          ${sidebarOpen ? "w-64" : "w-20"}`}
      >
        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-center justify-between h-14">
            {sidebarOpen && (
              <span className="font-bold text-[#000000] dark:text-white text-xl tracking-tight">
                Excellytics
              </span>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              className="p-2 rounded-full text-gray-400 hover:bg-gray-700/50 hover:text-white transition-all duration-300"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <nav className="flex flex-col gap-2 mt-8">
            <button
              className={sidebarOpen ? navButtonBaseClass : navButtonCollapsedClass}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              title="Home"
            >
              <Home className="h-5 w-5" />
              {sidebarOpen && <span>Home</span>}
            </button>

            <button
              className={sidebarOpen ? navButtonBaseClass : navButtonCollapsedClass}
              onClick={() => navigate("/dashboard")}
              title="Dashboard"
            >
              <FileSpreadsheet className="h-5 w-5" />
              {sidebarOpen && <span>Dashboard</span>}
            </button>

            <label
              className={`${sidebarOpen ? navButtonBaseClass : navButtonCollapsedClass} cursor-pointer`}
              title="Upload Data"
            >
              <Upload className="h-5 w-5" />
              {sidebarOpen && <span>Upload Data</span>}
              <input
                type="file"
                accept=".xls,.xlsx,.csv"
                className="hidden"
                onChange={onUpload}
              />
            </label>

            <button
              className={sidebarOpen ? navButtonBaseClass : navButtonCollapsedClass}
              onClick={onShowInsights}
              title="Insights"
            >
              <BarChart2 className="h-5 w-5" />
              {sidebarOpen && <span>Insights</span>}
            </button>

            {onClearData && (
              <button
                className={`${sidebarOpen ? navButtonBaseClass : navButtonCollapsedClass} hover:text-amber-400`}
                onClick={onClearData}
                title="Clear Data"
              >
                <Trash2 className="h-5 w-5" />
                {sidebarOpen && <span>Clear Data</span>}
              </button>
            )}

            {uploading && (
              <div className={`mt-2 ${sidebarOpen ? "w-full" : "w-12 mx-auto"}`}>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                {sidebarOpen && (
                  <p className="text-xs text-gray-400 mt-1 text-center">{uploadProgress}%</p>
                )}
              </div>
            )}

            {/* History Section */}
            {sidebarOpen && history.length > 0 && (
              <div className="mt-6 flex-1 flex flex-col min-h-0">
                <h4 className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Recent Files
                </h4>
                <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
                  {history.map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-800/40 transition-all cursor-pointer"
                      onClick={() => onSelectHistory(item)}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileSpreadsheet className="h-4 w-4 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                            {item.fileName}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {item.rows} rows
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteHistory(idx);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </nav>

          <div className="mt-auto pt-4 flex flex-col gap-2">
            <button
              onClick={toggleProfile}
              className={`${sidebarOpen ? navButtonBaseClass : navButtonCollapsedClass} ${showProfile ? "bg-gray-700/50 text-white" : ""}`}
              title={user?.name || "Profile"}
            >
              <User className="h-5 w-5" />
              {sidebarOpen && <span>Profile</span>}
            </button>

            <button
              onClick={handleLogout}
              className={`${sidebarOpen ? navButtonBaseClass : navButtonCollapsedClass} hover:bg-red-500/50 hover:text-red-300`}
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {showProfile && (
        <>
          <div className="fixed inset-0 bg-black/50 z-30" onClick={toggleProfile}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-6 rounded-2xl
            bg-gray-900/80 backdrop-blur-xl border border-gray-800 shadow-2xl w-80 max-w-[90vw]
            flex flex-col gap-4 text-white animate-fade-in">

            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold tracking-wide text-gray-900 dark:text-white">Profile</h3>
              <button onClick={toggleProfile} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-sm text-gray-300">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                <User className="h-5 w-5 text-indigo-400" />
                <div>
                  <p className="font-medium text-gray-100">{user?.name || "N/A"}</p>
                  <p className="text-xs text-gray-500">Name</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                <span className="text-indigo-400 text-sm">@</span>
                <div>
                  <p className="font-medium text-gray-100">{user?.email || "N/A"}</p>
                  <p className="text-xs text-gray-500">Email</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                <span className="text-indigo-400 text-sm">⚙</span>
                <div>
                  <p className="font-medium text-gray-100 capitalize">{user?.role || "N/A"}</p>
                  <p className="text-xs text-gray-500">Role</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-2 w-full bg-red-600 text-white rounded-lg hover:bg-red-700 py-3 transition font-medium tracking-wide"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </>
  );
}

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  uploading: PropTypes.bool.isRequired,
  uploadProgress: PropTypes.number,
  onShowInsights: PropTypes.func.isRequired,
  onClearData: PropTypes.func,
  history: PropTypes.array,
  onSelectHistory: PropTypes.func,
  onDeleteHistory: PropTypes.func,
};

Sidebar.defaultProps = {
  uploadProgress: 0,
  history: [],
};
