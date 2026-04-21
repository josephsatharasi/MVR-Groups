import React, { useState, useEffect } from 'react';
import { Users, Plus, Download, Edit, Trash2, X, CheckCircle, XCircle } from 'lucide-react';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import ConfirmModal from '../components/ConfirmModal';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Agents = () => {
  const [search, setSearch] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showCustomersModal, setShowCustomersModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentCustomers, setAgentCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [agents, setAgents] = useState([]);
  const [cadres, setCadres] = useState([]);
  const [cadreValidation, setCadreValidation] = useState({ valid: false, message: '', cadre: null });
  const [agentToDelete, setAgentToDelete] = useState(null);
  const [companyCodeFilter, setCompanyCodeFilter] = useState('all');
  
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
    agentId: '',
    cadreId: '',
    companyCode999: false,
  });

  useEffect(() => {
    fetchAgents();
    fetchCadres();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${API_URL}/agents`);
      setAgents(response.data);
    } catch (error) {
      toast.error('Failed to fetch agents');
      console.error(error);
    }
  };

  const fetchCadres = async () => {
    try {
      const response = await axios.get(`${API_URL}/cadres`);
      setCadres(response.data);
    } catch (error) {
      toast.error('Failed to fetch cadres');
      console.error(error);
    }
  };

  const validateCadreId = async (cadreId) => {
    if (!cadreId) {
      setCadreValidation({ valid: false, message: '', cadre: null });
      return;
    }
    
    try {
      const response = await axios.post(`${API_URL}/agents/validate-cadre`, { cadreId });
      if (response.data.valid) {
        setCadreValidation({ 
          valid: true, 
          message: `${response.data.cadre.name} - ${response.data.cadre.role}`, 
          cadre: response.data.cadre 
        });
      } else {
        setCadreValidation({ valid: false, message: 'Cadre ID not found', cadre: null });
      }
    } catch (error) {
      setCadreValidation({ valid: false, message: 'Error validating cadre', cadre: null });
    }
  };

  const filtered = agents.filter(a => {
    const matchesSearch = a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.mobile?.includes(search) ||
      a.agentId?.includes(search) ||
      a.cadreId?.includes(search);
    
    const matchesCompanyCode = companyCodeFilter === 'all' || 
      (companyCodeFilter === '999' && a.companyCode999 === true) ||
      (companyCodeFilter === 'other' && a.companyCode999 !== true);
    
    return matchesSearch && matchesCompanyCode;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/agents/${editingId}`, formData);
        toast.success('Agent updated successfully!');
      } else {
        // Auto-generate agentId
        const maxAgentId = agents.length > 0 && agents.some(a => a.agentId) 
          ? Math.max(...agents.map(a => parseInt(a.agentId) || 100000)) 
          : 100000;
        const newAgentId = (maxAgentId + 1).toString();
        await axios.post(`${API_URL}/agents`, { ...formData, agentId: newAgentId });
        toast.success(`Agent added successfully! Agent ID: ${newAgentId}`);
      }
      fetchAgents();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || (editingId ? 'Failed to update agent' : 'Failed to add agent'));
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
      agentId: row.agentId || '',
      cadreId: row.cadreId || '',
      companyCode999: row.companyCode999 || false,
    });
    setEditingId(row._id);
    setShowFormModal(true);
    if (row.cadreId) {
      validateCadreId(row.cadreId);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/agents/${agentToDelete.id}`);
      toast.success(`${agentToDelete.name} deleted successfully!`);
      fetchAgents();
      setAgentToDelete(null);
    } catch (error) {
      toast.error('Failed to delete agent');
      console.error(error);
    }
  };

  const handleRowClick = async (agent) => {
    setSelectedAgent(agent);
    try {
      // Fetch customers associated with this agent
      const response = await axios.get(`${API_URL}/customers`);
      const allCustomers = response.data;
      const associatedCustomers = allCustomers.filter(customer => customer.agentCode === agent.agentId);
      setAgentCustomers(associatedCustomers);
      setShowCustomersModal(true);
    } catch (error) {
      toast.error('Failed to fetch agent customers');
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
      agentId: '',
      cadreId: '',
      companyCode999: false,
    });
    setEditingId(null);
    setShowFormModal(false);
    setCadreValidation({ valid: false, message: '', cadre: null });
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
    doc.text('Agents List', 14, 35);
    
    const tableData = agents.map((a, index) => [
      index + 1,
      a.name,
      a.agentId,
      a.cadreId,
      a.mobile,
      a.address || '-'
    ]);
    
    autoTable(doc, {
      startY: 42,
      head: [['S.NO', 'Name', 'Agent ID', 'Cadre ID', 'Mobile', 'Address']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 5 },
    });
    
    doc.save('agents-list.pdf');
    toast.success('PDF downloaded successfully!');
  };

  const getCadreName = (cadreId) => {
    const cadre = cadres.find(c => c.cadreId === cadreId);
    return cadre ? cadre.name : 'Unknown';
  };

  const columns = [
    { header: 'Name', field: 'name', render: (row) => (
      <span className="font-semibold">{row.name}</span>
    )},
    { header: 'Agent ID', field: 'agentId' },
    { header: 'Cadre ID', field: 'cadreId', render: (row) => (
      <div>
        <span className="font-medium">{row.cadreId}</span>
        <br />
        <span className="text-xs text-gray-500">{getCadreName(row.cadreId)}</span>
      </div>
    )},
    { header: 'Mobile', field: 'mobile' },
    { header: 'Email', field: 'email' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Agents List</h1>
        <div className="flex gap-2">
          <Button variant="primary" icon={Plus} onClick={() => setShowFormModal(true)}>
            Add Agent
          </Button>
          <Button variant="secondary" icon={Download} onClick={downloadPDF}>
            Download PDF
          </Button>
        </div>
      </div>

      <Card>
        <div className="mb-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="flex-1">
            <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search agents..." />
          </div>
          <div className="w-full md:w-auto">
            <select 
              value={companyCodeFilter} 
              onChange={(e) => setCompanyCodeFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white"
            >
              <option value="all">All Agents</option>
              <option value="999">Company Code 999</option>
              <option value="other">Other</option>
            </select>
          </div>
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
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setAgentToDelete({ id: row._id, name: row.name })}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
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
                {editingId ? 'Edit Agent' : 'Add New Agent'}
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
                <div>
                  <FormInput
                    label="Cadre ID (Required)"
                    value={formData.cadreId}
                    onChange={(e) => {
                      setFormData({ ...formData, cadreId: e.target.value });
                      validateCadreId(e.target.value);
                    }}
                    required
                    placeholder="Enter cadre ID"
                  />
                  {formData.cadreId && (
                    <div className={`text-sm mt-1 flex items-center gap-1 ${cadreValidation.valid ? 'text-green-600' : 'text-red-600'}`}>
                      {cadreValidation.valid ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      {cadreValidation.valid ? '✓ ' : '✗ '}{cadreValidation.message}
                    </div>
                  )}
                </div>
                {!editingId && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">Agent ID</label>
                    <input
                      type="text"
                      value={(() => {
                        const maxId = agents.length > 0 && agents.some(a => a.agentId) 
                          ? Math.max(...agents.map(a => parseInt(a.agentId) || 100000)) 
                          : 100000;
                        return (maxId + 1).toString();
                      })()}
                      readOnly
                      className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                    />
                  </div>
                )}
                {editingId && formData.agentId && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">Agent ID</label>
                    <input
                      type="text"
                      value={formData.agentId}
                      readOnly
                      className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="companyCode999"
                    checked={formData.companyCode999}
                    onChange={(e) => setFormData({ ...formData, companyCode999: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="companyCode999" className="text-sm font-medium text-gray-800">
                    Company Code 999
                  </label>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" variant="primary" disabled={!cadreValidation.valid && !editingId}>
                  {editingId ? 'Update' : 'Add'} Agent
                </Button>
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!agentToDelete}
        onClose={() => setAgentToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Agent"
        message={`Are you sure you want to delete ${agentToDelete?.name}? This action cannot be undone.`}
      />

      {/* Agent Customers Modal */}
      {showCustomersModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Customers Associated with Agent</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Agent: <span className="font-semibold text-blue-600">{selectedAgent.name}</span> 
                  (ID: <span className="font-semibold">{selectedAgent.agentId}</span>)
                </p>
              </div>
              <button 
                onClick={() => setShowCustomersModal(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              {agentCustomers.length > 0 ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Total Customers: <span className="font-semibold text-blue-600">{agentCustomers.length}</span>
                    </p>
                    <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                      <p className="text-xs text-green-800 font-medium">Agent Commission: 4% on paid amounts</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full">
                      <thead style={{ backgroundColor: '#1e3a8a' }}>
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-white">Customer Name</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-white">Phone</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-white">Project</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-white">Plot No</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-white">Total Amount</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-white">Paid Amount</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-white">Balance</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-white">Agent Commission</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agentCustomers.map((customer, idx) => {
                          const totalAmount = parseFloat(customer.totalAmount) || 0;
                          const getTotalPaid = (customerId) => {
                            const paymentHistory = JSON.parse(localStorage.getItem(`payment_history_${customerId}`) || '[]');
                            return paymentHistory.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                          };
                          const paidAmount = getTotalPaid(customer._id || customer.id);
                          const balance = totalAmount - paidAmount;
                          const agentCommission = paidAmount * 0.04; // 4% commission
                          
                          return (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-semibold text-blue-700">{customer.name}</td>
                              <td className="px-4 py-3 text-sm">{customer.phone || customer.mobile}</td>
                              <td className="px-4 py-3 text-sm">{customer.projectName || '-'}</td>
                              <td className="px-4 py-3 text-sm">
                                <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                                  {customer.plotNo || '-'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-right font-semibold">₹{totalAmount.toLocaleString('en-IN')}</td>
                              <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">₹{paidAmount.toLocaleString('en-IN')}</td>
                              <td className="px-4 py-3 text-sm text-right font-semibold text-red-600">₹{balance.toLocaleString('en-IN')}</td>
                              <td className="px-4 py-3 text-sm text-right font-bold text-green-700">₹{agentCommission.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan="5" className="px-4 py-3 text-sm font-bold text-gray-800">Total:</td>
                          <td className="px-4 py-3 text-sm text-right font-bold text-green-600">
                            ₹{agentCustomers.reduce((sum, customer) => {
                              const getTotalPaid = (customerId) => {
                                const paymentHistory = JSON.parse(localStorage.getItem(`payment_history_${customerId}`) || '[]');
                                return paymentHistory.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                              };
                              return sum + getTotalPaid(customer._id || customer.id);
                            }, 0).toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-bold text-red-600">
                            ₹{agentCustomers.reduce((sum, customer) => {
                              const totalAmount = parseFloat(customer.totalAmount) || 0;
                              const getTotalPaid = (customerId) => {
                                const paymentHistory = JSON.parse(localStorage.getItem(`payment_history_${customerId}`) || '[]');
                                return paymentHistory.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                              };
                              const paidAmount = getTotalPaid(customer._id || customer.id);
                              return sum + (totalAmount - paidAmount);
                            }, 0).toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-bold text-green-700">
                            ₹{agentCustomers.reduce((sum, customer) => {
                              const getTotalPaid = (customerId) => {
                                const paymentHistory = JSON.parse(localStorage.getItem(`payment_history_${customerId}`) || '[]');
                                return paymentHistory.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                              };
                              const paidAmount = getTotalPaid(customer._id || customer.id);
                              return sum + (paidAmount * 0.04);
                            }, 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Users className="mx-auto mb-4 text-gray-400" size={64} />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Customers Found</h3>
                  <p className="text-sm text-gray-500">
                    This agent doesn't have any customers assigned yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;