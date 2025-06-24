import React, { useState } from "react";

const FileDistributionChart = ({ storageData }) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const smallFiles =
    storageData.fileCount > 0 ? Math.ceil(storageData.fileCount * 0.3) : 0;
  const mediumFiles =
    storageData.fileCount > 0 ? Math.ceil(storageData.fileCount * 0.5) : 0;
  const largeFiles =
    storageData.fileCount > 0 ? Math.floor(storageData.fileCount * 0.2) : 0;

  const fileData = [
    {
      name: "Small (< 1MB)",
      value: smallFiles,
      color: "#64ffda",
      icon: "📄",
      description: "Lightweight files",
    },
    {
      name: "Medium (1-5MB)",
      value: mediumFiles,
      color: "#ffee58",
      icon: "📊",
      description: "Standard size files",
    },
    {
      name: "Large (> 5MB)",
      value: largeFiles,
      color: "#ff7043",
      icon: "📈",
      description: "Heavy files",
    },
  ].filter((item) => item.value > 0);

  const total = fileData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div
        className="rounded-xl shadow-lg p-6 border border-[#334155]"
        style={{
          background: "linear-gradient(to bottom, #0f1e33, #132035)",
          color: "#ffffff",
        }}
      >
        <h2 className="text-xl font-bold mb-4">File Distribution</h2>
        <div className="flex items-center justify-center h-64 text-gray-400">
          No files to display
        </div>
      </div>
    );
  }

  let cumulativePercentage = 0;
  const segments = fileData.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startAngle = cumulativePercentage * 3.6;
    const endAngle = (cumulativePercentage + percentage) * 3.6;
    cumulativePercentage += percentage;

    return {
      ...item,
      percentage: percentage.toFixed(1),
      startAngle,
      endAngle,
      index,
    };
  });

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const createDonutPath = (startAngle, endAngle, innerRadius = 60, outerRadius = 100) => {
    const startOuter = polarToCartesian(0, 0, outerRadius, endAngle);
    const endOuter = polarToCartesian(0, 0, outerRadius, startAngle);
    const startInner = polarToCartesian(0, 0, innerRadius, endAngle);
    const endInner = polarToCartesian(0, 0, innerRadius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", startOuter.x, startOuter.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
      "L", endInner.x, endInner.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
      "Z",
    ].join(" ");
  };

  const totalStorageMB = storageData.storageMB || 0;

  const calculateActualStorageDistribution = () => {
    if (storageData.fileCount === 0) return { small: 0, medium: 0, large: 0 };

    const smallProportion = smallFiles / storageData.fileCount;
    const mediumProportion = mediumFiles / storageData.fileCount;
    const largeProportion = largeFiles / storageData.fileCount;

    const smallStorage = totalStorageMB * smallProportion;
    const mediumStorage = totalStorageMB * mediumProportion;
    const largeStorage = totalStorageMB * largeProportion;

    const formatStorage = (value) => {
      if (value >= 1) return value.toFixed(2);
      if (value >= 0.01) return value.toFixed(3);
      if (value >= 0.001) return value.toFixed(4);
      return value.toFixed(5);
    };

    return {
      small: formatStorage(smallStorage),
      medium: formatStorage(mediumStorage),
      large: formatStorage(largeStorage),
    };
  };

  const storageInfo = calculateActualStorageDistribution();

  return (
    <div
      className="rounded-xl p-6 border border-[#334155] shadow-xl text-white"
      style={{
        background: "linear-gradient(to bottom, #0f1e33, #132035)",
      }}
    >
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="relative">
          <svg width="240" height="240" viewBox="-120 -120 240 240">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={createDonutPath(segment.startAngle, segment.endAngle)}
                fill={segment.color}
                stroke="#0f172a"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredSegment(segment)}
                onMouseLeave={() => setHoveredSegment(null)}
                style={{
                  filter:
                    hoveredSegment?.index === index
                      ? "brightness(1.2) drop-shadow(0 0 8px rgba(255,255,255,0.3))"
                      : "none",
                  transform:
                    hoveredSegment?.index === index ? "scale(1.05)" : "scale(1)",
                  transformOrigin: "center",
                }}
              />
            ))}

            <circle cx="0" cy="0" r="55" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <text x="0" y="-15" textAnchor="middle" className="text-sm font-bold" fill="#cbd5e1">
              Total Files
            </text>
            <text x="0" y="5" textAnchor="middle" className="text-2xl font-bold" fill="white">
              {total}
            </text>
          </svg>

          {hoveredSegment && (
            <div
              className="absolute bg-[#1e293b] p-3 rounded-lg shadow-xl border pointer-events-none z-10"
              style={{
                borderColor: hoveredSegment.color,
                top: "10%",
                right: "-50%",
                transform: "translateX(50%)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{hoveredSegment.icon}</span>
                <span className="font-semibold text-white">{hoveredSegment.name}</span>
              </div>
              <div className="text-sm text-gray-300 space-y-1">
                <p>
                  Files:{" "}
                  <span className="font-semibold text-white">
                    {hoveredSegment.value}
                  </span>
                </p>
                <p>
                  Percentage:{" "}
                  <span className="font-semibold text-white">
                    {hoveredSegment.percentage}%
                  </span>
                </p>
                <p>{hoveredSegment.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Legend and Stats */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-4 text-white">File Size Categories</h3>
          <div className="space-y-3">
            {segments.map((segment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor:
                    hoveredSegment?.index === index ? "#1e3a8a" : "#1e293b",
                  borderLeft: `4px solid ${segment.color}`,
                  border:
                    hoveredSegment?.index === index
                      ? `1px solid ${segment.color}90`
                      : "1px solid #334155",
                }}
                onMouseEnter={() => setHoveredSegment(segment)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{segment.icon}</span>
                  <div>
                    <div className="font-medium text-white">{segment.name}</div>
                    <div className="text-sm text-gray-400">
                      {segment.percentage}% of total files
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-white">{segment.value}</div>
                  <div className="text-xs text-gray-400">files</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDistributionChart;
