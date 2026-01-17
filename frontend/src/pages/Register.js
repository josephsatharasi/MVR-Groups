import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', mobile: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.mobile || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }

    if (formData.mobile.length !== 10) {
      toast.error('Please enter valid 10-digit mobile number');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: formData.username, 
          email: formData.email, 
          mobile: formData.mobile, 
          password: formData.password 
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Registration successful! Please login.');
        navigate('/');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #2F4F4F 0%, #5F9EA0 50%, #7FCDCD 100%)'
    }}>
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#2F4F4F' }}>Register</h1>
          <p className="text-gray-600 mt-2">Create your admin account</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#2F4F4F' }}>Username <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#2F4F4F' }}>Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#2F4F4F' }}>Mobile Number <span className="text-red-500">*</span></label>
            <input
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#2F4F4F' }}>Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#2F4F4F' }}>Confirm Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              placeholder="Confirm password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-white py-3 rounded-lg transition-colors font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#2F4F4F' }}
          >
            <UserPlus size={20} />
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <Link to="/" className="font-semibold hover:underline" style={{ color: '#2F4F4F' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
