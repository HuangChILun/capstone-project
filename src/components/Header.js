// src/components/Header.js
import React from 'react';

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-blue-900 text-white px-4 py-2">
      <div className="flex items-center">
        <h1 className="text-lg font-bold">Bridging Abilities Database System</h1>
      </div>
      <div className="flex items-center">
        <span className="mr-4">John Doe</span>
        <div className="relative">
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
          <img src="/path-to-your-avatar.png" alt="Avatar" className="w-8 h-8 rounded-full" />
        </div>
      </div>
    </header>
  );
};

export default Header;
