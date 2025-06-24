// src/pages/MainPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { motion } from "framer-motion";
import ExcelAnalyticsLanding from "../components/ExcelAnalyticsLanding";
import { LogOut } from "lucide-react";

const MainPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      }}
    >
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="shadow-md border-b border-sky-800 backdrop-blur"
        style={{ backgroundColor: "#1e293b" }}
      >
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <motion.h1
            className="text-2xl font-extrabold text-sky-300"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            Excel Analytics - User Dashboard
          </motion.h1>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-sky-100">
                Welcome back, {user?.name} 👋
              </p>
              <p className="text-sm text-sky-400">Premium User</p>
            </div>
            <motion.button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg font-semibold"
              style={{ backgroundColor: "#0891b2", color: "#f0fdfa" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#22d3ee")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#0891b2")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-2">
                <span>Logout</span>
                <LogOut className="w-5 h-5" />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-14">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-extrabold text-sky-200 mb-2">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-lg text-sky-400 max-w-2xl mx-auto">
            Transform your Excel data into powerful insights with our advanced analytics tools and stunning visualizations.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8"
          initial="hidden"
          animate="visible"
        >
          {[
            {
              title: "Upload Excel File",
              desc: "Upload your Excel files for analysis",
              icon: "📊",
              link: "/upload",
              buttonText: "Upload File",
            },
            {
              title: "My Uploads",
              desc: "Quickly Preview the Excel Uploads",
              icon: "📁",
              link: "/myuploads",
              buttonText: "My Uploads",
            },
            {
              title: "Create 2D Charts",
              desc: "Visualize your data with interactive charts",
              icon: "📈",
              link: "/charts",
              buttonText: "Create 2D Chart",
            },
            {
              title: "Create 3D Charts",
              desc: "Visualize data in 3D charts",
              icon: "⚡",
              link: "/charts3d",
              buttonText: "Create 3D Chart",
            },
            {
              title: "Analysis History",
              desc: "Review your previous analysis results",
              icon: "📋",
              link: "/history",
              buttonText: "View History",
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              className="bg-slate-800 rounded-2xl shadow-xl p-6 border border-sky-900"
              style={{ backgroundColor: "#1e293b" }}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <motion.div
                  className="text-5xl mb-3"
                  animate={{ y: [0, -5, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  {card.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-sky-300 mb-1">
                  {card.title}
                </h3>
                <p className="text-sky-400 text-sm mb-4">
                  {card.desc}
                </p>
                <motion.button
                  onClick={() => navigate(card.link)}
                  className="w-full py-2 px-4 rounded-xl font-semibold border-2 border-sky-400 text-sky-200 hover:bg-sky-600 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {card.buttonText}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 rounded-2xl p-10 text-center shadow-xl"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #164e63 50%, #155e75 100%)",
          }}
        >
          <h2 className="text-3xl font-bold text-sky-200 mb-4">
            Unlock the Power of Your Data
          </h2>
          <p className="text-sky-300 text-md max-w-3xl mx-auto">
            Experience next-generation data analysis with our AI-powered tools that automatically detect patterns, generate insights, and create stunning visualizations from your Excel files.
          </p>
        </motion.div>

        <div className="mt-20">
          <ExcelAnalyticsLanding />
        </div>
      </main>
    </div>
  );
};

export default MainPage;