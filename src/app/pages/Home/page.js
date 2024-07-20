"use client"
import React from 'react';
import Sidebar from '../../../components/Sidebar.js';
import Header from '../../../components/Header.js';
import Dashboard from '../../../components/Dashboard.js';

function Home() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default Home;