import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, className = '', id, ...props }) => {
  const inputId = id || label?.toLowerCase()?.replace(/\s+/g, '-') || undefined;
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-gray-700 font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
      />
    </div>
  );
};

export default Input;
