import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200/50 shadow-sm px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="bg-primary-600 text-white font-bold px-3 py-1 rounded-md tracking-wider text-sm shadow-md shadow-primary-500/30">
          DCRTS
        </div>
        <h1 className="font-semibold text-gray-800 hidden sm:block">Digital Complaint & Resolution Tracking System</h1>
      </div>

      <div className="flex items-center gap-6">
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-sm font-medium text-gray-800">{user.name}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">{user.role}</span>
            </div>
            <div className="h-9 w-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold border border-primary-200 shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors bg-white hover:bg-red-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-red-200"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium hidden sm:block">Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
