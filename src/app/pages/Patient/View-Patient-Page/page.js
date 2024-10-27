"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/app/components/HomeUi/button";
import { Input } from "@/app/components/HomeUi/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/app/components/HomeUi/table";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/HomeUi/tabs";
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";

export default function ViewPatient() {
  const [patients, setPatients] = useState([]);
  const [waitlistClients, setWaitlistClients] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchWaitlist = async () => {
      if (!token) {
        router.push("/");
        console.log("need login");
        return;
      }
      try {
        const waitlistResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/waitlist-client/getAllWaitlistClient`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!waitlistResponse.ok) {
          throw new Error("Failed to fetch waitlist clients");
        }
        const waitlistData = await waitlistResponse.json();
        setWaitlistClients(waitlistData);
      } catch (error) {
        console.error("Error fetching waitlist data:", error);
        setError(error.message);
      }
    };

    const fetchPatients = async () => {
      try {
        const patientResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/clients`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!patientResponse.ok) {
          throw new Error("Failed to fetch clients");
        }

        const patientData = await patientResponse.json();
        setPatients(patientData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWaitlist();
    fetchPatients();
  }, [router, token]);

  // Filter active and archived patients based on currentStatus
  const activePatients = patients.filter(
    (patient) => patient.currentStatus === 1 || patient.currentStatus === null
  );
  const archivedPatients = patients.filter(
    (patient) => patient.currentStatus !== 1 && patient.currentStatus !== null
  );
  // Filter waitlist clients based on isArchived value
  const activeWaitlistClients = waitlistClients.filter(
    (client) => client.isArchived === 0 || client.isArchived === null
  );

  const archivedWaitlistClients = waitlistClients.filter(
    (client) => client.isArchived === 1 || client.isArchived === true
  );

  // Further filter patients by search input
  const filteredActivePatients = activePatients.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(searchInput.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchInput.toLowerCase())
  );
  const filteredArchivedPatients = archivedPatients.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(searchInput.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleAddPatient = () => {
    router.push("/pages/Patient/Add-New-Patient");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.pageContainer}>
      <HoriNav user={user} />
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <div style={styles.searchContainer}>
            <Input
              type="text"
              placeholder="Search by client name"
              style={styles.searchInput}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div style={styles.rightHeaderSection}>
            <Button style={styles.searchButton} onClick={handleAddPatient}>
              Add New Client
            </Button>
          </div>
        </header>

        <Tabs defaultValue="active" style={styles.tabs}>
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
            <TabsTrigger value="active-archived">Active Archived</TabsTrigger>
            <TabsTrigger value="waitlist-archived">
              Waitlist Archived
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Table style={styles.table}>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivePatients.map((patient) => (
                  <TableRow key={patient.clientId}>
                    <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                    <TableCell>{patient.phoneNumber}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>
                      <Link
                        href={`./View-Patient-Personal?clientId=${patient.clientId}`}
                      >
                        <Button style={styles.viewButton}>View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="waitlist">
            <Table style={styles.table}>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Date Placed</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Service Needed</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeWaitlistClients.map((client) => (
                  <TableRow key={client.waitlistClientId}>
                    <TableCell>{`${client.firstName} ${client.lastName}`}</TableCell>
                    <TableCell>
                      {new Date(client.datePlaced).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>{client.phoneNumber}</TableCell>
                    <TableCell>{client.serviceNeeded}</TableCell>
                    <TableCell>
                      <Link
                        href={`./view-waitlist-client?waitlistClientId=${client.waitlistClientId}`}
                      >
                        <Button style={styles.viewButton}>View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="active-archived">
            <Table style={styles.table}>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArchivedPatients.map((patient) => (
                  <TableRow key={patient.clientId}>
                    <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                    <TableCell>{patient.phoneNumber}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>
                      <Link
                        href={`./View-Patient-Personal?clientId=${patient.clientId}`}
                      >
                        <Button style={styles.viewButton}>View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="waitlist-archived">
            <Table style={styles.table}>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Date Placed</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Service Needed</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archivedWaitlistClients.map((client) => (
                  <TableRow key={client.waitlistClientId}>
                    <TableCell>{`${client.firstName} ${client.lastName}`}</TableCell>
                    <TableCell>
                      {new Date(client.datePlaced).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>{client.phoneNumber}</TableCell>
                    <TableCell>{client.serviceNeeded}</TableCell>
                    <TableCell>
                      <Link
                        href={`./view-waitlist-client?waitlistClientId=${client.waitlistClientId}`}
                      >
                        <Button style={styles.viewButton}>View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

// Styles
const styles = {
  pageContainer: {
    display: "flex",
    height: "100vh",
  },
  mainContent: {
    flex: 1,
    padding: "84px",
    backgroundColor: "#ffffff",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "16px",
    borderBottom: "1px solid #e5e5e5",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  searchInput: {
    width: "256px",
  },
  searchButton: {
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    cursor: "pointer",
  },
  rightHeaderSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  iconSmall: {
    width: "16px",
    height: "16px",
    marginRight: "8px",
  },
  tabs: {
    marginTop: "16px",
  },
  table: {
    marginTop: "16px",
  },
  viewButton: {
    border: "1px solid #e5e5e5",
    padding: "8px 16px",
    cursor: "pointer",
  },
};
