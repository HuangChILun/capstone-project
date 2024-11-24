"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ClientForm from "@/app/components/Add-Patient/ClientForm";
import GuardianForm from "@/app/components/Add-Patient/GuardianForm";
import OtherForm from "@/app/components/Add-Patient/OtherForm";
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";
import { useSearchParams } from "next/navigation";

export default function ConvertWaitlist() {
  // State variables
  const [step, setStep] = useState(1);
  const [waitlistClientData, setWaitlistClientData] = useState();
  const [clientForm, setClientForm] = useState(null);
  const [diagnosisForm, setDiagnosisForm] = useState(null);
  const [primaryGuardianForm, setPrimaryGuardianForm] = useState(null);
  const [secondaryGuardianForm, setSecondaryGuardianForm] = useState(null);
  const [consentForm, setConsentForm] = useState(null);
  const [insuranceForm, setInsuranceForm] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [contractForm, setContractForm] = useState(null);
  const [isPrimary, setIsPrimary] = useState(true);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [clientId, setClientId] = useState();

  // Retrieve token and search parameters
  const token = Cookies.get("token");
  const searchParams = useSearchParams();
  const waitlistClientId = searchParams.get("waitlistClientId");

  // useEffect should always be called unconditionally
  useEffect(() => {
    if (!token) {
      alert("Need login");
      window.location.href = "/";
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));

        const fetchWaitListClientData = async () => {
          try {
            setLoading(true);
            if (!waitlistClientId) {
              throw new Error("The WaitList Client ID is missing");
            }

            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_IP}/waitlist-client/getWaitlistClient/${waitlistClientId}`,
              {
                method: "GET",
                headers: {
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

            setWaitlistClientData(data);
          } catch (error) {
            console.error("Error fetching client data:", error);
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };

        fetchWaitListClientData();
      }
    }
  }, [token, waitlistClientId]);

  // Ensure that all hooks are called before any return statement
  // Conditional rendering after hooks are called
  if (!waitlistClientId || !token || loading || !waitlistClientData) {
    // Only render after data has been loaded
    return null;
  }

  // Function to generate note section based on waitlist data
  const generateNoteSection = (data) => {
    // Define the fields you want to include in the note section
    const fieldsToInclude = [
      "community",
      "language",
      "siblings",
      "pets",
      "caseWorkerName",
      "serviceType",
      "serviceProvidersNeeded",
      "fscdIdNum",
      "datePlaced",
      "dateContact",
      "dateConsultationBooked",
      "dateServiceOffered",
      "dateStartedService",
      "nextMeetingDate",
      "paperworkDeadline",
      "fundingSources",
      "feeDiscussed",
      "followUp",
      "referralFrom",
      "availability",
      "locationOfService",
      "previousService",
      "concerns",
      "consultationHistory",
    ];

    const lines = [];
    const today = new Date();
    const formattedToday =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    lines.push(`Waitlist Information (Converted on ${formattedToday})\n`);

    for (const key of fieldsToInclude) {
      let value = data[key];

      // Format dates
      if (value && key.toLowerCase().includes("date")) {
        value = new Date(value).toISOString().split("T")[0];
      }

      // Format boolean for better readability
      if (key === "feeDiscussed") {
        value = value ? "Yes" : "No";
      }

      // Capitalize first letter of other values for consistency
      if (typeof value === "string") {
        value = value.charAt(0).toUpperCase() + value.slice(1);
      }

      if (value !== null && value !== undefined && value !== "") {
        const formattedKey = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());

        lines.push(`${formattedKey}: ${value}`);
      }
    }

    return lines.join("\n");
  };

  // Client form update handler
  const clientFormUpdate = (clientData, diagnosisData) => {
    setClientForm(clientData);
    setDiagnosisForm(diagnosisData);
    setStep(2);
  };

  // Function to submit client data
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
        // For each diagnosis in diagnosisData, save data to backend
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

  // Guardian form update handler
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

  // Function to submit guardian data
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

  // Consent form update handler
  const consentFormUpdate = (consentData) => {
    setConsentForm(consentData);
  };

  // Function to submit consent data
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

  // Insurance form update handler
  const insuranceFormUpdate = (insuranceData) => {
    setInsuranceForm(insuranceData);
  };

  // Function to submit insurance data
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

  // Contract form update handler
  const contractFormUpdate = (selectedFile, contractData) => {
    setSelectedFile(selectedFile);
    setContractForm(contractData);
    setStep(3);
  };

  // Function to submit contract data
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

  // Function to delete waitlist client after converting
  const handleDeleteWaitlist = async (waitlistClientId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/waitlist-client/deleteWaitlistClient/${waitlistClientId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Waitlist delete successful:", result);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Error deleting waitlist client:", error);
    }
  };

  // Handle final form submission
  const handleFinalSubmit = async () => {
    try {
      const id = await handleClientSubmit();
      if (id == null) throw new Error("Client submission failed");

      setClientId(id);

      // Handle consent form submission
      if (consentForm != null) {
        await handleConsentSubmit(id);
      }

      // Handle insurance form submission
      if (insuranceForm != null) {
        await handleInsuranceSubmit(id);
      }

      // Handle contract form submission
      if (contractForm != null) {
        await handleContractSubmit(id);
      }

      // Handle primary guardian form submission
      if (primaryGuardianForm != null) {
        await handleGuardianSubmit(primaryGuardianForm, id);
      }

      // Handle secondary guardian form submission
      if (secondaryGuardianForm != null) {
        await handleGuardianSubmit(secondaryGuardianForm, id);
      }

      // If all submissions are successful, delete the waitlist entry
      await handleDeleteWaitlist(waitlistClientId);
      alert("Client converted successfully");

      // Redirect to the view patient page
      window.location.href = "./View-Patient-Page";
    } catch (error) {
      console.error("Error during form submission:", error);
      alert("An error occurred during form submission. Please try again.");
    }
  };

  return (
    <main className="flex h-screen bg-gray-100">
      {/* Horizontal Navigation Bar */}
      <HoriNav user={user} />

      <div className="flex-1 overflow-y-visible p-8">
        <h1 className="text-2xl font-bold mb-6">Add New Patient</h1>
        {/* Step 1: Personal Information Form */}
        {step === 1 && (
          <ClientForm
            onSubmit={clientFormUpdate}
            isConversion={true}
            waitlistClientData={waitlistClientData}
            note={generateNoteSection(waitlistClientData)}
          />
        )}

        {/* Step 2: Contract/Consent/Insurance Form */}
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
      </div>
    </main>
  );
}
