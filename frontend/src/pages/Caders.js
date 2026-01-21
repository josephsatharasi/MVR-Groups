import React, { useState, useEffect } from 'react';
import { Users, Plus, Download, Edit, Trash2, X } from 'lucide-react';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';
import Button from '../components/Button';
import FormInput from '../components/FormInput';

import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Caders = () => {
  const [search, setSearch] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRecruitModal, setShowRecruitModal] = useState(false);
  const [recruitFormData, setRecruitFormData] = useState({
    username: '',
    role: '',
    email: '',
    contact: '',
    percentage: '',
  });
  const [selectedCader, setSelectedCader] = useState(null);
  const [linkedCustomers, setLinkedCustomers] = useState([]);
  const [totalCommission, setTotalCommission] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    relationType: '',
    relation: '',
    mobile: '',
    whatsapp: '',
    email: '',
    dob: '',
    age: '',
    address: '',
    pinCode: '',
    aadharNo: '',
    panNo: '',
    cadreId: '',
    cadreRole: '',
    cadreDhamaka: '',
    introducerRole: '',
    introducerId: '',
  });

  const [caders, setCaders] = useState([]);

  useEffect(() => {
    fetchCadres();
  }, []);

  const fetchCadres = async () => {
    try {
      const response = await axios.get(`${API_URL}/cadres`);
      setCaders(response.data);
    } catch (error) {
      toast.error('Failed to fetch cadres');
      console.error(error);
    }
  };

  const roleHierarchy = ['FO', 'TL', 'STL', 'DO', 'SDO', 'MM', 'SMM', 'GM', 'SGM'];

  const getAvailableRoles = (recruiterRole) => {
    if (!recruiterRole) return [];
    const recruiterIndex = roleHierarchy.indexOf(recruiterRole);
    return roleOptions.filter((_, index) => index <= recruiterIndex);
  };

  const getAvailableRolesForNew = (introducerRole) => {
    if (!introducerRole) return roleOptions;
    const introducerIndex = roleHierarchy.indexOf(introducerRole);
    return roleOptions.filter((_, index) => index <= introducerIndex);
  };

  const roleOptions = [
    { value: 'FO', label: 'FIELD OFFICER (FO)' },
    { value: 'TL', label: 'TEAM LEADER (TL)' },
    { value: 'STL', label: 'SENIOR TEAM LEADER (STL)' },
    { value: 'DO', label: 'DEVELOPMENT OFFICE (DO)' },
    { value: 'SDO', label: 'SENIOR DEVELOPMENT OFFICE (SDO)' },
    { value: 'MM', label: 'MARKETING MANAGER (MM)' },
    { value: 'SMM', label: 'SENIOR MARKETING MANAGER (SMM)' },
    { value: 'GM', label: 'GENERAL MANAGER (GM)' },
    { value: 'SGM', label: 'SENIOR GENERAL MANAGER (SGM)' },
  ];

  const getRoleFullName = (role) => {
    const found = roleOptions.find(r => r.value === role);
    return found ? found.label : role;
  };

  const filtered = caders.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile?.includes(search) ||
    c.cadreId?.includes(search) ||
    c.cadreRole?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/cadres/${editingId}`, formData);
        toast.success('Cadre updated successfully!');
      } else {
        // Auto-generate cadreId
        const maxCadreId = caders.length > 0 && caders.some(c => c.cadreId) 
          ? Math.max(...caders.map(c => parseInt(c.cadreId) || 200000)) 
          : 200000;
        const newCadreId = (maxCadreId + 1).toString();
        await axios.post(`${API_URL}/cadres`, { ...formData, cadreId: newCadreId });
        toast.success(`Cadre added successfully! Cadre ID: ${newCadreId}`);
      }
      fetchCadres();
      resetForm();
    } catch (error) {
      toast.error(editingId ? 'Failed to update cadre' : 'Failed to add cadre');
      console.error(error);
    }
  };

  const handleEdit = (row) => {
    setFormData({
      name: row.name || '',
      relationType: row.relationType || '',
      relation: row.relation || '',
      mobile: row.mobile || '',
      whatsapp: row.whatsapp || '',
      email: row.email || '',
      dob: row.dob || '',
      age: row.age || '',
      address: row.address || '',
      pinCode: row.pinCode || '',
      aadharNo: row.aadharNo || '',
      panNo: row.panNo || '',
      cadreId: row.cadreId || '',
      cadreRole: row.cadreRole || '',
      cadreDhamaka: row.cadreDhamaka || '',
      introducerRole: row.introducerRole || '',
      introducerId: row.introducerId || '',
    });
    setEditingId(row._id);
    setShowFormModal(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm('Are you sure you want to delete this cadre?')) {
      try {
        await axios.delete(`${API_URL}/cadres/${row._id}`);
        toast.success('Cadre deleted successfully!');
        fetchCadres();
      } catch (error) {
        toast.error('Failed to delete cadre');
        console.error(error);
      }
    }
  };

  const handleRowClick = async (row) => {
    setSelectedCader(row);
    setShowDetailsModal(true);
    
    try {
      const response = await axios.get(`${API_URL}/customers`);
      const customers = response.data;
      const linked = customers.filter(c => c.cadreCode === row.cadreId || c.agentCode === row.cadreId);
      setLinkedCustomers(linked);
      
      const percentages = { FO: 4, TL: 2, STL: 1, DO: 1, SDO: 1, MM: 1, SMM: 1, GM: 1, SGM: 1 };
      const percentage = percentages[row.cadreRole] || 0;
      const total = linked.reduce((sum, customer) => {
        const amount = parseFloat(customer.totalAmount) || 0;
        return sum + (amount * percentage / 100);
      }, 0);
      setTotalCommission(total);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      setLinkedCustomers([]);
      setTotalCommission(0);
    }
  };

  const handleRecruitSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/cadres`, recruitFormData);
      toast.success(`${recruitFormData.username} recruited successfully!`);
      fetchCadres();
      setShowRecruitModal(false);
      setRecruitFormData({ username: '', role: '', email: '', contact: '', percentage: '' });
    } catch (error) {
      toast.error('Failed to recruit member');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      relationType: '',
      relation: '',
      mobile: '',
      whatsapp: '',
      email: '',
      dob: '',
      age: '',
      address: '',
      pinCode: '',
      aadharNo: '',
      panNo: '',
      cadreId: '',
      cadreRole: '',
      cadreDhamaka: '',
      introducerRole: '',
      introducerId: '',
    });
    setEditingId(null);
    setShowFormModal(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Company Header
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('MVR Groups', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Real Estate Management', 105, 22, { align: 'center' });
    
    // Title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Cadres List', 14, 35);
    
    const tableData = caders.map((c, index) => [
      index + 1,
      c.name,
      c.mobile,
      getRoleFullName(c.cadreRole),
      c.address || '-'
    ]);
    
    autoTable(doc, {
      startY: 42,
      head: [['S.NO', 'Name', 'Mobile', 'Cadre Role', 'Address']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [47, 79, 79], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 5 },
    });
    
    doc.save('cadres-list.pdf');
    toast.success('PDF downloaded successfully!');
  };

  const columns = [
    { header: 'Name', field: 'name', render: (row) => (
      <span className="font-semibold">{row.name} ({row.cadreRole})</span>
    )},
    { header: 'Cadre ID', field: 'cadreId' },
    { header: 'Role', field: 'cadreRole', render: (row) => getRoleFullName(row.cadreRole) },
    { header: 'Mobile', field: 'mobile' },
    { header: 'Email', field: 'email' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Caders List</h1>
        <div className="flex gap-2">
          <Button variant="primary" icon={Plus} onClick={() => setShowFormModal(true)}>
            Add Cader
          </Button>
          <Button variant="secondary" icon={Download} onClick={downloadPDF}>
            Download PDF
          </Button>
        </div>
      </div>

      <Card>
        <div className="mb-4">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search caders..." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#1e3a8a' }}>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-4 py-3 text-left text-sm font-semibold text-white">
                    {col.header}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, rowIdx) => (
                <tr 
                  key={rowIdx} 
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(row)}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-4 py-3 text-sm text-gray-700">
                      {col.render ? col.render(row) : row[col.field]}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleEdit(row)}
                        className="px-3 py-1 bg-blue-500 rounded text-white text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(row)}
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
      </Card>

      {/* Add/Edit Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? 'Edit Cader' : 'Add New Cader'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Name (Mr/Mrs/Ms/Dr)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter full name"
                />
                <div className="grid grid-cols-2 gap-2">
                  <FormInput
                    label="Relation"
                    type="select"
                    value={formData.relationType}
                    onChange={(e) => setFormData({ ...formData, relationType: e.target.value })}
                    options={['S/o', 'W/o', 'D/o']}
                    placeholder="Select"
                  />
                  <FormInput
                    label="Name"
                    value={formData.relation}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>
                <FormInput
                  label="Mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  required
                  placeholder="Enter mobile number"
                />
                <FormInput
                  label="WhatsApp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="Enter WhatsApp number"
                />
                <FormInput
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                />
                <FormInput
                  label="Date of Birth"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />
                <FormInput
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Enter age"
                />
                <FormInput
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address"
                />
                <FormInput
                  label="Pin Code"
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  placeholder="Enter pin code"
                />
                <FormInput
                  label="Aadhar No"
                  value={formData.aadharNo}
                  onChange={(e) => setFormData({ ...formData, aadharNo: e.target.value })}
                  placeholder="Enter Aadhar number"
                />
                <FormInput
                  label="PAN No"
                  value={formData.panNo}
                  onChange={(e) => setFormData({ ...formData, panNo: e.target.value })}
                  placeholder="Enter PAN number"
                />
                <FormInput
                  label="Cadre Role"
                  type="select"
                  value={formData.cadreRole}
                  onChange={(e) => setFormData({ ...formData, cadreRole: e.target.value })}
                  options={formData.introducerRole ? getAvailableRolesForNew(formData.introducerRole) : roleOptions}
                  placeholder="Select role"
                />
                <FormInput
                  label="Introducer Role"
                  type="select"
                  value={formData.introducerRole}
                  onChange={(e) => setFormData({ ...formData, introducerRole: e.target.value, introducerId: '' })}
                  options={roleOptions}
                  placeholder="Select introducer role"
                />
                <FormInput
                  label="Introducer ID"
                  type="select"
                  value={formData.introducerId}
                  onChange={(e) => setFormData({ ...formData, introducerId: e.target.value })}
                  options={caders
                    .filter(c => c.cadreRole === formData.introducerRole)
                    .map(c => ({ value: c.cadreId, label: `${c.name} (${c.cadreId})` }))}
                  placeholder="Select introducer"
                  disabled={!formData.introducerRole}
                />
                {!editingId && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">Cadre ID</label>
                    <input
                      type="text"
                      value={(() => {
                        const maxId = caders.length > 0 && caders.some(c => c.cadreId) 
                          ? Math.max(...caders.map(c => parseInt(c.cadreId) || 200000)) 
                          : 200000;
                        return (maxId + 1).toString();
                      })()}
                      readOnly
                      className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                    />
                  </div>
                )}
                {editingId && formData.cadreId && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">Cadre ID</label>
                    <input
                      type="text"
                      value={formData.cadreId}
                      readOnly
                      className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                    />
                  </div>
                )}
                <FormInput
                  label="Cadre Dhamaka"
                  value={formData.cadreDhamaka}
                  onChange={(e) => setFormData({ ...formData, cadreDhamaka: e.target.value })}
                  placeholder="Enter cadre dhamaka"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" variant="primary">
                  {editingId ? 'Update' : 'Add'} Cader
                </Button>
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cader Details Modal */}
      {showDetailsModal && selectedCader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Cader Details -</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Username</p>
                  <p className="font-semibold text-gray-900">{selectedCader.name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Role</p>
                  <p className="font-semibold text-gray-900">{getRoleFullName(selectedCader.cadreRole)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-semibold text-gray-900">{selectedCader.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contact</p>
                  <p className="font-semibold text-gray-900">{selectedCader.mobile || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Percentage</p>
                  <p className="font-semibold text-gray-900">{(() => {
                    const percentages = { FO: 4, TL: 2, STL: 1, DO: 1, SDO: 1, MM: 1, SMM: 1, GM: 1, SGM: 1 };
                    return percentages[selectedCader.cadreRole] || 0;
                  })()}%</p>
                </div>
              </div>

              <div className="border-t pt-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Recruitment Hierarchy & Commission</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2">
                    <Plus size={16} /> Recruit Team Member
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">This can recruit the following positions with their commission percentages:</p>
                
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Total Commission Distribution (Example: ₹10,000 booking)</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-2xl text-green-600">₹{totalCommission.toFixed(2)}</span>
                  </div>
                </div>

                {linkedCustomers.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Linked Customers ({linkedCustomers.length}):</p>
                    <div className="max-h-60 overflow-y-auto border rounded-lg">
                      <table className="w-full">
                        <thead className="bg-blue-50 sticky top-0">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Name</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Project</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Amount</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Commission</th>
                          </tr>
                        </thead>
                        <tbody>
                          {linkedCustomers.map((customer, idx) => {
                            const percentages = { FO: 4, TL: 2, STL: 1, DO: 1, SDO: 1, MM: 1, SMM: 1, GM: 1, SGM: 1 };
                            const percentage = percentages[selectedCader.cadreRole] || 0;
                            const amount = parseFloat(customer.totalAmount) || 0;
                            const commission = amount * percentage / 100;
                            return (
                              <tr key={idx} className="border-b hover:bg-gray-50">
                                <td className="px-3 py-2 text-sm">{customer.name}</td>
                                <td className="px-3 py-2 text-sm">{customer.projectName || '-'}</td>
                                <td className="px-3 py-2 text-sm text-right">₹{amount.toLocaleString('en-IN')}</td>
                                <td className="px-3 py-2 text-sm text-right font-semibold text-green-600">₹{commission.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Commission Calculation</h3>
                <p className="text-sm text-gray-600 mb-2">Based on role: {getRoleFullName(selectedCader.cadreRole)} - {(() => {
                  const percentages = { FO: 4, TL: 2, STL: 1, DO: 1, SDO: 1, MM: 1, SMM: 1, GM: 1, SGM: 1 };
                  return percentages[selectedCader.cadreRole] || 0;
                })()}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recruit Modal */}
      {showRecruitModal && selectedCader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Recruit Team Member
              </h2>
              <button onClick={() => setShowRecruitModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleRecruitSubmit} className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600">Recruiting as: <span className="font-semibold text-blue-700">{selectedCader.username} ({getRoleFullName(selectedCader.role)})</span></p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Username"
                  value={recruitFormData.username}
                  onChange={(e) => setRecruitFormData({ ...recruitFormData, username: e.target.value })}
                  required
                  placeholder="Enter username"
                />
                <FormInput
                  label="Role"
                  type="select"
                  value={recruitFormData.role}
                  onChange={(e) => setRecruitFormData({ ...recruitFormData, role: e.target.value })}
                  options={getAvailableRoles(selectedCader.role)}
                  required
                />
                <FormInput
                  label="Email"
                  type="email"
                  value={recruitFormData.email}
                  onChange={(e) => setRecruitFormData({ ...recruitFormData, email: e.target.value })}
                  required
                  placeholder="Enter email"
                />
                <FormInput
                  label="Contact"
                  type="tel"
                  value={recruitFormData.contact}
                  onChange={(e) => setRecruitFormData({ ...recruitFormData, contact: e.target.value })}
                  required
                  placeholder="Enter contact"
                />
                <FormInput
                  label="Percentage"
                  type="number"
                  value={recruitFormData.percentage}
                  onChange={(e) => setRecruitFormData({ ...recruitFormData, percentage: e.target.value })}
                  required
                  placeholder="Enter percentage (0-100)"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" variant="primary">
                  Recruit Member
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowRecruitModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Caders;
