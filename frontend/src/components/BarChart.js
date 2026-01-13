import React, { useState, useEffect } from 'react';

const BarChart = ({ data, title, color = '#2C7A7B' }) => {
  const [animatedData, setAnimatedData] = useState(data.map(() => 0));
  const maxValue = Math.max(...data.map(d => d.value));

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress * (2 - progress);
      
      setAnimatedData(data.map(d => d.value * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [data]);

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
            const height = (animatedData[index] / maxValue) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center" style={{ height: '220px' }}>
                  <div
                    className="w-full rounded-t-lg hover:opacity-80"
                    style={{
                      backgroundColor: color,
                      height: `${height}%`,
                      minHeight: '4px',
                      transition: 'height 0.1s ease-out'
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
