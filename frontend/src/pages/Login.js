import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ArrowLeft } from 'lucide-react';
import logo from '../assets/logo.JPG';

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <div className="text-center mb-8">
          <img src={logo} alt="MKL Enterprises" className="h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-blue-900">Admin Login</h1>
          <p className="text-gray-600 mt-2">Access your admin dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-2">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-2">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <LogIn size={20} />
            Login to Dashboard
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Demo: Click login without credentials to access
        </p>
      </div>
    </div>
  );
};

export default Login;
