"use client";
import React, { useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

// Register the required components
ChartJS.register(
  BarElement, // For Bar charts
  CategoryScale, // For Category scale on X-axis
  LinearScale, // For Linear scale on Y-axis
  ArcElement, // For Pie charts
  Tooltip,
);

export default function InvoiceSection({ monthlyData, clientData }) {
    const [mode, setMode] = useState("monthly"); // Default to 'monthly' mode
    const [selectedMonth, setSelectedMonth] = useState(null); // Track selected month
  // Ensure all 12 months are present in the data
  const allMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Fill missing months with 0
  const completeMonthlyData = allMonths.reduce((acc, month) => {
    acc[month] = monthlyData[month] || 0; // If month is missing in monthlyData, set it to 0
    return acc;
  }, {});

  const handleBarClick = (elements) => {
    if (elements.length === 0) return; // No bar clicked
    const monthIndex = elements[0].index; // Get the index of the clicked bar
    const monthName = allMonths[monthIndex]; // Get the month name from the index
    setSelectedMonth(monthName); // Set the selected month for pie chart
    setMode("detailed"); // Switch to detailed mode to show pie chart
  };

//   // Toggle between monthly total mode and detail mode
//   const toggleMode = () => {
//     setMode((prevMode) => (prevMode === "monthly" ? "detailed" : "monthly"));
//   };

  // Monthly Bar Chart Data
  const monthlyChartData = {
    labels: allMonths,
    datasets: [
      {
        label: "Monthly Invoice Total",
        data: Object.values(completeMonthlyData),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Pie Chart Data (Detailed by Clients)
  const clientChartData = {
    labels: Object.keys(clientData[selectedMonth] || {}),
    datasets: [
      {
        label: "$",
        data: Object.values(clientData[selectedMonth] || {}),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverOffset: 4,
      },
    ],
  };
// Chart options for bar click and tooltips
const barChartOptions = {
    onClick: (event, elements) => handleBarClick(elements), // Add onClick handler for bars
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const month = tooltipItem.label;
            const invoiceAmount = tooltipItem.raw;
            return `${month}: $${invoiceAmount}`;
          },
        },
      },
    },
  };
  // Chart options for tooltips
  const pieChartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const client = tooltipItem.label;
            const invoiceAmount = tooltipItem.raw; // This gets the invoice amount
            return `${client}: $${invoiceAmount}`; // Custom format for the tooltip
          },
        },
      },
    },
  };

  return (
    <div style={styles.invoiceSection}>
      {/* Conditionally Render the Top Right Button Only in Pie Chart Mode */}
      {mode === "detailed" && (
        <button
          onClick={() => setMode("monthly")} // Go back to bar chart when clicked
          style={styles.toggleButton}
        >
          Back to Monthly Breakdown
        </button>
      )}

      {/* Conditionally Render Chart Based on Mode */}
      {mode === "monthly" ? (
        <div style={styles.chartContainer}>
          <h3>Monthly Invoice Totals</h3>
          <Bar data={monthlyChartData} options={barChartOptions} height={50} />
        </div>
      ) : (
        <div style={styles.chartContainer}>
          <h3>Invoice Breakdown for {selectedMonth}</h3>
          <div style={styles.pieChartContainer}>
            <Pie data={clientChartData} options={pieChartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}

// Inline styles
const styles = {
  invoiceSection: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    position: "relative", // This allows us to position the toggle button within the section
  },
  toggleButton: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    position: "absolute", // Absolute position for top-right corner
    top: "10px",
    right: "20px",
  },
  chartContainer: {
    width: "100%",
    height: "200px",
    display: "flex",
    justifyContent: "center", // Center the chart horizontally
    flexDirection: "column",
    alignItems: "center", // Center the chart container contents
  },
  pieChartContainer: {
    width: "200px", // Ensure pie chart has a fixed size
    height: "200px",
    display: "flex",
    justifyContent: "center", // Center the pie chart horizontally
  },
};
