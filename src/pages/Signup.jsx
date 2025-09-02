import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiInfo, FiUser, FiMail, FiLock, FiKey } from "react-icons/fi";
import { motion } from "framer-motion";
import API from "../api";
import { UserContext } from "../context/UserContext";

export default function SignUp() {
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [secretKey, setSecretKey] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (role === "admin") {
        res = await API.post("/auth/create-admin", {
          name,
          email,
          password,
          secret: secretKey,
        });
      } else {
        res = await API.post("/auth/signup", { name, email, password });
      }

      // Use context to update logged-in user
      loginUser({
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
        token: res.data.token,
      });

      // Navigate after signup
      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  const fieldVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-950 p-4 relative">
      {/* Background blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-2/3 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-900/60 backdrop-blur-3xl rounded-3xl shadow-2xl shadow-gray-900/50 border border-gray-700/50 p-8 relative z-10"
      >
        <h2 className="text-3xl font-extrabold text-white mb-2 text-center tracking-tight">
          Create your <span className="text-indigo-400">Excellytics</span> account
        </h2>
        <p className="text-center text-sm text-gray-400 mb-8 font-light">
          Join us and start your journey.
        </p>

        <form className="space-y-5" onSubmit={handleSignUp}>
          {/* Name */}
          <motion.div variants={fieldVariants} initial="initial" animate="animate" transition={{ delay: 0.1 }}>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500"><FiUser /></span>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition duration-200"
                placeholder="Your name"
              />
            </div>
          </motion.div>

          {/* Email */}
          <motion.div variants={fieldVariants} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500"><FiMail /></span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition duration-200"
                placeholder="Your email address"
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div variants={fieldVariants} initial="initial" animate="animate" transition={{ delay: 0.3 }}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500"><FiLock /></span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition duration-200"
                placeholder="Create a strong password"
              />
            </div>
          </motion.div>

          {/* Role */}
          <motion.div variants={fieldVariants} initial="initial" animate="animate" transition={{ delay: 0.4 }}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
            <div className="flex gap-3">
              {["user", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-3 rounded-lg border text-sm font-semibold transition-all duration-300
                    ${role === r ? "bg-indigo-600 text-white border-indigo-600" : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600"}`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Admin Secret Key */}
          {role === "admin" && (
            <motion.div variants={fieldVariants} initial="initial" animate="animate" transition={{ delay: 0.5 }}>
              <label htmlFor="secretKey" className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                Admin Secret Key
                <span
                  className="relative cursor-pointer text-gray-500 hover:text-gray-400"
                  onMouseEnter={() => setTooltipVisible(true)}
                  onMouseLeave={() => setTooltipVisible(false)}
                >
                  <FiInfo />
                  <span className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs px-3 py-2 text-xs text-white bg-gray-700 rounded-lg shadow-xl transition-opacity duration-300 ${tooltipVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                    Only enter if you have been provided with the secret admin key.
                  </span>
                </span>
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500"><FiKey /></span>
                <input
                  id="secretKey"
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  required
                  className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition duration-200"
                  placeholder="Enter admin secret"
                />
              </div>
            </motion.div>
          )}

          {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 mt-6"
          >
            Sign Up
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline font-medium">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
