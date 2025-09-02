// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Users,
  Database,
  BarChart,
  LogOut,
  Menu,
  X,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import API from "../api";
import useTheme from "../hooks/useTheme";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  // Pagination states
  const [userPage, setUserPage] = useState(1);
  const [datasetPage, setDatasetPage] = useState(1);
  const [loginPage, setLoginPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resUsers, resDatasets, resLogin] = await Promise.all([
          API.get("/admin/users"),
          API.get("/admin/datasets"),
          API.get("/admin/login-history"),
        ]);

        setUsers(resUsers.data || []);
        setDatasets(resDatasets.data || []);
        setLoginHistory(
          (resLogin.data || []).map((l) => ({
            ...l,
            user: l.user || { name: "Deleted", email: "N/A" },
          }))
        );
      } catch (err) {
        showToast("Failed to load admin data", "error");
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    showToast("Logged out successfully", "info");
  };

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 4000);
  };

  const getToastIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "error":
        return <XCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getToastBgColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-100 border-green-400 text-green-800 dark:bg-green-900 dark:border-green-600 dark:text-green-200";
      case "error":
        return "bg-red-100 border-red-400 text-red-800 dark:bg-red-900 dark:border-red-600 dark:text-red-200";
      default:
        return "bg-blue-100 border-blue-400 text-blue-800 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-200";
    }
  };

  const paginate = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  // Delete handler
  const handleDelete = async (type, id) => {
    try {
      let url = type === "login" 
        ? `/admin/login-history/${id}` 
        : `/admin/${type}s/${id}`;

      await API.delete(url);

      showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`, "success");

      if (type === "user") setUsers((prev) => prev.filter((u) => u._id !== id));
      if (type === "dataset") setDatasets((prev) => prev.filter((d) => d._id !== id));
      if (type === "login") setLoginHistory((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error(err);
      showToast(`Failed to delete ${type}`, "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-950 text-gray-900 dark:text-gray-100">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg border shadow-lg ${getToastBgColor()} transition-all duration-300`}>
          {getToastIcon()}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast({ show: false, message: "", type: "info" })} className="ml-2 hover:opacity-70 transition-opacity">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`flex flex-col justify-between bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border-r border-gray-200 dark:border-gray-800 shadow-lg transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"} fixed h-screen z-40`}>
        <div>
          <div className="flex items-center justify-between p-4">
            {sidebarOpen && <span className="font-bold text-gray-900 dark:text-white">Admin Panel</span>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-2 p-2 mt-2">
            <Link to="/dashboard" className={`flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 ${sidebarOpen ? "bg-indigo-100 dark:bg-indigo-900" : ""}`}>
              <BarChart className="h-5 w-5" />
              {sidebarOpen && "User Dashboard"}
            </Link>

            <button onClick={handleLogout} className="flex items-center gap-2 p-2 rounded hover:bg-red-600 hover:text-white transition">
              <LogOut className="h-5 w-5" />
              {sidebarOpen && "Logout"}
            </button>
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Users */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" /> Manage Users
          </h2>
          <div className="bg-white/70 dark:bg-gray-900/60 rounded-lg shadow p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginate(users, userPage).map((u) => (
                  <tr key={u._id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2 capitalize">{u.role}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete("user", u._id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={() => setUserPage((p) => Math.max(p - 1, 1))}
                disabled={userPage === 1}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">Page {userPage}</span>
              <button
                onClick={() => setUserPage((p) => p + 1)}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Datasets */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-600" /> Uploaded Datasets
          </h2>
          <div className="bg-white/70 dark:bg-gray-900/60 rounded-lg shadow p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Rows</th>
                  <th className="text-left p-2">Uploaded By</th>
                  <th className="text-left p-2">Uploaded At</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginate(datasets, datasetPage).map((d) => (
                  <tr key={d._id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-2">{d.fileName}</td>
                    <td className="p-2">{d.rowCount}</td>
                    <td className="p-2">{d.uploadedBy?.email || "N/A"}</td>
                    <td className="p-2">{new Date(d.uploadedAt || d.createdAt).toLocaleString()}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete("dataset", d._id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={() => setDatasetPage((p) => Math.max(p - 1, 1))}
                disabled={datasetPage === 1}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">Page {datasetPage}</span>
              <button
                onClick={() => setDatasetPage((p) => p + 1)}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Login History */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-600" /> Login History
          </h2>
          <div className="bg-white/70 dark:bg-gray-900/60 rounded-lg shadow p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Time</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginate(loginHistory, loginPage).map((l) => (
                  <tr key={l._id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-2">{l.user?.name}</td>
                    <td className="p-2">{l.user?.email}</td>
                    <td className="p-2">{new Date(l.timestamp || l.createdAt).toLocaleString()}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete("login", l._id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={() => setLoginPage((p) => Math.max(p - 1, 1))}
                disabled={loginPage === 1}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">Page {loginPage}</span>
              <button
                onClick={() => setLoginPage((p) => p + 1)}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
