import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ChartDistributionPie = ({ stats }) => {
  // Function to get chart type icons (you can customize these)
  const getChartTypeIcon = (type) => {
    const icons = {
      'bar': '📊',
      'line': '📈',
      'pie': '🥧',
      'scatter': '⚪',
      'column3d': "📊",
      'surface3d':"🌐",
      'bar3d': "📊",
      'line3d':"📈",
      'scatter3d':"⚡",
      'pie3d':"🥧"
      
    };
    return icons[type] || '📊';
  };

  // Color palette for the pie chart
  const colors = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C',
    '#8DD1E1', '#D084D0', '#87D068', '#FFB347'
  ];

  // Prepare data for the pie chart
  const pieData = stats?.chartsByType?.map((type, index) => ({
    name: type._id.charAt(0).toUpperCase() + type._id.slice(1),
    value: type.count,
    icon: getChartTypeIcon(type._id),
    color: colors[index % colors.length]
  })) || [];

  // Custom label function to show percentage
  const renderLabel = (entry) => {
    const total = pieData.reduce((sum, item) => sum + item.value, 0);
    const percent = ((entry.value / total) * 100).toFixed(1);
    return `${percent}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border" style={{ borderColor: '#bde8f1' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{data.icon}</span>
            <span className="font-semibold" style={{ color: '#0d0d0d' }}>
              {data.name}
            </span>
          </div>
          <p style={{ color: '#819fa7' }}>
            Count: <span className="font-semibold" style={{ color: '#0d0d0d' }}>{data.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm flex items-center gap-1" style={{ color: '#819fa7' }}>
              <span>{pieData[index]?.icon}</span>
              {entry.value?.toUpperCase().replace(/3D$/, " 3D")}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (!stats?.chartsByType || stats.chartsByType.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6" style={{ backgroundColor: "#1e2a3a" }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: "#0d0d0d" }}>
          Charts Distribution
        </h2>
        <div className="flex items-center justify-center h-64" style={{ color: "#819fa7" }}>
          No chart data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6" style={{ backgroundColor: "#0d1b2a" }}>

      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="mt-6 pt-4 border-t" style={{ borderColor: '#bde8f1' }}>
        <div className="flex justify-between items-center">
          <span style={{ color: '#819fa7' }}>Total Charts:</span>
          <span className="font-semibold text-lg text-cyan-400">
            {pieData.reduce((sum, item) => sum + item.value, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChartDistributionPie;