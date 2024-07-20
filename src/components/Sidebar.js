// src/components/Sidebar.js
import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col h-screen">
      <div className="flex items-center justify-center p-4">
        <img src="/path-to-your-logo.png" alt="Logo" className="w-12 h-12 rounded-full" />
        <span className="ml-2 text-lg font-bold">Bridging Abilities</span>
      </div>
      <nav className="flex-1">
        <ul>
          <li className="px-4 py-2 hover:bg-blue-700">
            <a href="#">Home Page</a>
          </li>
          <li className="px-4 py-2 hover:bg-blue-700">
            <a href="#">Patient</a>
            <ul className="pl-4">
              <li className="px-4 py-2 hover:bg-blue-700">
                <a href="#">View Patient</a>
              </li>
              <li className="px-4 py-2 hover:bg-blue-700">
                <a href="#">Add New Patient</a>
              </li>
            </ul>
          </li>
          <li className="px-4 py-2 hover:bg-blue-700">
            <a href="#">Schedule</a>
          </li>
          <li className="px-4 py-2 hover:bg-blue-700">
            <a href="#">Invoice</a>
          </li>
          <li className="px-4 py-2 hover:bg-blue-700">
            <a href="#">Staff Management</a>
          </li>
          <li className="px-4 py-2 hover:bg-blue-700">
            <a href="#">Account</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
