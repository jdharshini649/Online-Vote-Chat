import React from 'react';

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-secondary-500 text-white',
    accent: 'bg-accent-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-400 text-white',
    danger: 'bg-red-500 text-white',
    gray: 'bg-gray-400 text-white',
  };

  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
