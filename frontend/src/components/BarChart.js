import React from 'react';

const BarChart = ({ data, title, color = '#2C7A7B' }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }}></div>
          <span className="text-sm text-gray-600">{title}</span>
        </div>
      </div>
      <div className="relative" style={{ height: '250px' }}>
        <div className="flex items-end justify-between h-full gap-2">
          {data.map((item, index) => {
            const height = (item.value / maxValue) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center" style={{ height: '220px' }}>
                  <div
                    className="w-full rounded-t-lg transition-all hover:opacity-80"
                    style={{
                      backgroundColor: color,
                      height: `${height}%`,
                      minHeight: '4px'
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BarChart;
