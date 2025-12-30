import React, { useState, useEffect } from 'react';
import { Search, X, Upload, Save, Download, Plus } from 'lucide-react';
import { getCustomers } from '../utils/storage';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';

const NewServices = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [services, setServices] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [savedService, setSavedService] = useState(null);
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
    const loadData = async () => {
      const data = await getCustomers();
      setCustomers(data);
    };
    loadData();
  }, []);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.phone.includes(searchTerm);
    const matchesArea = !areaFilter || c.area === areaFilter;
    return matchesSearch && matchesArea;
  });

  const handleRowClick = async (customer) => {
    setSelectedCustomer(customer);
    await loadServices(customer._id);
  };

  const loadServices = async (customerId) => {
    try {
      const response = await fetch(`https://mkl-admin-backend.onrender.com/api/services/customer/${customerId}`);
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
        customerId: selectedCustomer._id,
        customerName: selectedCustomer.name,
        spareParts: serviceData.spareParts,
        totalBill: serviceData.totalBill,
        paymentMode: serviceData.paymentMode,
        serviceDate: new Date().toISOString()
      };
      
      const response = await fetch('https://mkl-admin-backend.onrender.com/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceRecord)
      });
      
      if (response.ok) {
        const newService = await response.json();
        setSavedService(newService);
        toast.success('Service saved successfully!');
        await loadServices(selectedCustomer._id);
      }
    } catch (error) {
      toast.error('Failed to save service');
    }
  };

  const generateServiceInvoice = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('MKL ENTERPRISES', 105, 18, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Sales & Service', 105, 28, { align: 'center' });
    doc.setFontSize(8);
    doc.text('D, 58-1-319, NAD Kotha Rd, opp. Bank of India, Nad Junction', 105, 36, { align: 'center' });
    doc.text('Buchirajupalem, Dungalavanipalem, Visakhapatnam, AP 530027', 105, 42, { align: 'center' });
    
    // Invoice Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('SERVICE INVOICE', 105, 65, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Service Date: ${new Date(savedService.serviceDate).toLocaleDateString('en-GB')}`, 150, 75);
    doc.text(`Invoice No: SRV-${Date.now().toString().slice(-6)}`, 150, 82);
    
    // Customer Details Box
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.5);
    doc.rect(20, 90, 170, 30);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('CUSTOMER DETAILS', 25, 98);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${selectedCustomer.name}`, 25, 108);
    doc.text(`Phone: ${selectedCustomer.phone}`, 25, 116);
    
    // Spare Parts Table
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('SPARE PARTS USED', 25, 135);
    
    // Table Header
    doc.setFillColor(37, 99, 235);
    doc.rect(20, 140, 170, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('S.No', 25, 147);
    doc.text('Part Name', 50, 147);
    doc.text('Status', 150, 147);
    
    // Table Body
    doc.setTextColor(0, 0, 0);
    let yPos = 157;
    let sno = 1;
    Object.entries(savedService.spareParts).forEach(([part, used]) => {
      if (used) {
        doc.text(sno.toString(), 25, yPos);
        doc.text(part, 50, yPos);
        doc.text('✓ Used', 150, yPos);
        yPos += 8;
        sno++;
      }
    });
    
    // Payment Details Box
    yPos += 10;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, 170, 30, 'F');
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('PAYMENT DETAILS', 25, yPos + 10);
    
    doc.setFontSize(11);
    doc.text(`Total Amount: ₹${savedService.totalBill}`, 25, yPos + 20);
    doc.text(`Payment Mode: ${savedService.paymentMode}`, 100, yPos + 20);
    
    // Footer
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing MKL Enterprises!', 105, 270, { align: 'center' });
    doc.text('For any queries, please contact us at the above address', 105, 277, { align: 'center' });
    
    doc.save(`Service_Invoice_${selectedCustomer.name}_${Date.now()}.pdf`);
    toast.success('Invoice downloaded!');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">New Services</h1>
        <p className="text-gray-600">Search and manage customer services</p>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-blue-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        >
          <option value="">All Areas</option>
          <option value="Pendurthi">Pendurthi</option>
          <option value="Kothavalasa">Kothavalasa</option>
          <option value="Anakapelly">Anakapelly</option>
          <option value="Chinna Musaliwada">Chinna Musaliwada</option>
          <option value="NAD Junction">NAD Junction</option>
          <option value="Marripalem">Marripalem</option>
          <option value="Gajuwaka">Gajuwaka</option>
          <option value="Koramanapalem">Koramanapalem</option>
          <option value="Duvvada">Duvvada</option>
          <option value="Kancherapalem">Kancherapalem</option>
          <option value="RTC Complex">RTC Complex</option>
          <option value="Madhurapalem">Madhurapalem</option>
          <option value="Madhuruwada">Madhuruwada</option>
          <option value="Endada">Endada</option>
          <option value="Anumanthwada">Anumanthwada</option>
        </select>
      </div>

      <div className="rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Name</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Phone</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden md:table-cell">Area</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm hidden lg:table-cell">Address</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Service</th>
                <th className="px-4 md:px-6 py-3 text-left text-sm">Brand</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <tr 
                  key={customer._id || customer.id} 
                  onClick={() => handleRowClick(customer)}
                  className={`transition-all hover:bg-blue-100 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}
                >
                  <td className="px-4 md:px-6 py-4 text-sm font-semibold text-blue-700">{customer.name}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{customer.phone}</td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden md:table-cell">{customer.area}</td>
                  <td className="px-4 md:px-6 py-4 text-sm hidden lg:table-cell">{customer.address}</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{customer.service}M</td>
                  <td className="px-4 md:px-6 py-4 text-sm">{customer.brand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCustomers.length === 0 && (
          <div className="text-center py-8 text-gray-500">No customers found</div>
        )}
      </div>

      {selectedCustomer && !showAddService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Service History - {selectedCustomer.name}</h2>
              <button onClick={() => setSelectedCustomer(null)} className="hover:bg-blue-500 p-2 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-blue-900">All Services</h3>
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
            </div>
          </div>
        </div>
      )}

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
                    {savedService ? (
                      <>
                        <button
                          onClick={generateServiceInvoice}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          <Download size={20} />
                          Download Invoice
                        </button>
                        <button
                          onClick={() => { setShowAddService(false); setSavedService(null); }}
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          Close
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleSaveService}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          <Save size={20} />
                          Save Service
                        </button>
                      </>
                    )}
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

export default NewServices;
