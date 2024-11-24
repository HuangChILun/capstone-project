"use client";

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
import { Label } from "@/app/components/HomeUi/label";
import { Badge } from "@/app/components/HomeUi/badge";

export default function ViewWaitList() {
  const [clientData, setClientData] = useState(null);
  const [editedClientData, setEditedClientData] = useState(null); // For editing
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle for editing mode
  const user = JSON.parse(localStorage.getItem("user"));
  const router = useRouter();
  const searchParams = useSearchParams();
  const waitlistClientId = searchParams.get("waitlistClientId"); // Ensure 'waitlistClientId' exists in the URL

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
      return;
    }

    const fetchWaitListClientData = async () => {
      try {
        setIsLoading(true);
        if (!waitlistClientId) {
          throw new Error("The WaitList Client ID is missing from URL");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/waitlist-client/getWaitlistClient/${waitlistClientId}`,
          {
            headers: {
              method: "GET",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch waitlist client data. Status: ${response.status}`
          );
        }

        const data = await response.json();
        if (!data) {
          throw new Error("No data found for this client");
        }

        setClientData(data);
        setEditedClientData(data); // Initialize editedClientData
      } catch (error) {
        console.error("Error fetching client data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWaitListClientData();
  }, [router, waitlistClientId]);

  // Enable editing mode
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Cancel editing and reset data
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedClientData(clientData);
  };

  // Handle input changes for editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
  
    // Convert 'isArchived' value to integer
    if (name === "isArchived") {
      processedValue = parseInt(value, 10);
    }
  
    setEditedClientData({
      ...editedClientData,
      [name]: processedValue,
    });
  };
  

  // Save changes to the backend
  const handleSaveChanges = async () => {
    const token = Cookies.get("token");
    try {
      const updatedData = {
        ...editedClientData,
      };
  
      // Validate required fields
      // for (const [key, value] of Object.entries(updatedData)) {
      //   if (
      //     (value === "" || value === null || value === undefined) &&
      //     key !== "password"
      //   ) {
      //     throw new Error(`Field ${key} is required and cannot be empty.`);
      //   }
      // }
  
      // Format date fields to 'YYYY-MM-DD'
      const dateFields = [
        "birthDate",
        "paperworkDeadline",
        "nextMeetingDate",
        "dateConsultationBooked",
        "datePlaced",
        "dateContact",
        "dateServiceOffered",
        "dateStartedService",
      ];
      dateFields.forEach((field) => {
        if (updatedData[field]) {
          updatedData[field] = updatedData[field].split("T")[0];
        }
      });
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/waitlist-client/updateWaitlistClient/${waitlistClientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );
  
      if (!response.ok) {
        // Check if response is JSON
        let errorMessage = `Failed to update waitlist client data. Status: ${response.status}`;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
  
      alert("Waitlist client data updated successfully!");
      setClientData(updatedData); // Update clientData with saved data
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating waitlist client data:", error);
      alert(`Error updating waitlist client data: ${error.message}`);
    }
  };
  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!clientData) return <div>No client data found.</div>;

  return (
    <div>
      <HoriNav user={user} />
      <div className="p-4 ml-8 mt-2 pt-20">
        <Link href="./View-Patient-Page">
          <div className="flex items-center mb-4">
            <ArrowLeftIcon className="h-6 w-6 mr-2" />
            <span>Back to Client List</span>
          </div>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
          <h1 className="text-4xl font-bold">{`${clientData.firstName} ${clientData.lastName}`}</h1>
            <Badge variant="default" className="ml-4 ">
              {clientData.isArchived ? "Archived" : "Active"}
            </Badge>
          </div>
          {!isEditing && (
            <Button className="ml-auto mr-2" onClick={handleEditClick}>
              Edit
            </Button>
          )}
          {isEditing && (
            <div>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
              <Button className="ml-2" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Tabs for organizing fields */}
        <Tabs defaultValue="personal-info">
          <TabsList>
            <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
            <TabsTrigger value="service-info">Service Info</TabsTrigger>
            <TabsTrigger value="consultation-history">
              Consultation History
            </TabsTrigger>
            <TabsTrigger value="additional-info">Additional Info</TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal-info">
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* First Name */}
              <div>
                <Label>First Name</Label>
                {isEditing ? (
                  <Input
                    name="firstName"
                    value={editedClientData.firstName || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">{clientData.firstName}</div>
                )}
              </div>
              {/* Last Name */}
              <div>
                <Label>Last Name</Label>
                {isEditing ? (
                  <Input
                    name="lastName"
                    value={editedClientData.lastName || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">{clientData.lastName}</div>
                )}
              </div>
              {/* Gender */}
              <div>
                <Label>Gender</Label>
                {isEditing ? (
                  <Input
                    name="gender"
                    value={editedClientData.gender || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">{clientData.gender}</div>
                )}
              </div>
              {/* Birth Date */}
              <div>
                <Label>Birth Date</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    name="birthDate"
                    value={
                      editedClientData.birthDate
                        ? editedClientData.birthDate.split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.birthDate
                      ? new Date(clientData.birthDate).toLocaleDateString()
                      : ""}
                  </div>
                )}
              </div>
              {/* School */}
              <div>
                <Label>School</Label>
                {isEditing ? (
                  <Input
                    name="school"
                    value={editedClientData.school || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">{clientData.school}</div>
                )}
              </div>
              {/* Email */}
              <div>
                <Label>Email</Label>
                {isEditing ? (
                  <Input
                    name="email"
                    value={editedClientData.email || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">{clientData.email}</div>
                )}
              </div>
              {/* Phone Number */}
              <div>
                <Label>Phone Number</Label>
                {isEditing ? (
                  <Input
                    name="phoneNumber"
                    value={editedClientData.phoneNumber || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.phoneNumber}
                  </div>
                )}
              </div>
              {/* Address */}
              <div>
                <Label>Address</Label>
                {isEditing ? (
                  <Input
                    name="address"
                    value={editedClientData.address || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">{clientData.address}</div>
                )}
              </div>
              {/* Postal Code */}
              <div>
                <Label>Postal Code</Label>
                {isEditing ? (
                  <Input
                    name="postalCode"
                    value={editedClientData.postalCode || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.postalCode}
                  </div>
                )}
              </div>
              {/* City */}
              <div>
                <Label>City</Label>
                {isEditing ? (
                  <Input
                    name="city"
                    value={editedClientData.city || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">{clientData.city}</div>
                )}
              </div>
              {/* Province */}
              <div>
                <Label>Province</Label>
                {isEditing ? (
                  <Input
                    name="province"
                    value={editedClientData.province || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">{clientData.province}</div>
                )}
              </div>
              {/* Community */}
              <div>
                <Label>Community</Label>
                {isEditing ? (
                  <Input
                    name="community"
                    value={editedClientData.community || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.community}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Service Info Tab */}
          <TabsContent value="service-info">
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Service Type */}
              <div>
                <Label>Service Type</Label>
                {isEditing ? (
                  <Input
                    name="serviceType"
                    value={editedClientData.serviceType || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.serviceType}
                  </div>
                )}
              </div>
              {/* Service Providers Needed */}
              <div>
                <Label>Service Providers Needed</Label>
                {isEditing ? (
                  <Input
                    name="serviceProvidersNeeded"
                    value={editedClientData.serviceProvidersNeeded || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.serviceProvidersNeeded}
                  </div>
                )}
              </div>
              {/* Availability */}
              <div>
                <Label>Availability</Label>
                {isEditing ? (
                  <Input
                    name="availability"
                    value={editedClientData.availability || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.availability}
                  </div>
                )}
              </div>
              {/* Location Of Service */}
              <div>
                <Label>Location Of Service</Label>
                {isEditing ? (
                  <Input
                    name="locationOfService"
                    value={editedClientData.locationOfService || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.locationOfService}
                  </div>
                )}
              </div>
              {/* Fees Discussed */}
              <div>
                <Label>Fees Discussed</Label>
                {isEditing ? (
                  <Input
                    name="feesDiscussed"
                    value={editedClientData.feesDiscussed || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.feesDiscussed}
                  </div>
                )}
              </div>
              {/* Follow Up */}
              <div>
                <Label>Follow Up</Label>
                {isEditing ? (
                  <Input
                    name="followUp"
                    value={editedClientData.followUp || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">{clientData.followUp}</div>
                )}
              </div>
              {/* Referral From */}
              <div>
                <Label>Referral From</Label>
                {isEditing ? (
                  <Input
                    name="referralFrom"
                    value={editedClientData.referralFrom || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.referralFrom}
                  </div>
                )}
              </div>
              {/* Previous Service */}
              <div>
                <Label>Previous Service</Label>
                {isEditing ? (
                  <Input
                    name="previousService"
                    value={editedClientData.previousService || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.previousService}
                  </div>
                )}
              </div>
              {/* Paperwork Deadline */}
              <div>
                <Label>Paperwork Deadline</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    name="paperworkDeadline"
                    value={
                      editedClientData.paperworkDeadline
                        ? editedClientData.paperworkDeadline.split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.paperworkDeadline
                      ? new Date(
                          clientData.paperworkDeadline
                        ).toLocaleDateString()
                      : ""}
                  </div>
                )}
              </div>
              {/* Next Meeting Date */}
              <div>
                <Label>Next Meeting Date</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    name="nextMeetingDate"
                    value={
                      editedClientData.nextMeetingDate
                        ? editedClientData.nextMeetingDate.split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.nextMeetingDate
                      ? new Date(
                          clientData.nextMeetingDate
                        ).toLocaleDateString()
                      : ""}
                  </div>
                )}
              </div>
              {/* Service Needed */}
              <div>
                <Label>Service Needed</Label>
                {isEditing ? (
                  <Input
                    name="serviceNeeded"
                    value={editedClientData.serviceNeeded || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.serviceNeeded}
                  </div>
                )}
              </div>
              {/* Funding Sources */}
              <div>
                <Label>Funding Sources</Label>
                {isEditing ? (
                  <Input
                    name="fundingSources"
                    value={editedClientData.fundingSources || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.fundingSources}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Consultation History Tab */}
          <TabsContent value="consultation-history">
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Date Consultation Booked */}
              <div>
                <Label>Date Consultation Booked</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    name="dateConsultationBooked"
                    value={
                      editedClientData.dateConsultationBooked
                        ? editedClientData.dateConsultationBooked.split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.dateConsultationBooked
                      ? new Date(
                          clientData.dateConsultationBooked
                        ).toLocaleDateString()
                      : ""}
                  </div>
                )}
              </div>
              {/* Date Placed */}
              <div>
                <Label>Date Placed</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    name="datePlaced"
                    value={
                      editedClientData.datePlaced
                        ? editedClientData.datePlaced.split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.datePlaced
                      ? new Date(clientData.datePlaced).toLocaleDateString()
                      : ""}
                  </div>
                )}
              </div>
              {/* Date Contact */}
              <div>
                <Label>Date Contact</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    name="dateContact"
                    value={
                      editedClientData.dateContact
                        ? editedClientData.dateContact.split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.dateContact
                      ? new Date(clientData.dateContact).toLocaleDateString()
                      : ""}
                  </div>
                )}
              </div>
              {/* Date Service Offered */}
              <div>
                <Label>Date Service Offered</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    name="dateServiceOffered"
                    value={
                      editedClientData.dateServiceOffered
                        ? editedClientData.dateServiceOffered.split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.dateServiceOffered
                      ? new Date(
                          clientData.dateServiceOffered
                        ).toLocaleDateString()
                      : ""}
                  </div>
                )}
              </div>
              {/* Date Started Service */}
              <div>
                <Label>Date Started Service</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    name="dateStartedService"
                    value={
                      editedClientData.dateStartedService
                        ? editedClientData.dateStartedService.split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.dateStartedService
                      ? new Date(
                          clientData.dateStartedService
                        ).toLocaleDateString()
                      : ""}
                  </div>
                )}
              </div>
              {/* Consult History */}
              <div>
                <Label>Consult History</Label>
                {isEditing ? (
                  <Input
                    name="consultHistory"
                    value={editedClientData.consultHistory || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.consultHistory}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Additional Info Tab */}
          <TabsContent value="additional-info">
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Case Worker Name */}
              <div>
                <Label>Case Worker Name</Label>
                {isEditing ? (
                  <Input
                    name="caseWorkerName"
                    value={editedClientData.caseWorkerName || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.caseWorkerName}
                  </div>
                )}
              </div>
              {/* Concerns */}
              <div>
                <Label>Concerns</Label>
                {isEditing ? (
                  <Input
                    name="concerns"
                    value={editedClientData.concerns || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">{clientData.concerns}</div>
                )}
              </div>
              {/* Diagnosis */}
              <div>
                <Label>Diagnosis</Label>
                {isEditing ? (
                  <Input
                    name="diagnosis"
                    value={editedClientData.diagnosis || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.diagnosis}
                  </div>
                )}
              </div>
              {/* FSCD ID Number */}
              <div>
                <Label>FSCD ID Number</Label>
                {isEditing ? (
                  <Input
                    name="fscdIdNum"
                    value={editedClientData.fscdIdNum || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {clientData.fscdIdNum}
                  </div>
                )}
              </div>
              {/* Is Archived */}
            <div>
            <Label>Is Archived</Label>
            {isEditing ? (
                <select
                name="isArchived"
                value={editedClientData.isArchived ? "1" : "0"}
                onChange={handleInputChange}
                className="border rounded p-2 w-full"
                >
                <option value="0">No</option>
                <option value="1">Yes</option>
                </select>
            ) : (
                <div className="text-lg font-bold">
                {clientData.isArchived ? "Yes" : "No"}
                </div>
            )}
            </div>

            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Back Arrow Icon Component
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
