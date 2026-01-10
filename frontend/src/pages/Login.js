import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { toast } from 'react-toastify';
import logo from '../assets/logo.JPG';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsLoggedIn(true);
        toast.success('Login successful');
        navigate('/admin');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #2F4F4F 0%, #5F9EA0 50%, #7FCDCD 100%)'
    }}>
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <img src={logo} alt="Real Estate" className="h-24 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold" style={{ color: '#2F4F4F' }}>Admin Login</h1>
          <p className="text-gray-600 mt-2">Access your admin dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#2F4F4F' }}>Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ focusRingColor: '#5F9EA0' }}
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#2F4F4F' }}>Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ focusRingColor: '#5F9EA0' }}
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-white py-3 rounded-lg transition-colors font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#2F4F4F' }}
          >
            <LogIn size={20} />
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          <Link to="/forgot-password" className="font-semibold hover:underline" style={{ color: '#2F4F4F' }}>Forgot Password?</Link>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account? <Link to="/register" className="font-semibold hover:underline" style={{ color: '#2F4F4F' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
