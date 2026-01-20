import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, Trash2, Menu, X, LogOut, FileText, UserCog, DollarSign } from 'lucide-react';
// import logo from '../assets/logo.JPG';
import ConfirmModal from './ConfirmModal';

const Layout = ({ children, setIsLoggedIn }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/customers', icon: Users, label: 'Customers' },
    { path: '/admin/agents', icon: UserPlus, label: 'Agents' },
    { path: '/admin/caders', icon: UserCog, label: 'Caders' },
    { path: '/admin/commission', icon: DollarSign, label: 'Commission' },
    { path: '/admin/reports', icon: FileText, label: 'Reports' },
    { path: '/admin/bin', icon: Trash2, label: 'Recycle Bin' },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Desktop Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} text-white transition-all duration-300 hidden md:flex flex-col shadow-xl`} style={{background: '#1e3a8a'}}>
        <div className="p-4 flex items-center justify-between border-b border-blue-400">
          {isSidebarOpen && (
            <Link to="/admin">
              {/* <img src={logo} alt="Logo" className="h-16 bg-white p-1 rounded" /> */}
              <h2 className="text-xl font-bold text-white">MVR Groups</h2>
            </Link>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white" style={{opacity: 0.9}}>
            <Menu size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 mb-2 rounded-lg transition-colors relative group ${
                  isActive ? 'text-white shadow-lg' : 'text-blue-50'
                }`}
                style={isActive ? {background: '#1e3a8a'} : {}}
                title={!isSidebarOpen ? item.label : ''}
              >
                <Icon size={20} />
                {isSidebarOpen && <span>{item.label}</span>}
                {!isSidebarOpen && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {isSidebarOpen && (
          <div className="p-4 border-t" style={{borderColor: 'rgba(255,255,255,0.3)'}}>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
        {!isSidebarOpen && (
          <div className="p-4 border-t flex justify-center" style={{borderColor: 'rgba(255,255,255,0.3)'}}>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="text-white transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-64 text-white z-50" style={{background: '#1e3a8a'}} onClick={(e) => e.stopPropagation()}>
            <div className="p-4 flex items-center justify-between" style={{borderBottom: '1px solid rgba(255,255,255,0.3)'}}>
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                {/* <img src={logo} alt="Logo" className="h-16 bg-white p-1 rounded" /> */}
                <h2 className="text-xl font-bold text-white">MVR Groups</h2>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                <X size={20} />
              </button>
            </div>
            
            <nav className="p-4 flex-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 mb-2 rounded-lg transition-colors ${
                      isActive ? 'text-white' : 'text-blue-50'
                    }`}
                    style={isActive ? {background: '#1e3a8a'} : {}}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            <div className="p-4 border-t" style={{borderColor: 'rgba(255,255,255,0.3)'}}>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="shadow-md p-4 flex items-center justify-between bg-white border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden" style={{color: '#1e3a8a'}}>
              <Menu size={24} />
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Real Estate Admin</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:block">Admin Panel</span>
          </div>
        </header>
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
      />
    </div>
  );
};

export default Layout;
