import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, User, Mail, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import config from "../config";

const AuthForm = ({ type = "login", onAuthSuccess, onClose }) => {
  const isLogin = type === "login";
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    // Reset form when type changes
    setError("");
    setFieldErrors({});
    setUsername("");
    setEmail("");
    setPassword("");
  }, [type]);

  const validateForm = () => {
    let errors = {};
    if (!username.trim()) {
      errors.username = "Username is required";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
    if (!isLogin) {
      if (!email.trim()) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "Email is invalid";
      }
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    const endpoint = isLogin
      ? `${config.apiUrl}/api/auth/login`
      : `${config.apiUrl}/api/auth/register`;
    const body = isLogin
      ? { username, password }
      : { username, email, password };
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      if (onAuthSuccess) {
        onAuthSuccess(data.data.token, data.data.user);
        navigate('/dashboard'); // explicit navigation on success
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-900/50 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative w-full max-w-2xl h-auto md:h-[500px] rounded-3xl bg-white dark:bg-neutral-900 shadow-2xl border border-surface-200 dark:border-neutral-800 flex flex-col md:flex-row overflow-hidden"
      >
        <Link
          to="/"
          className="absolute top-4 right-4 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors z-50 p-2 rounded-full"
          aria-label="Close form"
        >
          <X size={24} />
        </Link>

        {/* Left Section - Form */}
        <div className="md:w-1/2 flex items-center justify-center p-6 md:p-8">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-extrabold text-center mb-4 text-neutral-900 dark:text-neutral-100 drop-shadow-sm">
              {isLogin ? "Welcome Back!" : "Create Your Journey"}
            </h2>
            <p className="text-center text-neutral-600 dark:text-neutral-400 mb-6 text-sm">
              {isLogin ? "Login to continue your career path." : "Sign up to begin your personalized roadmap."}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`block w-full px-10 py-2 border rounded-lg bg-surface-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300 ${fieldErrors.username ? "border-error-500" : "border-surface-300 dark:border-neutral-700"
                      }`}
                    placeholder="Your username"
                  />
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                </div>
                {fieldErrors.username && (
                  <p className="text-error-500 text-xs mt-1" role="alert" aria-live="assertive">{fieldErrors.username}</p>
                )}
              </motion.div>

              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="email-field"
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`block w-full px-10 py-2 border rounded-lg bg-surface-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300 ${fieldErrors.email ? "border-error-500" : "border-surface-300 dark:border-neutral-700"
                          }`}
                        placeholder="you@example.com"
                      />
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                    </div>
                    {fieldErrors.email && (
                      <p className="text-error-500 text-xs mt-1" role="alert" aria-live="assertive">{fieldErrors.email}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: isLogin ? 0.2 : 0.3 }}
              >
                <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full px-10 py-2 border rounded-lg bg-surface-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300 ${fieldErrors.password ? "border-error-500" : "border-surface-300 dark:border-neutral-700"
                      }`}
                    placeholder="••••••••"
                  />
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                </div>
                {fieldErrors.password && (
                  <p className="text-error-500 text-xs mt-1" role="alert" aria-live="assertive">{fieldErrors.password}</p>
                )}
              </motion.div>

              {error && (
                <p className="text-error-500 text-sm text-center" role="alert" aria-live="assertive">{error}</p>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex justify-center py-2 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={loading}
              >
                {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
              </motion.button>
            </form>

            <p className="mt-4 text-center text-sm text-neutral-700 dark:text-neutral-300">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Link
                to={isLogin ? "/register" : "/login"}
                className="font-medium text-primary-700 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 ml-1 transition-colors"
              >
                {isLogin ? "Sign Up" : "Login"}
              </Link>
            </p>
          </div>
        </div>

        {/* Right Section - Static SVG */}
        <div className="hidden md:flex md:w-1/2 relative items-center justify-center p-8 bg-gradient-to-br from-primary-100/50 to-accent-100/50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-r-3xl backdrop-blur-md">
          <svg className="w-full h-full max-w-sm" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <style>
              {`
                @keyframes pulse {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                  100% { transform: scale(1); }
                }
                .compass-line {
                  stroke-dasharray: 200;
                  stroke-dashoffset: 0;
                  animation: dash 5s linear infinite;
                }
                @keyframes dash {
                  to {
                    stroke-dashoffset: -400;
                  }
                }
              `}
            </style>
            <circle cx="100" cy="100" r="90" fill="none" stroke="#22c55e" strokeWidth="2" />
            <path className="compass-line" d="M100 10 L100 190 M10 100 L190 100" stroke="#22c55e" strokeWidth="2" />
            <path d="M100 20 L120 100 L100 180 L80 100 Z" fill="#22c55e" />
            <circle cx="100" cy="100" r="10" fill="#22c55e" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;
