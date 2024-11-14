"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import Link from 'next/link';

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/HomeUi/tabs";
import { Input } from '@/app/components/HomeUi/input';
import { Button } from '@/app/components/HomeUi/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/app/components/HomeUi/table";
import HoriNav from '@/app/components/Navigation-Bar/HoriNav';

export default function StaffInvoicesPage() {
  const router = useRouter();
  const [staffList, setStaffList] = useState([]);
  const [markedStaff, setMarkedStaff] = useState([]);
  const [unmarkedStaff, setUnmarkedStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/');
    } else {
      fetchStaffAndInvoices(token);
    }
  }, [router]);

  const fetchStaffAndInvoices = async (token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all staff
      const staffResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/users`,
        { headers }
      );

      // Fetch all invoices
      const invoicesResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/invoice`,
        { headers }
      );

      const staffData = staffResponse.data;
      const invoicesData = invoicesResponse.data;

      // Categorize staff based on invoice isGiven status
      const marked = [];
      const unmarked = [];

      staffData.forEach((staff) => {
        const staffInvoices = invoicesData.filter(
          (invoice) => invoice.userId === staff.userId
        );

        if (staffInvoices.length === 0) {
          // If staff has no invoices, decide where to place them. Here, we add them to 'Unmarked'.
          unmarked.push(staff);
        } else {
          const allInvoicesGiven = staffInvoices.every(
            (invoice) => invoice.isGiven === 1 || invoice.isGiven === true
          );

          if (allInvoicesGiven) {
            // All invoices have isGiven === true
            marked.push(staff);
          } else {
            // Has at least one invoice with isGiven === false
            unmarked.push(staff);
          }
        }
      });

      setStaffList(staffData);
      setMarkedStaff(marked);
      setUnmarkedStaff(unmarked);
    } catch (error) {
      console.error('Error fetching staff and invoices:', error);
    }
  };

  const handleAddInvoice = () => {
    router.push('/pages/invoice-management/Add-Invoice');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMarkedStaff = markedStaff.filter(
    (staff) =>
      staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUnmarkedStaff = unmarkedStaff.filter(
    (staff) =>
      staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStaffTable = (staffArray) => {
    return (
      <Table style={styles.table}>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffArray.map((staff) => (
            <TableRow key={staff.userId}>
              <TableCell>{staff.firstName}</TableCell>
              <TableCell>{staff.lastName}</TableCell>
              <TableCell>{staff.email}</TableCell>
              <TableCell>{staff.role}</TableCell>
              <TableCell>
                <Link href={`./View-Invoice-Personal?userId=${staff.userId}`}>
                  <Button style={styles.viewButton}>View Invoices</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div style={styles.pageContainer}>
      <HoriNav user={user} />
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <div style={styles.searchContainer}>
            <Input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={handleSearch}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.rightHeaderSection}>
            <Button style={styles.searchButton} onClick={handleAddInvoice}>
              Add New Invoice
            </Button>
          </div>
        </header>
        <section style={styles.tableSection}>
          <Tabs defaultValue="unmarked" style={styles.tabs}>
            <TabsList>
              <TabsTrigger value="unmarked">Unmarked</TabsTrigger>
              <TabsTrigger value="marked">Marked</TabsTrigger>
            </TabsList>

            <TabsContent value="unmarked">
              {renderStaffTable(filteredUnmarkedStaff)}
            </TabsContent>
            <TabsContent value="marked">
              {renderStaffTable(filteredMarkedStaff)}
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
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
