import React from 'react';

const DateRangeFilter = ({ fromDate, toDate, onFromDateChange, onToDateChange, rangeType, onRangeTypeChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-lg">
      <select
        value={rangeType}
        onChange={(e) => onRangeTypeChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-700"
        style={{ focusRingColor: '#2C7A7B' }}
      >
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="custom">Custom Range</option>
      </select>

      {rangeType === 'custom' && (
        <>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ focusRingColor: '#2C7A7B' }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ focusRingColor: '#2C7A7B' }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangeFilter;
