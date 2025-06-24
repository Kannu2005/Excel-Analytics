import React, { useState, useEffect } from "react";
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
  UserPlus,
  Check,
  X,
  Star,
  Anchor,
  Compass
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setValidationError("");
    setError("");

    // Calculate password strength
    if (e.target.name === 'password') {
      const password = e.target.value;
      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert("Registration successful! (This is a demo)");
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-15, 15, -15],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 2) return "bg-orange-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    if (passwordStrength <= 4) return "bg-blue-500";
    return "bg-emerald-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 2) return "Fair";
    if (passwordStrength <= 3) return "Good";
    if (passwordStrength <= 4) return "Strong";
    return "Very Strong";
  };

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordsDontMatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 3 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 6 }}
        />
      </div>

      {/* Constellation Pattern */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating Navigation Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 text-blue-300/40"
          animate={{
            y: [-25, 25, -25],
            rotate: [0, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Compass size={28} />
        </motion.div>
        <motion.div
          className="absolute top-32 right-32 text-indigo-300/40"
          animate={{
            y: [20, -20, 20],
            rotate: [-360, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Anchor size={32} />
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-40 text-purple-300/40"
          animate={{
            y: [-20, 20, -20],
            x: [-15, 15, -15],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Star size={24} />
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-20 text-blue-400/40"
          animate={{
            y: [15, -15, 15],
            rotate: [0, 270, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles size={26} />
        </motion.div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo/Brand Section */}
          <motion.div
            className="text-center mb-8"
            variants={itemVariants}
          >
            <motion.div
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl mb-6 shadow-2xl shadow-blue-500/25"
              whileHover={{ 
                scale: 1.15,
                rotate: 12,
                boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <UserPlus size={36} className="text-white" />
            </motion.div>
            <motion.h1
              className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3"
              variants={itemVariants}
            >
              Join Our Crew
            </motion.h1>
            <motion.p
              className="text-blue-200 text-lg font-medium"
              variants={itemVariants}
            >
              Set sail on your digital voyage
            </motion.p>
          </motion.div>

          {/* Register Form */}
          <motion.div
            className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-blue-400/20 p-8 relative overflow-hidden"
            variants={itemVariants}
            whileHover={{ 
              boxShadow: "0 30px 60px rgba(30, 58, 138, 0.3)",
              y: -8
            }}
            transition={{ duration: 0.4 }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-tr-full" />

            {/* Error Message */}
            {(error || validationError) && (
              <motion.div
                className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-400/20 backdrop-blur-sm flex items-center space-x-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm font-medium">{error || validationError}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Full Name Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-bold text-blue-200 mb-3">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User 
                      size={20} 
                      className={`transition-all duration-300 ${
                        focusedField === 'name' ? 'text-blue-400' : 'text-slate-400'
                      }`} 
                    />
                  </div>
                  <motion.input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-300/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400/40 transition-all duration-300 text-white placeholder-blue-200/60 font-medium"
                    placeholder="Enter your full name"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-bold text-blue-200 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail 
                      size={20} 
                      className={`transition-all duration-300 ${
                        focusedField === 'email' ? 'text-blue-400' : 'text-slate-400'
                      }`} 
                    />
                  </div>
                  <motion.input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-300/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400/40 transition-all duration-300 text-white placeholder-blue-200/60 font-medium"
                    placeholder="Enter your email"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-bold text-blue-200 mb-3">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock 
                      size={20} 
                      className={`transition-all duration-300 ${
                        focusedField === 'password' ? 'text-blue-400' : 'text-slate-400'
                      }`} 
                    />
                  </div>
                  <motion.input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-white/5 backdrop-blur-sm border border-blue-300/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400/40 transition-all duration-300 text-white placeholder-blue-200/60 font-medium"
                    placeholder="Create a strong password"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-400 transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <motion.div
                    className="mt-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-3 mb-1">
                      <div className="flex-1 bg-white/10 rounded-full h-2 backdrop-blur-sm">
                        <motion.div
                          className={`h-2 rounded-full transition-all duration-500 ${getPasswordStrengthColor()}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${
                        passwordStrength <= 2 ? 'text-red-400' : 
                        passwordStrength <= 3 ? 'text-yellow-400' : 'text-emerald-400'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-bold text-blue-200 mb-3">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock 
                      size={20} 
                      className={`transition-all duration-300 ${
                        focusedField === 'confirmPassword' ? 'text-blue-400' : 'text-slate-400'
                      }`} 
                    />
                  </div>
                  <motion.input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField('')}
                    required
                    className={`w-full pl-12 pr-12 py-4 bg-white/5 backdrop-blur-sm border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 text-white placeholder-blue-200/60 font-medium ${
                      passwordsMatch ? 'border-emerald-400/40 focus:ring-emerald-400' :
                      passwordsDontMatch ? 'border-red-400/40 focus:ring-red-400' :
                      'border-blue-300/20 focus:ring-blue-400 focus:border-blue-400/40'
                    }`}
                    placeholder="Confirm your password"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-4">
                    {formData.confirmPassword && (
                      <div className="flex items-center">
                        {passwordsMatch ? (
                          <Check size={16} className="text-emerald-400" />
                        ) : passwordsDontMatch ? (
                          <X size={16} className="text-red-400" />
                        ) : null}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-slate-400 hover:text-blue-400 transition-colors duration-300"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Role Selection */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-bold text-blue-200 mb-3">
                  Account Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Shield 
                      size={20} 
                      className={`transition-all duration-300 ${
                        focusedField === 'role' ? 'text-blue-400' : 'text-slate-400'
                      }`} 
                    />
                  </div>
                  <motion.select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('role')}
                    onBlur={() => setFocusedField('')}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-blue-300/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400/40 transition-all duration-300 text-white appearance-none cursor-pointer font-medium"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <option value="user" className="bg-slate-800 text-white">Standard User</option>
                    <option value="admin" className="bg-slate-800 text-white">Administrator</option>
                  </motion.select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 relative overflow-hidden"
                  whileHover={{ 
                    scale: loading ? 1 : 1.05,
                    boxShadow: loading ? undefined : "0 25px 50px rgba(59, 130, 246, 0.4)"
                  }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  {loading ? (
                    <>
                      <motion.div
                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full z-10"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="z-10">Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span className="z-10">Create Account</span>
                      <ArrowRight size={20} className="z-10" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Login Link */}
            <motion.div
              className="mt-8 text-center"
              variants={itemVariants}
            >
              <p className="text-blue-200 font-medium">
                Already have an account?{" "}
                <motion.button
                  onClick={() => navigate("/login")}
                  className="font-bold text-blue-400 hover:text-blue-300 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
              </p>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="text-center mt-8"
            variants={itemVariants}
          >
            <p className="text-blue-300/60 text-sm font-medium">
              © {new Date().getFullYear()} Excel Analytics. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;