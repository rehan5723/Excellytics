// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
import API from "../api";
import { UserContext } from "../context/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });

      // Save token to localStorage for persistent auth
      localStorage.setItem("token", res.data.token);

      // Update context with user info
      loginUser({
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
        token: res.data.token,
      });

      // Navigate based on role
      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const fieldVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex items-center justify-center p-4 relative h-screen bg-gray-950">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-2/3 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-900/60 backdrop-blur-3xl rounded-3xl shadow-2xl shadow-gray-900/50 border border-gray-700/50 p-8 relative z-10"
      >
        <h2 className="text-3xl font-extrabold text-white mb-2 text-center tracking-tight">
          Welcome back to <span className="text-indigo-400">Excellytics</span>
        </h2>
        <p className="text-center text-sm text-gray-400 mb-8 font-light">
          Please log in to your account.
        </p>

        <form className="space-y-5" onSubmit={handleLogin}>
          <motion.div variants={fieldVariants} initial="initial" animate="animate" transition={{ delay: 0.1 }}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500"><FiMail /></span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition duration-200"
                placeholder="Your email address"
              />
            </div>
          </motion.div>

          <motion.div variants={fieldVariants} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500"><FiLock /></span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition duration-200"
                placeholder="Your password"
              />
            </div>
          </motion.div>

          {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 mt-6 "
          >
            Login
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline font-medium">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
}
