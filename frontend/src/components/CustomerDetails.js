import React from 'react';
import { X, Calendar, User, Phone, Mail, MapPin, Package } from 'lucide-react';
import { getDaysUntilExpiry } from '../utils/storage';

const CustomerDetails = ({ customer, onClose }) => {
  const daysLeft = getDaysUntilExpiry(customer.endDate);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Customer Details</h2>
          <button onClick={onClose} className="hover:bg-blue-700 p-2 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <User className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Customer Name</p>
                <p className="font-semibold text-blue-900">{customer.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="font-semibold text-blue-900">{customer.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-blue-900">{customer.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="text-blue-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Partner</p>
                <p className="font-semibold text-blue-900">{customer.partnerName}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="text-blue-600 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-semibold text-blue-900">{customer.address}</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3">Subscription Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Plan Duration</p>
                <p className="font-semibold text-blue-900">{customer.plan} Months</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-semibold text-green-600 text-xl">₹{customer.amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-semibold text-blue-900">{customer.startDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-semibold text-blue-900">{customer.endDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-300">
            <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
              <Calendar size={20} />
              Subscription Status
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Days Remaining:</span>
                <span className={`font-bold ${daysLeft < 0 ? 'text-red-600' : daysLeft <= 7 ? 'text-orange-600' : 'text-green-600'}`}>
                  {daysLeft < 0 ? 'Expired' : `${daysLeft} days`}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">Additional Information</h3>
            <div className="text-sm text-gray-600">
              <p>Customer ID: #{customer.id}</p>
              <p>Registered: {new Date(customer.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
