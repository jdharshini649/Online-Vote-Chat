import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../UI/Button';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-lg md:text-2xl font-bold text-gray-800">Debate Arena</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <Link to="/" className="text-gray-700 hover:text-primary-500 font-medium transition">
                  Debates
                </Link>
                <Link to="/create" className="text-gray-700 hover:text-primary-500 font-medium transition">
                  Create
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-primary-500 font-medium transition">
                  Profile
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600">Hi, {user.username}</span>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    Logout
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setOpen((s) => !s)} className="p-2 rounded-md bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden mt-3">
            {user ? (
              <div className="space-y-2">
                <Link to="/" className="block px-3 py-2 rounded hover:bg-gray-100">Debates</Link>
                <Link to="/create" className="block px-3 py-2 rounded hover:bg-gray-100">Create</Link>
                <Link to="/profile" className="block px-3 py-2 rounded hover:bg-gray-100">Profile</Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Logout</button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/login" className="block px-3 py-2 rounded hover:bg-gray-100">Login</Link>
                <Link to="/register" className="block px-3 py-2 rounded hover:bg-gray-100">Register</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
