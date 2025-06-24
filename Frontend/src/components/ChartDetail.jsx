import React from 'react';
import { motion } from 'framer-motion';

const ChartDetail = ({ chart, file }) => {
  if (!chart || !file) {
    return null;
  }

  const chartAnalyticsData = [
    { label: 'Data Points', value: chart.chartData?.labels?.length || 0, icon: '📊' },
    { label: 'Columns', value: file.columns?.length || 0, icon: '📋' },
    { label: 'Chart Type', value: chart.chartType, icon: '🎯' },
    { label: 'Dimensions', value: chart.zAxis ? '3D (X,Y,Z)' : '2D (X,Y)', icon: '🌐' }
  ];

  const configurationSummaryData = {
    "Chart Name": chart.chartName,
    "File": file.filename,
    "X-Axis": chart.xAxis,
    "Y-Axis": chart.yAxis,
    "Created": chart.createdAt || chart.createdDate 
      ? new Date(chart.createdAt || chart.createdDate).toLocaleDateString() 
      : "N/A",
  };

  return (
    <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        
        {/* Chart Analytics */}
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🛠️</span> Chart Analytics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {chartAnalyticsData.map((item, index) => (
            <motion.div
              key={index}
              className="bg-slate-800 p-4 rounded-lg flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div>
                <p className="text-sm text-blue-400">{item.label}</p>
                <p className="text-2xl font-bold text-white">{item.value}</p>
              </div>
              <span className="text-3xl">{item.icon}</span>
            </motion.div>
          ))}
        </div>

        {/* Configuration Summary */}
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">📝</span> Configuration Summary
        </h3>
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(configurationSummaryData).map(([label, value], index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (chartAnalyticsData.length + index) * 0.1 }}
              >
                <p className="text-sm text-blue-400">{label}:</p>
                <p className="text-lg font-medium text-white break-words">{value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChartDetail; 