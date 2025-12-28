import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-300">
          © {new Date().getFullYear()} Debate Arena. All rights reserved.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Real-time debates with team voting
        </p>
      </div>
    </footer>
  );
};

export default Footer;
