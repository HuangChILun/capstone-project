import React from 'react';

const invoiceData = [
  { name: 'Elit mauris', percentage: 28.79, amount: 4544 },
  { name: 'Mauris non', percentage: 21.04, amount: 4544 },
  { name: 'Egestas facilisis', percentage: 19.73, amount: 4544 },
  { name: 'Tellus, at', percentage: 14.83, amount: 4544 },
  { name: 'Pharetra, donec', percentage: 7.80, amount: 4544 },
  { name: 'Aliquam amet', percentage: 7.80, amount: 4544 },
];

function InvoiceTable() {
  return (
    <table className="w-1/2 ml-8">
      <thead>
        <tr>
          <th className="text-left">Invoice</th>
          <th className="text-right">Percentage</th>
          <th className="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        {invoiceData.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td className="text-right">{item.percentage}%</td>
            <td className="text-right">${item.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default InvoiceTable;