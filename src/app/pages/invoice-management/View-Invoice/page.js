"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import Link from "next/link"
import { Input } from '@/app/components/HomeUi/input';
import { Button } from '@/app/components/HomeUi/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/HomeUi/avatar"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/app/components/HomeUi/table"
import Nav from '@/app/components/Navigation-Bar/NavBar';
import HoriNav from '@/app/components/Navigation-Bar/HoriNav';

export default function ViewInvoice() {
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("user"));
  
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  const handleAddInvoice = () => {
    router.push('/pages/invoice-management/Add-Invoice'); 
  };
  return (
    <div style={styles.pageContainer}>
      <HoriNav user={user} />
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <div style={styles.searchContainer}>
            <Input type="text" placeholder="input Patient name..." style={styles.searchInput} />
            <Button style={styles.searchButton}>
              <SearchIcon style={styles.iconSmall} />
              Search
            </Button>
          </div>
          <div style={styles.rightHeaderSection}>
            <Button style={styles.searchButton} onClick={handleAddInvoice}>Add New Invoice</Button>
          </div>
        </header>
        <section style={styles.tableSection}>
          <Table style={styles.table}>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Service Provider Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>061524001</TableCell>
                <TableCell>Albert Christoff</TableCell>
                <TableCell>Kevin Huang</TableCell>
                <TableCell>OT</TableCell>
                <TableCell>
                  <Link href="./View-Invoice-Personal">
                    <Button style={styles.viewButton}>View</Button>
                  </Link>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>123456789</TableCell>
                <TableCell>Albert Christoff</TableCell>
                <TableCell>Bella Jones</TableCell>
                <TableCell>Aide</TableCell>
                <TableCell>
                  <Link href="./View-Invoice-Personal">
                    <Button style={styles.viewButton}>View</Button>
                  </Link>
                </TableCell>
              </TableRow>
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
    backgroundColor: "#f7fafc",
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
  tableSection: {
    marginTop: "24px",
  },
  table: {
    width: "100%",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    padding: "16px",
  },
  viewButton: {
    border: "1px solid #e5e5e5",
    padding: "8px 16px",
    cursor: "pointer",
  },
};