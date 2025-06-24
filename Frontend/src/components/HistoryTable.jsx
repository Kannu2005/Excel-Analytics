import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, AlertCircle } from "lucide-react";
import apiService from "../services/api";

const HistoryTable = ({ charts, onViewChart, onDeleteChart, onDeleteSuccess,loading = false }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [error, setError] = useState(null);
  const rowsPerPage = 10;

  if (!Array.isArray(charts)) {
    return <p className="text-center text-gray-600">No charts available.</p>;
  }

  // Calculate pagination
  const totalPages = Math.ceil(charts.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentCharts = charts.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDeleteChart = async (chart) => {
    // Debug: Check if apiService is available
    console.log('apiService:', apiService);
    console.log('apiService.deleteChart:', apiService?.deleteChart);
    
    if (!chart._id) {
      console.error('Chart ID is missing');
      setError('Chart ID is missing. Cannot delete chart.');
      return;
    }

    // Add confirmation dialog
    const isConfirmed = window.confirm(`Are you sure you want to delete "${chart.chartName}"? This action cannot be undone.`);
    if (!isConfirmed) {
      return;
    }

    try {
      setError(null); // Clear any previous errors
      setDeletingIds(prev => new Set(prev).add(chart._id)); // Track which chart is being deleted
      
      // Call the deleteChart API function
      await apiService.deleteChart(chart._id);
      
      // Call the parent component's onDeleteChart callback
      if (onDeleteChart && typeof onDeleteChart === 'function') {
        onDeleteChart(chart);
      }
      
      console.log(`Chart "${chart.chartName}" deleted successfully`);
      if (onDeleteSuccess) {
      onDeleteSuccess();  // <-- this refreshes the chart list
    }
    } catch (error) {
      console.error('Failed to delete chart:', error);
      
      // Set a user-friendly error message
      const errorMessage = error.message || 'Failed to delete chart. Please try again.';
      setError(errorMessage);
      
      // Optionally, you could show a toast notification here instead
      // toast.error(errorMessage);
      
    } finally {
      // Remove the chart ID from the deleting set
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(chart._id);
        return newSet;
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
    hover: {
      scale: 1.02,
      backgroundColor: "#334155",
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: "#1d4ed8",
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
    },
  };

  const tableVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="overflow-x-auto px-4 sm:px-6 mx-auto max-w-4xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-xl transition duration-300 hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Go Back
      </motion.button>

      {/* Error Message */}
      {error && (
        <motion.div
          className="mb-4 p-4 bg-red-900/50 border border-red-500/50 rounded-lg flex items-center space-x-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AlertCircle className="text-red-400" size={20} />
          <span className="text-red-400">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            ×
          </button>
        </motion.div>
      )}

      <motion.div
        className="bg-slate-800 rounded-lg shadow-lg overflow-hidden"
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className="overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <table className="min-w-full bg-transparent border-collapse">
            <motion.thead
              className="bg-slate-700"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <tr>
                <th className="px-3 sm:px-4 py-3 border border-slate-600 text-white font-semibold text-sm sm:text-base">
                  Chart Name
                </th>
                <th className="px-3 sm:px-4 py-3 border border-slate-600 text-white font-semibold text-sm sm:text-base">
                  Type
                </th>
                <th className="px-3 sm:px-4 py-3 border border-slate-600 text-white font-semibold text-sm sm:text-base">
                  Actions
                </th>
                <th className="px-3 sm:px-4 py-3 border border-slate-600 text-white font-semibold text-sm sm:text-base">
                  Delete
                </th>
              </tr>
            </motion.thead>
            <tbody>
              {currentCharts.map((chart, index) => {
                const isDeleting = deletingIds.has(chart._id);
                
                return (
                  <motion.tr
                    key={chart._id}
                    className="text-center border-b border-slate-700 hover:bg-slate-700/50 transition-colors duration-200"
                    variants={rowVariants}
                    whileHover="hover"
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <td className="border border-slate-700 px-3 sm:px-4 py-3 text-slate-300 text-sm sm:text-base">
                      {chart.chartName}
                    </td>
                    <td className="border border-slate-700 px-3 sm:px-4 py-3 text-slate-300 text-sm sm:text-base">
                      {chart.chartType?.toUpperCase().replace(/3D$/, ' 3D')}

                    </td>
                    <td className="border border-slate-700 px-3 sm:px-4 py-3">
                      <motion.button
                        className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 text-sm sm:text-base hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => onViewChart(chart)}
                        disabled={isDeleting}
                        whileHover={isDeleting ? {} : { scale: 1.05 }}
                        whileTap={isDeleting ? {} : { scale: 0.95 }}
                      >
                        View
                      </motion.button>
                    </td>
                    <td className="border border-slate-700 px-3 sm:px-4 py-3">
                      <motion.button
                        className="text-red-500 hover:text-red-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleDeleteChart(chart)}
                        disabled={loading || isDeleting}
                        whileHover={loading || isDeleting ? {} : { scale: 1.05 }}
                        whileTap={loading || isDeleting ? {} : { scale: 0.95 }}
                        title={isDeleting ? "Deleting..." : "Delete Chart"}
                      >
                        {isDeleting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <motion.div 
          className="flex justify-between items-center p-4 bg-slate-800 border-t border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-xl font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              currentPage === 1
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            variants={buttonVariants}
            whileHover={currentPage === 1 ? {} : "hover"}
            whileTap={currentPage === 1 ? {} : "tap"}
          >
            Previous
          </motion.button>
          
          <span className="text-slate-400 font-medium">
            Page {currentPage} of {totalPages} ({charts.length} total charts)
          </span>
          
          <motion.button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-xl font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              currentPage === totalPages
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            variants={buttonVariants}
            whileHover={currentPage === totalPages ? {} : "hover"}
            whileTap={currentPage === totalPages ? {} : "tap"}
          >
            Next
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HistoryTable;