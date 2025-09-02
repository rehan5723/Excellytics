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
} from "lucide-react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  onUpload,
  uploading,
  uploadProgress = 0,
  onShowInsights,
}) {
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate(); // <-- initialize navigate

  const toggleProfile = useCallback(() => setShowProfile((prev) => !prev), []);

  const navButtonBaseClass = `flex items-center gap-4 rounded-xl transition-all duration-300
    px-4 py-3 text-sm font-medium
    hover:bg-gray-700/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`;

  const navButtonCollapsedClass = `w-12 h-12 mx-auto flex items-center justify-center rounded-2xl transition-all duration-300
    hover:bg-gray-700/50 hover:scale-110`;

  const handleLogout = () => {
    logout();       // clear user data
    navigate("/");  // redirect to landing page
  };

  return (
    <>
      <aside
        className={`flex flex-col justify-between fixed top-0 left-0 h-screen z-40
          bg-gray-900/60 backdrop-blur-xl border-r border-gray-800
          shadow-2xl transition-all duration-500 transform
          ${sidebarOpen ? "w-64" : "w-20"}`}
      >
        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-center justify-between h-14">
            {sidebarOpen && (
              <span className="font-extrabold text-white text-lg tracking-wide">
                Excel Analytics Platform
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
              className={`${sidebarOpen ? navButtonBaseClass : navButtonCollapsedClass} text-gray-500 cursor-not-allowed`}
              disabled
              title="Coming soon"
            >
              <FileSpreadsheet className="h-5 w-5" />
              {sidebarOpen && <span>Dashboard</span>}
            </button>

            <label className={sidebarOpen ? navButtonBaseClass : navButtonCollapsedClass}>
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

            {uploading && (
              <div className={`mt-2 ${sidebarOpen ? "w-full" : "w-12 mx-auto"}`}>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
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
              onClick={handleLogout} // <-- use handleLogout
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
            bg-gray-900/60 backdrop-blur-xl border border-gray-800 shadow-2xl w-80 max-w-[90vw]
            flex flex-col gap-4 text-white">

            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold tracking-wide">Profile</h3>
              <button onClick={toggleProfile} className="text-gray-400 hover:text-white transition">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col gap-2 text-sm text-gray-300">
              <p><strong>Name:</strong> {user?.name || "N/A"}</p>
              <p><strong>Email:</strong> {user?.email || "N/A"}</p>
              <p><strong>Role:</strong> {user?.role || "N/A"}</p>
            </div>

            <button
              onClick={handleLogout} // <-- logout in profile modal
              className="mt-4 w-full bg-red-600 text-white rounded-lg hover:bg-red-700 py-3 transition font-medium tracking-wide"
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
};

Sidebar.defaultProps = {
  uploadProgress: 0,
};
