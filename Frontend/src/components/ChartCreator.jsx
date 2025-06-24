// components/ChartCreator.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createChart } from '../redux/chartSlice';
import { getFileData } from '../redux/fileSlice';
import { motion } from 'framer-motion';

const ChartCreator = ({ fileId, onChartCreated }) => {
  const [formData, setFormData] = useState({
    chartName: '',
    chartType: 'bar',
    xAxis: '',
    yAxis: ''
  });

  const dispatch = useDispatch();
  const { currentFile } = useSelector((state) => state.files);
  const { loading } = useSelector((state) => state.charts);

  useEffect(() => {
    if (fileId) dispatch(getFileData(fileId));
  }, [fileId, dispatch]);

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: '📊' },
    { value: 'line', label: 'Line Chart', icon: '📈' },
    { value: 'pie', label: 'Pie Chart', icon: '🥧' },
    { value: 'scatter', label: 'Scatter Plot', icon: '⚡' },
    { value: 'column3d', label: '3D Column Chart', icon: '📈' }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.chartName || !formData.xAxis || !formData.yAxis) return alert('Fill all fields');

    try {
      await dispatch(createChart({ fileId, ...formData })).unwrap();
      if (onChartCreated) onChartCreated();
      setFormData({ chartName: '', chartType: 'bar', xAxis: '', yAxis: '' });
    } catch (err) {
      console.error('Chart creation failed:', err);
    }
  };

  if (!currentFile) return (
    <div className="text-center py-10 text-white bg-gradient-to-b from-blue-900 to-blue-800 rounded-xl shadow-lg">
      Loading file data...
    </div>
  );

  const columns = currentFile?.columns || [];

  return (
    <motion.div
      className="max-w-xl mx-auto bg-gradient-to-br from-blue-950 to-blue-800 p-6 rounded-2xl shadow-2xl text-white"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center border-b border-blue-500 pb-2">📈 Create New Chart</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-sm font-semibold text-blue-200">Chart Name *</label>
          <input
            type="text"
            name="chartName"
            value={formData.chartName}
            onChange={handleInputChange}
            className="w-full bg-blue-900 text-white border border-blue-700 p-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold text-blue-200">Chart Type *</label>
          <select
            name="chartType"
            value={formData.chartType}
            onChange={handleInputChange}
            className="w-full bg-blue-900 text-white border border-blue-700 p-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            {chartTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold text-blue-200">X Axis *</label>
          <select
            name="xAxis"
            value={formData.xAxis}
            onChange={handleInputChange}
            className="w-full bg-blue-900 text-white border border-blue-700 p-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Select Column</option>
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold text-blue-200">Y Axis *</label>
          <select
            name="yAxis"
            value={formData.yAxis}
            onChange={handleInputChange}
            className="w-full bg-blue-900 text-white border border-blue-700 p-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Select Column</option>
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 py-2 px-4 rounded-md font-semibold shadow-md disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Chart'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ChartCreator;
