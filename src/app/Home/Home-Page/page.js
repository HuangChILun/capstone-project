"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";
import AppointmentCard from "@/app/components/HomeUi/appointment-card";
import InvoiceSection from "@/app/components/HomeUi/invoice-display";

export default function Homepage() {
  const [activeClients, setActiveClients] = useState(0);
  const [activeWaitlist, setActiveWaitlist] = useState(0);
  const [archivedClients, setArchivedClients] = useState(0);
  const [archivedWaitlist, setArchivedWaitlist] = useState(0);
  const [invoiceData, setInvoiceData] = useState();
  const [assignedClients, setAssignedClients] = useState(0);
  // const [pendingTasks, setPendingTasks] = useState(0); // Placeholder for pending tasks
  // const [invoiceAmount, setInvoiceAmount] = useState(0); // Placeholder for invoice amount
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Role-based logic

  useEffect(() => {
    const token = Cookies.get("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/");
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser.isAdmin === 1);
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const fetchPatients = async () => {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/");
        console.log("need login");
        return;
      }

      try {
        // Fetch clients data
        if (user.isAdmin === 1) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_IP}/clients/`,
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
            let inactive = 0;

            for (const patient of allPatients) {
              if (patient.currentStatus === 1) {
                active++;
              } else {
                inactive++;
              }
            }
            setActiveClients(active);
            setArchivedClients(inactive);
          } else {
            // Handle error
          }

          const waitlistResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_IP}/waitlist-client/getAllWaitlistClient`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (waitlistResponse.ok) {
            const wlData = await waitlistResponse.json();
            const allWaitlist = [...wlData];
            let wlActive = 0;
            let wlInactive = 0;

            for (const client of allWaitlist) {
              if (client.isArchived === 0) {
                wlActive++;
              } else {
                wlInactive++;
              }
            }
            setActiveWaitlist(wlActive);
            setArchivedWaitlist(wlInactive);
          }
        } else {
          const assignedResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_IP}/team-member/user/${user.userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (assignedResponse.ok){
            const assignedClients = await assignedResponse.json()
            console.log(assignedClients);
            setAssignedClients(assignedClients.length);
          }
        }

        const invoiceResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/invoice/${user.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (invoiceResponse.ok) {
          const invoiceData = await invoiceResponse.json();
          console.log(invoiceData);
          setInvoiceData(invoiceData);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, [user, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }
  // Function to filter appointments within 2 weeks
  // function filterUpcomingAppointments(appointments) {
  //   const today = new Date();
  //   const twoWeeksFromNow = new Date();
  //   twoWeeksFromNow.setDate(today.getDate() + 14);

  //   return appointments.filter((appointment) => {
  //     const appointmentDate = new Date(appointment.date);
  //     return appointmentDate >= today && appointmentDate <= twoWeeksFromNow;
  //   });
  // }

  // const upcomingAppointments = filterUpcomingAppointments(testAppointments);
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
                <div
                  style={{
                    ...homepageStyle.dashboardCard,
                    backgroundColor: "white",
                  }}
                >
                  <p style={homepageStyle.cardTitle}>Active Clients</p>
                  <p style={homepageStyle.cardValue}>{activeClients}</p>
                </div>
              )}

              {/* Admin: Waitlisted Clients */}
              {isAdmin && (
                <div
                  style={{
                    ...homepageStyle.dashboardCard,
                    backgroundColor: "white",
                  }}
                >
                  <p style={homepageStyle.cardTitle}>Waitlisted Clients</p>
                  <p style={homepageStyle.cardValue}>{activeWaitlist}</p>
                </div>
              )}
              {/* Admin: Waitlisted Clients */}
              {isAdmin && (
                <div
                  style={{
                    ...homepageStyle.dashboardCard,
                    backgroundColor: "white",
                  }}
                >
                  <p style={homepageStyle.cardTitle}>Archived Clients</p>
                  <p style={homepageStyle.cardValue}>{archivedClients}</p>
                </div>
              )}
              {/* Admin: Waitlisted Clients */}
              {isAdmin && (
                <div
                  style={{
                    ...homepageStyle.dashboardCard,
                    backgroundColor: "white",
                  }}
                >
                  <p style={homepageStyle.cardTitle}>Archived Waitlist</p>
                  <p style={homepageStyle.cardValue}>{archivedWaitlist}</p>
                </div>
              )}
              {/* Service Provider: Assigned Clients */}
              {!isAdmin && (
                <div style={homepageStyle.dashboardCard}>
                  <p style={homepageStyle.cardTitle}>Assigned Clients</p>
                  <p style={homepageStyle.cardValue}>{assignedClients}</p>
                </div>
              )}

              {/* Shared: Upcoming Appointments for both Admin and Service Provider */}
              {/* <div style={homepageStyle.dashboardCard}>
                <p style={homepageStyle.cardTitle}>Upcoming Appointments</p>
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment, index) => (
                    <AppointmentCard key={index} appointment={appointment} />
                  ))
                ) : (
                  <p>No upcoming appointments within the next two weeks.</p>
                )}
              </div> */}

              {/* Shared: Invoice for both Admin and Service Provider */}
              <div
                style={{
                  ...homepageStyle.dashboardCard,
                  ...homepageStyle.invoiceCard,
                }}
              >
                <p style={homepageStyle.cardTitle}>Invoice</p>
                {/* <p style={homepageStyle.cardValue}>$ {invoiceAmount}</p> */}
                <InvoiceSection invoice={invoiceData} />
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
    gridTemplateColumns: "repeat(4, minmax(300px, 1fr))",
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
    gridColumn: "span 4",
  },
  placeholderChart: {
    width: "100%",
    height: "200px",
    backgroundColor: "#e5e5e5",
    marginTop: "20px",
  },
};
