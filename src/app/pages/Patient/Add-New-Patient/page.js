"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/compat/router";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/HomeUi/tabs";
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";
import GuardianForm from "@/app/components/Add-Patient/GuardianForm";
import WaitlistForm from "@/app/components/Add-Patient/WaitlistForm";
import ClientForm from "@/app/components/Add-Patient/ClientForm";

export default function AddNewPatient() {
  const router = useRouter();
  const token = Cookies.get("token");
  const [clientForm, setClientForm] = useState();
  const [guardianForm, setGuardianForm] = useState();

  const [step, setStep] = useState(1); // Step 1 is the default for personal information
  const [isPrimary, setIsPrimary] = useState(true);
  const [clientId, setClientId] = useState(null); // Store clientId after creating patient

  useEffect(() => {
    // Redirect to login if token is not present
    if (!token) {
      console.log("Need login");
      router.push("/");
    }
  }, [token, router]); 

  if (!token) {
    return null;
  }
  const user = JSON.parse(localStorage.getItem("user"));

  //Waitlist
  const handleWaitlistSubmit = async (formData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/waitlistClient/createWaitlistClient`,
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
  //Client
  const handleClientSubmit = async (clientData, diagnosisData) => {
    setClientForm(clientData);
    console.log("Submitting client data:", clientData);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/clients/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(clientData),
        }
      );
      if (response.ok) {
        const result = await response.json();
        console.log("New client created:", result);
        const id = result.clientId;
        setClientId(id);
        console.log(diagnosisData);
        //foreach diagnosis in diagnosisData do a try catch to backend to save data onto backend
        for (const diagnosis of diagnosisData) {
          try {
            const diagnosisResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_IP}/diagnosis/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  clientId: id,
                  diagnosis: diagnosis.diagnosis,
                  aType: diagnosis.aType ? 1 : 0,
                }),
              }
            );
            if (!diagnosisResponse.ok) {
              const diagnosisErrorData = await diagnosisResponse.json();
              console.error("Failed to add diagnosis:", diagnosisErrorData);
            } else {
              const diagnosisResult = await diagnosisResponse.json();
              console.log("Diagnosis added:", diagnosisResult);
            }
          } catch (error) {
            console.error("Error adding diagnosis:", error);
          }
        }
        setStep(2);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert(`Failed to add client: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting client form:", error);
      alert("An error occurred while adding the client");
    }
  };
  //Guardian
  const handleGuardianSubmit = async (guardianData) => {
    // Include clientId in the data to send
    const dataToSend = {
      ...guardianData,
      clientId: clientId, // Use the clientId state here
    };
    console.log("Submitting guardian data:", dataToSend);
    try {
      const response = await fetch(
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
      if (response.ok) {
        const result = await response.json();
        console.log("Primary Guardian Information:", result);
        if (isPrimary) {
          setIsPrimary(false);
          setStep(3);
        } else {
          alert("Add Client Complete");
          router.push("/View-Patient-Page");
        }
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert(`Failed to add guardian: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting guardian form:", error);
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
            {step === 1 && <ClientForm onSubmit={handleClientSubmit} />}

            {/* Step 2: Primary Guardian Information Form */}
            {step === 2 && (
              <GuardianForm
                onSubmit={handleGuardianSubmit}
                clientData={clientForm}
                primary={isPrimary}
              />
            )}
            {/* Step 3: Secondary Guardian Information Form */}
            {step === 3 && (
              <GuardianForm
                onSubmit={handleGuardianSubmit}
                clientData={clientForm}
                primary={isPrimary}
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
