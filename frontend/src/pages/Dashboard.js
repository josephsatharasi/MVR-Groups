import React, { useState, useEffect } from 'react';
import { IndianRupee, Home, Clock, Building2 } from 'lucide-react';
import StatCard from '../components/StatCard';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import CircularProgress from '../components/CircularProgress';
import DateRangeFilter from '../components/DateRangeFilter';
import { getCustomers } from '../utils/storage';

const Dashboard = () => {
  const [rangeType, setRangeType] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState([
    { title: 'Total Earnings', value: '₹0', icon: IndianRupee, trend: '+0%' },
    { title: 'Total Bookings', value: '0', icon: Home, trend: '+0%' },
    { title: 'Total Properties', value: '0', icon: Building2, trend: '+0%' },
    { title: 'Pending Balance', value: '₹0', icon: Clock, trend: '+0%' },
  ]);
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [projectWiseData, setProjectWiseData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getCustomers();
    setCustomers(data);
    calculateStats(data);
    calculateMonthlyBookings(data);
    calculateProjectWiseData(data);
  };

  const calculateStats = (data) => {
    const totalEarnings = data.reduce((sum, c) => sum + (parseFloat(c.bookingAmount) || 0), 0);
    const totalBalance = data.reduce((sum, c) => sum + (parseFloat(c.balanceAmount) || 0), 0);
    const uniqueProjects = [...new Set(data.map(c => c.projectName).filter(Boolean))].length;

    setStats([
      { title: 'Total Earnings', value: `₹${totalEarnings.toLocaleString()}`, icon: IndianRupee, trend: '+0%' },
      { title: 'Total Bookings', value: data.length.toString(), icon: Home, trend: '+0%' },
      { title: 'Total Properties', value: uniqueProjects.toString(), icon: Building2, trend: '+0%' },
      { title: 'Pending Balance', value: `₹${totalBalance.toLocaleString()}`, icon: Clock, trend: '+0%' },
    ]);
  };

  const calculateMonthlyBookings = (data) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyCounts = Array(12).fill(0);

    data.forEach(customer => {
      const date = new Date(customer.createdAt);
      if (date.getFullYear() === currentYear) {
        monthlyCounts[date.getMonth()]++;
      }
    });

    setMonthlyBookings(monthNames.map((label, index) => ({
      label,
      value: monthlyCounts[index]
    })));
  };

  const calculateProjectWiseData = (data) => {
    const projectCounts = {};
    data.forEach(customer => {
      const project = customer.projectName || 'Others';
      projectCounts[project] = (projectCounts[project] || 0) + 1;
    });

    const projectData = Object.entries(projectCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value }));

    setProjectWiseData(projectData);
  };

  const calculateOccupancyRate = () => {
    if (customers.length === 0) return 0;
    const paidCustomers = customers.filter(c => parseFloat(c.balanceAmount || 0) === 0).length;
    return Math.round((paidCustomers / customers.length) * 100);
  };

  const calculatePaymentProgress = () => {
    const totalAmount = customers.reduce((sum, c) => sum + (parseFloat(c.totalAmount) || 0), 0);
    const paidAmount = customers.reduce((sum, c) => sum + (parseFloat(c.bookingAmount) || 0), 0);
    return totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;
  };

  const calculatePendingRate = () => {
    if (customers.length === 0) return 0;
    const pendingCustomers = customers.filter(c => parseFloat(c.balanceAmount || 0) > 0).length;
    return Math.round((pendingCustomers / customers.length) * 100);
  };

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
          <LineChart 
            data={monthlyBookings} 
            title="Monthly Bookings" 
            subtitle="Number of property bookings per month in current year"
            color="#2C7A7B" 
          />
          <BarChart 
            data={projectWiseData} 
            title="Project-wise Bookings" 
            subtitle="Top 6 projects by number of bookings"
            color="#2C7A7B" 
          />
        </div>

        {/* Circular Progress */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-center items-center">
            <CircularProgress percentage={calculateOccupancyRate()} label="Fully Paid Properties" color="#2C7A7B" />
            <p className="text-xs text-gray-500 mt-2 text-center">Percentage of customers with zero balance</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-center items-center">
            <CircularProgress percentage={calculatePaymentProgress()} label="Payment Collection" color="#2C7A7B" />
            <p className="text-xs text-gray-500 mt-2 text-center">Total booking amount vs total property value</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-center items-center">
            <CircularProgress percentage={calculatePendingRate()} label="Pending Payments" color="#EF4444" />
            <p className="text-xs text-gray-500 mt-2 text-center">Percentage of customers with pending balance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
