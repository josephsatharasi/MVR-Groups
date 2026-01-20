import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, X, Upload, Download } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getAgents, addAgent, updateAgent, deleteAgent } from '../utils/storage';

const Agents = () => {
  const [search, setSearch] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({
    name: '', relationType: '', relation: '', mobile: '', whatsapp: '', email: '',
    dob: '', age: '', address: '', pinCode: '', aadharNo: '',
    panNo: '', agentId: '', companyCode: '', caderRole: '', percentage: '', agentDhamaka: '', registrationDhamaka: '', photo: null,
  });
  const [companyCodeChecked, setCompanyCodeChecked] = useState(false);
  const [companyAgents, setCompanyAgents] = useState([]);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    const data = await getAgents();
    setAgents(data);
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
      a.mobile,
      a.email || '-',
      a.agentId,
      a.caderRole
    ]);
    
    autoTable(doc, {
      startY: 42,
      head: [['S.NO', 'Name', 'Mobile', 'Email', 'Agent ID', 'Cader Role']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [47, 79, 79], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 4 },
    });
    
    doc.save('agents-list.pdf');
    toast.success('PDF downloaded successfully!');
  };

  const caderRoles = [
    { value: 'FO', label: 'FIELD OFFICER (FO)', percentage: 4 },
    { value: 'TL', label: 'TEAM LEADER (TL)', percentage: 2 },
    { value: 'STL', label: 'SENIOR TEAM LEADER (STL)', percentage: 1 },
    { value: 'DO', label: 'DEVELOPMENT OFFICE (DO)', percentage: 1 },
    { value: 'SDO', label: 'SENIOR DEVELOPMENT OFFICE (SDO)', percentage: 1 },
    { value: 'MM', label: 'MARKETING MANAGER (MM)', percentage: 1 },
    { value: 'SMM', label: 'SENIOR MARKETING MANAGER (SMM)', percentage: 1 },
    { value: 'SGM', label: 'SENIOR GENERAL MANAGER (SGM)', percentage: 1 },
  ];

  const filtered = agents.filter(a => 
    (a.name && a.name.toLowerCase().includes(search.toLowerCase())) ||
    (a.email && a.email.toLowerCase().includes(search.toLowerCase())) ||
    (a.mobile && a.mobile.includes(search)) ||
    (a.agentId && a.agentId.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile || !formData.companyCode) {
      toast.error('Please fill required fields: Name, Mobile, and Company Code');
      return;
    }
    
    if (!companyCodeChecked) {
      toast.error('Please check the company code first');
      return;
    }
    
    try {
      if (editingId) {
        await updateAgent(editingId, formData);
        toast.success('Agent updated successfully!');
      } else {
        const maxAgentId = agents.length > 0 && agents.some(a => a.agentId) 
          ? Math.max(...agents.map(a => parseInt(a.agentId) || 100000)) 
          : 100000;
        const newAgentId = (maxAgentId + 1).toString();
        await addAgent({ ...formData, agentId: newAgentId });
        toast.success(`Agent added successfully! Agent ID: ${newAgentId}`);
      }
      resetForm();
      loadAgents();
    } catch (error) {
      console.error('Error saving agent:', error);
      toast.error('Failed to save agent: ' + (error.message || 'Unknown error'));
    }
  };

  const handleEdit = (row) => {
    setFormData({ ...row });
    setEditingId(row._id);
    setShowFormModal(true);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete ${row.name}? This will move the agent to recycle bin.`)) return;
    try {
      await deleteAgent(row._id);
      toast.success('Agent moved to recycle bin!');
      loadAgents();
    } catch (error) {
      toast.error('Failed to delete agent');
    }
  };

  const handleRowClick = (row) => {
    setSelectedAgent(row);
    setShowDetailsModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '', relationType: '', relation: '', mobile: '', whatsapp: '', email: '',
      dob: '', age: '', address: '', pinCode: '', aadharNo: '',
      panNo: '', agentId: '', companyCode: '', caderRole: '', percentage: '', agentDhamaka: '', registrationDhamaka: '', photo: null,
    });
    setEditingId(null);
    setShowFormModal(false);
    setCompanyCodeChecked(false);
    setCompanyAgents([]);
  };

  const handleChange = (field, value) => {
    if (field === 'mobile' || field === 'whatsapp') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [field]: numericValue });
    } else if (field === 'aadharNo') {
      const numericValue = value.replace(/\D/g, '').slice(0, 12);
      const formatted = numericValue.match(/.{1,4}/g)?.join(' ') || numericValue;
      setFormData({ ...formData, [field]: formatted });
    } else if (field === 'panNo') {
      let inputValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
      let formatted = '';
      for (let i = 0; i < inputValue.length; i++) {
        if (i < 5 && /[A-Z]/.test(inputValue[i])) formatted += inputValue[i];
        else if (i >= 5 && i < 9 && /[0-9]/.test(inputValue[i])) formatted += inputValue[i];
        else if (i === 9 && /[A-Z]/.test(inputValue[i])) formatted += inputValue[i];
      }
      setFormData({ ...formData, [field]: formatted });
    } else if (field === 'agentDhamaka' || field === 'registrationDhamaka') {
      const numericValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [field]: numericValue });
    } else if (field === 'caderRole') {
      const role = caderRoles.find(r => r.value === value);
      setFormData({ ...formData, [field]: value, percentage: role ? role.percentage : '' });
    } else if (field === 'companyCode') {
      setFormData({ ...formData, [field]: value });
      setCompanyCodeChecked(false);
      setCompanyAgents([]);
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleCheckCompanyCode = () => {
    if (!formData.companyCode) {
      toast.error('Please enter company code');
      return;
    }
    const agentsInCompany = agents.filter(a => a.companyCode === formData.companyCode);
    setCompanyAgents(agentsInCompany);
    setCompanyCodeChecked(true);
    toast.success(`Found ${agentsInCompany.length} agent(s) in company code ${formData.companyCode}`);
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Agents</h1>
        <div className="flex gap-2">
          <Button variant="primary" icon={Plus} onClick={() => setShowFormModal(true)}>
            Add Agent
          </Button>
          <Button variant="secondary" icon={Download} onClick={downloadPDF}>
            Download PDF
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-4">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search agents..." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#1e3a8a' }}>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Mobile</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Agent ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Company Code</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Cader Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, rowIdx) => (
                <tr 
                  key={rowIdx} 
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  style={{backgroundColor: rowIdx % 2 !== 0 ? '#f9fafb' : 'white'}}
                  onClick={() => handleRowClick(row)}
                >
                  <td className="px-4 py-3 text-sm font-semibold" style={{color: '#1e3a8a'}}>{row.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.mobile}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.agentId}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.companyCode}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded text-xs font-semibold" style={{backgroundColor: '#1e3a8a' + '33', color: '#1e3a8a'}}>{row.caderRole}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleEdit(row)} className="px-3 py-1 rounded text-white text-xs" style={{backgroundColor: '#1e3a8a'}}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(row)} className="px-3 py-1 bg-red-500 rounded text-white text-xs">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? 'Edit Agent' : 'Add New Agent'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex justify-end mb-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-32 h-40 flex flex-col items-center justify-center">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })} className="hidden" id="photo-upload" />
                  <label htmlFor="photo-upload" className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                    Upload Photo
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Name (Mr/Mrs/Ms/Dr)" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required placeholder="Enter full name" />
                <div className="grid grid-cols-2 gap-2">
                  <FormInput label="Relation" type="select" value={formData.relationType} onChange={(e) => handleChange('relationType', e.target.value)} options={['S/o', 'W/o', 'D/o']} placeholder="Select" />
                  <FormInput label="Name" value={formData.relation} onChange={(e) => handleChange('relation', e.target.value)} placeholder="Enter name" />
                </div>
                <FormInput label="Mobile Number" type="tel" value={formData.mobile} onChange={(e) => handleChange('mobile', e.target.value)} required placeholder="Enter mobile number" />
                <FormInput label="WhatsApp Number" type="tel" value={formData.whatsapp} onChange={(e) => handleChange('whatsapp', e.target.value)} placeholder="Enter WhatsApp number" />
                <FormInput label="Email Address" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="Enter email address" />
                <FormInput label="Date of Birth" type="date" value={formData.dob} onChange={(e) => handleChange('dob', e.target.value)} />
                <FormInput label="Age" type="number" value={formData.age} onChange={(e) => handleChange('age', e.target.value)} placeholder="Enter age" />
              </div>

              <FormInput label="Address" type="textarea" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} rows={2} placeholder="Enter full address" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Pin Code" value={formData.pinCode} onChange={(e) => handleChange('pinCode', e.target.value)} placeholder="Enter pin code" />
                <FormInput label="Aadhar No" value={formData.aadharNo} onChange={(e) => handleChange('aadharNo', e.target.value)} placeholder="Enter Aadhar number" />
                <FormInput label="PAN No" value={formData.panNo} onChange={(e) => handleChange('panNo', e.target.value)} placeholder="Enter PAN number" />
                {!editingId && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">Agent ID</label>
                    <input type="text" value={(() => {
                      const maxId = agents.length > 0 && agents.some(a => a.agentId) 
                        ? Math.max(...agents.map(a => parseInt(a.agentId) || 100000)) 
                        : 100000;
                      return (maxId + 1).toString();
                    })()} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100" />
                  </div>
                )}
                {editingId && <FormInput label="Agent ID" value={formData.agentId} readOnly />}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">Company Code <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.companyCode}
                      onChange={(e) => handleChange('companyCode', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      placeholder="Enter company code"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleCheckCompanyCode}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Check
                    </button>
                  </div>
                  {companyCodeChecked && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Agents in this company ({companyAgents.length}):</p>
                      {companyAgents.length > 0 ? (
                        <select className="w-full px-3 py-2 border rounded-lg text-sm" size="3">
                          {companyAgents.map((agent, idx) => (
                            <option key={idx} value={agent.agentId}>
                              {agent.name} - {agent.agentId} ({agent.caderRole})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-sm text-gray-500">No agents found in this company</p>
                      )}
                    </div>
                  )}
                </div>
                <FormInput label="Select Cader" type="select" value={formData.caderRole} onChange={(e) => handleChange('caderRole', e.target.value)} options={caderRoles} placeholder="Select cader role" required />
                <FormInput label="Commission %" value={formData.percentage} readOnly placeholder="Auto-calculated" />
                <FormInput label="Agent Dhamaka" type="number" value={formData.agentDhamaka} onChange={(e) => handleChange('agentDhamaka', e.target.value)} placeholder="Enter agent dhamaka" />
                <FormInput label="Registration Dhamaka" type="number" value={formData.registrationDhamaka} onChange={(e) => handleChange('registrationDhamaka', e.target.value)} placeholder="Enter registration dhamaka" />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" variant="primary" icon={UserCheck}>
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

      {/* Details Modal */}
      {showDetailsModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Agent Details - {selectedAgent.name}
              </h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-900">{selectedAgent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mobile</p>
                  <p className="font-semibold text-gray-900">{selectedAgent.mobile}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{selectedAgent.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Agent ID</p>
                  <p className="font-semibold text-gray-900">{selectedAgent.agentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Company Code</p>
                  <p className="font-semibold text-gray-900">{selectedAgent.companyCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cader Role</p>
                  <p className="font-semibold text-gray-900">{selectedAgent.caderRole}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;
