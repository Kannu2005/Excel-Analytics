import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getUserFiles, getFileData } from "../redux/fileSlice";
import { createChart } from "../redux/chartSlice";
import ChartDisplay3D from "../components/ChartDisplay3D";
import AIsuggestion3D from "../components/AIsuggestion3D"; // Updated import
import { useNavigate } from "react-router-dom";
// import * as Plotly from "plotly";
import Plotly from "plotly.js-dist";
import { jsPDF } from "jspdf";


const ChartPage3D = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    files: userFiles = [],
    currentFile,
    loading: fileLoading,
  } = useSelector((state) => state.files || {});
  const { loading: chartLoading, currentChart } = useSelector(
    (state) => state.charts || {}
  );

  // State for chart creation workflow
  const [selectedFileId, setSelectedFileId] = useState("");
  const [chartConfig, setChartConfig] = useState({
    chartName: "",
    chartType: "bar3d",
    xAxis: "",
    yAxis: "",
    zAxis: "",
  });
  const [showChart, setShowChart] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(true);

  // Load user files on component mount
  useEffect(() => {
    dispatch(getUserFiles());
  }, [dispatch]);

  // Load file data when a file is selected
  useEffect(() => {
    if (selectedFileId) {
      dispatch(getFileData(selectedFileId));
      setShowChart(false);
      setChartConfig((prev) => ({ ...prev, xAxis: "", yAxis: "", zAxis: "" }));
      setShowAIPanel(true);
    }
  }, [selectedFileId, dispatch]);

  const chartTypes3D = [
    {
      value: "bar3d",
      label: "3D Bar Chart",
      icon: "📊",
      description: "3D bars for better visual impact",
    },
    {
      value: "line3d",
      label: "3D Line Chart",
      icon: "📈",
      description: "3D lines showing trends in space",
    },
    {
      value: "scatter3d",
      label: "3D Scatter Plot",
      icon: "⚡",
      description: "3D scatter for multi-dimensional data",
    },
    {
      value: "surface3d",
      label: "3D Surface Plot",
      icon: "🌐",
      description: "Surface visualization for continuous data",
    },
    {
      value: "column3d",
      label: "3D Column Chart",
      icon: "📋",
      description: "Enhanced 3D columns",
    },
    {
      value: "pie3d",
      label: "3D Pie Chart",
      icon: "🥧",
      description: "Enhanced pie chart with 3D effects",
    },
  ];

  const handleFileSelection = (e) => {
    setSelectedFileId(e.target.value);
  };

  const handleConfigChange = (e) => {
    setChartConfig({
      ...chartConfig,
      [e.target.name]: e.target.value,
    });
  };

  // Enhanced AI chart suggestions handler
  const handleAISuggestion = (suggestion) => {
    console.log("AI Suggestion received:", suggestion);

    // Update chart configuration with AI suggestion
    setChartConfig((prev) => ({
      ...prev,
      chartType: suggestion.chartType,
      xAxis: suggestion.xAxis || prev.xAxis,
      yAxis: suggestion.yAxis || prev.yAxis,
      zAxis: suggestion.zAxis || prev.zAxis,
    }));

    // Enhanced notification with better styling and animation
    const showNotification = () => {
      const notification = document.createElement("div");
      notification.className = `
        fixed top-4 right-4 z-50 transform transition-all duration-500 ease-out
        bg-gradient-to-r from-purple-500 to-indigo-600 text-white 
        px-6 py-3 rounded-xl shadow-xl border border-purple-300
        flex items-center gap-3 max-w-sm
      `;

      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span class="text-lg">🤖</span>
          </div>
          <div>
            <div class="font-semibold text-sm">AI Suggestion Applied!</div>
            <div class="text-xs opacity-90">${suggestion.chartType.toUpperCase()} chart configuration updated</div>
          </div>
        </div>
      `;

      document.body.appendChild(notification);

      // Animate in
      setTimeout(() => {
        notification.style.transform = "translateX(0)";
        notification.style.opacity = "1";
      }, 100);

      // Animate out and remove
      setTimeout(() => {
        notification.style.transform = "translateX(100%)";
        notification.style.opacity = "0";
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 500);
      }, 3500);
    };

    showNotification();

    // Auto-scroll to chart configuration section
    const chartConfigSection = document.querySelector(
      '[data-section="chart-config"]'
    );
    if (chartConfigSection) {
      chartConfigSection.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleCreateChart = async () => {
    // Enhanced validation
    if (!selectedFileId) {
      showErrorNotification("Please select a file first");
      return;
    }
    if (!chartConfig.chartName.trim()) {
      showErrorNotification("Please enter a chart name");
      return;
    }
    if (!chartConfig.xAxis || !chartConfig.yAxis) {
      showErrorNotification("Please select both X and Y axis");
      return;
    }

    // Additional validation for 3D charts that require Z axis
    if (
      (chartConfig.chartType === "scatter3d" ||
        chartConfig.chartType === "surface3d") &&
      !chartConfig.zAxis
    ) {
      showErrorNotification(
        `${chartConfig.chartType.toUpperCase()} requires a Z-axis selection`
      );
      return;
    }

    try {
      const chartData = {
        fileId: selectedFileId,
        ...chartConfig,
      };

      await dispatch(createChart(chartData)).unwrap();
      setShowChart(true);

      // Play success sound
      const audio = new Audio('/success2.mp3');
      audio.play();
      
      alert("Chart created successfully!");

      // Auto-scroll to chart display
      setTimeout(() => {
        const chartDisplay = document.querySelector(
          '[data-section="chart-display"]'
        );
        if (chartDisplay) {
          chartDisplay.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 500);
    } catch (error) {
      console.error("Error creating 3D chart:", error);
      showErrorNotification("Failed to create 3D chart. Please try again.");
    }
  };

  // Utility functions for notifications
  const showErrorNotification = (message) => {
    const notification = document.createElement("div");
    notification.className = `
      fixed top-4 right-4 z-50 transform transition-all duration-500 ease-out
      bg-gradient-to-r from-red-500 to-red-600 text-white 
      px-6 py-3 rounded-xl shadow-xl border border-red-300
      flex items-center gap-3 max-w-sm
    `;

    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span class="text-lg">⚠️</span>
        </div>
        <div>
          <div class="font-semibold text-sm">Error</div>
          <div class="text-xs opacity-90">${message}</div>
        </div>
      </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
      notification.style.opacity = "1";
    }, 100);

    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      notification.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 500);
    }, 4000);
  };

  const showSuccessNotification = (message) => {
    const notification = document.createElement("div");
    notification.className = `
      fixed top-4 right-4 z-50 transform transition-all duration-500 ease-out
      bg-gradient-to-r from-green-500 to-green-600 text-white 
      px-6 py-3 rounded-xl shadow-xl border border-green-300
      flex items-center gap-3 max-w-sm
    `;

    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span class="text-lg">✅</span>
        </div>
        <div>
          <div class="font-semibold text-sm">Success</div>
          <div class="text-xs opacity-90">${message}</div>
        </div>
      </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
      notification.style.opacity = "1";
    }, 100);

    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      notification.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 500);
    }, 3500);
  };

  const canCreateChart =
    selectedFileId &&
    chartConfig.chartName.trim() &&
    chartConfig.xAxis &&
    chartConfig.yAxis;


    
  // Download 3D chart as image
  // const download3DChart = async (format = "png") => {
  //   try {
  //     const chartContainer = document.getElementById("chart-container-3d");
  //     if (!chartContainer) {
  //       showErrorNotification("3D Chart not found!");
  //       return;
  //     }

  //     const plotlyDiv =
  //       chartContainer.querySelector("div[id*='plotly']") ||
  //       chartContainer.querySelector(".plotly-graph-div");

  //     if (!plotlyDiv) {
  //       showErrorNotification(
  //         "3D Chart element not found! Make sure the chart is fully loaded."
  //       );
  //       return;
  //     }

  //     const fileName = `${chartConfig?.chartName || "3d-chart"}-${
  //       new Date().toISOString().split("T")[0]
  //     }`;

  //     // Use Plotly's built-in download functionality
  //     const config = {
  //       format: format,
  //       width: 1200,
  //       height: 800,
  //       filename: fileName,
  //     };

  //     await Plotly.downloadImage(plotlyDiv, config);
  //     showSuccessNotification(
  //       `3D Chart downloaded as ${format.toUpperCase()}! 📸`
  //     );
  //   } catch (error) {
  //     console.error("3D Chart download failed:", error);
  //     showErrorNotification("Failed to download 3D chart. Please try again.");
  //   }
  // };








const download3DChart = async (format = "png") => {
  try {
    const chartContainer = document.getElementById("chart-container-3d");
    if (!chartContainer) {
      showErrorNotification("3D Chart container not found!");
      return;
    }

    const plotlyDiv = chartContainer.querySelector(".js-plotly-plot");
    if (!plotlyDiv || (!plotlyDiv._fullData && !plotlyDiv.data)) {
      showErrorNotification("Chart not ready. Please wait for it to render.");
      return;
    }

    const fileNameBase = `${chartConfig?.chartName || "3d-chart"}-${new Date()
      .toISOString()
      .split("T")[0]}`;

    if (format === "pdf") {
      const imgData = await Plotly.toImage(plotlyDiv, {
        format: "png", // Generate PNG first
        width: 1200,
        height: 800,
      });

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1200, 800],
      });

      pdf.addImage(imgData, "PNG", 0, 0, 1200, 800);
      pdf.save(`${fileNameBase}.pdf`);
    } else {
      // Download directly if supported format
      const allowedFormats = ["png", "jpeg", "webp", "svg", "full-json"];
      if (!allowedFormats.includes(format)) {
        showErrorNotification(`Unsupported export format: ${format}`);
        return;
      }

      const imageData = await Plotly.toImage(plotlyDiv, {
        format,
        width: 1200,
        height: 800,
      });

      const link = document.createElement("a");
      link.download = `${fileNameBase}.${format}`;
      link.href = imageData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    showSuccessNotification(`3D Chart downloaded as ${format.toUpperCase()}! 📸`);
  } catch (error) {
    console.error("3D Chart download failed:", error);
    showErrorNotification(`Failed to download 3D chart: ${error.message}`);
  }
};













  

  // Download chart data as CSV
  const downloadChartData = () => {
    try {
      if (!currentChart || !currentChart.chartData) {
        showErrorNotification("No chart data available!");
        return;
      }

      const { labels, datasets } = currentChart.chartData;

      // Create CSV content
      let csvContent =
        "Category," + datasets.map((d) => d.label).join(",") + "\n";

      labels.forEach((label, index) => {
        const row = [label];
        datasets.forEach((dataset) => {
          row.push(dataset.data[index] || 0);
        });
        csvContent += row.join(",") + "\n";
      });

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${chartConfig.chartName || "3d-chart"}-data-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();

      URL.revokeObjectURL(link.href);
      showSuccessNotification("Chart data downloaded as CSV! 📊");
    } catch (error) {
      console.error("CSV download failed:", error);
      showErrorNotification("Failed to download chart data. Please try again.");
    }
  };

  // Animation variants
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#111827] to-[#020617] text-gray-200 p-4 sm:p-6">
      <motion.div
        className="max-w-8xl mx-auto space-y-6 sm:space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white mb-6 sm:mb-8"
          variants={cardVariants}
        >
          Excel Analytics - 3D AI-Powered Chart Creator
        </motion.h1>

        <motion.button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-xl transition duration-300 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Go Back
        </motion.button>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Chart Configuration */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Step 1: File Selection */}
            <motion.div
              className="bg-[#1f2937] rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700"
              variants={cardVariants}
              whileHover="hover"
            >
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                  1
                </span>
                <span className="break-words">Select Excel File</span>
              </h2>

              {fileLoading ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-gray-400">Loading your files...</p>
                </div>
              ) : userFiles && userFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-lg">No Excel files found.</p>
                  <p className="text-sm sm:text-base">
                    Please upload some Excel files first to create 3D charts.
                  </p>
                </div>
              ) : (
                <div>
                  <select
                    value={selectedFileId}
                    onChange={handleFileSelection}
                    className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white text-base sm:text-lg"
                  >
                    <option value="">-- Select an Excel File --</option>
                    {userFiles &&
                      userFiles.map((file) => (
                        <option key={file._id} value={file._id}>
                          📄 {file.originalFileName} (
                          {new Date(file.uploadDate).toLocaleDateString()})
                        </option>
                      ))}
                  </select>

                  <AnimatePresence>
                    {selectedFileId && currentFile && (
                      <motion.div
                        className="mt-4 p-4 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-800"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-sm text-blue-300 break-words">
                          <strong>Selected File:</strong>{" "}
                          {currentFile.originalFileName}
                        </p>
                        <p className="text-sm text-blue-300">
                          <strong>Columns Available:</strong>{" "}
                          {currentFile.columns?.length || 0} columns
                        </p>
                        <p className="text-sm text-blue-300">
                          <strong>Data Rows:</strong>{" "}
                          {currentFile.data?.length || 0} rows
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>

            {/* Step 2: Chart Configuration */}
            <AnimatePresence>
              {selectedFileId && currentFile && (
                <motion.div
                  className="bg-[#1f2937] rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover="hover"
                  data-section="chart-config"
                >
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white flex items-center">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                      2
                    </span>
                    <span className="break-words">Configure Your 3D Chart</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Chart Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Chart Name *
                      </label>
                      <input
                        type="text"
                        name="chartName"
                        value={chartConfig.chartName}
                        onChange={handleConfigChange}
                        placeholder="Enter a name for your 3D chart"
                        className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white placeholder-gray-500"
                      />
                    </div>

                    {/* Chart Type */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        3D Chart Type *
                      </label>
                      <select
                        name="chartType"
                        value={chartConfig.chartType}
                        onChange={handleConfigChange}
                        className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white"
                      >
                        {chartTypes3D.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-400 mt-1">
                        {
                          chartTypes3D.find(
                            (t) => t.value === chartConfig.chartType
                          )?.description
                        }
                      </p>
                    </div>

                    {/* X Axis */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        X Axis (Categories) *
                      </label>
                      <select
                        name="xAxis"
                        value={chartConfig.xAxis}
                        onChange={handleConfigChange}
                        className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white"
                      >
                        <option value="">-- Select X Axis --</option>
                        {currentFile?.columns?.map((column) => (
                          <option key={column} value={column}>
                            {column}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Y Axis */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Y Axis (Values) *
                      </label>
                      <select
                        name="yAxis"
                        value={chartConfig.yAxis}
                        onChange={handleConfigChange}
                        className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white"
                      >
                        <option value="">-- Select Y Axis --</option>
                        {currentFile?.columns?.map((column) => (
                          <option key={column} value={column}>
                            {column}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Z Axis (Optional for certain chart types) */}
                    {(chartConfig.chartType === "scatter3d" ||
                      chartConfig.chartType === "surface3d") && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Z Axis{" "}
                          {chartConfig.chartType === "scatter3d"
                            ? "(Recommended)"
                            : "(Optional)"}
                        </label>
                        <select
                          name="zAxis"
                          value={chartConfig.zAxis}
                          onChange={handleConfigChange}
                          className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white"
                        >
                          <option value="">-- Select Z Axis --</option>
                          {currentFile?.columns?.map((column) => (
                            <option key={column} value={column}>
                              {column}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-400 mt-1">
                          {chartConfig.chartType === "scatter3d"
                            ? "Z-axis recommended for better 3D visualization"
                            : "Z-axis adds depth to your surface plot"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* AI Suggestion Status */}
                  <AnimatePresence>
                    {chartConfig.xAxis && chartConfig.yAxis && (
                      <motion.div
                        className="mt-4 p-3 bg-blue-900/30 border border-blue-800 rounded-lg"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-sm text-blue-300 flex items-center gap-2">
                          <span>✅</span>
                          <span>
                            Configuration ready! Chart will display{" "}
                            {chartConfig.chartType.replace("3d", " in 3D")} with{" "}
                            {chartConfig.xAxis} vs {chartConfig.yAxis}
                            {chartConfig.zAxis && ` vs ${chartConfig.zAxis}`}.
                          </span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

<div className="w-full flex justify-center">
                  {/* Create Chart Button */}
                  <motion.button
                    onClick={handleCreateChart}
                    disabled={!canCreateChart || chartLoading}
                    className={`mt-4 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-200  ${
                      canCreateChart && !chartLoading
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                    variants={buttonVariants}
                    whileHover={canCreateChart && !chartLoading ? "hover" : {}}
                    whileTap={canCreateChart && !chartLoading ? "tap" : {}}
                  >
                    {chartLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating 3D Chart...
                      </div>
                    ) : (<span className="flex items-center justify-center">🚀 Create 3D Chart</span>
                      
                    )}
                  </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 3: Chart Display */}
            <AnimatePresence>
              {showChart && currentChart && (
                <motion.div
                  className="bg-[#1f2937] rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  data-section="chart-display"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center">
                      <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                        3
                      </span>
                      <span className="break-words">Your 3D Chart</span>
                    </h2>

                    {/* Download Options */}
                    <div className="flex flex-wrap gap-2">
                      <motion.button
                        onClick={() => download3DChart("png")}
                        className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        📸 Download PNG
                      </motion.button>
                      <motion.button
                        onClick={() => download3DChart("jpeg")}
                        className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        📥 Download JPEG
                      </motion.button>
                      <motion.button
                        onClick={() => download3DChart("pdf")}
                        className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        📄 Download PDF
                      </motion.button>
                      <motion.button
                        onClick={downloadChartData}
                        className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm sm:text-base"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        📊 Download CSV
                      </motion.button>
                    </div>
                  </div>

                  <ChartDisplay3D chart={currentChart} />
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                    <motion.button
                      onClick={() => setShowChart(false)}
                      className="px-4 sm:px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm sm:text-base"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Hide Chart
                    </motion.button>

                    <motion.button
                      onClick={() => {
                        setChartConfig({
                          chartName: "",
                          chartType: "bar3d",
                          xAxis: "",
                          yAxis: "",
                          zAxis: "",
                        });
                        setShowChart(false);
                      }}
                      className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Create Another Chart
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - AI Suggestions Panel */}
          <AnimatePresence>
            {selectedFileId && (
              <motion.div
                className="lg:col-span-1"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="sticky top-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      🤖 AI Chart Assistant
                    </h3>
                    <motion.button
                      onClick={() => setShowAIPanel(!showAIPanel)}
                      className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-gray-700 transition duration-200"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {showAIPanel ? "Hide Panel" : "Show Panel"}
                    </motion.button>
                  </div>
                  
                  {/* Show AI Panel when showAIPanel is true and file is loaded */}
                  {showAIPanel && currentFile && (
                    <AIsuggestion3D
                      fileData={currentFile}
                      onSuggestionSelect={handleAISuggestion}
                      chartTypes={chartTypes3D}
                      mode="3d"
                    />
                  )}
                  
                  {/* Show loading state when file is selected but not loaded yet */}
                  {showAIPanel && selectedFileId && !currentFile && (
                    <motion.div
                      className="bg-[#1f2937] rounded-xl shadow-lg p-4 border border-gray-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="ml-3 text-blue-400">Loading file data for AI analysis...</p>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Show message when AI panel is hidden */}
                  {!showAIPanel && (
                    <motion.div
                      className="bg-[#1f2937] rounded-xl shadow-lg p-4 border border-gray-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="text-center py-6">
                        <div className="text-4xl mb-3">🤖</div>
                        <p className="text-gray-400 mb-3">AI Assistant is hidden</p>
                        <button
                          onClick={() => setShowAIPanel(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Show AI Assistant
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Additional Features Section */}
        <AnimatePresence>
          {showChart && currentChart && (
            <motion.div
              className="mt-6 sm:mt-8 bg-[#1f2937] rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">🛠️</span>
                <span>Chart Analytics</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Chart Statistics */}
                <motion.div
                  className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-sm font-medium">
                        Data Points
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {currentFile?.data?.length || 0}
                      </p>
                    </div>
                    <div className="text-blue-500 text-2xl">📊</div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-sm font-medium">
                        Columns
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {currentFile?.columns?.length || 0}
                      </p>
                    </div>
                    <div className="text-green-500 text-2xl">📋</div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-sm font-medium">
                        Chart Type
                      </p>
                      <p className="text-lg font-bold text-white capitalize">
                        {chartConfig.chartType?.replace("3d", " 3D") || "N/A"}
                      </p>
                    </div>
                    <div className="text-purple-500 text-2xl">🎯</div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-sm font-medium">
                        Dimensions
                      </p>
                      <p className="text-lg font-bold text-white">
                        {chartConfig.zAxis ? "3D (X,Y,Z)" : "2D (X,Y)"}
                      </p>
                    </div>
                    <div className="text-orange-500 text-2xl">🌐</div>
                  </div>
                </motion.div>
              </div>

              {/* Chart Configuration Summary */}
              {chartConfig.xAxis && chartConfig.yAxis && (
                <motion.div
                  className="mt-6 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="text-md font-semibold text-white mb-3 flex items-center">
                    <span className="mr-2">📝</span>
                    Configuration Summary
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-400">
                        Chart Name:
                      </span>
                      <p className="text-gray-200">
                        {chartConfig.chartName || "Untitled"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">X-Axis:</span>
                      <p className="text-gray-200">{chartConfig.xAxis}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">Y-Axis:</span>
                      <p className="text-gray-200">{chartConfig.yAxis}</p>
                    </div>
                    {chartConfig.zAxis && (
                      <div>
                        <span className="font-medium text-gray-400">
                          Z-Axis:
                        </span>
                        <p className="text-gray-200">{chartConfig.zAxis}</p>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-400">File:</span>
                      <p className="text-gray-200 truncate">
                        {currentFile?.originalFileName}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">
                        Created:
                      </span>
                      <p className="text-gray-200">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Section */}
        <motion.div
          className="mt-6 sm:mt-8 bg-[#1f2937] rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center">
            <motion.span
              className="mr-2 text-2xl"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              💡
            </motion.span>
            <span>3D Chart Creation Tips</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <motion.div className="space-y-3" >
              <h4 className="font-semibold text-blue-400 flex items-center">
                <span className="mr-2">🎯</span>
                Best Practices
              </h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>
                    Use descriptive chart names for easy identification
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>
                    Choose appropriate 3D chart types based on your data
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>
                    3D Scatter plots work best with 3 numeric dimensions
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>
                    Surface plots are ideal for continuous data visualization
                  </span>
                </li>
              </ul>
            </motion.div>

            <motion.div className="space-y-3" >
              <h4 className="font-semibold text-blue-400 flex items-center">
                <span className="mr-2">🚀</span>
                3D Features
              </h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Interactive rotation and zoom capabilities</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Enhanced depth perception for better insights</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Professional presentation-ready visualizations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">•</span>
                  <span>Export options: PNG, PDF, and CSV data</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-8 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p className="mb-2">
            Powered by AI • Enhanced 3D Visualizations • Interactive Charts
          </p>
          <motion.div
            className="flex justify-center space-x-4"
            variants={containerVariants}
          >
            <motion.span
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ duration: 0.2 }}
            >
              📊
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.2, rotate: -10 }}
              transition={{ duration: 0.2 }}
            >
              🤖
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ duration: 0.2 }}
            >
              🌐
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChartPage3D;
