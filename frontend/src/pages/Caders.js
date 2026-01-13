import React, { useState } from 'react';
import { Users, Plus, Download, Edit, Trash2, X } from 'lucide-react';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    role: '',
    email: '',
    contact: '',
    percentage: '',
    recruiterRole: '',
  });

  const [caders, setCaders] = useState([
    { id: 1, username: 'Rahul Sharma', role: 'FO', email: 'rahul@email.com', contact: '+91 98765 43210', percentage: 4, history: [
      { date: '2024-01-15', action: 'Created', details: 'Initial registration' },
      { date: '2024-02-10', action: 'Updated', details: 'Percentage changed from 3% to 4%' },
    ]},
    { id: 2, username: 'Priya Patel', role: 'TL', email: 'priya@email.com', contact: '+91 98765 43211', percentage: 2, history: [
      { date: '2024-01-20', action: 'Created', details: 'Initial registration' },
    ]},
    { id: 3, username: 'Amit Kumar', role: 'STL', email: 'amit@email.com', contact: '+91 98765 43212', percentage: 1, history: [
      { date: '2024-01-25', action: 'Created', details: 'Initial registration' },
    ]},
    { id: 4, username: 'Sneha Reddy', role: 'DO', email: 'sneha@email.com', contact: '+91 98765 43213', percentage: 1, history: [
      { date: '2024-02-01', action: 'Created', details: 'Initial registration' },
    ]},
    { id: 5, username: 'Vikram Singh', role: 'SDO', email: 'vikram@email.com', contact: '+91 98765 43214', percentage: 1, history: [
      { date: '2024-02-05', action: 'Created', details: 'Initial registration' },
    ]},
    { id: 6, username: 'Anjali Verma', role: 'MM', email: 'anjali@email.com', contact: '+91 98765 43215', percentage: 1, history: [
      { date: '2024-02-10', action: 'Created', details: 'Initial registration' },
    ]},
    { id: 7, username: 'Karan Mehta', role: 'SMM', email: 'karan@email.com', contact: '+91 98765 43216', percentage: 1, history: [
      { date: '2024-02-15', action: 'Created', details: 'Initial registration' },
    ]},
    { id: 8, username: 'Joseph Thomas', role: 'GM', email: 'joseph@email.com', contact: '+91 98765 43217', percentage: 1, history: [
      { date: '2024-02-20', action: 'Created', details: 'Initial registration' },
    ]},
    { id: 9, username: 'Ravi Gupta', role: 'SGM', email: 'ravi@email.com', contact: '+91 98765 43218', percentage: 1, history: [
      { date: '2024-02-25', action: 'Created', details: 'Initial registration' },
    ]},
  ]);

  const roleHierarchy = ['FO', 'TL', 'STL', 'DO', 'SDO', 'MM', 'SMM', 'GM', 'SGM'];

  const getAvailableRoles = (recruiterRole) => {
    if (!recruiterRole) return [];
    const recruiterIndex = roleHierarchy.indexOf(recruiterRole);
    return roleOptions.filter((_, index) => index <= recruiterIndex);
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
    c.username.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.contact.includes(search) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setCaders(caders.map(c => c.id === editingId ? { ...formData, id: editingId, history: [...c.history, { date: new Date().toISOString().split('T')[0], action: 'Updated', details: 'Profile updated' }] } : c));
      toast.success('Cader updated successfully!');
    } else {
      setCaders([...caders, { ...formData, id: Date.now(), history: [{ date: new Date().toISOString().split('T')[0], action: 'Created', details: 'Initial registration' }] }]);
      toast.success('Cader added successfully!');
    }
    resetForm();
  };

  const handleEdit = (row) => {
    setFormData({ username: row.username, role: row.role, email: row.email, contact: row.contact, percentage: row.percentage });
    setEditingId(row.id);
    setShowFormModal(true);
  };

  const handleDelete = (row) => {
    setCaders(caders.filter(c => c.id !== row.id));
    toast.success('Cader deleted successfully!');
  };

  const handleRowClick = (row) => {
    setSelectedCader(row);
    setShowDetailsModal(true);
  };

  const handleRecruitSubmit = (e) => {
    e.preventDefault();
    const newCader = {
      ...recruitFormData,
      id: Date.now(),
      history: [
        { date: new Date().toISOString().split('T')[0], action: 'Created', details: `Recruited by ${selectedCader.username} (${selectedCader.role})` }
      ]
    };
    setCaders([...caders, newCader]);
    toast.success(`${recruitFormData.username} recruited successfully!`);
    setShowRecruitModal(false);
    setRecruitFormData({ username: '', role: '', email: '', contact: '', percentage: '' });
  };

  const resetForm = () => {
    setFormData({ username: '', role: '', email: '', contact: '', percentage: '', recruiterRole: '' });
    setEditingId(null);
    setShowFormModal(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Caders List', 14, 20);
    
    const tableData = caders.map((c, index) => [
      index + 1,
      getRoleFullName(c.role),
      `${c.percentage}%`
    ]);
    
    autoTable(doc, {
      startY: 30,
      head: [['S.NO', 'CADER NAME', 'PERCENTAGE %']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [47, 79, 79], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: {
        0: { halign: 'center', cellWidth: 20 },
        1: { halign: 'left', cellWidth: 130 },
        2: { halign: 'center', cellWidth: 40 }
      }
    });
    
    doc.save('caders-list.pdf');
    toast.success('PDF downloaded successfully!');
  };

  const columns = [
    { header: 'Username', field: 'username', render: (row) => (
      <span className="font-semibold">{row.username} ({row.role})</span>
    )},
    { header: 'Role', field: 'role', render: (row) => getRoleFullName(row.role) },
    { header: 'Email', field: 'email' },
    { header: 'Contact', field: 'contact' },
    { header: 'Percentage', field: 'percentage', render: (row) => (
      <div className="flex items-center gap-2">
        <div className="w-24 bg-gray-200 rounded-full h-2">
          <div className="h-2 rounded-full" style={{ width: `${row.percentage}%`, backgroundColor: '#2C7A7B' }}></div>
        </div>
        <span className="text-sm font-semibold">{row.percentage}%</span>
      </div>
    )},
  ];

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#5F9EA0' }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">Caders List</h1>
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
            <thead style={{ backgroundColor: '#2F4F4F' }}>
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
              <h2 className="text-xl font-bold" style={{ color: '#2F4F4F' }}>
                {editingId ? 'Edit Cader' : 'Add New Cader'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Recruiter Role"
                  type="select"
                  value={formData.recruiterRole}
                  onChange={(e) => setFormData({ ...formData, recruiterRole: e.target.value, role: '' })}
                  options={roleOptions}
                  required
                />
                <FormInput
                  label="Role"
                  type="select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  options={getAvailableRoles(formData.recruiterRole)}
                  required
                  disabled={!formData.recruiterRole}
                />
                <FormInput
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  placeholder="Enter username"
                />
                <FormInput
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="Enter email"
                />
                <FormInput
                  label="Contact"
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
                  placeholder="Enter contact"
                />
                <FormInput
                  label="Percentage"
                  type="number"
                  value={formData.percentage}
                  onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                  required
                  placeholder="Enter percentage (0-100)"
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

      {/* Details Modal */}
      {showDetailsModal && selectedCader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold" style={{ color: '#2F4F4F' }}>
                Cader Details - {selectedCader.username}
              </h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Username</p>
                  <p className="font-semibold text-gray-900">{selectedCader.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-semibold text-gray-900">{getRoleFullName(selectedCader.role)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{selectedCader.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-semibold text-gray-900">{selectedCader.contact}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Percentage</p>
                  <p className="font-semibold text-gray-900">{selectedCader.percentage}%</p>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold" style={{ color: '#2F4F4F' }}>Recruitment Hierarchy & Commission</h3>
                  <button
                    onClick={() => setShowRecruitModal(true)}
                    className="px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90" style={{ backgroundColor: '#2F4F4F' }}
                  >
                    + Recruit Team Member
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">This {selectedCader.role} can recruit the following positions with their commission percentages:</p>
                <div className="space-y-2">
                  {(() => {
                    const currentIndex = roleHierarchy.indexOf(selectedCader.role);
                    return caders.filter((_, idx) => idx <= currentIndex).map((cader, idx) => {
                      const roleData = roleOptions.find(r => r.value === cader.role);
                      return (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: cader.role === selectedCader.role ? '#2F4F4F' : '#5F9EA0' }}>
                          <span className="text-white font-medium">{roleData?.label || cader.role}</span>
                          <span className="text-white font-bold">{cader.percentage}%</span>
                        </div>
                      );
                    });
                  })()}
                </div>
                <div className="mt-4 bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <p className="text-sm text-gray-600 mb-2">Total Commission Distribution (Example: ₹10,000 booking)</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-xl text-green-600">
                      ₹{(() => {
                        const currentIndex = roleHierarchy.indexOf(selectedCader.role);
                        const total = caders.filter((_, idx) => idx <= currentIndex).reduce((sum, c) => sum + (10000 * c.percentage / 100), 0);
                        return total.toFixed(2);
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <h3 className="text-lg font-bold mb-4" style={{ color: '#2F4F4F' }}>Commission Calculation</h3>
                <p className="text-sm text-gray-600 mb-4">Based on role: {getRoleFullName(selectedCader.role)} - {selectedCader.percentage}%</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Example: If booking amount is ₹10,000</p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Commission:</span>
                    <span className="font-bold text-lg" style={{ color: '#2F4F4F' }}>₹{(10000 * selectedCader.percentage / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-bold mb-4" style={{ color: '#2F4F4F' }}>Activity History</h3>
                <div className="space-y-3">
                  {selectedCader.history?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2C7A7B' }}>
                          <span className="text-white text-xs font-bold">{idx + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900">{item.action}</p>
                          <p className="text-xs text-gray-500">{item.date}</p>
                        </div>
                        <p className="text-sm text-gray-600">{item.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
              <h2 className="text-xl font-bold" style={{ color: '#2F4F4F' }}>
                Recruit Team Member
              </h2>
              <button onClick={() => setShowRecruitModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleRecruitSubmit} className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600">Recruiting as: <span className="font-semibold" style={{ color: '#2F4F4F' }}>{selectedCader.username} ({getRoleFullName(selectedCader.role)})</span></p>
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
