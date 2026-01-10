import React from 'react';
import { FileText, Download, TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';

const Reports = () => {
  const monthlyRevenue = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 52 },
    { label: 'Mar', value: 48 },
    { label: 'Apr', value: 61 },
    { label: 'May', value: 55 },
    { label: 'Jun', value: 67 },
  ];

  const propertySales = [
    { label: 'Jan', value: 12 },
    { label: 'Feb', value: 15 },
    { label: 'Mar', value: 10 },
    { label: 'Apr', value: 18 },
    { label: 'May', value: 14 },
    { label: 'Jun', value: 20 },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#5F9EA0' }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">Reports & Analytics</h1>
        <Button variant="primary" icon={Download}>Export Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold" style={{ color: '#2F4F4F' }}>₹3.28Cr</p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp size={14} /> +12.5%
              </p>
            </div>
            <FileText size={40} style={{ color: '#2C7A7B' }} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Properties Sold</p>
              <p className="text-2xl font-bold" style={{ color: '#2F4F4F' }}>89</p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp size={14} /> +8.3%
              </p>
            </div>
            <FileText size={40} style={{ color: '#2C7A7B' }} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Deal Time</p>
              <p className="text-2xl font-bold" style={{ color: '#2F4F4F' }}>45 days</p>
              <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                <TrendingDown size={14} /> -5.2%
              </p>
            </div>
            <FileText size={40} style={{ color: '#2C7A7B' }} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart data={monthlyRevenue} title="Monthly Revenue (in Lakhs)" color="#2C7A7B" />
        <BarChart data={propertySales} title="Property Sales" color="#2C7A7B" />
      </div>
    </div>
  );
};

export default Reports;
