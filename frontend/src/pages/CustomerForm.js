import React, { useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Card from '../components/Card';
import { toast } from 'react-toastify';

const CustomerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    mobile: '',
    whatsapp: '',
    ventureLocation: '',
    bookingPlotNo: '',
    dob: '',
    age: '',
    amount: '',
    address: '',
    pinCode: '',
    aadharNo: '',
    plotNo: '',
    ankanamSqft: '',
    price: '',
    purchaseType: '',
    projectName: '',
    location: '',
    totalAmount: '',
    bookingAmount: '',
    paymentType: '',
    chequeDD: '',
    chequeNo: '',
    bankName: '',
    agentCode: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Customer application submitted successfully!');
    console.log(formData);
  };

  const handleChange = (field, value) => {
    // Handle mobile number fields - only allow numbers and limit to 10 digits
    if (field === 'mobile' || field === 'whatsapp') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [field]: numericValue });
    }
    // Handle Aadhar - 12 digits with space after every 4
    else if (field === 'aadharNo') {
      const numericValue = value.replace(/\D/g, '').slice(0, 12);
      const formatted = numericValue.match(/.{1,4}/g)?.join(' ') || numericValue;
      setFormData({ ...formData, [field]: formatted });
    }
    // Handle PAN - 5 letters + 4 numbers + 1 letter
    else if (field === 'panNo') {
      let inputValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
      let formatted = '';
      for (let i = 0; i < inputValue.length; i++) {
        if (i < 5 && /[A-Z]/.test(inputValue[i])) formatted += inputValue[i];
        else if (i >= 5 && i < 9 && /[0-9]/.test(inputValue[i])) formatted += inputValue[i];
        else if (i === 9 && /[A-Z]/.test(inputValue[i])) formatted += inputValue[i];
      }
      setFormData({ ...formData, [field]: formatted });
    }
    else {
      setFormData({ ...formData, [field]: value });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#5F9EA0' }}>
      <div className="flex items-center gap-3 mb-6">
        <Users className="text-white" size={32} />
        <h1 className="text-2xl md:text-3xl font-bold text-white">Customer Application Form</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Name (Mr/Mrs/Ms/Dr)"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              placeholder="Enter full name"
            />
            <FormInput
              label="S/o, W/o, D/o"
              value={formData.relation}
              onChange={(e) => handleChange('relation', e.target.value)}
              placeholder="Enter relation"
            />
            <FormInput
              label="Mobile Number"
              type="tel"
              value={formData.mobile}
              onChange={(e) => handleChange('mobile', e.target.value)}
              required
              placeholder="Enter mobile number"
            />
            <FormInput
              label="WhatsApp Number"
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              placeholder="Enter WhatsApp number"
            />
            <FormInput
              label="Venture Location"
              value={formData.ventureLocation}
              onChange={(e) => handleChange('ventureLocation', e.target.value)}
              placeholder="Enter venture location"
            />
            <FormInput
              label="Booking Plot No"
              value={formData.bookingPlotNo}
              onChange={(e) => handleChange('bookingPlotNo', e.target.value)}
              placeholder="Enter plot number"
            />
            <FormInput
              label="Date of Birth (DD/MM/YY)"
              type="date"
              value={formData.dob}
              onChange={(e) => handleChange('dob', e.target.value)}
            />
            <FormInput
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              placeholder="Enter age"
            />
            <FormInput
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <FormInput
            label="Address"
            type="textarea"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={2}
            placeholder="Enter full address"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Pin Code"
              value={formData.pinCode}
              onChange={(e) => handleChange('pinCode', e.target.value)}
              placeholder="Enter pin code"
            />
            <FormInput
              label="Aadhar No"
              value={formData.aadharNo}
              onChange={(e) => handleChange('aadharNo', e.target.value)}
              placeholder="Enter Aadhar number"
            />
          </div>

          <h3 className="text-lg font-bold" style={{ color: '#2F4F4F' }}>Plot Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormInput
              label="Plot / Flat No"
              value={formData.plotNo}
              onChange={(e) => handleChange('plotNo', e.target.value)}
              placeholder="Plot No"
            />
            <FormInput
              label="Ankanam/Sqft"
              value={formData.ankanamSqft}
              onChange={(e) => handleChange('ankanamSqft', e.target.value)}
              placeholder="Area"
            />
            <FormInput
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="Price"
            />
            <FormInput
              label="Purchase Type"
              value={formData.purchaseType}
              onChange={(e) => handleChange('purchaseType', e.target.value)}
              placeholder="Type"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Project Name"
              value={formData.projectName}
              onChange={(e) => handleChange('projectName', e.target.value)}
              placeholder="Enter project name"
            />
            <FormInput
              label="Location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Enter location"
            />
            <FormInput
              label="Total Amount"
              type="number"
              value={formData.totalAmount}
              onChange={(e) => handleChange('totalAmount', e.target.value)}
              placeholder="Enter total amount"
            />
            <FormInput
              label="Booking Amount"
              type="number"
              value={formData.bookingAmount}
              onChange={(e) => handleChange('bookingAmount', e.target.value)}
              placeholder="Enter booking amount"
            />
          </div>

          <h3 className="text-lg font-bold" style={{ color: '#2F4F4F' }}>Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Payment Type"
              type="select"
              value={formData.paymentType}
              onChange={(e) => handleChange('paymentType', e.target.value)}
              options={['Cash', 'Cheque/DD']}
            />
            <FormInput
              label="Cheque/DD"
              value={formData.chequeDD}
              onChange={(e) => handleChange('chequeDD', e.target.value)}
              placeholder="Enter cheque/DD details"
            />
            <FormInput
              label="Cheque No"
              value={formData.chequeNo}
              onChange={(e) => handleChange('chequeNo', e.target.value)}
              placeholder="Enter cheque number"
            />
            <FormInput
              label="Name of the Bank"
              value={formData.bankName}
              onChange={(e) => handleChange('bankName', e.target.value)}
              placeholder="Enter bank name"
            />
            <FormInput
              label="Agent Code"
              value={formData.agentCode}
              onChange={(e) => handleChange('agentCode', e.target.value)}
              placeholder="Enter agent code"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="primary" icon={UserPlus}>
              Submit Application
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.history.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CustomerForm;
