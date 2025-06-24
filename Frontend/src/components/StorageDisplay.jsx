import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getStorageUsage } from "../utils/adminApi";
import FileDistributionChart from "../components/FileDistributionChart";
import { RefreshCw } from "lucide-react";

const StorageDisplay = () => {
  const [storageData, setStorageData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStorageUsage();
  }, []);

  const fetchStorageUsage = async () => {
    setLoading(true);
    try {
      const data = await getStorageUsage();
      setStorageData(data);
    } catch (error) {
      console.error("Error fetching storage usage:", error);
      alert("Failed to fetch storage usage");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
    hover: {
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] to-[#1b263b] text-white">
      <motion.div
        className="container mx-auto px-4 py-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >

        {/* 🔹 Divider Line Added Here */}
        <motion.div
          className="w-full h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 my-10 rounded-full shadow-md"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100%" }}
          transition={{ duration: 1 }}
        />

        {/* Section Title */}
        <motion.div className="mb-6" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-white">📦 Storage Dashboard</h2>
          <p className="text-sm text-blue-300 mt-1">
            Monitor your system's storage health in real-time
          </p>
        </motion.div>

        {loading ? (
          <motion.div className="text-center py-16" animate={{ opacity: 1 }}>
            <motion.div
              className="text-5xl mb-4 animate-spin"
              style={{ color: "#3fc1c9" }}
            >
              ⏳
            </motion.div>
            <p className="text-lg text-blue-300">Fetching storage details...</p>
          </motion.div>
        ) : storageData ? (
          <motion.div variants={containerVariants}>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[
                {
                  title: "Total Storage Used",
                  value: storageData.formattedSize,
                  icon: "💾",
                },
                {
                  title: "Total Files",
                  value: storageData.fileCount,
                  icon: "📄",
                },
                {
                  title: "Avg File Size",
                  value:
                    storageData.fileCount > 0
                      ? `${(
                          storageData.totalSizeMB / storageData.fileCount
                        ).toFixed(2)} MB`
                      : "0 MB",
                  icon: "📊",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="rounded-xl bg-[#1e2a3a] p-6 shadow-lg border border-blue-600/30"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-blue-300">{item.title}</p>
                      <h3 className="text-2xl font-bold text-white mt-1">
                        {item.value}
                      </h3>
                    </div>
                    <motion.div
                      className="text-3xl text-cyan-400"
                      whileHover={{ rotate: 360, scale: 1.15 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                    >
                      {item.icon}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Details and Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              {/* Storage Details */}
              <motion.div
                className="bg-[#1e2a3a] p-6 rounded-xl border border-blue-700/30 shadow-lg"
                variants={cardVariants}
                whileHover="hover"
              >
                <h4 className="text-xl font-semibold mb-4 text-cyan-300">
                  🧾 Storage Details
                </h4>
                <ul className="space-y-3 text-sm text-blue-200">
                  <li className="flex justify-between border-b border-blue-500/10 pb-2">
                    <span>Storage (MB)</span>
                    <span className="font-medium text-white">
                      {storageData.totalSizeMB} MB
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-blue-500/10 pb-2">
                    <span>Storage (Bytes)</span>
                    <span className="font-medium text-white">
                      {storageData.totalSizeBytes.toLocaleString()}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Last Updated</span>
                    <span className="font-medium text-white">
                      {new Date().toLocaleString()}
                    </span>
                  </li>
                </ul>
              </motion.div>

              {/* Chart */}
              <motion.div
                className="bg-[#1e2a3a] p-6 rounded-xl border border-blue-700/30 shadow-lg"
                variants={cardVariants}
                whileHover="hover"
              >
                <h4 className="text-xl font-semibold mb-4 text-cyan-300">
                  📊 File Distribution
                </h4>
                <FileDistributionChart storageData={storageData} />
              </motion.div>
            </div>

            {/* Health & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Health */}
              <motion.div
                className="bg-[#1e2a3a] p-6 rounded-xl border border-blue-700/30 shadow-lg"
                variants={cardVariants}
                whileHover="hover"
              >
                <h4 className="text-xl font-semibold mb-4 text-cyan-300">
                  ❤️ Storage Health
                </h4>
                <div className="text-center">
                  <div className="text-5xl mb-3">
                    {storageData.totalSizeMB > 80
                      ? "🔴"
                      : storageData.totalSizeMB > 50
                      ? "🟡"
                      : "🟢"}
                  </div>
                  <h5 className="text-lg font-bold text-white">
                    {storageData.totalSizeMB > 80
                      ? "Critical"
                      : storageData.totalSizeMB > 50
                      ? "Warning"
                      : "Healthy"}
                  </h5>
                  <p className="text-sm text-blue-300 mt-1">
                    Storage usage insights
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1 text-blue-300">
                    <span>Used</span>
                    <span>{storageData.totalSizeMB} MB</span>
                  </div>
                  <div className="w-full bg-blue-800 h-3 rounded-full">
                    <motion.div
                      className="h-3 rounded-full bg-cyan-400"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          (storageData.totalSizeMB / 100) * 100,
                          100
                        )}%`,
                      }}
                      transition={{ duration: 1.2 }}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                className="bg-[#1e2a3a] p-6 rounded-xl border border-blue-700/30 shadow-lg"
                variants={cardVariants}
                whileHover="hover"
              >
                <h4 className="text-xl font-semibold mb-4 text-cyan-300">
                  💡 Recommendations
                </h4>
                <div className="space-y-4 text-sm text-blue-300">
                  {storageData.totalSizeMB > 50 ? (
                    <div className="flex items-start gap-2">
                      <span className="text-xl">⚠️</span>
                      <p>Consider deleting or archiving large/old files.</p>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <span className="text-xl">✅</span>
                      <p>Storage usage is within safe limits.</p>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <span className="text-xl">🧹</span>
                    <p>Perform regular cleanups to maintain performance.</p>
                  </div>
                </div>

                <motion.button
                  onClick={fetchStorageUsage}
                  className="mt-6 w-full py-2 rounded-lg text-white font-semibold bg-cyan-500 hover:bg-cyan-600 transition-all flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.97 }}
                >
                  <RefreshCw className="w-5 h-5" />
                  Refresh Storage Data
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl text-cyan-400 mb-4">💾</div>
            <p className="text-lg text-blue-300">
              Unable to load storage information.
            </p>
            <p className="text-sm text-blue-400 mt-1">
              Try refreshing or check your connection.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StorageDisplay;
