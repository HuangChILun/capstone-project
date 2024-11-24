"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from "next/link"
import { Input } from "@/app/components/HomeUi/input"
import { Button } from "@/app/components/HomeUi/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/app/components/HomeUi/table"
import HoriNav from '@/app/components/Navigation-Bar/HoriNav';

export const dynamic = 'force-dynamic';

export default function ViewStaff() {
  const [staff, setStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("name");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const router = useRouter();

  useEffect(() => {
    const fetchStaff = async () => {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/');
        console.log("need login");
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/users`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch staff');
        }
        const data = await response.json();
        setStaff(data);
      } catch (error) {
        console.error('Error fetching staff:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [router]);

  const filteredStaff = staff.filter(s => {
    if (filterType === "name") {
      return (
        s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (filterType === "role") {
      return s.role && s.role.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const access = () => {
    if (user.isAdmin === 1) {
      return true;
    } else {
      return false;
    }
  }
  const isAdmin = access();
  const handleAddStaff = () => {
    router.push("/pages/Staff-Management/Add-New-Staff");
  };

  return (
    <div style={styles.pageContainer}>
      <HoriNav user={user} />
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <div style={styles.searchContainer}>
            <Input
              type="text"
              placeholder={`Search by staff ${filterType}`}
              style={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/*  
            <Button style={styles.searchButton}>
              <SearchIcon style={styles.iconSmall} />
              Search
            </Button>
            */}
            <select style={styles.filterDropdown} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="name">Name</option>
              <option value="role">Role</option>
            </select>
          </div>
          <div style={styles.rightHeaderSection}>
            <Button style={styles.searchButton} onClick={handleAddStaff}>
              Add New Staff
            </Button>
          </div>
        </header>
        <section style={styles.section}>
          <Table style={styles.table}>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((staff) => (
                <TableRow key={staff.staffId}>
                  <TableCell>{`${staff.firstName} ${staff.lastName}`}</TableCell>
                  <TableCell>{staff.role || "N/A"}</TableCell>
                  <TableCell>{staff.phoneNumber}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>
                  <Link href={`./View-Staff-Personal?userId=${staff.userId}`}>
                    <Button style={styles.viewButton}>View</Button>
                  </Link>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
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
  filterDropdown: {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "8px",
    marginLeft: "8px",
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
  section: {
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