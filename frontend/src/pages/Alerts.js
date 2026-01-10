import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import Table from '../components/Table';
import Card from '../components/Card';

const Alerts = () => {
  const alerts = [
    { id: 1, property: 'Luxury Villa', type: 'Lease Expiry', daysLeft: 15, owner: 'Rajesh Kumar', priority: 'High' },
    { id: 2, property: 'Modern Apartment', type: 'Payment Due', daysLeft: 5, owner: 'Priya Sharma', priority: 'Critical' },
    { id: 3, property: 'Beach House', type: 'Maintenance', daysLeft: 30, owner: 'Amit Patel', priority: 'Medium' },
    { id: 4, property: 'Commercial Space', type: 'Contract Renewal', daysLeft: 45, owner: 'Sneha Reddy', priority: 'Low' },
    { id: 5, property: 'Penthouse Suite', type: 'Inspection Due', daysLeft: 7, owner: 'Vikram Singh', priority: 'High' },
  ];

  const columns = [
    { header: 'Property', field: 'property' },
    { header: 'Alert Type', field: 'type' },
    { header: 'Days Left', field: 'daysLeft', render: (row) => (
      <span className="flex items-center gap-1"><Clock size={14} />{row.daysLeft} days</span>
    )},
    { header: 'Owner', field: 'owner' },
    { header: 'Priority', field: 'priority', render: (row) => (
      <span className={`px-2 py-1 rounded text-xs ${
        row.priority === 'Critical' ? 'bg-red-100 text-red-700' :
        row.priority === 'High' ? 'bg-orange-100 text-orange-700' :
        row.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
        'bg-blue-100 text-blue-700'
      }`}>{row.priority}</span>
    )},
  ];

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#5F9EA0' }}>
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="text-white" size={32} />
        <h1 className="text-2xl md:text-3xl font-bold text-white">Alerts & Notifications</h1>
      </div>

      <Card>
        <Table 
          columns={columns} 
          data={alerts}
          onView={(row) => alert(`View: ${row.property}`)}
        />
      </Card>
    </div>
  );
};

export default Alerts;
