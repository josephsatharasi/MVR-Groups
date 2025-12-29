import React, { useState } from 'react';
import { X, Calendar, User, Phone, Mail, MapPin, Package } from 'lucide-react';

const CustomerDetails = ({ customer, onClose }) => {
  const [spareParts, setSpareParts] = useState({
    'Sediment Carbon': false,
    'Post/Carbon': false,
    'Membrane': false,
    'Membrane Housing': false,
    'SV': false,
    'Pump': false,
    'SMTS': false,
    'Float': false,
    'Diveter Wall': false,
    'Pipe': false
  });
  const [totalPrice, setTotalPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const handleCheckboxChange = (part) => {
    setSpareParts(prev => ({ ...prev, [part]: !prev[part] }));
  };

  const handleSave = () => {
    console.log('Saved:', { spareParts, totalPrice, paymentMethod });
    alert('Data saved successfully!');
  };

  const handleEdit = () => {
    console.log('Edit mode activated');
  };

  const handleNextRemainder = () => {
    alert('Next remainder scheduled!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Customer Profile</h2>
          <button onClick={onClose} className="hover:bg-teal-600 p-2 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <User className="text-teal-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Customer Name</p>
                <p className="font-semibold text-teal-900">{customer.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-teal-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="font-semibold text-teal-900">{customer.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-teal-600 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-teal-900">{customer.email}</p>
              </div>
            </div>

          <div className="flex items-start gap-3">
            <Package className="text-teal-600 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-600">Area</p>
              <p className="font-semibold text-teal-900">{customer.area}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Package className="text-teal-600 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-600">Brand</p>
              <p className="font-semibold text-teal-900">{customer.brand}</p>
            </div>
          </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="text-teal-600 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-semibold text-teal-900">{customer.address}</p>
            </div>
          </div>

          <div className="bg-teal-50 rounded-lg p-4 border-2 border-teal-200">
            <h3 className="font-bold text-teal-900 mb-3">Service Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Service Plan</p>
                <p className="font-semibold text-teal-900">{customer.service} Months</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Brand</p>
                <p className="font-semibold text-teal-900">{customer.brand}</p>
              </div>
            </div>
          </div>

          <div className="bg-teal-50 rounded-lg p-4 border-2 border-teal-200">
            <h3 className="font-bold text-teal-900 mb-3">Spare Parts</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.keys(spareParts).map((part) => (
                <label key={part} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={spareParts[part]}
                    onChange={() => handleCheckboxChange(part)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">{part}</span>
                </label>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Total Price</label>
              <input
                type="number"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                placeholder="Enter total price"
                className="w-full px-3 py-2 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Payment Method</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-sm text-gray-700">UPI</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Cash"
                    checked={paymentMethod === 'Cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-sm text-gray-700">Cash</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Card"
                    checked={paymentMethod === 'Card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-sm text-gray-700">Card</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Save
              </button>
              <button
                onClick={handleEdit}
                className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors font-semibold"
              >
                Edit
              </button>
              <button
                onClick={handleNextRemainder}
                className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                Next Remainder
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-teal-900 mb-2">Additional Information</h3>
            <div className="text-sm text-gray-600">
            <p>Customer ID: #{customer._id || customer.id}</p>
              <p>Registered: {new Date(customer.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
