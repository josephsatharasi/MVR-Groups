import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle, AlertTriangle, XCircle, UserPlus, TrendingUp, Calendar } from 'lucide-react';
import { getCustomers } from '../utils/storage';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expiringSoon: 0,
    expired: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const customers = await getCustomers();
      
      setStats({
        total: customers.length,
        active: customers.length,
        expiringSoon: 0,
        expired: 0,
      });

      const recent = customers.slice(0, 5).map(c => ({
        name: c.name,
        date: new Date(c.createdAt).toLocaleDateString(),
        plan: `${c.service} Months`
      }));
      setRecentActivity(recent);
    };
    loadData();
  }, []);

  const cards = [
    { title: 'Total Customers', value: stats.total, icon: Users, color: 'bg-blue-50', link: '/admin/customers' },
    { title: 'Active Subscriptions', value: stats.active, icon: CheckCircle, color: 'bg-blue-50', link: '/admin/customers' },
    { title: 'Expiring Soon', value: stats.expiringSoon, icon: AlertTriangle, color: 'bg-blue-50', link: '/admin/expiry-alerts' },
    { title: 'Expired', value: stats.expired, icon: XCircle, color: 'bg-blue-50', link: '/admin/customers' },
  ];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link key={index} to={card.link}>
              <div className={`${card.color} rounded-xl shadow-lg p-6 hover:scale-105 transition-transform cursor-pointer`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">{card.title}</p>
                    <p className="text-4xl font-bold mt-2 text-gray-900">{card.value}</p>
                  </div>
                  <Icon size={48} className="text-gray-700" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl shadow-lg p-6 bg-white border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/add-customer" className="flex items-center gap-2 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md">
              <UserPlus size={20} />
              Add New Customer
            </Link>
            <Link to="/admin/new-services" className="flex items-center gap-2 w-full bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-semibold shadow-md">
              <AlertTriangle size={20} />
              View Expiry Alerts
            </Link>
          </div>
        </div>

        <div className="rounded-xl shadow-lg p-6 bg-white border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={24} />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-blue-700">{activity.name}</p>
                    <p className="text-sm text-blue-600">{activity.plan}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-blue-600">
                    <Calendar size={16} />
                    {activity.date}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
