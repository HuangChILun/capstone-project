import React from 'react';
import StatCard from './StatCard';
import InvoiceSection from './InvoiceSection';

function Dashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">John Doe, Welcome!</h2>
      <p className="text-gray-600 mb-8">Admin</p>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard title="Active Clients" value={50} increase="12%" />
        <StatCard title="Waitlisted Clients" value={50} chart="purple" />
        <StatCard title="Pending Tasks" value={2} chart="blue" />
      </div>

      <InvoiceSection />
    </div>
  );
}

export default Dashboard;