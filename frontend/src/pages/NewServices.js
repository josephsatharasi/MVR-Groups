import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getCustomers } from '../utils/storage';

const NewServices = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const data = await getCustomers();
      setCustomers(data);
    };
    loadData();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">New Services</h1>
        <p className="text-gray-600">Search and manage customer services</p>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-blue-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      <div className="rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Name</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Phone</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden md:table-cell">Email</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden lg:table-cell">Address</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Plan</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">End Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <tr 
                  key={customer._id || customer.id} 
                  className={`transition-all hover:bg-blue-100 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}
                >
                  <td className="px-4 md:px-6 py-4 text-sm font-semibold text-blue-700">{customer.name}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{customer.phone}</td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden md:table-cell">{customer.email}</td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden lg:table-cell">{customer.address}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{customer.plan}M</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{customer.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCustomers.length === 0 && (
          <div className="text-center py-8 text-gray-500">No customers found</div>
        )}
      </div>
    </div>
  );
};

export default NewServices;
