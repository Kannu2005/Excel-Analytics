import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  clearError,
} from "../redux/userSlice";
import apiService from "../services/api";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response = await apiService.login({
        email: formData.email,
        password: formData.password,
      });

      dispatch(loginSuccess(response));
      if (response.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/main");
      }
    } catch (error) {
      dispatch(loginFailure(error.message || "Login failed"));
    }
  };

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      {/* Animated Background Bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 4 }}
        />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 text-blue-300/30"
          animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={24} />
        </motion.div>
        <motion.div
          className="absolute top-40 right-32 text-cyan-300/30"
          animate={{ y: [20, -20, 20], rotate: [360, 180, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <Shield size={32} />
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-32 text-indigo-300/30"
          animate={{ y: [-15, 15, -15], x: [-10, 10, -10] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <CheckCircle size={28} />
        </motion.div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl mb-6 shadow-xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Shield size={32} className="text-white" />
            </motion.div>
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-2"
              variants={itemVariants}
            >
              Welcome Back
            </motion.h1>
            <motion.p className="text-gray-400 text-lg" variants={itemVariants}>
              Sign in to continue your journey
            </motion.p>
          </motion.div>

          {/* Form */}
          <motion.div
            className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8"
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {error && (
              <motion.div
                className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center space-x-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle size={20} className="text-red-400" />
                <p className="text-red-300 text-sm">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 text-white">
              {/* Email */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                    <Mail
                      size={20}
                      className={`${
                        focusedField === "email" ? "text-cyan-400" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <motion.input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    required
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-600 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                    <Lock
                      size={20}
                      className={`${
                        focusedField === "password" ? "text-cyan-400" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <motion.input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 bg-slate-800 border border-slate-600 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-cyan-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Role */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm mb-2">Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                    <User
                      size={20}
                      className={`${
                        focusedField === "role" ? "text-cyan-400" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <motion.select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("role")}
                    onBlur={() => setFocusedField("")}
                    className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-600 rounded-2xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </motion.select>
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  whileHover={{
                    scale: loading ? 1 : 1.02,
                  }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Register Link */}
            <motion.div className="mt-8 text-center text-gray-400" variants={itemVariants}>
              <p>
                Don't have an account?{" "}
                <motion.button
                  onClick={() => navigate("/register")}
                  className="font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  Create Account
                </motion.button>
              </p>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div className="text-center mt-8" variants={itemVariants}>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Excel Analytics. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
