import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { addCustomer } from '../utils/storage';
import jsPDF from 'jspdf';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [savedCustomer, setSavedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    area: '',
    service: '',
    brand: '',
  });

  useEffect(() => {}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.phone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits!');
      return;
    }
    
    try {
      const newCustomer = await addCustomer(formData);
      setSavedCustomer(newCustomer);
      toast.success(`${newCustomer.name} added successfully!`);
    } catch (error) {
      toast.error(error.message || 'Failed to add customer');
    }
  };

  const generateInvoice = () => {
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
    doc.text('CUSTOMER INVOICE', 105, 65, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Invoice Date: ${new Date().toLocaleDateString('en-GB')}`, 150, 75);
    doc.text(`Invoice No: INV-${Date.now().toString().slice(-6)}`, 150, 82);
    
    // Customer Details Box
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.5);
    doc.rect(20, 90, 170, 45);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('CUSTOMER DETAILS', 25, 98);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${savedCustomer.name}`, 25, 108);
    doc.text(`Phone: ${savedCustomer.phone}`, 25, 116);
    doc.text(`Email: ${savedCustomer.email}`, 25, 124);
    doc.text(`Area: ${savedCustomer.area}`, 120, 108);
    
    // Service Details Box
    doc.rect(20, 145, 170, 35);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('SERVICE DETAILS', 25, 153);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Service Plan: ${savedCustomer.service} Months`, 25, 163);
    doc.text(`Purifier Brand: ${savedCustomer.brand}`, 25, 171);
    
    // Footer
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing MKL Enterprises!', 105, 270, { align: 'center' });
    doc.text('For any queries, please contact us at the above address', 105, 277, { align: 'center' });
    
    doc.save(`Invoice_${savedCustomer.name}_${Date.now()}.pdf`);
    toast.success('Invoice downloaded!');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Add New Customer</h1>
      
      <form onSubmit={handleSubmit} className="rounded-xl shadow-lg p-4 md:p-6 space-y-4 bg-white border border-gray-200">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Customer Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter customer name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Phone Number <span className="text-red-500">*</span></label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            maxLength="10"
            pattern="[0-9]{10}"
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="9876543210"
          />
          <p className="text-xs text-gray-500 mt-1">Enter 10 digit mobile number (numbers only)</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="customer@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Address <span className="text-red-500">*</span></label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter complete address"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Area <span className="text-red-500">*</span></label>
          <select
            name="area"
            value={formData.area}
            onChange={handleChange}
            required
            size="1"
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-auto"
          >
            <option value="">Select Area</option>
            <option value="Banjara Hills">Banjara Hills</option>
            <option value="Jubilee Hills">Jubilee Hills</option>
            <option value="Gachibowli">Gachibowli</option>
            <option value="Kondapur">Kondapur</option>
            <option value="Madhapur">Madhapur</option>
            <option value="Kukatpally">Kukatpally</option>
            <option value="Miyapur">Miyapur</option>
            <option value="Ameerpet">Ameerpet</option>
            <option value="Secunderabad">Secunderabad</option>
            <option value="Begumpet">Begumpet</option>
            <option value="Somajiguda">Somajiguda</option>
            <option value="Punjagutta">Punjagutta</option>
            <option value="Himayatnagar">Himayatnagar</option>
            <option value="Abids">Abids</option>
            <option value="Nampally">Nampally</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Service Plan <span className="text-red-500">*</span></label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Service Plan</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Purifier Brand <span className="text-red-500">*</span></label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Brand</option>
            <option value="Kent">Kent</option>
            <option value="Aquaguard">Aquaguard</option>
            <option value="Pureit">Pureit</option>
            <option value="Livpure">Livpure</option>
            <option value="Blue Star">Blue Star</option>
            <option value="AO Smith">AO Smith</option>
            <option value="Havells">Havells</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {savedCustomer ? (
            <>
              <button
                type="button"
                onClick={generateInvoice}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md"
              >
                <Download size={20} />
                Download Invoice
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/customers')}
                className="flex items-center justify-center gap-2 px-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Go to Customers
              </button>
            </>
          ) : (
            <>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
              >
                <Save size={20} />
                Save
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/customers')}
                className="flex items-center justify-center gap-2 px-6 bg-gray-300 text-blue-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                <X size={20} />
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;
