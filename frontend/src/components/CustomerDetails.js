import React, { useState } from 'react';
import { X, User, Phone, MapPin, Home, DollarSign, Edit2, CreditCard } from 'lucide-react';
import { updateCustomer } from '../utils/storage';
import { toast } from 'react-toastify';

const CustomerDetails = ({ customer, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: customer.name || '',
    mobile: customer.phone || customer.mobile || '',
    whatsapp: customer.whatsapp || '',
    address: customer.address || '',
    projectName: customer.projectName || '',
    plotNo: customer.plotNo || '',
    totalAmount: customer.totalAmount || '',
    bookingAmount: customer.bookingAmount || '',
    balanceAmount: customer.balanceAmount || ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateCustomer(customer._id || customer.id, formData);
      toast.success('Customer updated successfully!');
      setIsEditing(false);
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      toast.error('Failed to update customer');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="text-white p-6 flex justify-between items-center" style={{background: '#2F4F4F'}}>
          <h2 className="text-2xl font-bold">{isEditing ? 'Edit Customer' : 'Customer Details'}</h2>
          <div className="flex gap-2">
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors" title="Edit Customer">
                <Edit2 size={24} />
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User className="mt-1" style={{color: '#2F4F4F'}} size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Customer Name</p>
                {isEditing ? (
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                ) : (
                  <p className="font-semibold" style={{color: '#2F4F4F'}}>{customer.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-1" style={{color: '#2F4F4F'}} size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Mobile Number</p>
                {isEditing ? (
                  <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                ) : (
                  <p className="font-semibold" style={{color: '#2F4F4F'}}>{customer.phone || customer.mobile}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-1" style={{color: '#2F4F4F'}} size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">WhatsApp Number</p>
                {isEditing ? (
                  <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                ) : (
                  <p className="font-semibold" style={{color: '#2F4F4F'}}>{customer.whatsapp || '-'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Home className="mt-1" style={{color: '#2F4F4F'}} size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Project Name</p>
                {isEditing ? (
                  <input type="text" name="projectName" value={formData.projectName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                ) : (
                  <p className="font-semibold" style={{color: '#2F4F4F'}}>{customer.projectName || '-'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Home className="mt-1" style={{color: '#2F4F4F'}} size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Plot No</p>
                {isEditing ? (
                  <input type="text" name="plotNo" value={formData.plotNo} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                ) : (
                  <p className="font-semibold" style={{color: '#2F4F4F'}}>{customer.plotNo || '-'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-1" style={{color: '#2F4F4F'}} size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold" style={{color: '#2F4F4F'}}>{customer.location || '-'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="mt-1" style={{color: '#2F4F4F'}} size={20} />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Address</p>
              {isEditing ? (
                <textarea name="address" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" rows="2" />
              ) : (
                <p className="font-semibold" style={{color: '#2F4F4F'}}>{customer.address || '-'}</p>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold mb-4" style={{color: '#2F4F4F'}}>Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <DollarSign className="mt-1" style={{color: '#2F4F4F'}} size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  {isEditing ? (
                    <input type="number" name="totalAmount" value={formData.totalAmount} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                  ) : (
                    <p className="font-semibold text-lg" style={{color: '#2F4F4F'}}>₹{customer.totalAmount || '0'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="mt-1 text-green-600" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Booking Amount</p>
                  {isEditing ? (
                    <input type="number" name="bookingAmount" value={formData.bookingAmount} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                  ) : (
                    <p className="font-semibold text-lg text-green-600">₹{customer.bookingAmount || '0'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="mt-1 text-red-600" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Balance Amount</p>
                  {isEditing ? (
                    <input type="number" name="balanceAmount" value={formData.balanceAmount} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                  ) : (
                    <p className="font-semibold text-lg text-red-600">₹{customer.balanceAmount || '0'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold mb-2" style={{color: '#2F4F4F'}}>Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              <p><span className="font-semibold">Customer ID:</span> #{customer._id || customer.id}</p>
              <p><span className="font-semibold">Aadhar No:</span> {customer.aadharNo || '-'}</p>
              <p><span className="font-semibold">Pin Code:</span> {customer.pinCode || '-'}</p>
              <p><span className="font-semibold">Payment Type:</span> {customer.paymentType || '-'}</p>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 justify-end">
              <button onClick={() => setIsEditing(false)} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} className="px-6 py-2 text-white rounded-lg transition-colors" style={{background: '#2F4F4F'}}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
