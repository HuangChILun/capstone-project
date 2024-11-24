"use client";

export const dynamic = 'force-dynamic';

import React from 'react';
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { Button } from "@/app/components/HomeUi/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/HomeUi/tabs";
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";
import { Input } from "@/app/components/HomeUi/input";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/app/components/HomeUi/table";


export default function ViewStaffInvoices() {
  const [staffData, setStaffData] = useState(null);
  const [unmarkedInvoices, setUnmarkedInvoices] = useState([]);
  const [markedInvoices, setMarkedInvoices] = useState([]);
  const [editedUnmarkedInvoices, setEditedUnmarkedInvoices] = useState([]);
  const [editedMarkedInvoices, setEditedMarkedInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [staffId, setStaffId] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = Cookies.get("token");
    const storedUser = localStorage.getItem("user");
    const staffId = searchParams.get("userId");

    if (!token || !storedUser) {
      router.push("/");
    } else {
      setUser(JSON.parse(storedUser));
      setStaffId(staffId);
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (!staffId) return;

    fetchStaffData();
    fetchInvoices();
  }, [router, staffId]);

  const fetchStaffData = async () => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/users/${staffId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStaffData(response.data);
    } catch (error) {
      console.error("Error fetching staff data:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvoices = async () => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      setIsLoading(true);

      const invoicesResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/invoice/${staffId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const invoicesData = invoicesResponse.data;

      const unmarked = invoicesData.filter((invoice) => !invoice.isGiven);
      const marked = invoicesData.filter((invoice) => invoice.isGiven);

      setUnmarkedInvoices(unmarked);
      setMarkedInvoices(marked);

      if (isEditing) {
        setEditedUnmarkedInvoices(JSON.parse(JSON.stringify(unmarked)));
        setEditedMarkedInvoices(JSON.parse(JSON.stringify(marked)));
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setError("Error fetching invoices.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      setEditedUnmarkedInvoices(JSON.parse(JSON.stringify(unmarkedInvoices)));
      setEditedMarkedInvoices(JSON.parse(JSON.stringify(markedInvoices)));
    } else {
      setEditedUnmarkedInvoices([]);
      setEditedMarkedInvoices([]);
    }
  }, [isEditing]);

  const handleInvoiceChange = (
    e,
    index,
    editedInvoices,
    setEditedInvoices
  ) => {
    const { name, value } = e.target;
    const updatedInvoices = [...editedInvoices];
    updatedInvoices[index][name] =
      name === "rate" || name === "hours" ? parseFloat(value) : value;
    setEditedInvoices(updatedInvoices);
  };

  const handleInvoiceCheckboxChange = (
    index,
    editedInvoices,
    setEditedInvoices
  ) => {
    const updatedInvoices = [...editedInvoices];
    updatedInvoices[index].isGiven = !updatedInvoices[index].isGiven;
    setEditedInvoices(updatedInvoices);
  };

  const renderInvoiceTable = (
    invoices,
    isMarked,
    editedInvoices = null,
    setEditedInvoices = null
  ) => {
    const currentInvoices =
      isEditing && editedInvoices ? editedInvoices : invoices;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!staffData) return <div>No staff data found.</div>;
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rate</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Mark as Finished</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentInvoices.map((invoice, index) => (
            <TableRow key={invoice.invoiceId}>
              <TableCell>
                {isEditing ? (
                  <Input
                    name="rate"
                    type="number"
                    value={invoice.rate}
                    onChange={(e) =>
                      handleInvoiceChange(
                        e,
                        index,
                        editedInvoices,
                        setEditedInvoices
                      )
                    }
                  />
                ) : (
                  invoice.rate
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    name="hours"
                    type="number"
                    value={invoice.hours}
                    onChange={(e) =>
                      handleInvoiceChange(
                        e,
                        index,
                        editedInvoices,
                        setEditedInvoices
                      )
                    }
                  />
                ) : (
                  invoice.hours
                )}
              </TableCell>
              <TableCell>
                {(invoice.rate * invoice.hours).toFixed(2)}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    name="month"
                    type="month"
                    value={formatMonthInput(invoice.month)}
                    onChange={(e) =>
                      handleInvoiceChange(
                        e,
                        index,
                        editedInvoices,
                        setEditedInvoices
                      )
                    }
                  />
                ) : (
                  formatMonthDisplay(invoice.month)
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={invoice.isGiven}
                    onChange={() =>
                      handleInvoiceCheckboxChange(
                        index,
                        editedInvoices,
                        setEditedInvoices
                      )
                    }
                  />
                ) : (
                  <input
                    type="checkbox"
                    checked={invoice.isGiven}
                    disabled
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const handleSaveChanges = async () => {
    const token = Cookies.get("token");
    try {
      for (const invoice of editedUnmarkedInvoices) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/invoice/${invoice.invoiceId}`,
          {
            rate: invoice.rate,
            hours: invoice.hours,
            month: formatMonthForBackend(invoice.month),
            isGiven: invoice.isGiven,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      for (const invoice of editedMarkedInvoices) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/invoice/${invoice.invoiceId}`,
          {
            rate: invoice.rate,
            hours: invoice.hours,
            month: formatMonthForBackend(invoice.month),
            isGiven: invoice.isGiven,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      await fetchInvoices();

      setIsEditing(false);
      alert("Invoices updated successfully!");
    } catch (error) {
      console.error("Error saving invoice changes:", error);
      alert("Failed to save invoice changes.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUnmarkedInvoices([]);
    setEditedMarkedInvoices([]);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!staffData) return <div>No staff data found.</div>;

  return (
    <div>
      <HoriNav user={user} />
      <div className="p-4 ml-8 mt-2 pt-20">
        <Link href="./View-Invoice">
          <div className="flex items-center mb-4">
            <ArrowLeftIcon className="h-6 w-6 mr-2" />
            <span>Back to Invoice List</span>
          </div>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="text-4xl font-bold">{`${staffData.firstName} ${staffData.lastName}`}</div>
            <div className="text-xl ml-2">{staffData.role}</div>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
          {isEditing && (
            <div>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
              <Button onClick={handleCancelEdit} className="ml-2">
                Cancel
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="unmarkedInvoice" className="mt-4">
          <TabsList>
            <TabsTrigger value="unmarkedInvoice">
              Unmarked Invoice
            </TabsTrigger>
            <TabsTrigger value="markedInvoice">Marked Invoice</TabsTrigger>
          </TabsList>

          <TabsContent value="unmarkedInvoice">
            {isEditing
              ? renderInvoiceTable(
                  unmarkedInvoices,
                  false,
                  editedUnmarkedInvoices,
                  setEditedUnmarkedInvoices
                )
              : renderInvoiceTable(unmarkedInvoices, false)}
          </TabsContent>

          <TabsContent value="markedInvoice">
            {isEditing
              ? renderInvoiceTable(
                  markedInvoices,
                  true,
                  editedMarkedInvoices,
                  setEditedMarkedInvoices
                )
              : renderInvoiceTable(markedInvoices, true)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function formatMonthInput(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatMonthDisplay(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const options = { year: "numeric", month: "long" }; // e.g., 'November 2024'
  return date.toLocaleDateString(undefined, options);
}

function formatMonthForBackend(monthStr) {
  if (!monthStr) return null;
  if (monthStr.length === 7) {
    // If format is 'YYYY-MM', append '-01'
    return `${monthStr}-01`;
  } else if (monthStr.length === 10) {
    // Format is already 'YYYY-MM-DD'
    return monthStr;
  } else {
    // Handle ISO date format
    const date = new Date(monthStr);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${year}-${month}-01`;
    }
    return null;
  }
}

function ArrowLeftIcon(props) {
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
      <path d="M19 12H5" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
