import React, { useState, useEffect } from 'react';
import { Trash2, Search, Eye, Plus, X, UserPlus, Download, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { getCustomers, deleteCustomer, addCustomer, getCadres } from '../utils/storage';
import CustomerDetails from '../components/CustomerDetails';
import ConfirmModal from '../components/ConfirmModal';
import { useSearchParams } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Card from '../components/Card';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [searchParams] = useSearchParams();
  const [showFormModal, setShowFormModal] = useState(false);
  const [cadres, setCadres] = useState([]);
  const [cadreValidation, setCadreValidation] = useState({ valid: false, cadre: null, checked: false, percentage: 0 });
  const [formData, setFormData] = useState({
    name: '', relationType: '', relation: '', mobile: '', whatsapp: '',
    dob: '', age: '', address: '', pinCode: '', aadharNo: '', plotNo: '',
    gadhiAnkanamSqft: '', price: '',
    projectName: '', location: '',
    totalAmount: '', bookingAmount: '', balanceAmount: '', paymentType: '', chequeDD: '', chequeNo: '',
    bankName: '', cadreCode: '', bookingDhamaka: '', upiId: '', registrationDhamaka: '',
  });

  useEffect(() => {
    loadCustomers();
    loadCadres();
  }, []);

  const loadCustomers = async () => {
    const data = await getCustomers();
    if (data.length > 0) {
      setCustomers(data);
    }
  };

  const loadCadres = async () => {
    const data = await getCadres();
    setCadres(data);
  };

  const getRolePercentage = (role) => {
    const percentages = {
      'FO': 4, 'TL': 2, 'STL': 1, 'DO': 1,
      'SDO': 1, 'MM': 1, 'SMM': 1, 'GM': 1, 'SGM': 1
    };
    return percentages[role] || 0;
  };

  const formatIndianNumber = (num) => {
    if (!num) return '0';
    const number = parseFloat(num);
    if (isNaN(number)) return '0';
    return number.toLocaleString('en-IN');
  };

  const handleDelete = async () => {
    await deleteCustomer(customerToDelete.id);
    loadCustomers();
    toast.success(`${customerToDelete.name} deleted successfully!`);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCustomer({ ...formData, phone: formData.mobile, agentCode: formData.cadreCode, cadreCode: formData.cadreCode });
      toast.success('Customer added successfully!');
      setShowFormModal(false);
      setFormData({
        name: '', relationType: '', relation: '', mobile: '', whatsapp: '',
        dob: '', age: '', address: '', pinCode: '', aadharNo: '', plotNo: '',
        gadhiAnkanamSqft: '', price: '',
        projectName: '', location: '',
        totalAmount: '', bookingAmount: '', balanceAmount: '', paymentType: '', chequeDD: '', chequeNo: '',
        bankName: '', cadreCode: '', bookingDhamaka: '', upiId: '', registrationDhamaka: '',
      });
      setCadreValidation({ valid: false, cadre: null, checked: false, percentage: 0 });
      loadCustomers();
    } catch (error) {
      toast.error('Failed to add customer');
    }
  };

  const validateCadre = (cadreId) => {
    if (!cadreId || cadreId.length !== 6) {
      setCadreValidation({ valid: false, cadre: null, checked: false, percentage: 0 });
      return;
    }
    const cadre = cadres.find(c => c.cadreId === cadreId);
    if (cadre) {
      const percentage = getRolePercentage(cadre.cadreRole);
      setCadreValidation({ valid: true, cadre, checked: true, percentage });
    } else {
      setCadreValidation({ valid: false, cadre: null, checked: true, percentage: 0 });
    }
  };

  const handleChange = (field, value) => {
    if (field === 'mobile' || field === 'whatsapp') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [field]: numericValue });
    } else if (field === 'aadharNo') {
      const numericValue = value.replace(/\D/g, '').slice(0, 12);
      const formatted = numericValue.match(/.{1,4}/g)?.join(' ') || numericValue;
      setFormData({ ...formData, [field]: formatted });
    } else if (field === 'pinCode') {
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData({ ...formData, [field]: numericValue });
    } else if (field === 'cadreCode') {
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData({ ...formData, [field]: numericValue });
      validateCadre(numericValue);
    } else if (field === 'bookingDhamaka') {
      const numericValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [field]: numericValue });
    } else if (field === 'totalAmount' || field === 'bookingAmount') {
      const newFormData = { ...formData, [field]: value };
      const total = parseFloat(newFormData.totalAmount) || 0;
      const booking = parseFloat(newFormData.bookingAmount) || 0;
      newFormData.balanceAmount = (total - booking).toString();
      setFormData(newFormData);
    } else {
      setFormData({ ...formData, [field]: value });
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
    doc.text('Customers List', 14, 35);
    
    const tableData = customers.map((c, index) => [
      index + 1,
      c.name,
      c.phone || c.mobile,
      c.projectName || '-',
      c.plotNo || '-',
      formatIndianNumber(c.totalAmount),
      formatIndianNumber(c.balanceAmount)
    ]);
    
    autoTable(doc, {
      startY: 42,
      head: [['S.NO', 'Name', 'Phone', 'Project', 'Plot No', 'Total Amount', 'Balance']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [47, 79, 79], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
    });
    
    doc.save('customers-list.pdf');
    toast.success('PDF downloaded successfully!');
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Customers</h1>
        <div className="flex gap-2">
          <Button variant="primary" icon={Plus} onClick={() => setShowFormModal(true)}>
            Add Customer
          </Button>
          <Button variant="secondary" icon={Download} onClick={downloadPDF}>
            Download PDF
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-primary" size={20} />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      <div className="rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="overflow-x-auto overflow-y-auto" style={{maxHeight: '500px'}}>
          <table className="w-full">
            <thead className="text-white sticky top-0 z-10" style={{background: '#1e3a8a'}}>
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Name</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Phone</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden md:table-cell">Cadre ID</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden md:table-cell">Project</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden lg:table-cell">Plot No</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden lg:table-cell">Total Amount</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Balance</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <tr 
                  key={customer.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  style={{backgroundColor: index % 2 !== 0 ? '#f9fafb' : 'white'}}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <td className="px-4 md:px-6 py-4 text-sm font-semibold" style={{color: '#1e3a8a'}}>{customer.name}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{customer.phone || customer.mobile}</td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden md:table-cell">
                    <span className="px-2 py-1 rounded text-xs font-semibold" style={{backgroundColor: '#1e3a8a' + '22', color: '#1e3a8a'}}>{customer.cadreCode || customer.agentCode || '-'}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden md:table-cell">{customer.projectName || '-'}</td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden lg:table-cell">
                    <span className="px-2 py-1 rounded text-xs font-semibold" style={{backgroundColor: '#1e3a8a' + '33', color: '#1e3a8a'}}>{customer.plotNo || '-'}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden lg:table-cell">₹{formatIndianNumber(customer.totalAmount)}</td>
                  <td className="px-4 md:px-6 py-4 text-sm font-semibold" style={{color: customer.balanceAmount > 0 ? '#dc2626' : '#16a34a'}}>₹{formatIndianNumber(customer.balanceAmount)}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(customer);
                        }} 
                        className="hover:scale-110 transition-transform"
                        style={{color: '#1e3a8a'}}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCustomerToDelete({ id: customer._id || customer.id, name: customer.name });
                        }} 
                        className="text-red-500 hover:text-red-700 hover:scale-110 transition-transform"
                        title="Delete Customer"
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
        {filteredCustomers.length === 0 && (
          <div className="text-center py-8 text-gray-500">No customers found</div>
        )}
      </div>

      {selectedCustomer && (
        <CustomerDetails customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} onUpdate={loadCustomers} />
      )}

      <ConfirmModal
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customerToDelete?.name}? This action cannot be undone.`}
      />

      {/* Add Customer Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Add New Customer</h2>
              <button onClick={() => setShowFormModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Name (Mr/Mrs/Ms/Dr)" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required placeholder="Enter full name" />
                <div className="grid grid-cols-2 gap-2">
                  <FormInput label="Relation" type="select" value={formData.relationType} onChange={(e) => handleChange('relationType', e.target.value)} options={['S/o', 'W/o', 'D/o']} placeholder="Select" />
                  <FormInput label="Name" value={formData.relation} onChange={(e) => handleChange('relation', e.target.value)} placeholder="Enter name" />
                </div>
                <FormInput label="Mobile Number" type="tel" value={formData.mobile} onChange={(e) => handleChange('mobile', e.target.value)} required placeholder="Enter mobile number" />
                <FormInput label="WhatsApp Number" type="tel" value={formData.whatsapp} onChange={(e) => handleChange('whatsapp', e.target.value)} placeholder="Enter WhatsApp number" />
                <FormInput label="Date of Birth" type="date" value={formData.dob} onChange={(e) => handleChange('dob', e.target.value)} />
                <FormInput label="Age" type="number" value={formData.age} onChange={(e) => handleChange('age', e.target.value)} placeholder="Enter age" />
              </div>
              <FormInput label="Address" type="textarea" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} rows={2} placeholder="Enter full address" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Pin Code (6 digits)" value={formData.pinCode} onChange={(e) => handleChange('pinCode', e.target.value)} placeholder="Enter 6-digit pin code" maxLength={6} />
                <FormInput label="Aadhar No" value={formData.aadharNo} onChange={(e) => handleChange('aadharNo', e.target.value)} placeholder="Enter Aadhar number" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Plot Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput label="Plot / Flat No" value={formData.plotNo} onChange={(e) => handleChange('plotNo', e.target.value)} placeholder="Plot No" />
                <FormInput label="Gadhi/Ankanam/Sqft" value={formData.gadhiAnkanamSqft} onChange={(e) => handleChange('gadhiAnkanamSqft', e.target.value)} placeholder="Enter area" />
                <FormInput label="Price" type="number" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="Price" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Project Name" value={formData.projectName} onChange={(e) => handleChange('projectName', e.target.value)} placeholder="Enter project name" />
                <FormInput label="Location" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} placeholder="Enter location" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput label="Total Amount" type="number" value={formData.totalAmount} onChange={(e) => handleChange('totalAmount', e.target.value)} placeholder="Enter total amount" required />
                <FormInput label="Booking Amount" type="number" value={formData.bookingAmount} onChange={(e) => handleChange('bookingAmount', e.target.value)} placeholder="Enter booking amount" />
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-800">Pending Amount</label>
                  <input
                    type="number"
                    value={formData.balanceAmount}
                    readOnly
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 font-semibold text-red-600"
                    placeholder="Auto calculated"
                  />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Payment Type" type="select" value={formData.paymentType} onChange={(e) => handleChange('paymentType', e.target.value)} options={['Cash', 'Cheque/DD', 'UPI']} />
                {formData.paymentType === 'Cheque/DD' && (
                  <>
                    <FormInput label="Cheque/DD" value={formData.chequeDD} onChange={(e) => handleChange('chequeDD', e.target.value)} placeholder="Enter cheque/DD details" />
                    <FormInput label="Cheque No" value={formData.chequeNo} onChange={(e) => handleChange('chequeNo', e.target.value)} placeholder="Enter cheque number" />
                    <FormInput label="Name of the Bank" value={formData.bankName} onChange={(e) => handleChange('bankName', e.target.value)} placeholder="Enter bank name" />
                  </>
                )}
                {formData.paymentType === 'UPI' && (
                  <FormInput label="UPI ID" value={formData.upiId} onChange={(e) => handleChange('upiId', e.target.value)} placeholder="Enter UPI ID" />
                )}
                <div>
                  <FormInput label="Cadre ID (6 digits)" value={formData.cadreCode} onChange={(e) => handleChange('cadreCode', e.target.value)} placeholder="Enter 6-digit cadre ID" maxLength={6} />
                  {cadreValidation.checked && (
                    <div className={`mt-1 text-sm flex items-center gap-1 ${cadreValidation.valid ? 'text-green-600' : 'text-red-600'}`}>
                      {cadreValidation.valid ? (
                        <>
                          <CheckCircle size={16} />
                          <span>Cadre Found: {cadreValidation.cadre.name} ({cadreValidation.cadre.cadreRole}) - {cadreValidation.percentage}% Commission</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={16} />
                          <span>Cadre not found in system</span>
                        </>
                      )}
                    </div>
                  )}
                  {cadreValidation.valid && formData.totalAmount && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Commission Calculation:</p>
                      <p className="text-sm font-semibold text-green-700">
                        ₹{formatIndianNumber(formData.totalAmount)} × {cadreValidation.percentage}% = ₹{formatIndianNumber((parseFloat(formData.totalAmount) * cadreValidation.percentage / 100).toFixed(2))}
                      </p>
                    </div>
                  )}
                </div>
                <FormInput label="Booking Dhamaka" type="number" value={formData.bookingDhamaka} onChange={(e) => handleChange('bookingDhamaka', e.target.value)} placeholder="Enter booking dhamaka" />
                <FormInput label="Registration Dhamaka" type="number" value={formData.registrationDhamaka} onChange={(e) => handleChange('registrationDhamaka', e.target.value)} placeholder="Enter registration dhamaka" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" variant="primary" icon={UserPlus}>Add Customer</Button>
                <Button type="button" variant="secondary" onClick={() => setShowFormModal(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
