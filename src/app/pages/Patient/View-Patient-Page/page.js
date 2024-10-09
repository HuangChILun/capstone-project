"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button } from "@/app/components/HomeUi/button"
import { Input } from "@/app/components/HomeUi/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/HomeUi/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/HomeUi/tabs"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/app/components/HomeUi/table"
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";

export default function ViewPatient() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPatients = async () => {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/');
        console.log("need login");
        return;
      }

      try {
        setIsLoading(true);
        const allPatients = [];
        for (let i = 1; i <= 4; i++) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/auth/patients/${i}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            if (response.status === 404) {
              // If patient not found, skip to the next one
              continue;
            }
            throw new Error(`Failed to fetch patient ${i}`);
          }
          const data = await response.json();
          allPatients.push(data);
        }
        setPatients(allPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchPatients();
  }, [router]);

  const filteredPatients = patients.filter(patient =>
    patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  const handleAddPatient = () => {
    router.push('/pages/Patient/Add-New-Patient'); 
  };
  return (
    <div style={styles.pageContainer}>
      <HoriNav user={user} />
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <div style={styles.searchContainer}>
            <Input
              type="text"
              placeholder="input patient name..."
              style={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button style={styles.searchButton}>
              <SearchIcon style={styles.iconSmall} />
              Search
            </Button>
          </div>
          <div style={styles.rightHeaderSection}>
            <Button style={styles.searchButton} onClick={handleAddPatient}>Add New Patient</Button>
          </div>

        </header>
        <Tabs defaultValue="active" style={styles.tabs}>
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <Table style={styles.table}>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Primary Guardian</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.clientId}>
                    <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                    <TableCell>{patient.guardianName || "N/A"}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>
                      <Link href={`./View-Patient-Personal?id=${patient.clientId}`}>
                        <Button style={styles.viewButton}>
                          View
                        </Button>
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
  )
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
  iconLarge: {
    width: "24px",
    height: "24px",
    color: "#4B5563",
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