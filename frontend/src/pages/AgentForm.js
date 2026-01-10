import React, { useState } from 'react';
import { UserCheck, Upload } from 'lucide-react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Card from '../components/Card';
import { toast } from 'react-toastify';

const AgentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    whatsapp: '',
    email: '',
    relation: '',
    dob: '',
    age: '',
    address: '',
    pinCode: '',
    aadharNo: '',
    panNo: '',
    introducerId: '',
    agentId: '',
    photo: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Agent application submitted successfully!');
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

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#5F9EA0' }}>
      <div className="flex items-center gap-3 mb-6">
        <UserCheck className="text-white" size={32} />
        <h1 className="text-2xl md:text-3xl font-bold text-white">Agent Application Form</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-end mb-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-32 h-40 flex flex-col items-center justify-center">
              <Upload size={24} className="text-gray-400 mb-2" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                Upload Photo
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Name (Mr/Mrs/Ms/Dr)"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              placeholder="Enter full name"
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
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email address"
            />
            <FormInput
              label="S/o, W/o, D/o"
              value={formData.relation}
              onChange={(e) => handleChange('relation', e.target.value)}
              placeholder="Enter relation"
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
            <FormInput
              label="PAN No"
              value={formData.panNo}
              onChange={(e) => handleChange('panNo', e.target.value)}
              placeholder="Enter PAN number"
            />
            <FormInput
              label="Introducer ID"
              value={formData.introducerId}
              onChange={(e) => handleChange('introducerId', e.target.value)}
              placeholder="Enter introducer ID"
            />
            <FormInput
              label="Agent ID"
              value={formData.agentId}
              onChange={(e) => handleChange('agentId', e.target.value)}
              placeholder="Enter agent ID"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="primary" icon={UserCheck}>
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

export default AgentForm;
