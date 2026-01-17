import React from 'react';
import CountUp from './CountUp';

const StatCard = ({ title, value, icon: Icon, trend, iconBg = '#2C7A7B' }) => {
  const parseValue = (val) => {
    const numStr = val.replace(/[^0-9.]/g, '');
    return parseFloat(numStr) || 0;
  };

  const getPrefix = (val) => {
    const match = val.match(/^[^0-9]+/);
    return match ? match[0] : '';
  };

  const getSuffix = (val) => {
    const match = val.match(/[^0-9.,]+$/);
    return match ? match[0] : '';
  };

  const numericValue = parseValue(value);
  const prefix = getPrefix(value);
  const suffix = getSuffix(value);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="p-3 rounded-full" style={{ backgroundColor: '#1a1a1a' }}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">
            <CountUp end={numericValue} duration={2000} prefix={prefix} suffix={suffix} />
          </p>
          {trend && (
            <p className="text-sm mt-2" style={{ color: '#2C7A7B' }}>
              ↑ {trend} Since last week
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
