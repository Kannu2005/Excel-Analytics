import React from "react";

const RecentActivityList = ({ charts }) => {
  if (!Array.isArray(charts) || charts.length === 0) {
    return (
      <p className="text-center text-gray-300 italic mt-4">
        No recent activity.
      </p>
    );
  }

  // Sort by createdAt descending and take last 4
  const lastFourCharts = [...charts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div className="overflow-x-auto px-6 mx-auto max-w-4xl">
      <div className="bg-[#0f172a] bg-opacity-90 shadow-xl rounded-2xl p-6 backdrop-blur-md border border-slate-800">
        <h2 className="text-xl font-semibold text-white mb-4 text-center">
          Recent Activity
        </h2>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-[#1e293b]">
              <th className="px-6 py-3 text-left text-sm font-semibold text-white border-b border-slate-700">
                Chart Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white border-b border-slate-700">
                Type
              </th>
            </tr>
          </thead>
          <tbody>
            {lastFourCharts.map((chart, index) => (
              <tr
                key={chart._id}
                className={`${
                  index % 2 === 0 ? "bg-[#1e293b]" : "bg-[#0f172a]"
                } hover:bg-[#334155] transition-colors`}
              >
                <td className="px-6 py-4 text-sm text-gray-300 border-b border-slate-700">
                  {chart.chartName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 border-b border-slate-700">
                  {chart.chartType}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivityList;
