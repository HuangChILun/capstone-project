"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";
import AppointmentCard from "@/app/components/HomeUi/appointment-card";
import InvoiceSection from "@/app/components/HomeUi/invoice-display";

export default function Homepage() {
  const [activeClients, setActiveClients] = useState(0);
  const [waitlistClients, setWaitlistClients] = useState(0);
  const [assignedClients, setAssignedClients] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0); // Placeholder for pending tasks
  const [invoiceAmount, setInvoiceAmount] = useState(0); // Placeholder for invoice amount
  const user = JSON.parse(localStorage.getItem("user"));
  const router = useRouter();

  // Role-based logic

  const access = () => {
    if (user.isAdmin === 1) {
      return true;
    } else {
      return false;
    }
  };
  const isAdmin = access();
  useEffect(() => {
    const fetchPatients = async () => {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/");
        console.log("need login");
        return;
      }

      try {
        // Fetch clients data (if necessary for both roles)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/patients/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const allPatients = [...data];
          let active = 0;

          for (const patient of allPatients) {
            if (patient.currentStatus === 1) {
              active++;
            }
          }
          setActiveClients(active);
        } else {
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, [router]);
  //Test data
  const testAppointments = [
    { patientName: "John Doe", date: "2024-10-10", time: "10:30 AM" },
    { patientName: "Jane Smith", date: "2024-10-12", time: "2:00 PM" },
    { patientName: "Sam Wilson", date: "2024-10-03", time: "9:00 AM" },
    { patientName: "Anna Johnson", date: "2024-10-15", time: "11:00 AM" },
  ];
  // Mock Monthly Data (Bar Chart Data)
  const testMonthlyData = {
    January: 1500,
    February: 2000,
    March: 1800,
    April: 2200,
    May: 2500,
    June: 2300,
    July: 1700,
    August: 1900,
    September: 2400,
    October: 2100,
    November: 1600,
    December: 3000,
  };

  // Mock Client Breakdown Data (Pie Chart Data by Month)
  const testClientData = {
    January: {
      "John Doe": 500,
      "Jane Smith": 300,
      "Anna Johnson": 700,
    },
    February: {
      "John Doe": 800,
      "Jane Smith": 500,
      "Anna Johnson": 700,
    },
    March: {
      "John Doe": 600,
      "Jane Smith": 600,
      "Anna Johnson": 600,
    },
    April: {
      "John Doe": 1000,
      "Jane Smith": 800,
      "Anna Johnson": 400,
    },
    May: {
      "John Doe": 1300,
      "Jane Smith": 900,
      "Anna Johnson": 300,
    },
    June: {
      "John Doe": 1000,
      "Jane Smith": 800,
      "Anna Johnson": 500,
    },
    July: {
      "John Doe": 800,
      "Jane Smith": 500,
      "Anna Johnson": 400,
    },
    August: {
      "John Doe": 900,
      "Jane Smith": 600,
      "Anna Johnson": 400,
    },
    September: {
      "John Doe": 1200,
      "Jane Smith": 800,
      "Anna Johnson": 400,
    },
    October: {
      "John Doe": 1000,
      "Jane Smith": 700,
      "Anna Johnson": 400,
    },
    November: {
      "John Doe": 900,
      "Jane Smith": 500,
      "Anna Johnson": 200,
    },
    December: {
      "John Doe": 1500,
      "Jane Smith": 1000,
      "Anna Johnson": 500,
    },
  };

  // Function to filter appointments within 2 weeks
  function filterUpcomingAppointments(appointments) {
    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14);

    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= today && appointmentDate <= twoWeeksFromNow;
    });
  }

  const upcomingAppointments = filterUpcomingAppointments(testAppointments);
  return (
    <div style={homepageStyle.homepageContainer}>
      {/* Fixed Top Navigation Bar */}
      <HoriNav user={user} />

      <div style={homepageStyle.homepageContent}>
        {/* Old Sidebar Navigation */}
        {/* <Nav access={isAdmin} /> */}

        {/* Main Content */}
        <main style={homepageStyle.mainContent}>
          <div>
            <h2 style={homepageStyle.sectionTitle}>
              Welcome, {user.firstName} {user.lastName}
            </h2>

            <div style={homepageStyle.gridLayout}>
              {/* Admin: Active Clients */}
              {isAdmin && (
                <div style={homepageStyle.dashboardCard}>
                  <p style={homepageStyle.cardTitle}>Active Clients</p>
                  <p style={homepageStyle.cardValue}>{activeClients}</p>
                </div>
              )}

              {/* Admin: Waitlisted Clients */}
              {isAdmin && (
                <div style={homepageStyle.dashboardCard}>
                  <p style={homepageStyle.cardTitle}>Waitlisted Clients</p>
                  <p style={homepageStyle.cardValue}>{waitlistClients}</p>
                </div>
              )}
              {/* Service Provider: Assigned Clients */}
              {!isAdmin && (
                <div style={homepageStyle.dashboardCard}>
                  <p style={homepageStyle.cardTitle}>Assigned Clients</p>
                  <p style={homepageStyle.cardValue}>{activeClients}</p>
                </div>
              )}

              {/* Shared: Upcoming Appointments for both Admin and Service Provider */}
              <div style={homepageStyle.dashboardCard}>
                <p style={homepageStyle.cardTitle}>Upcoming Appointments</p>
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment, index) => (
                    <AppointmentCard key={index} appointment={appointment} />
                  ))
                ) : (
                  <p>No upcoming appointments within the next two weeks.</p>
                )}
              </div>

              {/* Shared: Invoice for both Admin and Service Provider */}
              <div
                style={{
                  ...homepageStyle.dashboardCard,
                  ...homepageStyle.invoiceCard,
                }}
              >
                <p style={homepageStyle.cardTitle}>Invoice</p>
                {/* <p style={homepageStyle.cardValue}>$ {invoiceAmount}</p> */}
                <InvoiceSection
                  monthlyData={testMonthlyData}
                  clientData={testClientData}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Styles
const homepageStyle = {
  homepageContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  homepageContent: {
    display: "flex",
    flex: 1,
    paddingTop: "60px",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  gridLayout: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    justifyContent: "center",
  },
  dashboardCard: {
    padding: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "500",
    marginBottom: "10px",
  },
  cardValue: {
    fontSize: "36px",
    fontWeight: "bold",
  },
  invoiceCard: {
    gridColumn: "span 3",
  },
  placeholderChart: {
    width: "100%",
    height: "200px",
    backgroundColor: "#e5e5e5",
    marginTop: "20px",
  },
};
