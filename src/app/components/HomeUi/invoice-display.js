"use client";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { Button } from "./button";

// Register the required components
ChartJS.register(
  BarElement, // For Bar charts
  CategoryScale, // For Category scale on X-axis
  LinearScale, // For Linear scale on Y-axis
  ArcElement, // For Pie charts
  Tooltip
);

export default function InvoiceSection({ invoice }) {
  const [invoiceData, setInvoiceData] = useState([]);
  const [mode, setMode] = useState("monthly"); // Default to 'monthly' mode
  const [selectedMonth, setSelectedMonth] = useState(null); // Track selected month
  const [selectedYear, setSelectedYear] = useState(""); // Track selected year
  const [availableYears, setAvailableYears] = useState([]); // Store available years

  // Populate invoiceData from props and extract available years
  useEffect(() => {
    if (invoice && Array.isArray(invoice)) {
      setInvoiceData(invoice);

      // Extract unique years from invoice data
      const years = [...new Set(invoice.map((item) => new Date(item.month).getFullYear()))];
      setAvailableYears(years);
      // Set the default year to the most recent year available
      if (years.length > 0) {
        setSelectedYear(years[0]);
      }
    }
  }, [invoice]);

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

  // Filter invoice data by the selected year
  const filteredInvoiceData = invoiceData.filter(
    (item) => new Date(item.month).getFullYear() === selectedYear
  );

  // Transform filtered invoice data to match mock format (use only month names)
  const monthlyData = filteredInvoiceData.reduce((acc, item) => {
    const date = new Date(item.month);
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(date); // Get only the month name (e.g., "July")

    if (!acc[monthName]) {
      acc[monthName] = 0;
    }

    acc[monthName] += item.rate * item.hours;

    return acc;
  }, {});

  // Transform filtered invoice data for client breakdown
  const clientData = filteredInvoiceData.reduce((acc, item) => {
    const date = new Date(item.month);
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(date);

    if (!acc[monthName]) {
      acc[monthName] = {};
    }

    const clientName = `${item.firstName} ${item.lastName}`;
    if (!acc[monthName][clientName]) {
      acc[monthName][clientName] = 0;
    }

    acc[monthName][clientName] += item.rate * item.hours;

    return acc;
  }, {});

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

  // Monthly Bar Chart Data
  const monthlyChartData = {
    labels: allMonths,
    datasets: [
      {
        label: "Monthly Invoice Total",
        data: allMonths.map((month) => completeMonthlyData[month]),
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
    onClick: (event, elements) => handleBarClick(elements),
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
      {/* Dropdown to select year */}
      <div style={styles.yearDropdown}>
        <label htmlFor="year-select">Select Year: </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Conditionally Render the Top Right Button Only in Pie Chart Mode */}
      {mode === "detailed" && (
        <Button
          onClick={() => setMode("monthly")} // Go back to bar chart when clicked
          style={styles.toggleButton}
        >
          Back to Monthly Breakdown
        </Button>
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
    position: "relative",
  },
  yearDropdown: {
    marginBottom: "20px",
  },
  toggleButton: {
    padding: "10px 20px",
    cursor: "pointer",
    position: "absolute",
    top: "10px",
    right: "20px",
  },
  chartContainer: {
    width: "100%",
    height: "200px",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  pieChartContainer: {
    width: "200px",
    height: "200px",
    display: "flex",
    justifyContent: "center",
  },
};
