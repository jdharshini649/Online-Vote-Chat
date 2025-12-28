import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ className = '' }) => {
  const location = useLocation();

  const links = [
    { path: '/', label: 'All Debates', icon: '🏛️' },
    { path: '/create', label: 'Create Debate', icon: '➕' },
    { path: '/profile', label: 'My Profile', icon: '👤' },
  ];

  return (
    <aside className={`w-full md:w-64 bg-white shadow-sm h-full ${className}`}>
      <nav className="p-4">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
              location.pathname === link.path
                ? 'bg-primary-100 text-primary-700 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl md:text-2xl">{link.icon}</span>
            <span className="hidden md:inline">{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
