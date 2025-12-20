import React, { useState, useEffect } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { getCustomers, getDaysUntilExpiry } from '../utils/storage';

const ExpiryAlerts = () => {
  const [expiringCustomers, setExpiringCustomers] = useState([]);

  useEffect(() => {
    const customers = getCustomers();
    const expiring = customers.filter(c => {
      const days = getDaysUntilExpiry(c.endDate);
      return days > 0 && days <= 7;
    }).sort((a, b) => getDaysUntilExpiry(a.endDate) - getDaysUntilExpiry(b.endDate));
    
    setExpiringCustomers(expiring);
  }, []);

  const sendReminder = (customer) => {
    alert(`Reminder sent to ${customer.name} at ${customer.email}`);
  };

  const getDaysColor = (days) => {
    if (days <= 2) return 'text-red-600 font-bold';
    if (days <= 5) return 'text-orange-600 font-semibold';
    return 'text-yellow-600';
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">Expiry Alerts</h1>
        <p className="text-blue-600">Subscriptions expiring within 7 days</p>
      </div>

      {expiringCustomers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-blue-900 mt-4">All Clear!</h2>
          <p className="text-blue-600 mt-2">No subscriptions expiring in the next 7 days</p>
        </div>
      ) : (
        <div className="space-y-4">
          {expiringCustomers.map((customer) => {
            const days = getDaysUntilExpiry(customer.endDate);
            return (
              <div key={customer.id} className="bg-white rounded-xl shadow-lg p-4 md:p-6 border-l-4 border-yellow-500">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2">
                      <h3 className="text-lg md:text-xl font-bold text-blue-900">{customer.name}</h3>
                      <span className={`text-xl ${getDaysColor(days)}`}>
                        {days} {days === 1 ? 'day' : 'days'} left
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold text-blue-900">{customer.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-blue-900">{customer.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">End Date</p>
                        <p className="font-semibold text-blue-900">{customer.endDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Plan</p>
                        <p className="font-semibold text-blue-900">{customer.plan} Months</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => sendReminder(customer)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors shadow-md"
                  >
                    <Send size={18} />
                    Send Reminder
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExpiryAlerts;
