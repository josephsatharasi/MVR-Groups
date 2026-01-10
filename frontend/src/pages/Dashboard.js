import React, { useState, useEffect } from 'react';
import { IndianRupee, Home, Clock, Building2 } from 'lucide-react';
import StatCard from '../components/StatCard';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import CircularProgress from '../components/CircularProgress';
import DateRangeFilter from '../components/DateRangeFilter';

const Dashboard = () => {
  const [rangeType, setRangeType] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Dummy data for real estate
  const stats = [
    { title: 'Total Earnings', value: '₹1,46,000', icon: IndianRupee, trend: '+17%', link: '/admin/reports' },
    { title: 'Total Bookings', value: '1400', icon: Home, trend: '+17%', link: '/admin/properties' },
    { title: 'Total Days', value: '150,700', icon: Clock, trend: '+17%', link: '/admin/alerts' },
    { title: 'Total Properties', value: '500', icon: Building2, trend: '+17%', link: '/admin/properties' },
  ];

  // Dummy workflow data
  const workflowData = [
    { label: 'Jan', value: 10 },
    { label: 'Feb', value: 15 },
    { label: 'Mar', value: 8 },
    { label: 'Apr', value: 18 },
    { label: 'May', value: 20 },
    { label: 'Jun', value: 22 },
    { label: 'Jul', value: 18 },
    { label: 'Aug', value: 25 },
    { label: 'Sep', value: 28 },
    { label: 'Oct', value: 32 },
    { label: 'Nov', value: 35 },
    { label: 'Dec', value: 40 },
  ];

  // Dummy marketing data
  const marketingData = [
    { label: 'Jan', value: 5 },
    { label: 'Feb', value: 8 },
    { label: 'Mar', value: 12 },
    { label: 'Apr', value: 10 },
    { label: 'May', value: 15 },
    { label: 'Jun', value: 18 },
    { label: 'Jul', value: 16 },
    { label: 'Aug', value: 22 },
    { label: 'Sep', value: 28 },
    { label: 'Oct', value: 32 },
    { label: 'Nov', value: 38 },
    { label: 'Dec', value: 45 },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#5F9EA0' }}>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">Overview</h1>
          <DateRangeFilter
            rangeType={rangeType}
            fromDate={fromDate}
            toDate={toDate}
            onRangeTypeChange={setRangeType}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LineChart data={workflowData} title="Recent Workflow" color="#2C7A7B" />
          <BarChart data={marketingData} title="Recent Marketing" color="#E5E7EB" />
        </div>

        {/* Circular Progress */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 flex justify-center items-center">
            <CircularProgress percentage={75} label="Property Occupancy Rate" color="#2C7A7B" />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex justify-center items-center">
            <CircularProgress percentage={71} label="Customer Satisfaction" color="#2C7A7B" />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex justify-center items-center">
            <CircularProgress percentage={46} label="Pending Approvals" color="#EF4444" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
