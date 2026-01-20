import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw } from 'lucide-react';
import Card from '../components/Card';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const RecycleBin = () => {
  const [deletedCustomers, setDeletedCustomers] = useState([]);
  const [deletedAgents, setDeletedAgents] = useState([]);
  const [deletedCadres, setDeletedCadres] = useState([]);
  const [activeTab, setActiveTab] = useState('customers');

  useEffect(() => {
    loadDeletedItems();
  }, []);

  const loadDeletedItems = async () => {
    try {
      const response = await fetch(`${API_URL}/bin`);
      const data = await response.json();
      setDeletedCustomers(data.customers || []);
      setDeletedAgents(data.agents || []);
      setDeletedCadres(data.cadres || []);
    } catch (error) {
      console.error('Error loading deleted items:', error);
      toast.error('Failed to load deleted items');
    }
  };

  const handleRestore = async (row, type) => {
    try {
      const response = await fetch(`${API_URL}/bin/restore/${type}/${row._id}`, {
        method: 'POST',
      });
      if (response.ok) {
        toast.success(`${row.name} restored successfully!`);
        loadDeletedItems();
      } else {
        toast.error('Failed to restore');
      }
    } catch (error) {
      toast.error('Failed to restore');
    }
  };

  const handlePermanentDelete = async (row, type) => {
    if (!window.confirm(`Permanently delete ${row.name}? This cannot be undone.`)) return;
    try {
      const response = await fetch(`${API_URL}/bin/${type}/${row._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.error(`${row.name} permanently deleted!`);
        loadDeletedItems();
      } else {
        toast.error('Failed to delete');
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <Trash2 className="text-gray-800" size={32} />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Recycle Bin</h1>
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
        <button
          onClick={() => setActiveTab('cadres')}
          className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'cadres' ? 'bg-white text-gray-800' : 'bg-gray-200 text-gray-600'}`}
        >
          Cadres ({deletedCadres.length})
        </button>
      </div>

      <Card>
        {activeTab === 'customers' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#1e3a8a' }}>
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
                  <tr key={row._id} className="border-b hover:bg-gray-50" style={{backgroundColor: idx % 2 !== 0 ? '#f9fafb' : 'white'}}>
                    <td className="px-4 py-3 text-sm font-semibold text-blue-700">{row.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.phone || row.mobile}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.email || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{new Date(row.deletedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRestore(row, 'customer')}
                          className="px-3 py-1 bg-blue-600 rounded text-white text-xs flex items-center gap-1 hover:bg-blue-700"
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
            {deletedCustomers.length === 0 && (
              <div className="text-center py-8 text-gray-500">No deleted customers</div>
            )}
          </div>
        )}
        {activeTab === 'agents' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#1e3a8a' }}>
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
                  <tr key={row._id} className="border-b hover:bg-gray-50" style={{backgroundColor: idx % 2 !== 0 ? '#f9fafb' : 'white'}}>
                    <td className="px-4 py-3 text-sm font-semibold text-blue-700">{row.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.mobile}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.agentId || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 rounded text-xs font-semibold" style={{backgroundColor: '#1e3a8a' + '33', color: '#1e3a8a'}}>{row.caderRole || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{new Date(row.deletedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRestore(row, 'agent')}
                          className="px-3 py-1 bg-blue-600 rounded text-white text-xs flex items-center gap-1 hover:bg-blue-700"
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
            {deletedAgents.length === 0 && (
              <div className="text-center py-8 text-gray-500">No deleted agents</div>
            )}
          </div>
        )}
        {activeTab === 'cadres' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#1e3a8a' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Mobile</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Cadre ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Cadre Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Deleted Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deletedCadres.map((row, idx) => (
                  <tr key={row._id} className="border-b hover:bg-gray-50" style={{backgroundColor: idx % 2 !== 0 ? '#f9fafb' : 'white'}}>
                    <td className="px-4 py-3 text-sm font-semibold text-blue-700">{row.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.mobile}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.cadreId || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 rounded text-xs font-semibold" style={{backgroundColor: '#1e3a8a' + '33', color: '#1e3a8a'}}>{row.cadreRole || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{new Date(row.deletedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRestore(row, 'cadre')}
                          className="px-3 py-1 bg-blue-600 rounded text-white text-xs flex items-center gap-1 hover:bg-blue-700"
                        >
                          <RotateCcw size={12} /> Restore
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(row, 'cadre')}
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
            {deletedCadres.length === 0 && (
              <div className="text-center py-8 text-gray-500">No deleted cadres</div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default RecycleBin;
