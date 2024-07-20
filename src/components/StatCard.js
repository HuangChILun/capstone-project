import React from 'react';

function StatCard({ title, value, increase, chart }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold mb-2">{value}</p>
      {increase && (
        <p className="text-green-500 text-sm">Increase {increase} compared to last year</p>
      )}
      {chart && (
        <div className={`h-16 bg-${chart}-100 mt-4`}></div>
      )}
    </div>
  );
}

export default StatCard;