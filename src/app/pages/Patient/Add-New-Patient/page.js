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
import OtherForm from "@/app/components/Add-Patient/OtherForm";

export default function AddNewPatient() {
  const router = useRouter();
  const [clientForm, setClientForm] = useState(null);
  const [diagnosisForm, setDiagnosisForm] = useState(null);
  const [primaryGuardianForm, setPrimaryGuardianForm] = useState(null);
  const [secondaryGuardianForm, setSecondaryGuardianForm] = useState(null);
  const [consentForm, setConsentForm] = useState(null);
  const [insuranceForm, setInsuranceForm] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [contractForm, setContractForm] = useState(null);
  const [step, setStep] = useState(1);
  const [isPrimary, setIsPrimary] = useState(true);
  const [clientId, setClientId] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      alert("Need login");
      window.location.href = "/"; 
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false); // Data is loaded; ready to render
    }
  }, [token]);

  if (!token || loading) {
    // Only render after data has been loaded
    return null;
  }
  //Handle final form submission
  const handleFinalSubmit = async () => {
    const id = await handleClientSubmit();
    if (id != null) {
      setClientId(id);
      if (consentForm != null) {
        await handleConsentSubmit(id);
      }
      if (insuranceForm != null) {
        await handleInsuranceSubmit(id);
      }
      if (contractForm != null) {
        await handleContractSubmit(id);
      }
      if (primaryGuardianForm != null) {
        await handleGuardianSubmit(primaryGuardianForm, id);
      }
      if (secondaryGuardianForm != null) {
        await handleGuardianSubmit(secondaryGuardianForm, id);
      }
    }
    alert("Client creation successful");
    window.location.href = "./View-Patient-Page";
  };

  //Waitlist
  const handleWaitlistSubmit = async (formData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/waitlist-client/createWaitlistClient`,
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
        window.location.href = "./View-Patient-Page";
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
  const clientFormUpdate = (clientData, diagnosisData) => {
    setClientForm(clientData);
    setDiagnosisForm(diagnosisData);
    setStep(2);
  };
  const handleClientSubmit = async () => {
    console.log("Submitting client data:", clientForm);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/clients/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(clientForm),
        }
      );
      if (response.ok) {
        const result = await response.json();
        console.log("New client created:", result);
        const id = result.clientId;
        setClientId(id);
        console.log(diagnosisForm);
        //foreach diagnosis in diagnosisData do a try catch to backend to save data onto backend
        for (const diagnosis of diagnosisForm) {
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
            if (diagnosisResponse.ok) {
              const diagnosisResult = await diagnosisResponse.json();
              console.log("Diagnosis added:", diagnosisResult);
            } else {
              const diagnosisErrorData = await diagnosisResponse.json();
              console.error("Failed to add diagnosis:", diagnosisErrorData);
            }
          } catch (error) {
            console.error("Error adding diagnosis:", error);
          }
        }
        return result.clientId;
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        return null;
      }
    } catch (error) {
      console.error("Error submitting client form:", error);
      alert("An error occurred while adding the client");
    }
  };
  //Guardian
  const guardianFormUpdate = (guardianData) => {
    if (guardianData === null) {
      handleFinalSubmit();
    } else {
      if (isPrimary) {
        setPrimaryGuardianForm(guardianData);
        console.log(primaryGuardianForm);
        setIsPrimary(false);
        setStep(4);
      } else {
        setSecondaryGuardianForm(guardianData);
        console.log(secondaryGuardianForm);
        handleFinalSubmit();
      }
    }
  };
  const handleGuardianSubmit = async (guardianForm, clientId) => {
    // Include clientId in the data to send
    const dataToSend = {
      ...guardianForm,
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
        console.log("Guardian Information:", result);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert(`Failed to add guardian: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting guardian form:", error);
    }
  };

  //Consent
  const consentFormUpdate = (consentData) => {
    setConsentForm(consentData);
  };
  const handleConsentSubmit = async (clientId) => {
    const updatedConsentData = {
      ...consentForm,
      clientId: clientId,
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/consents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedConsentData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Consent sent successful:", result);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Error adding consent:", error);
    }
  };
  //Insurance
  const insuranceFormUpdate = (insuranceData) => {
    setInsuranceForm(insuranceData);
  };
  const handleInsuranceSubmit = async (clientId) => {
    const updatedInsuranceData = {
      ...insuranceForm,
      clientId: clientId,
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/insurance-info`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedInsuranceData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Insurance sent successful:", result);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Error adding insurance:", error);
    }
  };
  //Contract
  const contractFormUpdate = (selectedFile, contractData) => {
    setSelectedFile(selectedFile);
    setContractForm(contractData);
    setStep(3);
  };
  const handleContractSubmit = async (clientId) => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("clientId", clientId);
    formData.append("fileCategory", 1);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/files/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        const updatedContractData = {
          ...contractForm,
          clientId: clientId,
          fileId: data.fileId,
        };

        try {
          const contractResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_IP}/client-contract`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(updatedContractData),
            }
          );
          if (contractResponse.ok) {
            const contractResult = await contractResponse.json();
            console.log("Contract sent successful:", contractResult);
          } else {
            const contractErrorData = await contractResponse.json();
            console.error("Error:", contractErrorData);
          }
        } catch (error) {
          console.error("Error adding contract:", error);
        }
      } else {
        const errorData = await response.json();
        console.log(errorData);
      }
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };

  return (
    <main className="flex h-screen bg-gray-100">
      {/* Horizontal Navigation Bar */}
      <HoriNav user={user} />

      <div className="flex-1 overflow-y-visible p-8">
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
            {step === 1 && <ClientForm onSubmit={clientFormUpdate} />}

            {/*Step 2: Contract/Consent/Insurance Form */}
            {step === 2 && (
              <OtherForm
                clientData={clientForm}
                SendConsent={consentFormUpdate}
                SendInsurance={insuranceFormUpdate}
                SendContract={contractFormUpdate}
              />
            )}

            {/* Step 3: Primary Guardian Information Form */}
            {step === 3 && (
              <GuardianForm
                SendGuardian={guardianFormUpdate}
                clientData={clientForm}
                primary={isPrimary}
              />
            )}
            {/* Step 4: Secondary Guardian Information Form */}
            {step === 4 && (
              <GuardianForm
                SendGuardian={guardianFormUpdate}
                clientData={clientForm}
                primary={isPrimary}
              />
            )}
          </TabsContent>
          <TabsContent value="waitlist">
            <WaitlistForm onSubmit={handleWaitlistSubmit} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
