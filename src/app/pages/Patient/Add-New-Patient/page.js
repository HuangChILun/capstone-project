"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/compat/router";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/HomeUi/tabs";
import { Label } from "@/app/components/HomeUi/label";
import { Input } from "@/app/components/HomeUi/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/components/HomeUi/select";
import { Button } from "@/app/components/HomeUi/button";
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";
import GuardianForm from "@/app/components/Add-Patient/GuardianForm";
import WaitlistForm from "@/app/components/Add-Patient/WaitlistForm";

export default function ImprovedAddNewPatient() {
  const router = useRouter();
  const token = Cookies.get("token");

  const [patientData, setPatientData] = useState({
    psNote: "",
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phoneNumber: "",
    email: "",
    diagnosisId: "",
    school: "",
    age: 0,
    currentStatus: true,
    fscdIdNum: "",
    contractId: 1,
    guardianId: 1,
    insuranceInfoId: 1,
    consentId: 1,
    teamMemberId: 1,
    grade: "",
  });

  const [guardianData, setGuardianData] = useState({
    custody: "",
    firstName: "",
    lastName: "",
    relationship: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
  });

  const [waitlistData, setWaitlistData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    phoneNumber: "",
    address: "",
    email: "",
    diagnosis: "",
    school: "",
    caseWorkerName: "",
    serviceType: "",
    serviceProvidersNeeded: [],
    availability: "",
    locationOfService: "",
    referralFrom: "",
    concerns: "",
    datePlaced: "",
    dateContacted: "",
    dateConsultationBooked: "",
    dateServicesOffered: "",
    dateStartedServices: "",
    nextMeetingDate: "",
    paperworkDeadline: "",
    fundingSource: "",
    isArchived: false,
  });

  const [step, setStep] = useState(1); // Step 1 is the default for personal information
  const [clientId, setClientId] = useState(null); // Store clientId after creating patient

  if (!token) {
    router.push("/");
    console.log("Need login");
    return null;
  }

  const user = JSON.parse(localStorage.getItem("user"));

  // Handle changes for patient form
  const handlePatientChange = (e) => {
    const { id, value } = e.target;
    console.log(`${id}: ${value}`); // Log field and value
    // Convert numeric fields to numbers
    const numericFields = [
      "diagnosisId",
      "age",
      "contractId",
      "guardianId",
      "insuranceInfoId",
      "consentId",
      "teamMemberId",
    ];
    if (numericFields.includes(id)) {
      setPatientData({ ...patientData, [id]: Number(value) });
    } else if (id === "currentStatus") {
      setPatientData({ ...patientData, [id]: value === "true" });
    } else {
      setPatientData({ ...patientData, [id]: value });
    }
  };

  const handlePatientSelectChange = (id, value) => {
    console.log(`${id}: ${value}`); // Log selected value
    setPatientData({ ...patientData, [id]: value });
  };

  // Handle changes for guardian form
  const handleGuardianChange = (e) => {
    const { name, value } = e.target;
    console.log(`${name}: ${value}`); // Log guardian field and value
    setGuardianData({ ...guardianData, [name]: value });
  };

  const handleGuardianSelectChange = (name, value) => {
    console.log(`${name}: ${value}`); // Log selected value for guardian
    setGuardianData({ ...guardianData, [name]: value });
  };

  // Handles personal info form submission and moves to the next step
  const handleSubmitPersonalInfo = async (e) => {
    e.preventDefault();

    console.log("Submitting patient data:", patientData);

    // Prepare data to send, ensuring correct data types
    const dataToSend = {
      ...patientData,
      diagnosisId: Number(patientData.diagnosisId),
      age: Number(patientData.age),
      currentStatus: Boolean(patientData.currentStatus),
      contractId: Number(patientData.contractId),
      guardianId: Number(patientData.guardianId),
      insuranceInfoId: Number(patientData.insuranceInfoId),
      consentId: Number(patientData.consentId),
      teamMemberId: Number(patientData.teamMemberId),
    };

    try {
      let response;
      if (!clientId) {
        // If clientId doesn't exist, create a new patient
        response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/patients/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dataToSend),
          }
        );

        if (response.ok) {
          const patientResult = await response.json();
          console.log("Patient added successfully:", patientResult);
          setClientId(patientResult.clientId); // Store the clientId
          alert("Patient added successfully!");
          setStep(2); // Proceed to Step 2
        } else {
          const errorData = await response.json();
          console.log("Failed to add patient:", errorData);
          alert(
            `Failed to add patient: ${errorData.message || "Unknown error"}`
          );
        }
      } else {
        // If clientId exists, update the patient data
        response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/patients/${clientId}/`,
          {
            method: "PUT", // or PATCH
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dataToSend),
          }
        );

        if (response.ok) {
          const patientResult = await response.json();
          console.log("Patient added successfully:", patientResult);

          // Double-check how the `clientId` is received from the backend response
          if (patientResult.clientId) {
            setClientId(patientResult.clientId); // Store the clientId
          } else {
            console.error("Client ID not found in the response");
          }

          alert("Patient added successfully!");
          setStep(2); // Proceed to Step 2
        } else {
          const errorData = await response.json();
          console.log("Failed to add patient:", errorData);
          alert(
            `Failed to add patient: ${errorData.message || "Unknown error"}`
          );
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding/updating the patient");
    }
  };

  // Handles submission of the guardian information
  const handleSubmitGuardianInfo = async (e) => {
    e.preventDefault();

    console.log("Submitting guardian data:", guardianData);

    try {
      if (!clientId) {
        alert(
          "Client ID not found. Please complete patient information first."
        );
        setStep(1);
        return;
      }

      // Include clientId in the data to send
      const dataToSend = {
        ...guardianData,
        clientId: clientId, // Use the clientId state here
      };

      // Sending guardian data to the backend server, linking it to the patient
      const guardianResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/guardians/primary/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (guardianResponse.ok) {
        console.log("Guardian added successfully");
        alert("Guardian added successfully!");
        router.push("/View-Patient-Page"); // Redirect to patient list page
      } else {
        const errorData = await guardianResponse.json();
        console.log("Failed to add guardian:", errorData);
        console.log("clientId after creating patient:", clientId);

        alert(
          `Failed to add guardian: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the guardian");
    }
  };

  const goBackToPatientForm = () => {
    setStep(1);
  };

  //Waitlist Section
  const handleWaitlistSubmit = async (formData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/waitlist/createWaitlistClient`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
          body: JSON.stringify(formData), // Send the form data as JSON
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Waitlist patient created:", result);
        alert("Waitlist patient added successfully!");
        router.push("/View-Patient-Page"); // Redirect after successful submission
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert(`Failed to add waitlist patient: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting waitlist form:", error);
      alert("An error occurred while adding the waitlist patient");
    }
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Horizontal Navigation Bar */}
      <HoriNav user={user} />

      <main className="flex-1 overflow-y-visible p-8">
        <h1 className="text-2xl font-bold mb-6">Add New Patient</h1>

        {/* Tabbed layout for Active/Waitlist sections */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="active" className="px-4 py-2">
              Active
            </TabsTrigger>
            <TabsTrigger value="waitlist" className="px-4 py-2">
              Waitlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {/* Step 1: Personal Information Form */}
            {step === 1 && (
              <form
                className="bg-white shadow-sm rounded-lg p-6"
                onSubmit={handleSubmitPersonalInfo}
              >
                <fieldset>
                  <legend className="text-lg font-semibold mb-4">
                    Personal Information
                  </legend>

                  {/* Personal Information Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Input"
                        className="w-full"
                        value={patientData.firstName}
                        onChange={handlePatientChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Input"
                        className="w-full"
                        value={patientData.lastName}
                        onChange={handlePatientChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fscdIdNum">FSCD ID#</Label>
                      <Input
                        id="fscdIdNum"
                        placeholder="Input"
                        className="w-full"
                        value={patientData.fscdIdNum}
                        onChange={handlePatientChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Date Of Birth</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        className="w-full"
                        value={patientData.birthDate}
                        onChange={handlePatientChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Input
                        id="gender"
                        placeholder="Input"
                        className="w-full"
                        value={patientData.gender}
                        onChange={handlePatientChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Input"
                        className="w-full"
                        value={patientData.age}
                        onChange={handlePatientChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school">School</Label>
                      <Input
                        id="school"
                        placeholder="Input"
                        className="w-full"
                        value={patientData.school}
                        onChange={handlePatientChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade</Label>
                      <Input
                        id="grade"
                        placeholder="Input"
                        className="w-full"
                        value={patientData.grade}
                        onChange={handlePatientChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Input"
                        className="w-full"
                        value={patientData.address}
                        onChange={handlePatientChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="Input"
                        className="w-full"
                        value={patientData.city}
                        onChange={handlePatientChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province">Province</Label>
                      <Select
                        onValueChange={(value) =>
                          handlePatientSelectChange("province", value)
                        }
                      >
                        <SelectTrigger id="province" className="w-full">
                          <SelectValue
                            placeholder={
                              patientData.province || "Select province"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Options for selecting province */}
                          {[
                            "AB",
                            "BC",
                            "MB",
                            "NB",
                            "NL",
                            "NS",
                            "ON",
                            "PE",
                            "QC",
                            "SK",
                            "NT",
                            "YT",
                            "NU",
                          ].map((prov) => (
                            <SelectItem key={prov} value={prov}>
                              {prov}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        placeholder="Input"
                        className="w-full"
                        value={patientData.postalCode}
                        onChange={handlePatientChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Input"
                        className="w-full"
                        value={patientData.phoneNumber}
                        onChange={handlePatientChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Input"
                        className="w-full"
                        value={patientData.email}
                        onChange={handlePatientChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="psNote">Note</Label>
                      <Input
                        id="psNote"
                        placeholder="Note"
                        className="w-full"
                        value={patientData.psNote}
                        onChange={handlePatientChange}
                      />
                    </div>
                  </div>
                </fieldset>
                <Button type="submit" className="mt-4">
                  Next: Guardian Info
                </Button>
              </form>
            )}

            {/* Step 2: Guardian Information Form */}
            {step === 2 && (
              <GuardianForm
                guardianData={guardianData}
                handleGuardianChange={handleGuardianChange}
                handleGuardianSelectChange={handleGuardianSelectChange}
                handleSubmit={handleSubmitGuardianInfo}
                goBack={goBackToPatientForm}
              />
            )}
          </TabsContent>
          <TabsContent value="waitlist">
            <WaitlistForm onSubmit={handleWaitlistSubmit} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
