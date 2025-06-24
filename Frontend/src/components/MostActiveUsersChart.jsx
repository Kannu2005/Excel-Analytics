import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MostActiveUsersChart = ({ stats }) => {
  const [hoveredUser, setHoveredUser] = useState(null);
  const [showAllModal, setShowAllModal] = useState(false);

  // Updated color palette for dark theme
  const colors = [
    "#3498db", // Brighter Blue
    "#2ecc71", // Emerald Green
    "#f1c40f", // Sunflower Yellow
    "#e67e22", // Carrot Orange
    "#9b59b6", // Amethyst Purple
    "#1abc9c", // Turquoise
    "#e74c3c", // Pomegranate Red
    "#34495e", // Wet Asphalt
  ];

  if (!stats?.topUsers || stats.topUsers.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4 text-cyan-400">👥</div>
        <p className="text-lg text-blue-300">No user data available</p>
      </div>
    );
  }

  // Prepare data
  const userData = stats.topUsers.map((user, index) => ({
    ...user,
    color: colors[index % colors.length],
    index,
  }));

  const maxCharts = Math.max(...userData.map((user) => user.chartCount));
  const totalCharts = userData.reduce((sum, user) => sum + user.chartCount, 0);
  const displayedUsers = userData.slice(0, 4);
  const remainingUsers = userData.slice(4);

  // Get user initials for avatars
  const getUserInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // User Row Component
  const UserRow = ({ user, index, isModal = false }) => {
    const percentage = maxCharts > 0 ? (user.chartCount / maxCharts) * 100 : 0;
    const isHovered = hoveredUser === user.index;

    return (
      <motion.div
        key={user.index}
        className="relative cursor-pointer"
        onMouseEnter={() => setHoveredUser(user.index)}
        onMouseLeave={() => setHoveredUser(null)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        {/* User info and bar container */}
        <div className="flex items-center gap-4 mb-2">
          {/* Avatar */}
          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: user.color, border: "2px solid rgba(255,255,255,0.2)" }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {getUserInitials(user.userName)}
          </motion.div>

          {/* User details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="font-semibold truncate text-white">
                  {user.userName}
                </h3>
                <p className="text-xs truncate text-blue-300">
                  {user.userEmail}
                </p>
              </div>
              <div className="text-right ml-4">
                <span className="font-bold text-lg text-white">
                  {user.chartCount}
                </span>
                <span className="text-sm ml-1 text-blue-300">
                  charts
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative">
              <div className="h-3 rounded-full bg-[#2a3a4a]">
                <motion.div
                  className="h-full rounded-full relative overflow-hidden"
                  style={{
                    backgroundColor: user.color,
                    boxShadow: isHovered ? `0 0 12px ${user.color}` : "none",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  {/* Animated shine effect */}
                  <div
                    className="absolute top-0 left-0 h-full w-full opacity-50"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                      animation: isHovered
                        ? "shine 1.5s ease-in-out infinite"
                        : "none",
                    }}
                  />
                </motion.div>
              </div>

              {/* Percentage label */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute left-0 bottom-0 transform translate-y-5 text-xs font-medium"
                    style={{ color: user.color }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    {totalCharts > 0 ? ((user.chartCount / totalCharts) * 100).toFixed(1) : 0}% of total
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Rank badge */}
        <motion.div
          className="absolute -left-2 top-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-gray-800"
          style={{
            backgroundColor: index < 3 ? "#FFD700" : "#C0C0C0",
            boxShadow: isHovered
              ? "0 4px 12px rgba(0,0,0,0.3)"
              : "0 2px 5px rgba(0,0,0,0.2)",
          }}
          animate={{
            scale: isHovered ? 1.15 : 1,
            rotate: isHovered ? -10 : 0
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {index + 1}
        </motion.div>

        {/* Hover tooltip */}
        <AnimatePresence>
          {isHovered && !isModal && (
            <motion.div
              className="absolute right-0 top-0 bg-[#2a3a4a] p-2 rounded-lg shadow-lg border border-blue-600/50 z-10 pointer-events-none"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{
                transform: "translateX(100%) translateX(8px)",
              }}
            >
              <div className="text-xs whitespace-nowrap">
                <div className="font-semibold text-white">
                  Rank #{index + 1}
                </div>
                <div className="text-blue-300">
                  {totalCharts > 0 ? ((user.chartCount / totalCharts) * 100).toFixed(1) : 0}% of total
                </div>
                <div className="text-blue-300">
                  {user.chartCount} / {totalCharts} charts
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        {displayedUsers.map((user, index) => (
          <UserRow key={index} user={{ ...user, index }} />
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-blue-500/20 flex justify-around text-center">
        <div>
          <h4 className="text-xl font-bold text-white">{userData.length}</h4>
          <p className="text-xs text-blue-300">Active Users</p>
        </div>
        <div>
          <h4 className="text-xl font-bold text-white">{totalCharts}</h4>
          <p className="text-xs text-blue-300">Total Charts</p>
        </div>
        <div>
          <h4 className="text-xl font-bold text-white">
            {userData.length > 0
              ? (totalCharts / userData.length).toFixed(1)
              : 0}
          </h4>
          <p className="text-xs text-blue-300">Avg per User</p>
        </div>
      </div>

      {remainingUsers.length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAllModal(true)}
            className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline"
          >
            Show All {userData.length} Users
          </button>
        </div>
      )}

      {/* Show All Users Modal */}
      <AnimatePresence>
        {showAllModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-[#1e2a3a] rounded-xl p-6 max-w-lg w-full max-h-[80vh] flex flex-col border border-blue-700/30 shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-cyan-300">
                  All Active Users
                </h3>
                <button
                  onClick={() => setShowAllModal(false)}
                  className="text-2xl hover:opacity-70 text-blue-300"
                >
                  ✕
                </button>
              </div>
              <div className="overflow-y-auto pr-2 space-y-4">
                {userData.map((user, index) => (
                  <UserRow
                    key={index}
                    user={{ ...user, index }}
                    isModal={true}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MostActiveUsersChart;