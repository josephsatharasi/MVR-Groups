import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Agents from './pages/Agents';
import Caders from './pages/Caders';
import Reports from './pages/Reports';
import RecycleBin from './pages/RecycleBin';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick theme="colored" />
      <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/admin" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/admin" /> : <Register />} />
        <Route path="/forgot-password" element={isLoggedIn ? <Navigate to="/admin" /> : <ForgotPassword />} />
        <Route path="/reset-password" element={isLoggedIn ? <Navigate to="/admin" /> : <ResetPassword />} />
        <Route path="/admin/*" element={
          isLoggedIn ? (
            <Layout setIsLoggedIn={setIsLoggedIn}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/caders" element={<Caders />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/bin" element={<RecycleBin />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/" />
          )
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
