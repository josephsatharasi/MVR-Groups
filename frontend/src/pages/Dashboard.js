import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle, AlertTriangle, XCircle, UserPlus, FileText } from 'lucide-react';
import { getCustomers, getDaysUntilExpiry } from '../utils/storage';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expiringSoon: 0,
    expired: 0,
  });

  useEffect(() => {
    const customers = getCustomers();
    const now = new Date();
    
    const active = customers.filter(c => new Date(c.endDate) > now).length;
    const expired = customers.filter(c => new Date(c.endDate) <= now).length;
    const expiringSoon = customers.filter(c => {
      const days = getDaysUntilExpiry(c.endDate);
      return days > 0 && days <= 7;
    }).length;

    setStats({
      total: customers.length,
      active,
      expiringSoon,
      expired,
    });
  }, []);

  const cards = [
    { title: 'Total Customers', value: stats.total, icon: Users, color: 'bg-gradient-to-br from-blue-500 to-blue-600', link: '/admin/customers' },
    { title: 'Active Subscriptions', value: stats.active, icon: CheckCircle, color: 'bg-gradient-to-br from-green-500 to-green-600', link: '/admin/customers' },
    { title: 'Expiring Soon', value: stats.expiringSoon, icon: AlertTriangle, color: 'bg-gradient-to-br from-yellow-500 to-yellow-600', link: '/admin/expiry-alerts' },
    { title: 'Expired', value: stats.expired, icon: XCircle, color: 'bg-gradient-to-br from-red-500 to-red-600', link: '/admin/customers' },
  ];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link key={index} to={card.link}>
              <div className={`${card.color} text-white rounded-xl shadow-lg p-6 hover:scale-105 transition-transform cursor-pointer`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">{card.title}</p>
                    <p className="text-4xl font-bold mt-2">{card.value}</p>
                  </div>
                  <Icon size={48} className="opacity-80" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/add-customer" className="flex items-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-semibold shadow-md">
              <UserPlus size={20} />
              Add New Customer
            </Link>
            <Link to="/admin/expiry-alerts" className="flex items-center gap-2 w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 px-4 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-colors font-semibold shadow-md">
              <AlertTriangle size={20} />
              View Expiry Alerts
            </Link>
            <Link to="/admin/reports" className="flex items-center gap-2 w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white py-3 px-4 rounded-lg hover:from-blue-800 hover:to-blue-700 transition-colors font-semibold shadow-md">
              <FileText size={20} />
              Generate Reports
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">System Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-semibold text-blue-900">Last Updated:</span>
              <span className="text-blue-700">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-semibold text-blue-900">Plan Types:</span>
              <span className="text-blue-700">3, 6, 12 Months</span>
            </div>
            <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-semibold text-blue-900">Alert Threshold:</span>
              <span className="text-blue-700">7 Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
