import React, { useState } from 'react';
import { Trash2, RotateCcw } from 'lucide-react';
import Table from '../components/Table';
import Card from '../components/Card';
import { toast } from 'react-toastify';

const RecycleBin = () => {
  const [deletedCustomers, setDeletedCustomers] = useState([
    { id: 1, name: 'Rajesh Kumar', phone: '+91 9876543210', email: 'rajesh@email.com', deletedAt: new Date('2024-01-15') },
    { id: 2, name: 'Priya Sharma', phone: '+91 9123456789', email: 'priya@email.com', deletedAt: new Date('2024-01-10') },
  ]);
  const [deletedAgents, setDeletedAgents] = useState([
    { id: 1, name: 'Amit Patel', mobile: '+91 9988776655', agentId: '100001', caderRole: 'FO', deletedAt: new Date('2024-01-12') },
    { id: 2, name: 'Sneha Reddy', mobile: '+91 9876512345', agentId: '100002', caderRole: 'TL', deletedAt: new Date('2024-01-08') },
  ]);
  const [activeTab, setActiveTab] = useState('customers');

  const handleRestore = (row, type) => {
    if (type === 'customer') {
      setDeletedCustomers(deletedCustomers.filter(c => c.id !== row.id));
    } else {
      setDeletedAgents(deletedAgents.filter(a => a.id !== row.id));
    }
    toast.success(`${row.name} restored successfully!`);
  };

  const handlePermanentDelete = (row, type) => {
    if (!window.confirm(`Permanently delete ${row.name}? This cannot be undone.`)) return;
    if (type === 'customer') {
      setDeletedCustomers(deletedCustomers.filter(c => c.id !== row.id));
    } else {
      setDeletedAgents(deletedAgents.filter(a => a.id !== row.id));
    }
    toast.error(`${row.name} permanently deleted!`);
  };

  const customerColumns = [
    { header: 'Name', field: 'name' },
    { header: 'Phone', field: 'phone' },
    { header: 'Email', field: 'email' },
    { header: 'Deleted Date', field: (row) => new Date(row.deletedAt).toLocaleDateString() },
  ];

  const agentColumns = [
    { header: 'Name', field: 'name' },
    { header: 'Mobile', field: 'mobile' },
    { header: 'Agent ID', field: 'agentId' },
    { header: 'Cader Role', field: 'caderRole' },
    { header: 'Deleted Date', field: (row) => new Date(row.deletedAt).toLocaleDateString() },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#5F9EA0' }}>
      <div className="flex items-center gap-3 mb-6">
        <Trash2 className="text-white" size={32} />
        <h1 className="text-2xl md:text-3xl font-bold text-white">Recycle Bin</h1>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'customers' ? 'bg-white text-gray-800' : 'bg-gray-200 text-gray-600'}`}
        >
          Customers ({deletedCustomers.length})
        </button>
        <button
          onClick={() => setActiveTab('agents')}
          className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'agents' ? 'bg-white text-gray-800' : 'bg-gray-200 text-gray-600'}`}
        >
          Agents ({deletedAgents.length})
        </button>
      </div>

      <Card>
        {activeTab === 'customers' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#2F4F4F' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Deleted Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deletedCustomers.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50" style={{backgroundColor: idx % 2 !== 0 ? '#f9fafb' : 'white'}}>
                    <td className="px-4 py-3 text-sm font-semibold" style={{color: '#2F4F4F'}}>{row.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{new Date(row.deletedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRestore(row, 'customer')}
                          className="px-3 py-1 rounded text-white text-xs flex items-center gap-1"
                          style={{ backgroundColor: '#2C7A7B' }}
                        >
                          <RotateCcw size={12} /> Restore
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(row, 'customer')}
                          className="px-3 py-1 bg-red-500 rounded text-white text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#2F4F4F' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Mobile</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Agent ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Cader Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Deleted Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deletedAgents.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50" style={{backgroundColor: idx % 2 !== 0 ? '#f9fafb' : 'white'}}>
                    <td className="px-4 py-3 text-sm font-semibold" style={{color: '#2F4F4F'}}>{row.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.mobile}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.agentId}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 rounded text-xs font-semibold" style={{backgroundColor: '#5F9EA0', color: 'white'}}>{row.caderRole}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{new Date(row.deletedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRestore(row, 'agent')}
                          className="px-3 py-1 rounded text-white text-xs flex items-center gap-1"
                          style={{ backgroundColor: '#2C7A7B' }}
                        >
                          <RotateCcw size={12} /> Restore
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(row, 'agent')}
                          className="px-3 py-1 bg-red-500 rounded text-white text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RecycleBin;
