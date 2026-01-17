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
    <div className="flex h-screen" style={{ backgroundColor: '#2F4F4F' }}>
      {/* Desktop Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} text-white transition-all duration-300 hidden md:flex flex-col shadow-xl`} style={{ backgroundColor: '#2F4F4F' }}>
        <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          {isSidebarOpen && (
            <Link to="/admin">
              {/* <img src={logo} alt="Logo" className="h-16 bg-white p-1 rounded" /> */}
              <h2 className="text-xl font-bold text-white">MVR Groups</h2>
            </Link>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white hover:text-gray-300">
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
                  isActive ? 'text-white' : 'text-gray-300 hover:text-white hover:bg-opacity-20 hover:bg-white'
                }`}
                style={isActive ? { backgroundColor: '#5F9EA0' } : {}}
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

        <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
          {isSidebarOpen ? (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center text-white hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-64 text-white z-50" style={{ backgroundColor: '#2F4F4F' }} onClick={(e) => e.stopPropagation()}>
            <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
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
                      isActive ? 'text-white' : 'text-gray-300'
                    }`}
                    style={isActive ? { backgroundColor: '#5F9EA0' } : {}}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto" style={{ backgroundColor: '#5F9EA0' }}>
        <header className="shadow-md p-4 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden" style={{ color: '#2F4F4F' }}>
              <Menu size={24} />
            </button>
            <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#2F4F4F' }}>Real Estate Admin</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:block">Admin Panel</span>
          </div>
        </header>
        <div>
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
