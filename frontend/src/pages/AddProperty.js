import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Card from '../components/Card';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    propertyName: '',
    propertyType: '',
    location: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    status: 'Available',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Property added successfully!');
    navigate('/admin/properties');
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#5F9EA0' }}>
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Add New Property</h1>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Property Name"
              value={formData.propertyName}
              onChange={(e) => handleChange('propertyName', e.target.value)}
              required
              placeholder="Enter property name"
            />
            <FormInput
              label="Property Type"
              type="select"
              value={formData.propertyType}
              onChange={(e) => handleChange('propertyType', e.target.value)}
              options={['Apartment', 'Villa', 'House', 'Commercial', 'Land']}
              required
            />
            <FormInput
              label="Location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              required
              placeholder="Enter location"
            />
            <FormInput
              label="Price (₹)"
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              required
              placeholder="Enter price"
            />
            <FormInput
              label="Area (sq.ft)"
              type="number"
              value={formData.area}
              onChange={(e) => handleChange('area', e.target.value)}
              required
              placeholder="Enter area"
            />
            <FormInput
              label="Bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={(e) => handleChange('bedrooms', e.target.value)}
              placeholder="Number of bedrooms"
            />
            <FormInput
              label="Bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={(e) => handleChange('bathrooms', e.target.value)}
              placeholder="Number of bathrooms"
            />
            <FormInput
              label="Status"
              type="select"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              options={['Available', 'Sold', 'Rented', 'Pending']}
              required
            />
            <FormInput
              label="Owner Name"
              value={formData.ownerName}
              onChange={(e) => handleChange('ownerName', e.target.value)}
              required
              placeholder="Enter owner name"
            />
            <FormInput
              label="Owner Phone"
              type="tel"
              value={formData.ownerPhone}
              onChange={(e) => handleChange('ownerPhone', e.target.value)}
              required
              placeholder="Enter phone number"
            />
            <FormInput
              label="Owner Email"
              type="email"
              value={formData.ownerEmail}
              onChange={(e) => handleChange('ownerEmail', e.target.value)}
              placeholder="Enter email"
            />
          </div>
          
          <FormInput
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            placeholder="Enter property description"
          />

          <div className="flex gap-4">
            <Button type="submit" variant="primary" icon={Building2}>
              Add Property
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/admin/properties')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddProperty;
