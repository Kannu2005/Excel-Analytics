import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AIsuggestion3D = ({
  fileData,
  onSuggestionSelect,
  chartTypes,
  mode = "3d",
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  // Updated Gemini API configuration
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const suggestionVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 8px 25px rgba(30, 58, 138, 0.15)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  };

  const loadingVariants = {
    spin: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Generate 3D chart suggestions when file data is available
  useEffect(() => {
    if (fileData && fileData.columns && fileData.data) {
      generate3DChartSuggestions();
    }
  }, [fileData]);

  const callGeminiAPI = async (prompt) => {
    // Check if API key is available
    if (!GEMINI_API_KEY) {
      throw new Error(
        "Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your environment variables."
      );
    }

    // Try multiple models in case one fails
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return data.candidates[0]?.content?.parts[0]?.text || "";
        } else {
          console.warn(
            `❌ Model ${model} failed with status: ${response.status}`
          );
          if (response.status === 403) {
            throw new Error(
              "API key is invalid or doesn't have proper permissions"
            );
          }
          continue;
        }
      } catch (error) {
        console.warn(`❌ Model ${model} failed:`, error.message);
        if (model === models[models.length - 1]) {
          throw error;
        }
        continue;
      }
    }

    throw new Error("All Gemini models failed to respond");
  };

  const generate3DChartSuggestions = async () => {
    setLoading(true);
    setError("");

    try {
      const columns = fileData.columns || [];
      const sampleData = fileData.data?.slice(0, 10) || [];

      // Create data summary for AI
      const dataSummary = {
        columns: columns,
        sampleRows: sampleData.length,
        totalRows: fileData.data?.length || 0,
        columnTypes: analyzeColumnTypes(columns, sampleData),
      };

      const prompt = `
Analyze this Excel data and suggest the best 3D chart types for enhanced visualization:

Data Structure:
- Columns: ${columns.join(", ")}
- Total Rows: ${dataSummary.totalRows}
- Sample Data: ${JSON.stringify(sampleData.slice(0, 3))}

Column Analysis:
${Object.entries(dataSummary.columnTypes)
  .map(([col, type]) => `- ${col}: ${type}`)
  .join("\n")}

Available 3D Chart Types:
1. bar3d - 3D Bar Charts for comparing categories with depth and visual impact
2. line3d - 3D Line Charts for showing trends in three-dimensional space
3. scatter3d - 3D Scatter Plots for multi-dimensional relationships (requires X, Y, Z axes)
4. surface3d - 3D Surface Plots for continuous data visualization (requires X, Y, Z axes)
5. column3d - Enhanced 3D Column Charts for better visual representation
6. pie3d - 3D Pie Charts with enhanced depth effects

Important 3D Chart Guidelines:
- scatter3d and surface3d work best with 3 numeric dimensions (X, Y, Z axes)
- bar3d, line3d, column3d work well with 2 dimensions (X categorical, Y numeric)
- pie3d works best for categorical data showing parts of a whole
- 3D charts provide better visual depth and interactivity than 2D charts

Please provide:
1. Top 3 recommended 3D chart types with reasons
2. Best X-axis, Y-axis, and Z-axis (if applicable) combinations
3. Brief explanation focusing on 3D visualization benefits
4. Confidence level for each recommendation

Format your response as JSON:
{
  "recommendations": [
    {
      "chartType": "bar3d|line3d|pie3d|scatter3d|surface3d|column3d",
      "xAxis": "column_name",
      "yAxis": "column_name", 
      "zAxis": "column_name or null",
      "reason": "explanation focusing on 3D benefits",
      "confidence": "high|medium|low",
      "visualBenefit": "specific 3D advantage"
    }
  ]
}
`;

      const response = await callGeminiAPI(prompt);

      // Parse the JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const aiResponse = JSON.parse(jsonMatch[0]);
        setSuggestions(aiResponse.recommendations || []);
      } else {
        setSuggestions(parseTextResponse(response));
      }
    } catch (error) {
      console.error("Error generating 3D suggestions:", error);
      setError(`Failed to generate 3D AI suggestions: ${error.message}`);
      setFallback3DSuggestions();
    } finally {
      setLoading(false);
    }
  };

  const analyzeColumnTypes = (columns, sampleData) => {
    const types = {};

    columns.forEach((column) => {
      const sampleValues = sampleData
        .map((row) => row[column])
        .filter((val) => val !== null && val !== undefined);

      if (sampleValues.length === 0) {
        types[column] = "unknown";
        return;
      }

      const isNumeric = sampleValues.every(
        (val) => !isNaN(parseFloat(val)) && isFinite(val)
      );
      const isDate = sampleValues.some((val) => !isNaN(Date.parse(val)));

      if (isNumeric) {
        types[column] = "numeric";
      } else if (isDate) {
        types[column] = "date";
      } else {
        types[column] = "categorical";
      }
    });

    return types;
  };

  const parseTextResponse = (text) => {
    const suggestions = [];
    const lines = text.split("\n");

    lines.forEach((line) => {
      if (line.includes("bar3d") || line.includes("3D bar")) {
        suggestions.push({
          chartType: "bar3d",
          reason: "Recommended for 3D category comparison with enhanced depth",
          confidence: "medium",
          visualBenefit: "Enhanced visual impact with 3D depth"
        });
      }
      if (line.includes("scatter3d") || line.includes("3D scatter")) {
        suggestions.push({
          chartType: "scatter3d",
          reason: "Ideal for multi-dimensional data relationships in 3D space",
          confidence: "high",
          visualBenefit: "Shows complex relationships across three dimensions"
        });
      }
    });

    return suggestions.slice(0, 3);
  };

  const setFallback3DSuggestions = () => {
    const columns = fileData?.columns || [];
    const numericColumns = columns.filter((col) =>
      fileData.data?.some((row) => !isNaN(parseFloat(row[col])))
    );
    const categoricalColumns = columns.filter(
      (col) => !numericColumns.includes(col)
    );

    const fallback = [];

    if (numericColumns.length > 0 && categoricalColumns.length > 0) {
      fallback.push({
        chartType: "bar3d",
        xAxis: categoricalColumns[0],
        yAxis: numericColumns[0],
        zAxis: null,
        reason: "3D bars provide enhanced visual depth for comparing categories",
        confidence: "medium",
        visualBenefit: "Better visual impact than 2D charts"
      });
    }

    if (numericColumns.length >= 3) {
      fallback.push({
        chartType: "scatter3d",
        xAxis: numericColumns[0],
        yAxis: numericColumns[1],
        zAxis: numericColumns[2],
        reason: "Perfect for exploring relationships in three-dimensional space",
        confidence: "high",
        visualBenefit: "Interactive 3D exploration of data relationships"
      });
    }

    if (numericColumns.length >= 2) {
      fallback.push({
        chartType: "surface3d",
        xAxis: numericColumns[0],
        yAxis: numericColumns[1],
        zAxis: numericColumns[2] || numericColumns[0],
        reason: "Ideal for visualizing continuous data as a 3D surface",
        confidence: "medium",
        visualBenefit: "Smooth 3D surface visualization"
      });
    }

    setSuggestions(fallback);
  };

  const handleSuggestionClick = (suggestion) => {
    onSuggestionSelect({
      chartType: suggestion.chartType,
      xAxis: suggestion.xAxis,
      yAxis: suggestion.yAxis,
      zAxis: suggestion.zAxis,
    });
  };

  const getChartIcon = (chartType) => {
    const iconMap = {
      bar3d: "📊",
      line3d: "📈", 
      scatter3d: "⚡",
      surface3d: "🌐",
      column3d: "📋",
      pie3d: "🥧"
    };
    return iconMap[chartType] || "📊";
  };

  const getChartLabel = (chartType) => {
    const labelMap = {
      bar3d: "3D Bar Chart",
      line3d: "3D Line Chart", 
      scatter3d: "3D Scatter Plot", 
      surface3d: "3D Surface Plot",
      column3d: "3D Column Chart",
      pie3d: "3D Pie Chart"
    };
    return labelMap[chartType] || "3D Chart";
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-4 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 text-sm sm:text-base font-semibold shadow-lg flex items-center gap-2 border border-gray-600"
        whileHover={{
          scale: 1.05,
          boxShadow: "0 6px 20px rgba(75, 85, 99, 0.3)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          animate={{ rotate: isVisible ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isVisible ? "▼" : "▶"}
        </motion.span>
        {isVisible ? "Hide AI Assistant" : "Show AI Assistant"}
      </motion.button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="bg-[#1f2937] rounded-xl shadow-lg border border-gray-700 overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Header with animated background */}
            <motion.div
              className="bg-gradient-to-r from-gray-700 to-gray-800 p-4 sm:p-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h3
                className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center flex-wrap gap-2"
                variants={pulseVariants}
                animate="pulse"
              >
                <motion.span
                  className="text-2xl sm:text-3xl"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  🤖
                </motion.span>
                <span className="text-lg sm:text-xl">3D AI Chart Assistant</span>
              </motion.h3>
              <motion.p
                className="text-gray-300 text-sm sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Smart 3D visualization recommendations powered by AI
              </motion.p>
            </motion.div>

            <div className="p-4 sm:p-6">
              {/* Show message when no file data is available */}
              {!fileData && (
                <motion.div
                  className="mb-4 sm:mb-6 p-4 bg-gray-800 border-2 border-gray-600 rounded-lg shadow-sm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.p
                    className="text-gray-300 text-sm sm:text-base flex items-start gap-2"
                    variants={itemVariants}
                  >
                    <span className="text-lg flex-shrink-0">📁</span>
                    <span>
                      <strong>No file selected:</strong> Please select a file to get AI-powered 3D chart suggestions.
                    </span>
                  </motion.p>
                </motion.div>
              )}

              {/* API Key Warning */}
              <AnimatePresence>
                {!GEMINI_API_KEY && (
                  <motion.div
                    className="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-900 bg-opacity-50 border-2 border-yellow-600 rounded-lg shadow-sm"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.p
                      className="text-yellow-300 text-sm sm:text-base flex items-start gap-2"
                      variants={itemVariants}
                    >
                      <span className="text-lg flex-shrink-0">⚠️</span>
                      <span>
                        <strong>3D AI features disabled:</strong> Please set your
                        VITE_GEMINI_API_KEY in your environment variables to enable 3D AI
                        suggestions.
                      </span>
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 3D Chart Suggestions Section */}
              <AnimatePresence>
                {fileData && suggestions.length > 0 && (
                  <motion.div
                    className="mb-6 sm:mb-8"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.h4
                      className="text-lg sm:text-xl font-semibold text-blue-400 mb-3 sm:mb-4 flex items-center gap-2"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.span
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                      >
                        🎯
                      </motion.span>
                      Recommended 3D Charts
                    </motion.h4>

                    {loading ? (
                      <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center py-6 sm:py-8 gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"
                          variants={loadingVariants}
                          animate="spin"
                        />
                        <span className="text-blue-400 font-medium text-center">
                          AI is analyzing your data for 3D visualization...
                        </span>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="grid gap-3 sm:gap-4"
                        variants={containerVariants}
                      >
                        {suggestions.map((suggestion, index) => (
                          <motion.div
                            key={index}
                            className="bg-gray-800 rounded-lg border-2 border-gray-600 hover:border-blue-500 transition-all duration-300 cursor-pointer overflow-hidden"
                            variants={suggestionVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => handleSuggestionClick(suggestion)}
                            layout
                          >
                            <div className="p-4 sm:p-5">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3 flex-wrap">
                                    <motion.span
                                      className="text-xl sm:text-2xl"
                                      whileHover={{ scale: 1.3, rotate: 10 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      {getChartIcon(suggestion.chartType)}
                                    </motion.span>
                                    <span className="font-semibold text-blue-400 text-base sm:text-lg">
                                      {getChartLabel(suggestion.chartType)}
                                    </span>
                                    <motion.span
                                      className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                                        suggestion.confidence === "high"
                                          ? "bg-blue-900 text-blue-300"
                                          : suggestion.confidence === "medium"
                                          ? "bg-yellow-900 text-yellow-300"
                                          : "bg-gray-700 text-gray-300"
                                      }`}
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      {suggestion.confidence} confidence
                                    </motion.span>
                                  </div>

                                  {suggestion.xAxis && suggestion.yAxis && (
                                    <motion.div
                                      className="text-sm sm:text-base text-gray-300 mb-2 font-medium"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.2 }}
                                    >
                                      <strong className="text-blue-400">Axes:</strong>{" "}
                                      X: {suggestion.xAxis}, Y: {suggestion.yAxis}
                                      {suggestion.zAxis && `, Z: ${suggestion.zAxis}`}
                                    </motion.div>
                                  )}

                                  <motion.p
                                    className="text-sm sm:text-base text-gray-400 mb-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                  >
                                    {suggestion.reason}
                                  </motion.p>

                                  {suggestion.visualBenefit && (
                                    <motion.div
                                      className="text-xs sm:text-sm text-blue-300 bg-blue-900 bg-opacity-50 px-2 py-1 rounded-md inline-block"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.4 }}
                                    >
                                      <strong>3D Benefit:</strong> {suggestion.visualBenefit}
                                    </motion.div>
                                  )}
                                </div>

                                <motion.button
                                  className="ml-0 sm:ml-4 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm sm:text-base font-semibold shadow-lg self-start sm:self-center"
                                  whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 6px 20px rgba(59, 130, 246, 0.3)",
                                  }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Apply 3D Chart
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Fallback when no file data is available */}
              {!fileData && (
                <motion.div
                  className="mb-6 sm:mb-8 p-6 bg-gray-800 rounded-lg border-2 border-gray-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <motion.h4
                    className="text-lg sm:text-xl font-semibold text-blue-400 mb-3 flex items-center gap-2"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>📊</span>
                    Ready for 3D Chart Creation
                  </motion.h4>
                  <motion.p
                    className="text-gray-300 text-sm sm:text-base mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Select a file to get AI-powered 3D chart suggestions. Our AI will analyze your data and recommend the best 3D visualization options.
                  </motion.p>
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🎯</span>
                        <span className="font-medium text-blue-400">Smart Analysis</span>
                      </div>
                      <p className="text-xs text-gray-400">AI analyzes your data structure and suggests optimal 3D chart types</p>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">✨</span>
                        <span className="font-medium text-blue-400">3D Benefits</span>
                      </div>
                      <p className="text-xs text-gray-400">Enhanced depth perception and interactive visualizations</p>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-900 bg-opacity-50 border-2 border-red-600 rounded-lg shadow-sm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.p
                      className="text-red-300 text-sm sm:text-base flex items-start gap-2"
                      variants={itemVariants}
                    >
                      <span className="text-lg flex-shrink-0">❌</span>
                      <span>{error}</span>
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading State */}
              <AnimatePresence>
                {loading && !suggestions.length && (
                  <motion.div
                    className="text-center py-8 sm:py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="inline-block rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-500 border-t-transparent mb-4"
                      variants={loadingVariants}
                      animate="spin"
                    />
                    <motion.p
                      className="text-blue-400 font-medium text-base sm:text-lg"
                      variants={pulseVariants}
                      animate="pulse"
                    >
                      AI is analyzing your data for 3D visualization...
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 3D Chart Benefits Info */}
              <motion.div
                className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <motion.h5
                  className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2"
                  whileHover={{ x: 3 }}
                >
                  <span>✨</span>
                  3D Visualization Benefits
                </motion.h5>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Enhanced depth perception and visual impact</li>
                  <li>• Interactive rotation and zooming capabilities</li>
                  <li>• Better understanding of multi-dimensional relationships</li>
                  <li>• Professional presentation-ready visualizations</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIsuggestion3D;