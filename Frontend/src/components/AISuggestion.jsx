import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AISuggestion = ({
  fileData,
  onSuggestionSelect,
  chartTypes = ["bar", "line", "pie", "scatter"],
  mode = "2d",
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  const suggestionVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    hover: {
      scale: 1.03,
      boxShadow: "0 8px 25px rgba(79, 70, 229, 0.15)", // Indigo shadow
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.97 },
  };

  useEffect(() => {
    if (fileData && fileData.columns && fileData.data) {
      generateChartSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [fileData]);

  const callGeminiAPI = async (prompt) => {
    if (!GEMINI_API_KEY) {
      throw new Error("VITE_GEMINI_API_KEY not set");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || "";
  };

  const generateChartSuggestions = async () => {
    if (!fileData) return;
    setLoading(true);
    setError("");

    try {
      // Check if API key is available
      if (!GEMINI_API_KEY) {
        console.log("No Gemini API key available, using fallback suggestions");
        setFallbackSuggestions();
        return;
      }

      const columns = fileData.columns || [];
      const sampleData = fileData.data?.slice(0, 5) || [];
      const availableChartTypes = chartTypes.join(", ");

      const prompt = `
        Analyze the following data and suggest the top 3 chart types.
        Data columns: ${columns.join(", ")}
        Sample data: ${JSON.stringify(sampleData)}
        Available chart types: ${availableChartTypes}

        For each suggestion, provide the chart type, recommended columns for axes, a brief reason, a confidence score, and a visual benefit.
        Format the response as a JSON object with a key "recommendations", which is an array of objects.
        Each object should have: "chartType", "xAxis", "yAxis", "reason", "confidence", "visualBenefit".
      `;

      const response = await callGeminiAPI(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const aiResponse = JSON.parse(jsonMatch[0]);
        setSuggestions(aiResponse.recommendations || []);
      } else {
        setError("AI response was not in a valid format.");
        setFallbackSuggestions();
      }
    } catch (err) {
      console.error("Error generating suggestions:", err);
      setError("Failed to get AI suggestions. Using fallback.");
      setFallbackSuggestions();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackSuggestions = () => {
    // Enhanced fallback logic
    const columns = fileData?.columns || [];
    const numericColumns = columns.filter((col) =>
      fileData.data?.some((row) => !isNaN(parseFloat(row[col])))
    );
    const categoricalColumns = columns.filter(
      (col) => !numericColumns.includes(col)
    );

    const fallback = [];
    
    // Bar chart suggestion
    if (numericColumns.length > 0 && categoricalColumns.length > 0) {
      fallback.push({
        chartType: "bar",
        xAxis: categoricalColumns[0],
        yAxis: numericColumns[0],
        reason: "Perfect for comparing values across different categories.",
        confidence: "high",
        visualBenefit: "Clear visual distinction between categories.",
      });
    }
    
    // Line chart suggestion
    if (numericColumns.length >= 2) {
      fallback.push({
        chartType: "line",
        xAxis: numericColumns[0],
        yAxis: numericColumns[1],
        reason: "Ideal for showing trends and changes over time or sequence.",
        confidence: "high",
        visualBenefit: "Easy to spot trends, patterns, and outliers.",
      });
    }
    
    // Pie chart suggestion
    if (categoricalColumns.length > 0 && numericColumns.length > 0) {
      fallback.push({
        chartType: "pie",
        xAxis: categoricalColumns[0],
        yAxis: numericColumns[0],
        reason: "Great for showing proportions and parts of a whole.",
        confidence: "medium",
        visualBenefit: "Simple representation of percentage distribution.",
      });
    }
    
    // Scatter plot suggestion
    if (numericColumns.length >= 2) {
      fallback.push({
        chartType: "scatter",
        xAxis: numericColumns[0],
        yAxis: numericColumns[1],
        reason: "Excellent for revealing correlations between two numeric variables.",
        confidence: "medium",
        visualBenefit: "Shows relationship and clustering of data points.",
      });
    }
    
    setSuggestions(fallback.slice(0, 3));
  };

  const getChartIcon = (chartType) => {
    const iconMap = {
      bar: "📊",
      line: "📈",
      pie: "🥧",
      scatter: "✨",
      area: "🏞️",
    };
    return iconMap[chartType] || "📊";
  };

  const getChartLabel = (chartType) => {
    return chartType.charAt(0).toUpperCase() + chartType.slice(1) + " Chart";
  };

  return (
    <motion.div
      className="bg-[#161b22] rounded-xl shadow-lg border border-slate-700 overflow-hidden mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4 sm:p-6">
        <motion.h3
          className="text-lg sm:text-xl font-semibold text-indigo-400 mb-4 flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-xl">🤖</span> AI Recommendations
        </motion.h3>

        {!GEMINI_API_KEY && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-300 text-sm">
            <strong>AI Assistant Notice:</strong> 
            <p className="mt-1">For enhanced AI-powered chart recommendations, please set up your Gemini API key:</p>
            <ol className="mt-2 ml-4 list-decimal space-y-1 text-xs">
              <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google AI Studio</a></li>
              <li>Create a new API key</li>
              <li>Add <code className="bg-gray-700 px-1 rounded">VITE_GEMINI_API_KEY=your_key_here</code> to your .env file</li>
            </ol>
            <p className="mt-2 text-xs">Currently using smart fallback suggestions based on your data structure.</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="ml-3 text-indigo-400">Analyzing your data...</p>
          </div>
        )}

        {error && (
          <div className="text-red-400 bg-red-500/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && !fileData && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-slate-400 mb-2">No file data available</p>
            <p className="text-sm text-slate-500">Please select a file to get AI chart recommendations</p>
          </div>
        )}

        {!loading && !error && fileData && suggestions.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🤔</div>
            <p className="text-slate-400 mb-2">No suggestions available</p>
            <p className="text-sm text-slate-500">Unable to generate chart suggestions for this data</p>
          </div>
        )}

        {!loading && !error && fileData && suggestions.length > 0 && (
          <motion.div
            className="grid gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 rounded-lg shadow-md border border-gray-700 hover:border-blue-600 transition-all duration-300"
                variants={suggestionVariants}
                whileHover="hover"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3 flex-wrap">
                        <motion.span className="text-2xl">
                          {getChartIcon(suggestion.chartType)}
                        </motion.span>
                        <span className="font-semibold text-blue-400 text-lg">
                          {getChartLabel(suggestion.chartType)}
                        </span>
                        <motion.span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            suggestion.confidence === "high"
                              ? "bg-blue-900 text-blue-300"
                              : suggestion.confidence === "medium"
                              ? "bg-yellow-900 text-yellow-300"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {suggestion.confidence} confidence
                        </motion.span>
                      </div>

                      <p className="text-sm text-gray-300 mb-3">
                        <span className="font-semibold text-gray-200">
                          Axes:
                        </span>{" "}
                        X: {suggestion.xAxis}, Y: {suggestion.yAxis}
                      </p>

                      <p className="text-sm text-gray-400 mb-4">
                        {suggestion.reason}
                      </p>

                      {suggestion.visualBenefit && (
                         <div className="p-3 bg-gray-900/50 rounded-lg">
                          <p className="text-sm text-blue-300">
                            <span className="font-bold">Benefit:</span>{" "}
                            {suggestion.visualBenefit}
                          </p>
                        </div>
                      )}
                    </div>

                    <motion.button
                      onClick={() => onSuggestionSelect(suggestion)}
                      className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 self-stretch sm:self-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Apply Chart
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AISuggestion;
