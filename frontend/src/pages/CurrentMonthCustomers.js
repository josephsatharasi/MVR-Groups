import React, { useState, useEffect } from 'react';
import { getCustomers } from '../utils/storage';
import CustomerDetails from '../components/CustomerDetails';

const CurrentMonthCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const allCustomers = await getCustomers();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const filtered = allCustomers.filter(customer => {
      const createdDate = new Date(customer.createdAt);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    });
    
    setCustomers(filtered);
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Current Month Customers</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600 mb-4">Total: {customers.length} customers this month</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer) => (
            <div
              key={customer._id}
              onClick={() => setSelectedCustomer(customer)}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
            >
              <h3 className="font-bold text-lg text-gray-800">{customer.name}</h3>
              <p className="text-sm text-gray-600">{customer.phone}</p>
              <p className="text-sm text-gray-500">{customer.area}</p>
              <p className="text-xs text-gray-400 mt-2">
                Added: {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {customers.length === 0 && (
          <p className="text-center text-gray-500 py-8">No customers added this month</p>
        )}
      </div>

      {selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onUpdate={loadCustomers}
        />
      )}
    </div>
  );
};

export default CurrentMonthCustomers;
