import React, { useRef, useEffect, useState } from "react";

const ChartDisplay3D = ({ chart }) => {
  const chartRef = useRef(null);
  const plotlyDivRef = useRef(null);
  const [plotlyLoaded, setPlotlyLoaded] = useState(false);
  const [plotlyError, setPlotlyError] = useState(null);

  // Load Plotly from CDN
  useEffect(() => {
    if (window.Plotly) {
      setPlotlyLoaded(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="plotly"]');
    if (existingScript) {
      // Wait for existing script to load
      existingScript.onload = () => setPlotlyLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.26.0/plotly.min.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      // Add small delay to ensure Plotly is fully initialized
      setTimeout(() => {
        if (window.Plotly && window.Plotly.newPlot) {
          setPlotlyLoaded(true);
        } else {
          setPlotlyError("Plotly failed to initialize properly");
        }
      }, 100);
    };

    script.onerror = () => {
      setPlotlyError("Failed to load Plotly.js library from CDN");
    };

    document.head.appendChild(script);

    return () => {
      // Don't remove script on cleanup to avoid re-loading
    };
  }, []);

  useEffect(() => {
    if (
      !plotlyLoaded ||
      !chart ||
      !chart.chartData ||
      !chart.chartType ||
      !plotlyDivRef.current
    ) {
      return;
    }

    const renderChart = () => {
      const chartData = chart.chartData;
      // console.log("data",chart.zAxis,chart.xAxis,chart.yAxis)
      const chartType = chart.chartType;

      let data = [];
      let layout = {
        template: 'plotly_dark',
        title: {
          text: chart.chartName || "3D Chart",
          font: { size: 18, color: '#ffffff' }
        },
        scene: {
          xaxis: {
            title: chart.xAxis || "X Axis",
            titlefont: { size: 14, color: '#a0aec0' },
            tickfont: { color: '#a0aec0' },
            gridcolor: 'rgba(255, 255, 255, 0.1)',
            zerolinecolor: 'rgba(255, 255, 255, 0.2)',
          },
          yaxis: {
            title: chart.yAxis || "Y Axis",
            titlefont: { size: 14, color: '#a0aec0' },
            tickfont: { color: '#a0aec0' },
            gridcolor: 'rgba(255, 255, 255, 0.1)',
            zerolinecolor: 'rgba(255, 255, 255, 0.2)',
          },
          zaxis: {
            title: chart.zAxis || "Z Axis",
            titlefont: { size: 14, color: '#a0aec0' },
            tickfont: { color: '#a0aec0' },
            gridcolor: 'rgba(255, 255, 255, 0.1)',
            zerolinecolor: 'rgba(255, 255, 255, 0.2)',
          },
          camera: {
            eye: { x: 1.2, y: 1.2, z: 1.2 }
          },
          bgcolor: '#111827',
        },
        margin: { l: 0, r: 0, b: 0, t: 50 },
        paper_bgcolor: '#1f2937',
        plot_bgcolor: '#1f2937',
        autosize: true,
        legend: {
          font: {
            color: '#ffffff'
          }
        }
      };

      const config = {
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ["pan2d", "lasso2d", "select2d"],
        responsive: true,
      };

      switch (chartType) {
        case "bar3d":
          // Create proper 3D bar chart using scatter3d with bar-like visualization
          data = chartData.datasets.map((dataset, index) => {
            const x = [];
            const y = [];
            const z = [];

            // Create 3D bars by creating vertical lines for each data point
            chartData.labels.forEach((label, i) => {
              const value = Math.max(0, dataset.data[i] || 0);
              // Create vertical bar from 0 to value
              x.push(i, i, null);
              y.push(0, value, null);
              z.push(index * 0.5, index * 0.5, null);
            });

            return {
              type: "scatter3d",
              mode: "lines",
              x: [...x], // Create new array to avoid mutation
              y: [...y],
              z: [...z],
              name: dataset.label || `Dataset ${index + 1}`,
              line: {
                color: generateLineColor(index),
                width: 8,
              },
            };
          });
          break;

        case "surface3d":
          // Create proper surface plot data
          if (chartData.datasets.length > 0) {
            // Generate a proper grid for surface
            const xSize = chartData.labels.length;
            const ySize = chartData.datasets.length;

            const zValues = [];
            for (let i = 0; i < ySize; i++) {
              const row = [];
              for (let j = 0; j < xSize; j++) {
                const value = chartData.datasets[i]?.data?.[j];
                row.push(typeof value === "number" ? value : 0);
              }
              zValues.push([...row]); // Create new array to avoid mutation
            }

            data = [
              {
                type: "surface",
                x: chartData.labels.map((_, i) => i),
                y: chartData.datasets.map((_, i) => i),
                z: zValues,
                colorscale: "Viridis",
                opacity: 0.9,
                name: "Surface",
                showscale: true,
              },
            ];
          }
          break;

        case "scatter3d":
          data = chartData.datasets.map((dataset, index) => ({
            type: "scatter3d",
            mode: "markers",
            x: chartData.labels.map((_, i) => i),
            y: [...(dataset.data || [])], // Create new array
            z: dataset.data
              ? dataset.data.map((val, i) => Math.sin(i * 0.3) * 10)
              : [], // Better Z variation
            name: dataset.label || `Dataset ${index + 1}`,
            marker: {
              size: 6,
              color: [...(dataset.data || [])], // Create new array
              colorscale: "Viridis",
              opacity: 0.8,
              colorbar: {
                title: dataset.label || `Dataset ${index + 1}`,
              },
              line: {
                color: "rgb(204, 204, 204)",
                width: 1,
              },
            },
          }));
          break;

        case "line3d":
          data = chartData.datasets.map((dataset, index) => ({
            type: "scatter3d",
            mode: "lines+markers",
            x: chartData.labels.map((_, i) => i),
            y: [...(dataset.data || [])], // Create new array
            z: dataset.data
              ? dataset.data.map((val, i) => Math.sin(i * 0.5) * 5 + index * 2)
              : [], // Better Z variation
            name: dataset.label || `Dataset ${index + 1}`,
            line: {
              color: generateLineColor(index),
              width: 4,
            },
            marker: {
              size: 4,
              color: generateLineColor(index),
              opacity: 0.8,
            },
          }));
          break;

        case "column3d":
          // Create true 3D column chart using bar3d approach
          data = chartData.datasets.map((dataset, datasetIndex) => {
            const x = [];
            const y = [];
            const z = [];
            const colors = [];

            chartData.labels.forEach((label, i) => {
              const value = Math.max(0, dataset.data?.[i] || 0);
              const colorSet = generateColors(1, datasetIndex);
              const steps = Math.max(5, Math.min(20, Math.ceil(value / 5)));

              // Create multiple points to form a column
              for (let step = 0; step <= steps; step++) {
                const h = (value * step) / steps;
                x.push(i + datasetIndex * 0.3);
                y.push(h);
                z.push(datasetIndex);
                colors.push(colorSet[0]);
              }
            });

            return {
              type: "scatter3d",
              mode: "markers",
              x: [...x], // Create new array
              y: [...y],
              z: [...z],
              name: dataset.label || `Dataset ${datasetIndex + 1}`,
              marker: {
                size: 3,
                color: [...colors], // Create new array
                opacity: 0.8,
              },
            };
          });
          break;

        case "pie3d":
          // For pie chart, we need to remove the scene layout
          const pieData = chartData.datasets?.[0]?.data || [];
          const pieLabels = chartData.labels || [];

          data = [
            {
              type: "pie",
              labels: [...pieLabels], // Create new array
              values: [...pieData], // Create new array
              name: chartData.datasets?.[0]?.label || "Pie Chart",
              hole: 0.3,
              marker: {
                colors: generatePieColors(pieLabels.length),
                line: {
                  color: "#FFFFFF",
                  width: 2,
                },
              },
              textinfo: "label+percent",
              textposition: "outside",
              automargin: true,
            },
          ];

          // Override layout for pie chart (remove 3D scene)
          layout = {
            title: {
              text: chart.chartName || "3D Pie Chart",
              font: { size: 18 },
            },
            showlegend: true,
            margin: { l: 50, r: 50, b: 50, t: 80 },
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)",
            autosize: true,
          };
          break;

        case "mesh3d":
          // Add mesh3d chart type
          const firstDataset = chartData.datasets?.[0];
          if (firstDataset && firstDataset.data) {
            const meshX = chartData.labels.map((_, i) => i);
            const meshY = [...firstDataset.data]; // Create new array
            const meshZ = firstDataset.data.map(
              (val, i) => Math.cos(i * 0.3) * (val || 0) * 0.1
            );

            data = [
              {
                type: "mesh3d",
                x: [...meshX], // Create new array
                y: meshY,
                z: [...meshZ], // Create new array
                intensity: meshY,
                colorscale: "Rainbow",
                opacity: 0.7,
                name: firstDataset.label || "Mesh 3D",
              },
            ];
          }
          break;

        default:
          // Default to 3D scatter
          const defaultDataset = chartData.datasets?.[0];
          if (defaultDataset && defaultDataset.data) {
            data = [
              {
                type: "scatter3d",
                mode: "markers",
                x: chartData.labels.map((_, i) => i),
                y: [...defaultDataset.data], // Create new array
                z: defaultDataset.data.map((val, i) => i),
                name: defaultDataset.label || "Default Chart",
                marker: {
                  size: 5,
                  color: [...defaultDataset.data], // Create new array
                  colorscale: "Viridis",
                  opacity: 0.8,
                  colorbar: {
                    title: "Values",
                  },
                },
              },
            ];
          }
      }

      // Use window.Plotly since we loaded it via CDN
      try {
        if (
          window.Plotly &&
          typeof window.Plotly.newPlot === "function" &&
          data.length > 0
        ) {
          // Clear any existing plot first
          if (plotlyDivRef.current) {
            window.Plotly.purge(plotlyDivRef.current);
          }

          // Create deep copies to avoid mutation issues
          const plotData = JSON.parse(JSON.stringify(data));
          const plotLayout = JSON.parse(JSON.stringify(layout));

          window.Plotly.newPlot(
            plotlyDivRef.current,
            plotData,
            plotLayout,
            config
          );
        } else {
          setPlotlyError("Plotly.newPlot is not available or no data to plot");
        }
      } catch (error) {
        console.error("Error rendering Plotly chart:", error);
        setPlotlyError("Error rendering chart: " + error.message);
      }
    };

    renderChart();

    // Cleanup function
    return () => {
      if (
        plotlyDivRef.current &&
        window.Plotly &&
        typeof window.Plotly.purge === "function"
      ) {
        try {
          window.Plotly.purge(plotlyDivRef.current);
        } catch (error) {
          console.error("Error cleaning up Plotly chart:", error);
        }
      }
    };
  }, [chart, plotlyLoaded]);

  if (plotlyError) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200">
        <div className="text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="text-red-600 font-semibold">
            Error: Plotly library not properly loaded
          </p>
          <p className="text-sm text-red-500 mt-1">{plotlyError}</p>
          <p className="text-xs text-red-400 mt-2">
            Please refresh the page or check your internet connection
          </p>
        </div>
      </div>
    );
  }

  if (!plotlyLoaded) {
    return (
      <div className="flex items-center justify-center h-64 bg-blue-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-2">⏳</div>
          <p className="text-blue-600">Loading 3D Chart Library...</p>
          <p className="text-sm text-blue-500">Please wait</p>
        </div>
      </div>
    );
  }

  if (!chart || !chart.chartData || !chart.chartType) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-2">📈</div>
          <p className="text-gray-500">No 3D chart data available</p>
          <p className="text-sm text-gray-400">
            Create a 3D chart to see it here
          </p>
        </div>
      </div>
    );
  }

  const chartData = chart.chartData;

  return (
    <div className="w-full">
      {/* Chart Info */}
      <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
        <div className="grid lg:grid-cols-5 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-semibold text-gray-400">Chart Type:</span>
            <p className="text-white capitalize">
              {chart.chartType.replace("3d", " 3D")}
            </p>
          </div>
          <div>
            <span className="font-semibold text-gray-400">X Axis:</span>
            <p className="text-white">{chart.xAxis || "X Axis"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-400">Y Axis:</span>
            <p className="text-white">{chart.yAxis || "Y Axis"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-400">Z Axis:</span>
            <p className="text-white">{chart.zAxis || "Z Axis not used"}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-400">Data Points:</span>
            <p className="text-white">{chartData.labels?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div
        id="chart-container-3d"
        className="relative bg-[#1f2937] p-4 rounded-lg shadow-lg border border-gray-700"
        style={{ height: "600px" }}
      >
        <div ref={plotlyDivRef} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Chart Statistics */}
      <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
        <h4 className="font-semibold text-blue-400 mb-2">
          📊 Chart Statistics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          {chartData.datasets.map((dataset, index) => {
            const values = dataset.data.filter(
              (val) => typeof val === "number" && !isNaN(val)
            );
            const sum = values.reduce((a, b) => a + b, 0);
            const avg = values.length > 0 ? sum / values.length : 0;
            const max = values.length > 0 ? Math.max(...values) : 0;
            const min = values.length > 0 ? Math.min(...values) : 0;

            return (
              <div key={index} className="bg-gray-700 p-2 rounded border border-gray-600">
                <span className="font-semibold text-blue-300 block mb-1">
                  {dataset.label}
                </span>
                <div className="text-xs text-gray-300 space-y-1">
                  <p>
                    <strong>Total:</strong> {sum.toLocaleString()}
                  </p>
                  <p>
                    <strong>Average:</strong> {avg.toFixed(2)}
                  </p>
                  <p>
                    <strong>Max:</strong> {max.toLocaleString()}
                  </p>
                  <p>
                    <strong>Min:</strong> {min.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3D Controls Info */}
      <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
        <h4 className="font-semibold text-blue-400 mb-2">
          🎮 3D Interactive Controls
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
          <div className="flex items-center space-x-2">
            <span className="font-bold">🖱️ Rotate:</span>
            <span>Click and drag</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold">🔍 Zoom:</span>
            <span>Scroll wheel</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold">✋ Pan:</span>
            <span>Shift + click and drag</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          <p>
            💡 Tip: Use the toolbar buttons to reset view, take screenshot, or
            toggle hover info
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper functions for generating colors
const generateColors = (count, datasetIndex = 0) => {
  const colorSets = [
    ["#3B82F6", "#1E40AF", "#1D4ED8", "#2563EB", "#60A5FA"],
    ["#EF4444", "#DC2626", "#B91C1C", "#F87171", "#FCA5A5"],
    ["#10B981", "#059669", "#047857", "#34D399", "#6EE7B7"],
    ["#F59E0B", "#D97706", "#B45309", "#FBBF24", "#FCD34D"],
    ["#8B5CF6", "#7C3AED", "#6D28D9", "#A78BFA", "#C4B5FD"],
    ["#06B6D4", "#0891B2", "#0E7490", "#22D3EE", "#67E8F9"],
  ];

  const colors = colorSets[datasetIndex % colorSets.length];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

const generatePieColors = (count) => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FECA57",
    "#FF9FF3",
    "#54A0FF",
    "#5F27CD",
    "#00D2D3",
    "#FF9F43",
    "#EE5A24",
    "#0097E6",
    "#8C7AE6",
    "#2ED573",
    "#FFC312",
    "#FF6348",
    "#1DD1A1",
    "#FF3838",
    "#FF6B35",
    "#F8B500",
  ];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

const generateLineColor = (datasetIndex = 0) => {
  const colors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#06B6D4",
    "#F97316",
    "#84CC16",
    "#EC4899",
    "#6366F1",
    "#14B8A6",
    "#F472B6",
  ];
  return colors[datasetIndex % colors.length];
};

export default ChartDisplay3D;
