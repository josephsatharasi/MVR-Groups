import React, { useState } from 'react';
import { Users, Phone, Mail } from 'lucide-react';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';

const Clients = () => {
  const [search, setSearch] = useState('');

  const clients = [
    { id: 1, name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@email.com', properties: 2, totalValue: 33500000, status: 'Active' },
    { id: 2, name: 'Priya Sharma', phone: '+91 98765 43211', email: 'priya@email.com', properties: 1, totalValue: 8500000, status: 'Active' },
    { id: 3, name: 'Amit Patel', phone: '+91 98765 43212', email: 'amit@email.com', properties: 3, totalValue: 48000000, status: 'Active' },
    { id: 4, name: 'Sneha Reddy', phone: '+91 98765 43213', email: 'sneha@email.com', properties: 1, totalValue: 18000000, status: 'Inactive' },
    { id: 5, name: 'Vikram Singh', phone: '+91 98765 43214', email: 'vikram@email.com', properties: 2, totalValue: 20000000, status: 'Active' },
  ];

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: 'Client Name', field: 'name' },
    { header: 'Phone', field: 'phone', render: (row) => (
      <span className="flex items-center gap-1"><Phone size={14} />{row.phone}</span>
    )},
    { header: 'Email', field: 'email', render: (row) => (
      <span className="flex items-center gap-1"><Mail size={14} />{row.email}</span>
    )},
    { header: 'Properties', field: 'properties' },
    { header: 'Total Value', field: 'totalValue', render: (row) => `₹${(row.totalValue / 10000000).toFixed(1)}Cr` },
    { header: 'Status', field: 'status', render: (row) => (
      <span className={`px-2 py-1 rounded text-xs ${
        row.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
      }`}>{row.status}</span>
    )},
  ];

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#5F9EA0' }}>
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Clients</h1>

      <Card>
        <div className="mb-4">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clients..." />
        </div>
        <Table 
          columns={columns} 
          data={filtered}
          onView={(row) => alert(`View: ${row.name}`)}
          onEdit={(row) => alert(`Edit: ${row.name}`)}
        />
      </Card>
    </div>
  );
};

export default Clients;
