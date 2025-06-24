// AdminPanel.jsx

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { logout } from "../redux/userSlice";
import { getDashboardStats } from "../utils/adminApi";
import UserListModal from "../components/UserListModal";
import FileListModal from "../components/FileListModal";
import StorageModal from "../components/StorageModal";
import StorageDisplay from "../components/StorageDisplay";
import ChartAnalysis from "../components/ChartAnalysis";
import { LogOut } from "lucide-react";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFiles: 0,
    totalCharts: 0,
    activeSessions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const dashboardData = await getDashboardStats();
      setStats(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleUserDeleted = () => fetchDashboardStats();
  const handleFileDeleted = () => fetchDashboardStats();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
    hover: {
      scale: 1.03,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  return (
    <motion.div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "#f8fafc",
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.header
        className="shadow-lg backdrop-blur-md bg-opacity-60"
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.7)",
          boxShadow: "0 4px 12px rgba(30, 58, 138, 0.4)",
        }}
        variants={itemVariants}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <motion.h1
              className="text-2xl font-bold text-blue-400"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Excel Analytics - Admin Panel
            </motion.h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="text-left">
                <p className="font-semibold text-white">{user?.name}</p>
                <p className="text-sm font-medium text-gray-400">
                  Administrator
                </p>
              </div>
              <motion.button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg font-semibold"
                style={{
                  backgroundColor: "#3b82f6",
                  color: "#f8fafc",
                }}
                whileHover={{
                  backgroundColor: "#60a5fa",
                  scale: 1.05,
                }}
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
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main className="container mx-auto px-4 py-10" variants={containerVariants}>
        {/* Stats Cards */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants}>
          {[
            { label: "Total Users", value: stats.totalUsers, icon: "👥" },
            { label: "Files Uploaded", value: stats.totalFiles, icon: "📁" },
            { label: "Charts Created", value: stats.totalCharts, icon: "📊" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="rounded-xl p-6 backdrop-blur-lg bg-white/5 border border-blue-500/20 shadow-md"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-400">
                    {item.label}
                  </p>
                  <motion.p
                    className="text-3xl font-bold text-white"
                    key={item.value}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {loading ? "..." : item.value}
                  </motion.p>
                </div>
                <motion.div
                  className="text-3xl"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Management Sections */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10" variants={containerVariants}>
          {/* User Management */}
          <motion.div
            className="rounded-xl p-6 bg-white/5 backdrop-blur border border-blue-500/20"
            variants={cardVariants}
            whileHover="hover"
          >
            <h2 className="text-xl font-bold text-white mb-4">User Management</h2>
            <div className="space-y-4">
              {["All Users", "Recent Registrations"].map((text, idx) => (
                <motion.div
                  key={idx}
                  className="flex justify-between items-center py-3 border-b border-blue-500/20"
                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                >
                  <span className="text-blue-300">{text}</span>
                  <motion.button
                    onClick={() => setShowUserModal(true)}
                    className="px-3 py-1 rounded text-sm font-medium bg-blue-500 text-white"
                    whileHover={{ scale: 1.05, backgroundColor: "#60a5fa" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Data Management */}
          <motion.div
            className="rounded-xl p-6 bg-white/5 backdrop-blur border border-blue-500/20"
            variants={cardVariants}
            whileHover="hover"
          >
            <h2 className="text-xl font-bold text-white mb-4">Data Management</h2>
            <div className="space-y-4">
              {[
                { label: "All Uploaded Files", action: () => setShowFileModal(true), btnText: "Manage" },
                { label: "Storage Usage", action: () => setShowStorageModal(true), btnText: "Monitor" },
              ].map(({ label, action, btnText }, index) => (
                <motion.div
                  key={index}
                  className="flex justify-between items-center py-3 border-b border-blue-500/20"
                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                >
                  <span className="text-blue-300">{label}</span>
                  <motion.button
                    onClick={action}
                    className="px-3 py-1 rounded text-sm font-medium bg-blue-500 text-white"
                    whileHover={{ scale: 1.05, backgroundColor: "#60a5fa" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {btnText}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.main>

      {/* Modals & Components */}
      <UserListModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onUserDeleted={handleUserDeleted}
      />
      <FileListModal
        isOpen={showFileModal}
        onClose={() => setShowFileModal(false)}
        onFileDeleted={handleFileDeleted}
      />
      <StorageModal
        isOpen={showStorageModal}
        onClose={() => setShowStorageModal(false)}
      />
      <StorageDisplay />
      <ChartAnalysis />
    </motion.div>
  );
};

export default AdminPanel;
