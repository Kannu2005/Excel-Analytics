// components/ChartDisplay.jsx
import React, { useRef, useEffect } from "react";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const ChartDisplay = ({ chart }) => {
  const chartRef = useRef(null);

  if (!chart || !chart.chartData || !chart.chartType) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-800 rounded-lg border border-slate-700">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-slate-400">No chart data available</p>
          <p className="text-sm text-slate-500">Create a chart to see it here</p>
        </div>
      </div>
    );
  }

  const chartData = chart.chartData;
  const chartType = chart.chartType;

  // Chart components mapping
  const components = {
    bar: Bar,
    line: Line,
    pie: Pie,
    scatter: Scatter,
    column3d: Bar, // Fallback to regular bar for 3D column
  };

  const ChartComponent = components[chartType] || Bar;

  const getGradient = (color) => {
    return 'rgba(59, 130, 246, 0.5)';
  };

  // Chart options with better styling and download support
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
    plugins: {
      title: {
        display: true,
        text: chart.chartName || "Chart",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: 20,
        color: "#e2e8f0", // slate-200
      },
      legend: {
        display: true,
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
          color: "#cbd5e1", // slate-300
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)", // slate-900 with opacity
        titleColor: "#e2e8f0", // slate-200
        bodyColor: "#cbd5e1", // slate-300
        borderColor: "rgba(59, 130, 246, 0.5)", // blue-500 with opacity
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function (context) {
            return context[0].label;
          },
          label: function (context) {
            const label = context.dataset.label || "";
            const value =
              typeof context.parsed.y !== "undefined"
                ? context.parsed.y
                : context.parsed;
            return `${label}: ${
              typeof value === "number" ? value.toLocaleString() : value
            }`;
          },
        },
      },
    },
    scales:
      chartType !== "pie"
        ? {
            x: {
              display: true,
              title: {
                display: true,
                text: chart.xAxis || "X Axis",
                font: {
                  size: 14,
                  weight: "bold",
                },
                color: "#e2e8f0", // slate-200
              },
              grid: {
                display: true,
                color: "rgba(148, 163, 184, 0.2)", // slate-400 with opacity
              },
              ticks: {
                color: "#cbd5e1", // slate-300
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: chart.yAxis || "Y Axis",
                font: {
                  size: 14,
                  weight: "bold",
                },
                color: "#e2e8f0", // slate-200
              },
              grid: {
                display: true,
                color: "rgba(148, 163, 184, 0.2)", // slate-400 with opacity
              },
              ticks: {
                color: "#cbd5e1", // slate-300
              },
              beginAtZero: true,
            },
          }
        : undefined,
  };

  // Enhanced chart data with better colors and styling
  const enhancedChartData = {
    ...chartData,
    datasets: chartData.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor:
        chartType === "pie"
          ? generatePieColors(chartData.labels.length)
          : generateBarColors(chartData.labels.length, index),
      borderColor:
        chartType === "line"
          ? generateLineColors(index)
          : chartType === "pie"
          ? undefined
          : "rgba(59, 130, 246, 0.8)", // blue-500
      borderWidth: chartType === "pie" ? 2 : chartType === "line" ? 3 : 1,
      tension: chartType === "line" ? 0.4 : undefined,
      fill: chartType === "line" ? false : undefined,
      pointBackgroundColor:
        chartType === "line" ? generateLineColors(index) : undefined,
      pointBorderColor: chartType === "line" ? "#1e293b" : undefined, // slate-800
      pointBorderWidth: chartType === "line" ? 2 : undefined,
      pointRadius: chartType === "line" ? 5 : undefined,
      pointHoverRadius: chartType === "line" ? 7 : undefined,
    })),
  };

  return (
    <div className="w-full">
      {/* Chart Container */}
      <div
        id="chart-container"
        className="relative bg-slate-900 p-4 rounded-lg border border-slate-700"
        style={{ height: "500px" }}
      >
        <ChartComponent
          ref={chartRef}
          data={enhancedChartData}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

// Helper functions for generating colors
const generatePieColors = (count) => {
  const colors = [
    "#3B82F6", // blue-500
    "#EF4444", // red-500
    "#F59E0B", // amber-500
    "#10B981", // emerald-500
    "#8B5CF6", // violet-500
    "#F97316", // orange-500
    "#06B6D4", // cyan-500
    "#84CC16", // lime-500
    "#EC4899", // pink-500
    "#6366F1", // indigo-500
    "#14B8A6", // teal-500
    "#F43F5E", // rose-500
    "#A855F7", // purple-500
    "#EAB308", // yellow-500
    "#22C55E", // green-500
  ];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

const generateBarColors = (count, datasetIndex = 0) => {
  const colorSets = [
    "rgba(59, 130, 246, 0.6)", // blue-500
    "rgba(239, 68, 68, 0.6)", // red-500
    "rgba(245, 158, 11, 0.6)", // amber-500
    "rgba(16, 185, 129, 0.6)", // emerald-500
    "rgba(139, 92, 246, 0.6)", // violet-500
    "rgba(249, 115, 22, 0.6)", // orange-500
  ];
  return Array(count).fill(colorSets[datasetIndex % colorSets.length]);
};

const generateLineColors = (datasetIndex = 0) => {
  const colors = [
    "rgb(59, 130, 246)", // blue-500
    "rgb(239, 68, 68)", // red-500
    "rgb(245, 158, 11)", // amber-500
    "rgb(16, 185, 129)", // emerald-500
    "rgb(139, 92, 246)", // violet-500
    "rgb(249, 115, 22)", // orange-500
  ];
  return colors[datasetIndex % colors.length];
};

export default ChartDisplay;
