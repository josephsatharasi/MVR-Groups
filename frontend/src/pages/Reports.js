import React, { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, TrendingDown, Users, UserCheck } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import CountUp from '../components/CountUp';
import { getCustomers, getCadres } from '../utils/storage';

const Reports = () => {
  const [customers, setCustomers] = useState([]);
  const [cadres, setCadres] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [propertySales, setPropertySales] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    propertiesSold: 0,
    avgDealTime: 0,
    totalCustomers: 0,
    totalAgents: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const customerData = await getCustomers();
    const cadreData = await getCadres();
    setCustomers(customerData);
    setCadres(cadreData);
    calculateStats(customerData, cadreData);
    calculateMonthlyRevenue(customerData);
    calculatePropertySales(customerData);
  };

  const calculateStats = (customerData, cadreData) => {
    const totalRevenue = customerData.reduce((sum, c) => sum + (parseFloat(c.bookingAmount) || 0), 0);
    const propertiesSold = customerData.length;
    const totalCustomers = customerData.length;
    const totalAgents = cadreData.length;

    setStats({
      totalRevenue: totalRevenue / 10000000,
      propertiesSold,
      avgDealTime: 45,
      totalCustomers,
      totalAgents
    });
  };

  const calculateMonthlyRevenue = (data) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = Array(12).fill(0);

    data.forEach(customer => {
      const date = new Date(customer.createdAt);
      if (date.getFullYear() === currentYear) {
        monthlyRevenue[date.getMonth()] += parseFloat(customer.bookingAmount) || 0;
      }
    });

    setMonthlyRevenue(monthNames.map((label, index) => ({
      label,
      value: Math.round(monthlyRevenue[index] / 100000)
    })));
  };

  const calculatePropertySales = (data) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlySales = Array(12).fill(0);

    data.forEach(customer => {
      const date = new Date(customer.createdAt);
      if (date.getFullYear() === currentYear) {
        monthlySales[date.getMonth()]++;
      }
    });

    setPropertySales(monthNames.map((label, index) => ({
      label,
      value: monthlySales[index]
    })));
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Reports & Analytics</h1>
        <Button variant="primary" icon={Download}>Export Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-700">
                <CountUp end={stats.totalRevenue} duration={2000} prefix="₹" suffix="Cr" decimals={2} />
              </p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp size={14} /> Total booking amount
              </p>
            </div>
            <FileText size={40} className="text-blue-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Properties Sold</p>
              <p className="text-2xl font-bold text-blue-700">
                <CountUp end={stats.propertiesSold} duration={2000} />
              </p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp size={14} /> Total bookings
              </p>
            </div>
            <FileText size={40} className="text-blue-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Deal Time</p>
              <p className="text-2xl font-bold text-blue-700">
                <CountUp end={stats.avgDealTime} duration={2000} suffix=" days" />
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                Average processing time
              </p>
            </div>
            <FileText size={40} className="text-blue-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-blue-700">
                <CountUp end={stats.totalCustomers} duration={2000} />
              </p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp size={14} /> Active customers
              </p>
            </div>
            <Users size={40} className="text-blue-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cadres</p>
              <p className="text-2xl font-bold text-blue-700">
                <CountUp end={stats.totalAgents} duration={2000} />
              </p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp size={14} /> Active cadres
              </p>
            </div>
            <UserCheck size={40} className="text-blue-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart 
          data={monthlyRevenue} 
          title="Monthly Revenue (in Lakhs)" 
          subtitle="Total booking amount collected per month in current year"
          color="#1e3a8a" 
        />
        <BarChart 
          data={propertySales} 
          title="Property Sales" 
          subtitle="Number of properties sold per month in current year"
          color="#1e3a8a" 
        />
      </div>
    </div>
  );
};

export default Reports;
