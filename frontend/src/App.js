import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import ExpiryAlerts from './pages/ExpiryAlerts';
import NewServices from './pages/NewServices';
import CustomInvoice from './pages/CustomInvoice';
import Bin from './pages/Bin';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  useEffect(() => {
    const preventCopyPaste = (e) => {
      e.preventDefault();
      return false;
    };

    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('contextmenu', preventContextMenu);

    return () => {
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('cut', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick theme="colored" />
      <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/admin" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/admin/*" element={
          isLoggedIn ? (
            <Layout setIsLoggedIn={setIsLoggedIn}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/add-customer" element={<AddCustomer />} />
                <Route path="/expiry-alerts" element={<ExpiryAlerts />} />
                <Route path="/new-services" element={<NewServices />} />
                <Route path="/custom-invoice" element={<CustomInvoice />} />
                <Route path="/bin" element={<Bin />} />
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
