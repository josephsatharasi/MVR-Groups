import React, { useState, useEffect } from 'react';
import { Users, Plus, Download, Edit, Trash2, X, FileSpreadsheet } from 'lucide-react';
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
  const [teamMembers, setTeamMembers] = useState([]);
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
    introducerId: '',
    companyCode999: false,
  });

  const [caders, setCaders] = useState([]);
  const [companyCodeFilter, setCompanyCodeFilter] = useState('all');
  const [introducerValidation, setIntroducerValidation] = useState({ valid: false, message: '', cadre: null });
  const [cadreToDelete, setCadreToDelete] = useState(null);

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
  const rolePercentages = { FO: 4, TL: 2, STL: 1, DO: 1, SDO: 1, MM: 1, SMM: 1, GM: 1, SGM: 1 };
  
  const getCumulativePercentage = (role) => {
    const roleIndex = roleHierarchy.indexOf(role);
    let total = 0;
    for (let i = 0; i <= roleIndex; i++) {
      total += rolePercentages[roleHierarchy[i]] || 0;
    }
    return total;
  };

  const getAvailableRoles = (recruiterRole) => {
    if (!recruiterRole) return [];
    const recruiterIndex = roleHierarchy.indexOf(recruiterRole);
    return roleOptions.filter((_, index) => index <= recruiterIndex);
  };

  const getAvailableRolesForNew = (introducerRole) => {
    if (!introducerRole) return roleOptions;
    const introducerIndex = roleHierarchy.indexOf(introducerRole);
    return roleOptions.filter((_, index) => index < introducerIndex);
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

  const filtered = caders.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile?.includes(search) ||
      c.cadreId?.includes(search) ||
      c.cadreRole?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCompanyCode = companyCodeFilter === 'all' || 
      (companyCodeFilter === '999' && c.companyCode999 === true) ||
      (companyCodeFilter === 'other' && c.companyCode999 !== true);
    
    return matchesSearch && matchesCompanyCode;
  });

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
      introducerId: row.introducerId || '',
      companyCode999: row.companyCode999 || false,
    });
    setEditingId(row._id);
    setShowFormModal(true);
    if (row.introducerId) {
      validateIntroducerId(row.introducerId);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/cadres/${cadreToDelete.id}`);
      toast.success(`${cadreToDelete.name} deleted successfully!`);
      fetchCadres();
      setCadreToDelete(null);
    } catch (error) {
      toast.error('Failed to delete cadre');
      console.error(error);
    }
  };

  const handleRowClick = async (row) => {
    setSelectedCader(row);
    setShowDetailsModal(true);
    
    try {
      const response = await axios.get(`${API_URL}/customers`);
      const customers = response.data;
      
      // Helper function to get total paid amount
      const getTotalPaid = (customerId) => {
        const paymentHistory = JSON.parse(localStorage.getItem(`payment_history_${customerId}`) || '[]');
        return paymentHistory.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
      };
      
      // Get all team members recursively
      const getTeamMembers = (cadreId, level = 0) => {
        const directMembers = caders.filter(c => c.introducerId === cadreId);
        let allMembers = directMembers.map(m => ({ ...m, level }));
        directMembers.forEach(member => {
          allMembers = [...allMembers, ...getTeamMembers(member.cadreId, level + 1)];
        });
        return allMembers;
      };
      
      const team = getTeamMembers(row.cadreId);
      setTeamMembers(team);
      
      const allTeamIds = [row.cadreId, ...team.map(m => m.cadreId)];
      const linked = customers.filter(c => allTeamIds.includes(c.cadreCode) || allTeamIds.includes(c.agentCode));
      setLinkedCustomers(linked);
      
      const percentages = { FO: 4, TL: 2, STL: 1, DO: 1, SDO: 1, MM: 1, SMM: 1, GM: 1, SGM: 1 };
      const cumulativePercentage = getCumulativePercentage(row.cadreRole);
      const roleHierarchy = ['FO', 'TL', 'STL', 'DO', 'SDO', 'MM', 'SMM', 'GM', 'SGM'];
      
      // Calculate own earnings based on PAID AMOUNT
      const ownCustomers = customers.filter(c => c.cadreCode === row.cadreId || c.agentCode === row.cadreId);
      const ownEarnings = ownCustomers.reduce((sum, customer) => {
        const paidAmount = getTotalPaid(customer._id || customer.id);
        return sum + (paidAmount * cumulativePercentage / 100);
      }, 0);
      
      // Calculate team earnings based on PAID AMOUNT
      const teamEarnings = team.reduce((sum, member) => {
        const memberCustomers = customers.filter(c => c.cadreCode === member.cadreId || c.agentCode === member.cadreId);
        const memberCumulativePercentage = getCumulativePercentage(member.cadreRole);
        const mySharePercentage = cumulativePercentage - memberCumulativePercentage;
        
        return sum + memberCustomers.reduce((mSum, customer) => {
          const paidAmount = getTotalPaid(customer._id || customer.id);
          return mSum + (paidAmount * mySharePercentage / 100);
        }, 0);
      }, 0);
      
      setTotalCommission(ownEarnings + teamEarnings);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      setLinkedCustomers([]);
      setTotalCommission(0);
      setTeamMembers([]);
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

  const formatIndianNumber = (num) => {
    if (!num) return '0';
    const number = parseFloat(num);
    if (isNaN(number)) return '0';
    return number.toLocaleString('en-IN');
  };

  const downloadCadreExcel = () => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    // Company Header
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('MVR Groups', 148, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Real Estate Management', 148, 21, { align: 'center' });
    
    // Title
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text(`Caders Report - ${selectedCader.name}`, 10, 32);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(`Caders ID: ${selectedCader.cadreId} | Role: ${getRoleFullName(selectedCader.cadreRole)}`, 10, 38);
    
    const getTotalPaid = (customerId) => {
      const paymentHistory = JSON.parse(localStorage.getItem(`payment_history_${customerId}`) || '[]');
      return paymentHistory.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    };
    
    // Main cadre data
    const mainCadreCustomers = linkedCustomers.filter(c => 
      c.cadreCode === selectedCader.cadreId || c.agentCode === selectedCader.cadreId
    );
    const mainDirectBusiness = mainCadreCustomers.reduce((sum, c) => sum + getTotalPaid(c._id || c.id), 0);
    
    // Calculate total business from all team members
    const allTeamBusiness = teamMembers.reduce((sum, member) => {
      const memberCustomers = linkedCustomers.filter(c => 
        c.cadreCode === member.cadreId || c.agentCode === member.cadreId
      );
      return sum + memberCustomers.reduce((mSum, c) => mSum + getTotalPaid(c._id || c.id), 0);
    }, 0);
    
    const totalBusiness = mainDirectBusiness + allTeamBusiness;
    const mainCommission = totalBusiness * getCumulativePercentage(selectedCader.cadreRole) / 100;
    const mainRecruits = caders.filter(c => c.introducerId === selectedCader.cadreId).length;
    
    const tableData = [];
    
    // Main cadre row
    tableData.push([
      '1',
      selectedCader.cadreId,
      selectedCader.name,
      selectedCader.mobile,
      selectedCader.introducerId || '-',
      getRoleFullName(selectedCader.cadreRole),
      mainRecruits.toString(),
      teamMembers.length.toString(),
      formatIndianNumber(mainDirectBusiness),
      formatIndianNumber(mainCommission.toFixed(2)),
      mainCadreCustomers.length > 0 ? (() => {
        const lastCustomer = mainCadreCustomers[mainCadreCustomers.length - 1];
        const paymentHistory = JSON.parse(localStorage.getItem(`payment_history_${lastCustomer._id || lastCustomer.id}`) || '[]');
        return paymentHistory.length > 0 ? new Date(paymentHistory[paymentHistory.length - 1].date).toLocaleDateString('en-IN') : '-';
      })() : '-'
    ]);
    
    // Team members rows
    teamMembers.forEach((member, idx) => {
      const memberCustomers = linkedCustomers.filter(c => 
        c.cadreCode === member.cadreId || c.agentCode === member.cadreId
      );
      const directBusiness = memberCustomers.reduce((sum, c) => sum + getTotalPaid(c._id || c.id), 0);
      
      // Get all sub-team members under this member
      const getSubTeam = (cadreId) => {
        const direct = teamMembers.filter(m => m.introducerId === cadreId);
        let all = [...direct];
        direct.forEach(m => {
          all = [...all, ...getSubTeam(m.cadreId)];
        });
        return all;
      };
      
      const subTeam = getSubTeam(member.cadreId);
      const subTeamBusiness = subTeam.reduce((sum, subMember) => {
        const subCustomers = linkedCustomers.filter(c => 
          c.cadreCode === subMember.cadreId || c.agentCode === subMember.cadreId
        );
        return sum + subCustomers.reduce((sSum, c) => sSum + getTotalPaid(c._id || c.id), 0);
      }, 0);
      
      const totalMemberBusiness = directBusiness + subTeamBusiness;
      const memberCumulativePercentage = getCumulativePercentage(member.cadreRole);
      const memberCommission = totalMemberBusiness * memberCumulativePercentage / 100;
      const memberRecruits = caders.filter(c => c.introducerId === member.cadreId).length;
      
      // Get last payment date for this member's customers
      const lastPaymentDate = memberCustomers.length > 0 ? (() => {
        const lastCustomer = memberCustomers[memberCustomers.length - 1];
        const paymentHistory = JSON.parse(localStorage.getItem(`payment_history_${lastCustomer._id || lastCustomer.id}`) || '[]');
        return paymentHistory.length > 0 ? new Date(paymentHistory[paymentHistory.length - 1].date).toLocaleDateString('en-IN') : '-';
      })() : '-';
      
      tableData.push([
        (idx + 2).toString(),
        member.cadreId,
        member.name,
        member.mobile,
        member.introducerId || '-',
        getRoleFullName(member.cadreRole),
        memberRecruits.toString(),
        subTeam.length.toString(),
        formatIndianNumber(directBusiness),
        formatIndianNumber(memberCommission.toFixed(2)),
        lastPaymentDate
      ]);
    });
    
    autoTable(doc, {
      startY: 44,
      head: [['Level', 'Code', 'Agent', 'Contact', 'Introducer', 'Caders', 'Recruits', 'Team', 'Direct', 'Commission', 'Released Date']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [30, 58, 138], 
        textColor: 255, 
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        fontSize: 8
      },
      styles: { 
        fontSize: 7, 
        cellPadding: 2,
        valign: 'middle',
        lineColor: [200, 200, 200],
        lineWidth: 0.1
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 18, halign: 'center' },
        2: { cellWidth: 28, halign: 'left' },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 20, halign: 'center' },
        5: { cellWidth: 45, halign: 'left' },
        6: { cellWidth: 16, halign: 'center' },
        7: { cellWidth: 14, halign: 'center' },
        8: { cellWidth: 24, halign: 'right' },
        9: { cellWidth: 26, halign: 'right' },
        10: { cellWidth: 24, halign: 'center' }
      },
      margin: { left: 7, right: 7 },
      tableWidth: 'auto'
    });
    
    doc.save(`cadre-${selectedCader.name}-${selectedCader.cadreId}.pdf`);
    toast.success('PDF downloaded successfully!');
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
      introducerId: '',
      companyCode999: false,
    });
    setEditingId(null);
    setShowFormModal(false);
    setIntroducerValidation({ valid: false, message: '', cadre: null });
  };

  const validateIntroducerId = (id) => {
    if (!id) {
      setIntroducerValidation({ valid: false, message: '', cadre: null });
      return;
    }
    const foundCadre = caders.find(c => c.cadreId === id);
    if (foundCadre) {
      setIntroducerValidation({ 
        valid: true, 
        message: `${foundCadre.name} - ${getRoleFullName(foundCadre.cadreRole)}`, 
        cadre: foundCadre 
      });
      setFormData(prev => ({ ...prev, cadreRole: '' }));
    } else {
      setIntroducerValidation({ valid: false, message: 'ID not matched', cadre: null });
    }
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
    doc.text('Caders List', 14, 35);
    
    const tableData = caders.map((c, index) => [
      index + 1,
      c.name,
      c.mobile,
      getRoleFullName(c.cadreRole),
      c.address || '-'
    ]);
    
    autoTable(doc, {
      startY: 42,
      head: [['S.NO', 'Name', 'Mobile', 'Caders Role', 'Address']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
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
        <div className="mb-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="flex-1">
            <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search caders..." />
          </div>
          <div className="w-full md:w-auto">
            <select 
              value={companyCodeFilter} 
              onChange={(e) => setCompanyCodeFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white"
            >
              <option value="all">All Caders</option>
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
                        onClick={() => setCadreToDelete({ id: row._id, name: row.name })}
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
                  label="Introducer ID"
                  value={formData.introducerId}
                  onChange={(e) => {
                    setFormData({ ...formData, introducerId: e.target.value });
                    validateIntroducerId(e.target.value);
                  }}
                  placeholder="Enter introducer caders ID"
                />
                {formData.introducerId && (
                  <div className={`text-sm mt-1 ${introducerValidation.valid ? 'text-green-600' : 'text-red-600'}`}>
                    {introducerValidation.valid ? '✓ ' : '✗ '}{introducerValidation.message}
                  </div>
                )}
                <FormInput
                  label="Caders Role"
                  type="select"
                  value={formData.cadreRole}
                  onChange={(e) => setFormData({ ...formData, cadreRole: e.target.value })}
                  options={introducerValidation.cadre ? getAvailableRolesForNew(introducerValidation.cadre.cadreRole) : roleOptions}
                  placeholder="Select role"
                />
                {!editingId && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">Caders ID</label>
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
                    <label className="block text-sm font-medium mb-2 text-gray-800">Caders ID</label>
                    <input
                      type="text"
                      value={formData.cadreId}
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
                  <p className="font-semibold text-gray-900">{getCumulativePercentage(selectedCader.cadreRole)}%</p>
                </div>
              </div>

              <div className="border-t pt-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Recruitment Hierarchy & Commission</h3>
                  <button 
                    onClick={downloadCadreExcel}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-2"
                  >
                    <Download size={16} /> Download PDF
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">Team members under this caders with cumulative commission percentages:</p>
                
                {teamMembers.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {(() => {
                      const percentages = { FO: 4, TL: 2, STL: 1, DO: 1, SDO: 1, MM: 1, SMM: 1, GM: 1, SGM: 1 };
                      const currentCumulativePercentage = getCumulativePercentage(selectedCader.cadreRole);
                      
                      return teamMembers.map((member, idx) => {
                        const memberPercentage = percentages[member.cadreRole] || 0;
                        const indent = member.level * 20;
                        
                        // Calculate cumulative percentage from FO to current role
                        const chainPercentage = getCumulativePercentage(selectedCader.cadreRole);
                        
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200" style={{ marginLeft: `${indent}px` }}>
                            <div>
                              <span className="font-medium text-gray-800">{member.name}</span>
                              <span className="text-xs text-gray-600 ml-2">({getRoleFullName(member.cadreRole)})</span>
                              <span className="text-xs text-blue-600 ml-2">ID: {member.cadreId}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-blue-700">
                                Chain Total: {chainPercentage}%
                              </div>
                              <div className="text-xs text-gray-600">All roles in chain</div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
                
                {teamMembers.length === 0 && (
                  <div className="text-center py-4 bg-gray-50 rounded-lg mb-4">
                    <p className="text-gray-500 text-sm">No team members yet</p>
                  </div>
                )}
                
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Total Commission from all team sales</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-2xl text-green-600">₹{formatIndianNumber(totalCommission.toFixed(2))}</span>
                  </div>
                </div>

                {linkedCustomers.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">All Customers ({linkedCustomers.length}):</p>
                    <div className="max-h-60 overflow-y-auto border rounded-lg">
                      <table className="w-full">
                        <thead className="bg-blue-50 sticky top-0">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Name</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Project</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Total Amount</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Paid Amount</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Balance</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Commission</th>
                            <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Released Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {linkedCustomers.map((customer, idx) => {
                            const totalAmount = parseFloat(customer.totalAmount) || 0;
                            const getTotalPaid = (customerId) => {
                              const paymentHistory = JSON.parse(localStorage.getItem(`payment_history_${customerId}`) || '[]');
                              return paymentHistory.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                            };
                            const paidAmount = getTotalPaid(customer._id || customer.id);
                            const balance = totalAmount - paidAmount;
                            
                            // Get last payment date
                            const paymentHistory = JSON.parse(localStorage.getItem(`payment_history_${customer._id || customer.id}`) || '[]');
                            const lastPaymentDate = paymentHistory.length > 0 
                              ? new Date(paymentHistory[paymentHistory.length - 1].date).toLocaleDateString('en-IN')
                              : '-';
                            
                            const sellerCadreId = customer.cadreCode || customer.agentCode;
                            const cumulativePercentage = getCumulativePercentage(selectedCader.cadreRole);
                            let commission = 0;
                            
                            if (sellerCadreId === selectedCader.cadreId) {
                              commission = paidAmount * cumulativePercentage / 100;
                            } else {
                              const sellerCadre = caders.find(c => c.cadreId === sellerCadreId);
                              const sellerPercentage = sellerCadre ? getCumulativePercentage(sellerCadre.cadreRole) : 0;
                              const myShare = cumulativePercentage - sellerPercentage;
                              commission = paidAmount * myShare / 100;
                            }
                            
                            return (
                              <tr key={idx} className="border-b hover:bg-gray-50">
                                <td className="px-3 py-2 text-sm">{customer.name}</td>
                                <td className="px-3 py-2 text-sm">{customer.projectName || '-'}</td>
                                <td className="px-3 py-2 text-sm text-right">₹{totalAmount.toLocaleString('en-IN')}</td>
                                <td className="px-3 py-2 text-sm text-right font-semibold text-green-600">₹{paidAmount.toLocaleString('en-IN')}</td>
                                <td className="px-3 py-2 text-sm text-right font-semibold text-red-600">₹{balance.toLocaleString('en-IN')}</td>
                                <td className="px-3 py-2 text-sm text-right font-semibold text-green-600">₹{commission.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                <td className="px-3 py-2 text-sm text-center text-gray-700">{lastPaymentDate}</td>
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
                <p className="text-sm text-gray-600 mb-2">Based on role: {getRoleFullName(selectedCader.cadreRole)} - {getCumulativePercentage(selectedCader.cadreRole)}%</p>
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

      <ConfirmModal
        isOpen={!!cadreToDelete}
        onClose={() => setCadreToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Cadre"
        message={`Are you sure you want to delete ${cadreToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Caders;
