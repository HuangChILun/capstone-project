import React from 'react';
import InvoiceChart from './InvoiceChart';
import InvoiceTable from './InvoiceTable';

function InvoiceSection() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-bold mb-4">Invoice Received</h3>
      <div className="flex space-x-4 mb-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">All</button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded">This Month</button>
        <button className="px-4 py-2 bg-white text-gray-700 rounded">This Year</button>
      </div>
      <div className="flex">
        <InvoiceChart />
        <InvoiceTable />
      </div>
    </div>
  );
}

export default InvoiceSection;