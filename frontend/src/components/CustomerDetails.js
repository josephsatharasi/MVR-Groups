import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Mail, MapPin, Package, Plus, Upload, Save, Download } from 'lucide-react';
import { toast } from 'react-toastify';

const CustomerDetails = ({ customer, onClose }) => {
  const [services, setServices] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceData, setServiceData] = useState({
    spareParts: {
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
    },
    images: [],
    totalBill: '',
    paymentMode: 'UPI'
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/services/customer/${customer._id}`);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const handleAddService = () => {
    setShowAddService(true);
    setSelectedService(null);
    setServiceData({
      spareParts: {
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
      },
      images: [],
      totalBill: '',
      paymentMode: 'UPI'
    });
  };

  const handleViewService = (service) => {
    setSelectedService(service);
    setShowAddService(true);
  };

  const handleCheckboxChange = (part) => {
    setServiceData(prev => ({
      ...prev,
      spareParts: { ...prev.spareParts, [part]: !prev.spareParts[part] }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setServiceData(prev => ({ ...prev, images: [...prev.images, ...imageUrls] }));
  };

  const handleSaveService = async () => {
    try {
      const serviceRecord = {
        customerId: customer._id,
        customerName: customer.name,
        spareParts: serviceData.spareParts,
        totalBill: serviceData.totalBill,
        paymentMode: serviceData.paymentMode,
        serviceDate: new Date().toISOString()
      };
      
      const response = await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceRecord)
      });
      
      if (response.ok) {
        toast.success('Service saved successfully!');
        setShowAddService(false);
        loadServices();
      }
    } catch (error) {
      toast.error('Failed to save service');
    }
  };
  const [totalPrice, setTotalPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');



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

          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-blue-900">Service History</h3>
              <button
                onClick={handleAddService}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <Plus size={18} />
                Add New Service
              </button>
            </div>
            {services.length > 0 ? (
              <div className="space-y-2">
                {services.map((service) => (
                  <div
                    key={service._id}
                    onClick={() => handleViewService(service)}
                    className="p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-blue-900">Service Date: {new Date(service.serviceDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                        <p className="text-sm text-gray-600">Total: ₹{service.totalBill} | Payment: {service.paymentMode}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No service history</p>
            )}
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

      {showAddService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddService(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedService ? 'View Service' : 'Add New Service'}</h2>
              <button onClick={() => setShowAddService(false)} className="hover:bg-blue-500 p-2 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {selectedService ? (
                <>
                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-3">Service Details</h3>
                    <p className="text-sm text-gray-700 mb-2"><strong>Date:</strong> {new Date(selectedService.serviceDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                    <p className="text-sm text-gray-700 mb-2"><strong>Total Bill:</strong> ₹{selectedService.totalBill}</p>
                    <p className="text-sm text-gray-700"><strong>Payment Mode:</strong> {selectedService.paymentMode}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-3">Spare Parts Used</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedService.spareParts).map(([part, used]) => (
                        used && <span key={part} className="text-sm text-gray-700">✓ {part}</span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-3">Spare Parts</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(serviceData.spareParts).map((part) => (
                        <label key={part} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={serviceData.spareParts[part]}
                            onChange={() => handleCheckboxChange(part)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{part}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-3">Upload Images</h3>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {serviceData.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {serviceData.images.map((img, idx) => (
                          <img key={idx} src={img} alt="Service" className="w-full h-24 object-cover rounded" />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-3">Billing Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Total Bill</label>
                        <input
                          type="number"
                          value={serviceData.totalBill}
                          onChange={(e) => setServiceData(prev => ({ ...prev, totalBill: e.target.value }))}
                          placeholder="Enter total amount"
                          className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Payment Mode</label>
                        <div className="flex gap-4">
                          {['UPI', 'Cash', 'Card'].map(mode => (
                            <label key={mode} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                value={mode}
                                checked={serviceData.paymentMode === mode}
                                onChange={(e) => setServiceData(prev => ({ ...prev, paymentMode: e.target.value }))}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-sm text-gray-700">{mode}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveService}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      <Save size={20} />
                      Save Service
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      <Download size={20} />
                      Download Invoice
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
