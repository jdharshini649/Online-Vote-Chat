import React from 'react';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button',
  size = 'md',
  fullWidth = false,
  ariaLabel,
}) => {
  const sizeMap = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const base = `inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${sizeMap[size]}`;

  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm',
    secondary: 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-800',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white shadow',
    outline: 'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${base} ${variants[variant] || variants.primary} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
