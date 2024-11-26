"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsContent,
} from "@/app/components/HomeUi/tabs";
import { Label } from "@/app/components/HomeUi/label";
import { Input } from "@/app/components/HomeUi/input";
import { Button } from "@/app/components/HomeUi/button";
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";
import axios from "axios";
import Cookies from "js-cookie";

export default function AddInvoice() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    rate: "",
    hours: "",
    month: "",
    isGiven: 0,
    // Add other fields as needed
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = Cookies.get("token");
      console.log("Token:", token);
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Prepare the data to be sent to the API
      const invoiceData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        month: `${formData.month}-01`, // Ensure this is in the correct format
        rate: parseFloat(formData.rate),
        hours: parseFloat(formData.hours),
        // isGiven will default to false in the backend
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/invoice`,
        invoiceData,
        { headers }
      );

      // Handle success
      console.log(response.data);
      alert("Invoice created successfully");
      router.push("./View-Invoice"); // Redirect to invoice management page
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice");
    }
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      router.push("/");
    }
  }, [router]);

  if (!user) {
    return null; // or a loading indicator
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <HoriNav user={user} />
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Add New Invoice</h1>
        <Tabs defaultValue="active" className="w-full">
          <TabsContent value="active">
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-sm rounded-lg p-6"
            >
              <fieldset>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Input"
                      className="w-full"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Input"
                      className="w-full"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate">Rate</Label>
                    <Input
                      id="rate"
                      placeholder="Input"
                      className="w-full"
                      value={formData.rate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hours">Hours</Label>
                    <Input
                      id="hours"
                      placeholder="Input"
                      className="w-full"
                      value={formData.hours}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="month">Month</Label>
                    <Input
                      id="month"
                      type="month"
                      placeholder="Select month"
                      className="w-full"
                      value={formData.month}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* Add other fields as needed */}
                </div>
              </fieldset>
              <Button type="submit" className="mt-6">
                Submit
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
