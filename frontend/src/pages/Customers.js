import React, { useState, useEffect } from 'react';
import { Trash2, Search, Eye, Plus, X, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';
import { getCustomers, deleteCustomer, addCustomer } from '../utils/storage';
import CustomerDetails from '../components/CustomerDetails';
import ConfirmModal from '../components/ConfirmModal';
import { useSearchParams } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Card from '../components/Card';

const Customers = () => {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Rajesh Kumar', phone: '9876543210', mobile: '9876543210', projectName: 'Green Valley', plotNo: 'A-101', totalAmount: '5000000', balanceAmount: '1500000', bookingAmount: '3500000' },
    { id: 2, name: 'Priya Sharma', phone: '9123456789', mobile: '9123456789', projectName: 'Sunrise Heights', plotNo: 'B-205', totalAmount: '7500000', balanceAmount: '2000000', bookingAmount: '5500000' },
    { id: 3, name: 'Amit Patel', phone: '9988776655', mobile: '9988776655', projectName: 'Royal Gardens', plotNo: 'C-310', totalAmount: '4500000', balanceAmount: '0', bookingAmount: '4500000' },
    { id: 4, name: 'Sneha Reddy', phone: '9876512345', mobile: '9876512345', projectName: 'Palm Residency', plotNo: 'D-150', totalAmount: '6000000', balanceAmount: '3000000', bookingAmount: '3000000' },
    { id: 5, name: 'Vikram Singh', phone: '9123498765', mobile: '9123498765', projectName: 'Green Valley', plotNo: 'A-220', totalAmount: '5500000', balanceAmount: '500000', bookingAmount: '5000000' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [searchParams] = useSearchParams();
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', relationType: '', relation: '', mobile: '', whatsapp: '',
    dob: '', age: '', address: '', pinCode: '', aadharNo: '', plotNo: '',
    gadhiAnkanamSqft: '', price: '',
    projectName: '', location: '',
    totalAmount: '', bookingAmount: '', balanceAmount: '', paymentType: '', chequeDD: '', chequeNo: '',
    bankName: '', agentCode: '', bookingDhamaka: '',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await getCustomers();
    if (data.length > 0) {
      setCustomers(data);
    }
  };

  const handleDelete = async () => {
    await deleteCustomer(customerToDelete.id);
    loadCustomers();
    toast.success(`${customerToDelete.name} deleted successfully!`);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCustomer({ ...formData, phone: formData.mobile });
      toast.success('Customer added successfully!');
      setShowFormModal(false);
      setFormData({
        name: '', relationType: '', relation: '', mobile: '', whatsapp: '',
        dob: '', age: '', address: '', pinCode: '', aadharNo: '', plotNo: '',
        gadhiAnkanamSqft: '', price: '',
        projectName: '', location: '',
        totalAmount: '', bookingAmount: '', balanceAmount: '', paymentType: '', chequeDD: '', chequeNo: '',
        bankName: '', agentCode: '', bookingDhamaka: '',
      });
      loadCustomers();
    } catch (error) {
      toast.error('Failed to add customer');
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


  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (searchParams.get('filter') === 'expired') {
      const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const [year, month, day] = dateStr.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      };
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const serviceDate = c.serviceDate ? parseDate(c.serviceDate) : new Date(c.createdAt);
      const expireDate = new Date(serviceDate);
      expireDate.setMonth(expireDate.getMonth() + parseInt(c.service || 0));
      expireDate.setHours(0, 0, 0, 0);
      
      const isExpired = expireDate < today;
      return matchesSearch && isExpired;
    }
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#5F9EA0' }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Customers</h1>
        <Button variant="primary" icon={Plus} onClick={() => setShowFormModal(true)}>
          Add Customer
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-white" size={20} />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white shadow-sm"
          />
        </div>
      </div>

      <div className="rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="overflow-x-auto overflow-y-auto" style={{maxHeight: '500px'}}>
          <table className="w-full">
            <thead className="text-white sticky top-0 z-10" style={{background: '#2F4F4F'}}>
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Name</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Phone</th>
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
                  <td className="px-4 md:px-6 py-4 text-sm font-semibold" style={{color: '#2F4F4F'}}>{customer.name}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{customer.phone || customer.mobile}</td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden md:table-cell">{customer.projectName || '-'}</td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden lg:table-cell">
                    <span className="px-2 py-1 rounded text-xs font-semibold" style={{backgroundColor: '#5F9EA0', color: 'white'}}>{customer.plotNo || '-'}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden lg:table-cell">₹{customer.totalAmount || '0'}</td>
                  <td className="px-4 md:px-6 py-4 text-sm font-semibold" style={{color: customer.balanceAmount > 0 ? '#dc2626' : '#16a34a'}}>₹{customer.balanceAmount || '0'}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(customer);
                        }} 
                        className="hover:scale-110 transition-transform"
                        style={{color: '#5F9EA0'}}
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
              <h2 className="text-xl font-bold" style={{ color: '#2F4F4F' }}>Add New Customer</h2>
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
                <FormInput label="Pin Code" value={formData.pinCode} onChange={(e) => handleChange('pinCode', e.target.value)} placeholder="Enter pin code" />
                <FormInput label="Aadhar No" value={formData.aadharNo} onChange={(e) => handleChange('aadharNo', e.target.value)} placeholder="Enter Aadhar number" />
              </div>
              <h3 className="text-lg font-bold" style={{ color: '#2F4F4F' }}>Plot Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput label="Plot / Flat No" value={formData.plotNo} onChange={(e) => handleChange('plotNo', e.target.value)} placeholder="Plot No" />
                <FormInput label="Gadhi/Ankanam/Sqft" value={formData.gadhiAnkanamSqft} onChange={(e) => handleChange('gadhiAnkanamSqft', e.target.value)} placeholder="Enter area" />
                <FormInput label="Price" type="number" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="Price" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Project Name" value={formData.projectName} onChange={(e) => handleChange('projectName', e.target.value)} placeholder="Enter project name" />
                <FormInput label="Location" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} placeholder="Enter location" />
                <FormInput label="Booking Amount" type="number" value={formData.bookingAmount} onChange={(e) => handleChange('bookingAmount', e.target.value)} placeholder="Enter booking amount" />
                <FormInput label="Total Amount" type="number" value={formData.totalAmount} onChange={(e) => handleChange('totalAmount', e.target.value)} placeholder="Enter total amount" />
                <FormInput label="Balance Amount" type="number" value={formData.balanceAmount} readOnly placeholder="Auto calculated" />
              </div>
              <h3 className="text-lg font-bold" style={{ color: '#2F4F4F' }}>Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Payment Type" type="select" value={formData.paymentType} onChange={(e) => handleChange('paymentType', e.target.value)} options={['Cash', 'Cheque/DD']} />
                {formData.paymentType === 'Cheque/DD' && (
                  <>
                    <FormInput label="Cheque/DD" value={formData.chequeDD} onChange={(e) => handleChange('chequeDD', e.target.value)} placeholder="Enter cheque/DD details" />
                    <FormInput label="Cheque No" value={formData.chequeNo} onChange={(e) => handleChange('chequeNo', e.target.value)} placeholder="Enter cheque number" />
                    <FormInput label="Name of the Bank" value={formData.bankName} onChange={(e) => handleChange('bankName', e.target.value)} placeholder="Enter bank name" />
                  </>
                )}
                <FormInput label="Agent ID" value={formData.agentCode} onChange={(e) => handleChange('agentCode', e.target.value)} placeholder="Enter 6-digit agent ID" />
                <FormInput label="Booking Dhamaka" type="number" value={formData.bookingDhamaka} onChange={(e) => handleChange('bookingDhamaka', e.target.value)} placeholder="Enter booking dhamaka" />
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
