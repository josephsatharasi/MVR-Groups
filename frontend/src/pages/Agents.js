import React, { useState } from 'react';
import { UserCheck, Plus, X, Upload } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { toast } from 'react-toastify';

const Agents = () => {
  const [search, setSearch] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', relationType: '', relation: '', mobile: '', whatsapp: '', email: '',
    dob: '', age: '', address: '', pinCode: '', aadharNo: '',
    panNo: '', agentId: '', companyCode: '999', caderRole: '', agentDhamaka: '', photo: null,
  });

  const [agents, setAgents] = useState([
    { id: 1, name: 'Rajesh Kumar', mobile: '+91 98765 43210', email: 'rajesh@email.com', agentId: '100001', companyCode: '999', caderRole: 'FO' },
    { id: 2, name: 'Priya Sharma', mobile: '+91 98765 43211', email: 'priya@email.com', agentId: '100002', companyCode: '999', caderRole: 'TL' },
  ]);

  const caderRoles = [
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

  const filtered = agents.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.mobile.includes(search) ||
    a.agentId.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setAgents(agents.map(a => a.id === editingId ? { ...formData, id: editingId } : a));
      toast.success('Agent updated successfully!');
    } else {
      const maxAgentId = agents.length > 0 ? Math.max(...agents.map(a => parseInt(a.agentId))) : 100000;
      const newAgentId = (maxAgentId + 1).toString();
      setAgents([...agents, { ...formData, id: Date.now(), agentId: newAgentId }]);
      toast.success(`Agent added successfully! Agent ID: ${newAgentId}`);
    }
    resetForm();
  };

  const handleEdit = (row) => {
    setFormData({ ...row });
    setEditingId(row.id);
    setShowFormModal(true);
  };

  const handleDelete = (row) => {
    setAgents(agents.filter(a => a.id !== row.id));
    toast.success('Agent deleted successfully!');
  };

  const handleRowClick = (row) => {
    setSelectedAgent(row);
    setShowDetailsModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '', relationType: '', relation: '', mobile: '', whatsapp: '', email: '',
      dob: '', age: '', address: '', pinCode: '', aadharNo: '',
      panNo: '', agentId: '', companyCode: '999', caderRole: '', agentDhamaka: '', photo: null,
    });
    setEditingId(null);
    setShowFormModal(false);
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
    } else if (field === 'agentDhamaka') {
      const numericValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [field]: numericValue });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#5F9EA0' }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">Agents</h1>
        <Button variant="primary" icon={Plus} onClick={() => setShowFormModal(true)}>
          Add Agent
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-4">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search agents..." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#2F4F4F' }}>
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
                  <td className="px-4 py-3 text-sm font-semibold" style={{color: '#2F4F4F'}}>{row.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.mobile}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.agentId}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.companyCode}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded text-xs font-semibold" style={{backgroundColor: '#5F9EA0', color: 'white'}}>{row.caderRole}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleEdit(row)} className="px-3 py-1 rounded text-white text-xs" style={{backgroundColor: '#5F9EA0'}}>
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
              <h2 className="text-xl font-bold" style={{ color: '#2F4F4F' }}>
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
                    <label className="block text-sm font-medium mb-2" style={{color: '#2F4F4F'}}>Agent ID</label>
                    <input type="text" value={(() => {
                      const maxId = agents.length > 0 ? Math.max(...agents.map(a => parseInt(a.agentId))) : 100000;
                      return (maxId + 1).toString();
                    })()} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100" />
                  </div>
                )}
                {editingId && <FormInput label="Agent ID" value={formData.agentId} readOnly />}
                <div>
                  <label className="flex items-center gap-2 cursor-not-allowed">
                    <input type="checkbox" checked disabled className="w-4 h-4" />
                    <span className="text-sm font-medium" style={{color: '#2F4F4F'}}>Company Code 999</span>
                  </label>
                </div>
                <FormInput label="Select Cader" type="select" value={formData.caderRole} onChange={(e) => handleChange('caderRole', e.target.value)} options={caderRoles} placeholder="Select cader role" />
                <FormInput label="Agent Dhamaka" type="number" value={formData.agentDhamaka} onChange={(e) => handleChange('agentDhamaka', e.target.value)} placeholder="Enter agent dhamaka" />
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
              <h2 className="text-xl font-bold" style={{ color: '#2F4F4F' }}>
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
