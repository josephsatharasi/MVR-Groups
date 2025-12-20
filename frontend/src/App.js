import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initializeDummyData } from './utils/dummyData';
import { initializePartners } from './utils/partners';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import ExpiryAlerts from './pages/ExpiryAlerts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    initializeDummyData();
    initializePartners();
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick theme="colored" />
      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/admin/*" element={
          isLoggedIn ? (
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/add-customer" element={<AddCustomer />} />
                <Route path="/expiry-alerts" element={<ExpiryAlerts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
    </>
  );
}

export default App;
