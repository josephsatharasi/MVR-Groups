import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, trend, link, iconBg = '#2C7A7B' }) => {
  return (
    <Link to={link} className="block">
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="p-3 rounded-full" style={{ backgroundColor: '#1a1a1a' }}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className="text-sm mt-2" style={{ color: '#2C7A7B' }}>
                ↑ {trend} Since last week
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StatCard;
