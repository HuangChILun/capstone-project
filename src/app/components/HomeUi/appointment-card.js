"use client";

import React from 'react';

export default function AppointmentCard({ appointment }) {
  // Format the date to show only the abbreviated month and day
  const formattedDate = new Date(appointment.date).toLocaleDateString("en-US", {
    month: "short", // Abbreviated month (e.g., "Oct")
    day: "numeric", // Numeric day (e.g., "10")
  });
  return (
    <div style={styles.card}>
      <div style={styles.date}>{formattedDate}</div>
      <div style={styles.patientName}>{appointment.patientName}</div>
      <div style={styles.time}>{appointment.time}</div>
    </div>
  );
}

// Styles
const styles = {
  card: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr", // Three columns with proportional widths
    alignItems: "center", // Vertically center the content
    padding: "10px 20px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "10px",
    fontFamily: "Arial, sans-serif",
  },
  patientName: {
    fontWeight: "center",
    gridColumn: "2", 
  },
  date: {
    textAlign: "bold",
    gridColumn: "1", 
  },
  time: {
    textAlign: "right",
    gridColumn: "3", 
  },
};
