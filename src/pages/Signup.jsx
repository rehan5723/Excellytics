// src/pages/Signup.jsx
import React, { useState, useContext, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiKey, FiEye, FiEyeOff, FiCheck, FiArrowRight, FiInfo, FiShield } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";
import { UserContext } from "../context/UserContext";
import { GoogleLogin } from "@react-oauth/google";

// Password strength calculator
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "", width: "0%" };

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score, label: "Very Weak", color: "bg-red-500", textColor: "text-red-400", width: "16%" };
  if (score <= 2) return { score, label: "Weak", color: "bg-orange-500", textColor: "text-orange-400", width: "33%" };
  if (score <= 3) return { score, label: "Fair", color: "bg-yellow-500", textColor: "text-yellow-400", width: "50%" };
  if (score <= 4) return { score, label: "Good", color: "bg-blue-500", textColor: "text-blue-400", width: "66%" };
  if (score <= 5) return { score, label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-400", width: "83%" };
  return { score, label: "Very Strong", color: "bg-emerald-400", textColor: "text-emerald-300", width: "100%" };
}

// Password requirement checks
function getPasswordChecks(password) {
  return [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^a-zA-Z0-9]/.test(password) },
  ];
}

export default function SignUp() {
  const navigate = useNavigate();
  const { loginUser, user } = useContext(UserContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user?.token) {
      navigate(user.role === "admin" ? "/admin-dashboard" : "/dashboard");
    }
  }, [user, navigate]);

  // Email validation
  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  // Password strength
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordChecks = useMemo(() => getPasswordChecks(password), [password]);
  const passwordsMatch = confirmPassword && password === confirmPassword;

  // Form validation
  const isFormValid = useMemo(() => {
    if (!name.trim() || !isValidEmail(email) || password.length < 6 || password !== confirmPassword) return false;
    if (!acceptTerms) return false;
    return true;
  }, [name, email, password, confirmPassword, acceptTerms]);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/google-login", {
        credential: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      loginUser({
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
        token: res.data.token,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(res.data.user.role === "admin" ? "/admin-dashboard" : "/dashboard");
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || "Google Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!acceptTerms) {
      setError("Please accept the terms and conditions.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/signup", {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
      });

      // Save token
      localStorage.setItem("token", res.data.token);

      // Update context
      loginUser({
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
        token: res.data.token,
      });

      setSuccess(true);

      // Navigate after brief success animation
      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Signup failed";
      setError(msg);
      const form = document.getElementById("signup-form");
      form?.classList.add("animate-shake");
      setTimeout(() => form?.classList.remove("animate-shake"), 500);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError = false) =>
    `w-full px-4 py-3 pl-11 rounded-xl border bg-gray-800/60 text-gray-100 placeholder-gray-500 
    focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all duration-200
    ${hasError ? "border-red-500/50" : "border-gray-700/60 hover:border-gray-600"}`;

  return (
    <div className="flex items-center justify-center p-4 relative min-h-screen bg-gray-950 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <motion.div
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 40, -30, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full filter blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -50, 20, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-600/20 rounded-full filter blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -20, 30, 0],
            y: [0, 30, -20, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full filter blur-3xl"
        />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }} />
      </div>

      {/* Signup Card */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg relative z-10 my-8"
      >
        <div className="bg-gray-900/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/40 border border-gray-700/40 p-8 sm:p-10">
          {/* Logo / Brand */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500 grid place-items-center mb-6 shadow-lg shadow-purple-500/20"
          >
            <span className="text-white text-2xl font-bold">E</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-extrabold text-white mb-1 text-center tracking-tight"
          >
            Create your account
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-center text-sm text-gray-400 mb-8 font-light"
          >
            Start your journey with <span className="text-indigo-400 font-medium">Excellytics</span>
          </motion.p>

          <form id="signup-form" className="space-y-4" onSubmit={handleSignUp} noValidate>
            {/* Name Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                  <FiUser className="w-4 h-4" />
                </span>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  required
                  autoComplete="name"
                  className={inputClass(!name.trim() && error)}
                  placeholder="John Doe"
                />
                {name.trim().length >= 2 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-400">
                    <FiCheck className="w-4 h-4" />
                  </motion.span>
                )}
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                  <FiMail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  required
                  autoComplete="email"
                  className={inputClass(!isValidEmail(email) && email && error)}
                  placeholder="you@example.com"
                />
                {email && isValidEmail(email) && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-400">
                    <FiCheck className="w-4 h-4" />
                  </motion.span>
                )}
              </div>
            </motion.div>

            {/* Password Field with Strength */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                  <FiLock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onFocus={() => setShowPasswordReqs(true)}
                  onBlur={() => setTimeout(() => setShowPasswordReqs(false), 200)}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  required
                  autoComplete="new-password"
                  className={`${inputClass()} pr-12`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Bar */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Password strength</span>
                    <span className={`text-xs font-medium ${passwordStrength.textColor}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: passwordStrength.width }}
                      transition={{ duration: 0.3 }}
                      className={`h-full rounded-full ${passwordStrength.color}`}
                    />
                  </div>
                </motion.div>
              )}

              {/* Password Requirements Checklist */}
              <AnimatePresence>
                {showPasswordReqs && password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 p-3 rounded-lg bg-gray-800/40 border border-gray-700/30"
                  >
                    <ul className="space-y-1">
                      {passwordChecks.map((check) => (
                        <li key={check.label} className="flex items-center gap-2 text-xs">
                          <span className={`flex-shrink-0 w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                            check.met
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                              : "border-gray-600 text-gray-600"
                          }`}>
                            {check.met && <FiCheck className="w-2.5 h-2.5" />}
                          </span>
                          <span className={check.met ? "text-gray-300" : "text-gray-500"}>
                            {check.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
            >
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                  <FiLock className="w-4 h-4" />
                </span>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  required
                  autoComplete="new-password"
                  className={`${inputClass(confirmPassword && !passwordsMatch)} pr-12`}
                  placeholder="Re-enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-1">
                  {passwordsMatch && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-400">
                      <FiCheck className="w-4 h-4" />
                    </motion.span>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {confirmPassword && !passwordsMatch && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-400 mt-1"
                >
                  Passwords do not match
                </motion.p>
              )}
            </motion.div>

            {/* Terms */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-gray-600 bg-gray-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0 focus:ring-offset-gray-900 cursor-pointer"
                />
                <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                  I agree to the Terms of Service and Privacy Policy. 
                  My data will be processed securely.
                </span>
              </label>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                  <span className="text-red-400 text-sm flex-1">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading || success || !isFormValid}
              className={`w-full relative overflow-hidden font-bold py-3.5 px-4 rounded-xl transition-all duration-300 mt-2
                flex items-center justify-center gap-2 text-sm tracking-wide
                ${success
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                  : isFormValid
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700/50"
                }
                disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : success ? (
                <>
                  <FiCheck className="w-5 h-5" />
                  <span>Account created! Redirecting...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700/50" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-900/70 px-4 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="flex justify-center flex-col items-center gap-4">
             <div className="w-full flex justify-center">
               <GoogleLogin
                 onSuccess={handleGoogleSuccess}
                 onError={() => setError("Google Signup failed")}
                 theme="filled_black"
                 shape="pill"
               />
             </div>

            <div className="relative w-full my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-900/70 px-4 text-gray-500">Already have an account?</span>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="w-full block text-center py-3 px-4 rounded-xl border border-gray-700/50 text-gray-300 
              hover:bg-gray-800/50 hover:border-gray-600 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            Sign in to your account
          </Link>
        </div>

        {/* Security Badge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-gray-600 mt-6 flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Your data is encrypted and secured
        </motion.p>
      </motion.div>

      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
