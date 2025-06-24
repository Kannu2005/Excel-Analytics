import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserCharts } from "../redux/chartSlice";
import HistoryTable from "../components/HistoryTable";
import ChartDisplay from "../components/ChartDisplay";
import ChartDisplay3D from "../components/ChartDisplay3D";
import { motion } from "framer-motion";
import Plotly from 'plotly.js-dist';
import jsPDF from "jspdf";

const HistoryPage = () => {
  const dispatch = useDispatch();
  const { charts } = useSelector((state) => state.charts);
  const [selectedChart, setSelectedChart] = useState(null);

  useEffect(() => {
    dispatch(getUserCharts());
  }, [dispatch]);

  const refreshCharts = () => {
    dispatch(getUserCharts());
  };

  const is3DChart = (chartType) => {
    if (!chartType) return false;
    const normalizedType = chartType.toLowerCase().trim();
    const chart3DTypes = [
      "3d bar chart",
      "3d line chart", 
      "3d scatter chart",
      "3d surface chart",
      "3d column chart",
      "3d pie chart",
      "bar3d",
      "line3d",
      "scatter3d",
      "surface3d",
      "column3d",
      "pie3d",
      "mesh3d"
    ];
    return chart3DTypes.some(type => 
      normalizedType === type || normalizedType.includes(type)
    );
  };

  const is2DChart = (chartType) => {
    if (!chartType) return false;
    const normalizedType = chartType.toLowerCase().trim();
    const chart2DTypes = ["pie", "bar", "scatter", "line"];
    
    return chart2DTypes.some(type => 
      normalizedType === type || 
      (normalizedType.includes(type) && !normalizedType.includes('3d'))
    );
  };

  const downloadChart = async (format = "png") => {
    try {
      const is3D = selectedChart && is3DChart(selectedChart.chartType);
      
      let chartContainer;
      
      if (is3D) {
        chartContainer = document.getElementById("chart-container-3d");
      } else {
        chartContainer = document.getElementById("chart-container");
      }
      
      if (!chartContainer) {
        alert("Chart container not found!");
        console.log("Looking for chart container. Available elements:", document.querySelectorAll("[id*='chart']"));
        return;
      }

      const fileName = `${selectedChart?.chartName || "chart"}-${new Date().toISOString().split("T")[0]}`;

      if (is3D) {
        try {
          const plotlyDiv = chartContainer.querySelector("div[data-plotly='true']") || 
                           chartContainer.querySelector(".plotly-graph-div") ||
                           chartContainer.firstElementChild;
          
          if (!plotlyDiv) {
            alert("3D chart not found! Make sure the chart is fully loaded.");
            return;
          }

          if (typeof window.Plotly !== 'undefined') {
            let imageData;
            
            if (format === "pdf") {
              imageData = await window.Plotly.toImage(plotlyDiv, {
                format: 'png',
                width: 1200,
                height: 800,
                scale: 2
              });
              
              const img = new Image();
              img.onload = () => {
                const pdf = new jsPDF({
                  orientation: img.width > img.height ? "landscape" : "portrait",
                  unit: "px",
                  format: [img.width, img.height],
                });
                pdf.addImage(imageData, "PNG", 0, 0, img.width, img.height);
                pdf.save(`${fileName}.pdf`);
              };
              img.src = imageData;
              return;
            } else {
              imageData = await window.Plotly.toImage(plotlyDiv, {
                format: format,
                width: 1200,
                height: 800,
                scale: 2
              });
              
              const link = document.createElement("a");
              link.download = `${fileName}.${format}`;
              link.href = imageData;
              link.click();
              return;
            }
          }
          
          const canvas = plotlyDiv.querySelector("canvas");
          if (canvas) {
            console.log("Using fallback canvas method for 3D chart");
            await downloadFromCanvas(canvas, fileName, format);
            return;
          }
          
          alert("Unable to export 3D chart. Plotly export functionality not available.");
          return;
          
        } catch (error) {
          console.error("3D chart export failed:", error);
          alert("Failed to export 3D chart. Please try again.");
          return;
        }
      }

      const canvas = chartContainer.querySelector("canvas");
      
      if (!canvas) {
        alert("2D chart canvas not found! Make sure the chart is fully loaded.");
        console.log("Available elements in chart container:", chartContainer.innerHTML);
        return;
      }

      await downloadFromCanvas(canvas, fileName, format);

    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download chart. Please try again.");
    }
  };

  const downloadFromCanvas = async (canvas, fileName, format) => {
    try {
      if (format === "pdf") {
        let imageData;
        
        try {
          imageData = canvas.toDataURL("image/png");
        } catch (error) {
          console.warn("Direct canvas export failed, trying alternative method:", error);
          
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext("2d");
          tempCtx.drawImage(canvas, 0, 0);
          imageData = tempCanvas.toDataURL("image/png");
        }

        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? "landscape" : "portrait",
          unit: "px",
          format: [canvas.width, canvas.height],
        });

        pdf.addImage(imageData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save(`${fileName}.pdf`);
        return;
      }

      const link = document.createElement("a");
      link.download = `${fileName}.${format}`;

      try {
        if (format === "png") {
          link.href = canvas.toDataURL("image/png");
        } else if (format === "jpeg") {
          link.href = canvas.toDataURL("image/jpeg", 0.9);
        }
        
        link.click();
      } catch (error) {
        console.warn("Direct export failed, trying alternative method:", error);
        
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(canvas, 0, 0);
        
        if (format === "png") {
          link.href = tempCanvas.toDataURL("image/png");
        } else if (format === "jpeg") {
          link.href = tempCanvas.toDataURL("image/jpeg", 0.9);
        }
        
        link.click();
      }
    } catch (error) {
      console.error("Canvas download failed:", error);
      alert("Failed to download from canvas. Please try again.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <motion.div
      className="p-4 sm:p-6 min-h-screen bg-slate-900 text-slate-300"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-center text-white mb-6 sm:mb-8"
        variants={itemVariants}
      >
        Your Chart History
      </motion.h1>

      <motion.div
        className="mx-auto px-2 sm:px-4 flex flex-col lg:flex-row gap-6 sm:gap-8 w-full"
        variants={itemVariants}
      >
        <motion.div className="flex-1" variants={itemVariants}>
          <HistoryTable charts={charts} onViewChart={setSelectedChart} onDeleteSuccess={refreshCharts} />
        </motion.div>

        <motion.div className="flex-1" variants={itemVariants}>
          {selectedChart && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {(() => {
                const chartType = selectedChart.chartType;
                const is2D = is2DChart(chartType);
                const is3D = is3DChart(chartType);
                
                if (is3D && !is2D) {
                  return <ChartDisplay3D chart={selectedChart} />;
                } else if (is2D && !is3D) {
                  return <ChartDisplay chart={selectedChart} />;
                } else {
                  const normalizedType = chartType?.toLowerCase().trim() || '';
                  if (normalizedType.includes('3d')) {
                    return <ChartDisplay3D chart={selectedChart} />;
                  } else {
                    return <ChartDisplay chart={selectedChart} />;
                  }
                }
              })()}
            </motion.div>
          )}

          {selectedChart && (
            <motion.div
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.button
                onClick={() => downloadChart("pdf")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors flex items-center justify-center space-x-2"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <span>📥</span>
                <span>Download PDF</span>
              </motion.button>

              <motion.button
                onClick={() => downloadChart("png")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors flex items-center justify-center space-x-2"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <span>📥</span>
                <span>Download PNG</span>
              </motion.button>

              <motion.button
                onClick={() => downloadChart("jpeg")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors flex items-center justify-center space-x-2"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <span>📥</span>
                <span>Download JPEG</span>
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HistoryPage;
