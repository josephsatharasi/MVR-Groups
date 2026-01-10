import React, { useState } from 'react';
import { Building2, MapPin } from 'lucide-react';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const Properties = () => {
  const [search, setSearch] = useState('');

  const properties = [
    { id: 1, name: 'Luxury Villa', type: 'Villa', location: 'Mumbai', price: 25000000, area: 3500, bedrooms: 4, status: 'Available' },
    { id: 2, name: 'Modern Apartment', type: 'Apartment', location: 'Delhi', price: 8500000, area: 1200, bedrooms: 3, status: 'Sold' },
    { id: 3, name: 'Commercial Space', type: 'Commercial', location: 'Bangalore', price: 15000000, area: 2500, bedrooms: 0, status: 'Available' },
    { id: 4, name: 'Beach House', type: 'House', location: 'Goa', price: 18000000, area: 2800, bedrooms: 3, status: 'Rented' },
    { id: 5, name: 'Penthouse Suite', type: 'Apartment', location: 'Mumbai', price: 35000000, area: 4000, bedrooms: 5, status: 'Available' },
    { id: 6, name: 'Plot Land', type: 'Land', location: 'Pune', price: 5000000, area: 5000, bedrooms: 0, status: 'Available' },
  ];

  const filtered = properties.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: 'Property Name', field: 'name' },
    { header: 'Type', field: 'type' },
    { header: 'Location', field: 'location', render: (row) => (
      <span className="flex items-center gap-1"><MapPin size={14} />{row.location}</span>
    )},
    { header: 'Price', field: 'price', render: (row) => `₹${(row.price / 100000).toFixed(1)}L` },
    { header: 'Area (sq.ft)', field: 'area' },
    { header: 'Bedrooms', field: 'bedrooms' },
    { header: 'Status', field: 'status', render: (row) => (
      <span className={`px-2 py-1 rounded text-xs ${
        row.status === 'Available' ? 'bg-green-100 text-green-700' :
        row.status === 'Sold' ? 'bg-red-100 text-red-700' :
        'bg-yellow-100 text-yellow-700'
      }`}>{row.status}</span>
    )},
  ];

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#5F9EA0' }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">All Properties</h1>
        <Link to="/admin/add-property">
          <Button variant="primary" icon={Building2}>Add New Property</Button>
        </Link>
      </div>

      <Card>
        <div className="mb-4">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search properties..." />
        </div>
        <Table 
          columns={columns} 
          data={filtered}
          onView={(row) => alert(`View: ${row.name}`)}
          onEdit={(row) => alert(`Edit: ${row.name}`)}
          onDelete={(row) => alert(`Delete: ${row.name}`)}
        />
      </Card>
    </div>
  );
};

export default Properties;
