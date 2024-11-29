"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Badge } from "@/app/components/HomeUi/badge";
import { Button } from "@/app/components/HomeUi/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/HomeUi/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/app/components/HomeUi/table";
import { Label } from "@/app/components/HomeUi/label";
import { Input } from "@/app/components/HomeUi/input";
import { useRouter, useSearchParams } from "next/navigation";
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";

export default function ViewPatientPersonal() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ViewPatientPersonalContent />
      </Suspense>
    </div>
  );
}

function ViewPatientPersonalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const [patient, setPatient] = useState(null);
  const [guardian, setGuardian] = useState([]);
  const [editedPatient, setEditedPatient] = useState(null);
  const [editedGuardian, setEditedGuardian] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const [editedDiagnosis, setEditedDiagnosis] = useState([]);
  const [insurance, setInsurance] = useState(null);
  const [editedInsurance, setEditedInsurance] = useState(null);
  const [consent, setConsent] = useState(null);
  const [editedConsent, setEditedConsent] = useState(null);
  const [contract, setContract] = useState(null);
  const [editedContract, setEditedContract] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  // the function for future use
  const [newOutsideProvider, setNewOutsideProvider] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    agency: "",
    startServiceDate: "",
    endServiceDate: "",
  });
  // end the function

  //Add consent if no information
  const [addingConsent, setAddingConsent] = useState(false);
  const [newConsent, setNewConsent] = useState({
    clientId: clientId,
    permissionNote: "",
    receivedDate: "",
    withdrawDate: "",
  });
  // end here

  // add insurance if no information
  const [addingInsurance, setAddingInsurance] = useState(false);
  const [newInsurance, setNewInsurance] = useState({
    clientId: clientId,
    insuranceProvider: "",
    primaryPlanName: "",
    certificateId: "",
    coverateDetail: "",
    startDate: "",
    endDate: "",
  });
  // add contract if no information
  const [addingContract, setAddingContract] = useState(false);
  const [newContract, setNewContract] = useState({
    clientId: clientId,
    startDate: "",
    endDate: "",
    COOhours: 0,
    PBChours: 0,
    SLPhours: 0,
    OThours: 0,
    PThours: 0,
    AIDEhours: 0,
    COUShours: 0,
    CARhours: 0,
  });
  const [newContractFile, setNewContractFile] = useState(null);
  const [editedContractFile, setEditedContractFile] = useState(null);
  // For controlling new guardian form
  const [addingGuardian, setAddingGuardian] = useState(false);
  const [newGuardian, setNewGuardian] = useState({
    firstName: "",
    lastName: "",
    relationship: "",
    custody: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    clientId: clientId,
  });
  // For controlling new diagnosis
  const [addingDiagnosis, setAddingDiagnosis] = useState(false);

  const [newDiagnosis, setNewDiagnosis] = useState({
    diagnosis: "",
    aType: "typical",
  });
  // Team tab states
  const [searchName, setSearchName] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assignedTeamMembers, setAssignedTeamMembers] = useState([]);
  const [editedAssignedTeamMembers, setEditedAssignedTeamMembers] = useState(
    []
  );

  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = Cookies.get("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);
  // Fetch assigned team members and initialize editedAssignedTeamMembers
  const fetchAssignedTeamMembers = async () => {
    const token = Cookies.get("token");

    try {
      const teamResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/team-member/client/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!teamResponse.ok) {
        throw new Error("Failed to fetch assigned team members");
      }

      const teamData = await teamResponse.json();

      // Ensure teamData is an array
      if (!Array.isArray(teamData)) {
        console.error("Team data is not an array:", teamData);
        throw new Error("Invalid team data format");
      }

      setAssignedTeamMembers(teamData);
      setEditedAssignedTeamMembers(teamData);
    } catch (error) {
      console.error("Error fetching assigned team members:", error);
    }
  };

  // assign new team members
  const assignNewTeamMembers = async () => {
    const token = Cookies.get("token");
    try {
      for (const user of selectedUsers) {
        // Ensure dates are in the correct format or handle empty strings
        const formatDate = (date) => (date ? date : null);

        const formattedUserData = {
          clientId: patient.clientId,
          userId: user.userId,
          startServiceDate: formatDate(user.startServiceDate),
          endServiceDate: formatDate(user.endServiceDate),
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/team-member/assign`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formattedUserData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error assigning team member:", errorData);
          throw new Error(
            `Failed to assign team member: ${
              errorData.message || errorData.error || "Unknown error"
            }`
          );
        }
      }

      // Clear selected users and refresh the team members list
      setSelectedUsers([]);
      await fetchAssignedTeamMembers();
    } catch (error) {
      console.error("Error assigning team members:", error);
      throw error;
    }
  };

  // Fetch Diagnosis
  const fetchDiagnosis = async () => {
    const token = Cookies.get("token");
    try {
      const diagnosisResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/diagnosis/clients/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!diagnosisResponse.ok) {
        throw new Error("Failed to fetch assigned diagnosis");
      }
      const diagnosisData = await diagnosisResponse.json();

      // Ensure diagnosisData is an array
      const diagnosesArray = Array.isArray(diagnosisData)
        ? diagnosisData
        : [diagnosisData];

      // Map aType to "typical" or "atypical" for display
      const formattedDiagnoses = diagnosesArray.map((item) => ({
        ...item,
        aType: item.aType === 1 ? "typical" : "atypical",
      }));

      setDiagnosis(formattedDiagnoses);
      setEditedDiagnosis([...formattedDiagnoses]);
    } catch (error) {
      console.error("Error fetching assigned diagnosis:", error);
    }
  };

  // Fetch Insurance
  const fetchInsurance = async () => {
    const token = Cookies.get("token");
    try {
      const insuranceResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/insurance-info/client/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!insuranceResponse.ok) {
        throw new Error("Failed to fetch insurance information");
      }

      const insuranceData = await insuranceResponse.json();

      // Handle array data
      let insuranceItem;
      if (Array.isArray(insuranceData)) {
        if (insuranceData.length > 0) {
          insuranceItem = insuranceData[0];
        } else {
          insuranceItem = null;
        }
      } else {
        insuranceItem = insuranceData;
      }

      setInsurance(insuranceItem);
      setEditedInsurance(insuranceItem);
    } catch (error) {
      console.error("Error fetching insurance information:", error);
    }
  };

  // Fetch Consent
  const fetchConsent = async () => {
    const token = Cookies.get("token");
    try {
      const consentResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/consents/client/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!consentResponse.ok) {
        throw new Error("Failed to fetch consent information");
      }

      const consentData = await consentResponse.json();

      // Handle array data
      let consentItem;
      if (Array.isArray(consentData)) {
        if (consentData.length > 0) {
          consentItem = consentData[0];
        } else {
          consentItem = null;
        }
      } else {
        consentItem = consentData;
      }

      setConsent(consentItem);
      setEditedConsent(consentItem);
    } catch (error) {
      console.error("Error fetching consent information:", error);
    }
  };

  // fetch contract information
  const fetchContract = async () => {
    const token = Cookies.get("token");
    try {
      const contractResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/client-contract/client/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!contractResponse.ok) {
        throw new Error("Failed to fetch contract information");
      }

      const contractData = await contractResponse.json();

      //
      let contractItem;
      if (Array.isArray(contractData)) {
        if (contractData.length > 0) {
          contractItem = contractData[0]; //
        } else {
          contractItem = null;
        }
      } else {
        contractItem = contractData;
      }

      setContract(contractItem);
      setEditedContract(contractItem);
    } catch (error) {
      console.error("Error fetching contract information:", error);
    }
  };

  const handleAddOutsideProvider = async () => {
    const token = Cookies.get("token");
    try {
      // Create the outside provider
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/outside-provider`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: newOutsideProvider.firstName,
            lastName: newOutsideProvider.lastName,
            email: newOutsideProvider.email,
            phoneNumber: newOutsideProvider.phoneNumber,
            agency: newOutsideProvider.agency,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error adding outside provider:", errorData);
        throw new Error(
          `Failed to add outside provider: ${
            errorData.message || errorData.error || "Unknown error"
          }`
        );
      }

      const outsideProviderData = await response.json();

      // Assign the outside provider to the client
      const assignResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/team-member/assign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            clientId: clientId,
            outsideProviderId: outsideProviderData.outsideProviderId,
            startServiceDate: newOutsideProvider.startServiceDate || null,
            endServiceDate: newOutsideProvider.endServiceDate || null,
          }),
        }
      );

      if (!assignResponse.ok) {
        const errorData = await assignResponse.json();
        console.error("Error assigning outside provider:", errorData);
        throw new Error(
          `Failed to assign outside provider: ${
            errorData.message || errorData.error || "Unknown error"
          }`
        );
      }

      // Refresh the assigned team members list
      await fetchAssignedTeamMembers();

      // Clear the form
      setNewOutsideProvider({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        agency: "",
        startServiceDate: "",
        endServiceDate: "",
      });

      alert("Outside provider added and assigned successfully!");
    } catch (error) {
      console.error("Error adding outside provider:", error);
      alert(`Error adding outside provider: ${error.message}`);
    }
  };

  // the function for future use end

  // fetch clients by this effect
  useEffect(() => {
    const fetchPatientData = async () => {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/");
        console.log("Need login");
        return;
      }
  
      try {
        setIsLoading(true);
        if (!clientId) {
          console.error("Patient ID is missing");
          return;
        }
  
        // Fetch client data
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/clients/${clientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch patient data");
        }
  
        const data = await response.json();
        setPatient(data);
        setEditedPatient(data);
  
        // Fetch other related data
        await fetchConsent();
        await fetchDiagnosis();
        await fetchInsurance();
        await fetchContract();
        await fetchAssignedTeamMembers();
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (clientId) {
      fetchPatientData();
      fetchGuardian(); // Call fetchGuardian separately
    }
  }, [clientId, router]);
  
  // Define fetchGuardian function
const fetchGuardian = async () => {
  const token = Cookies.get("token");
  if (!token) {
    router.push("/");
    console.log("Need login");
    return;
  }

  try {
    // Fetch guardian by clientId
    const guardianResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_IP}/guardians/primary/${clientId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!guardianResponse.ok) {
      // If guardian data is not found, set guardian to an empty array
      setGuardian([]);
      setEditedGuardian([]);
    } else {
      const guardianData = await guardianResponse.json();

      // Ensure guardianData is an array
      const guardiansArray = Array.isArray(guardianData)
        ? guardianData
        : [guardianData];

      setGuardian(guardiansArray);
      setEditedGuardian([...guardiansArray]);
    }
  } catch (error) {
    console.error("Error fetching guardian data:", error);
    // Set guardian to an empty array
    setGuardian([]);
    setEditedGuardian([]);
  }
};
  // Fetch all users when the component mounts
  useEffect(() => {
    const fetchAllUsers = async () => {
      const token = Cookies.get("token");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const users = await response.json();
        setAllUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  // Handle Edit mode
  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedPatient(patient);
    setEditedGuardian(guardian);
    setEditedDiagnosis(diagnosis);
    setEditedInsurance(insurance);
    setEditedConsent(consent);
    setEditedContract(contract);
    setSelectedUsers([]);
    setSearchResults([]);
    setSearchName("");
    setSearchRole("");
    setEditedAssignedTeamMembers(assignedTeamMembers);
  };

  // Handle input changes
  const handlePatientInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPatient({ ...editedPatient, [name]: value });
  };

  const handleGuardianInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedGuardians = [...editedGuardian];
    updatedGuardians[index] = {
      ...updatedGuardians[index],
      [name]: value,
    };
    setEditedGuardian(updatedGuardians);
  };

  const handleDiagnosisInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDiagnoses = [...editedDiagnosis];
    updatedDiagnoses[index] = {
      ...updatedDiagnoses[index],
      [name]: value,
    };
    setEditedDiagnosis(updatedDiagnoses);
  };

  const handleInsuranceInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInsurance({ ...editedInsurance, [name]: value || null });
  };

  const handleConsentInputChange = (e) => {
    const { name, value } = e.target;
    setEditedConsent({ ...editedConsent, [name]: value });
  };

  const handleContractInputChange = (e) => {
    const { name, value } = e.target;
    setEditedContract({ ...editedContract, [name]: value });
  };

  // Handle date changes for assigned team members
  const handleAssignedDateChange = (teamMemberId, field, value) => {
    const updatedMembers = editedAssignedTeamMembers.map((member) => {
      if (member.teamMemberId === teamMemberId) {
        return { ...member, [field]: value };
      }
      return member;
    });
    setEditedAssignedTeamMembers(updatedMembers);
  };

  // Update functions
  const updateClientInfo = async () => {
    const token = Cookies.get("token");
    try {
      // Format the dates to 'YYYY-MM-DD'
      const formattedPatientData = {
        ...editedPatient,
        birthDate: editedPatient.birthDate
          ? editedPatient.birthDate.split("T")[0]
          : null,
        serviceStartDate: editedPatient.serviceStartDate
          ? editedPatient.serviceStartDate.split("T")[0]
          : null,
        serviceEndDate: editedPatient.serviceEndDate
          ? editedPatient.serviceEndDate.split("T")[0]
          : null,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/clients/${clientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formattedPatientData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating client data:", errorData);
        throw new Error(
          `Failed to update client data: ${
            errorData.message || errorData.error || "Unknown error"
          }`
        );
      }

      // Update the state with the latest client data
      setPatient(formattedPatientData);
    } catch (error) {
      console.error("Error updating client data:", error);
      throw error;
    }
  };

  const updateGuardianInfo = async () => {
    const token = Cookies.get("token");
    if (editedGuardian && editedGuardian.length > 0) {
      try {
        for (const guardianItem of editedGuardian) {
          if (guardianItem.guardianId) {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_IP}/guardians/primary/${guardianItem.guardianId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(guardianItem),
              }
            );

            if (!response.ok) {
              const errorData = await response.json();
              console.error("Error updating guardian data:", errorData);
              throw new Error(
                `Failed to update guardian data: ${
                  errorData.message || errorData.error || "Unknown error"
                }`
              );
            }
          }
        }
        // Update the state with the latest guardian data
        setGuardian(editedGuardian);
      } catch (error) {
        console.error("Error updating guardian data:", error);
        throw error;
      }
    }
  };

  const updateDiagnosisInfo = async () => {
    const token = Cookies.get("token");
    if (editedDiagnosis && editedDiagnosis.length > 0) {
      try {
        for (const diagnosisItem of editedDiagnosis) {
          if (diagnosisItem.diagnosisId) {
            // Map "typical"/"atypical" back to 1/0
            const aTypeValue = diagnosisItem.aType === "typical" ? 1 : 0;

            const updatedDiagnosis = {
              ...diagnosisItem,
              aType: aTypeValue,
            };

            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_IP}/diagnosis/${diagnosisItem.diagnosisId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedDiagnosis),
              }
            );

            if (!response.ok) {
              const errorData = await response.json();
              console.error("Error updating diagnosis data:", errorData);
              throw new Error(
                `Failed to update diagnosis data: ${
                  errorData.message || errorData.error || "Unknown error"
                }`
              );
            }
          }
        }
        // Update the state with the latest diagnosis data
        setDiagnosis(editedDiagnosis);
      } catch (error) {
        console.error("Error updating diagnosis data:", error);
        throw error;
      }
    }
  };

  const updateInsuranceInfo = async () => {
    const token = Cookies.get("token");
    if (editedInsurance && editedInsurance.insuranceInfoId) {
      try {
        const updatedInsurance = {
          ...editedInsurance,
          startDate: formatDate(editedInsurance.startDate),
          endDate: formatDate(editedInsurance.endDate),
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/insurance-info/${editedInsurance.insuranceInfoId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedInsurance),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error updating insurance data:", errorData);
          throw new Error(
            `Failed to update insurance data: ${
              errorData.message || errorData.error || "Unknown error"
            }`
          );
        }

        // Update the state with the latest insurance data
        setInsurance(updatedInsurance);
      } catch (error) {
        console.error("Error updating insurance data:", error);
        throw error;
      }
    }
  };

  const updateConsentInfo = async () => {
    const token = Cookies.get("token");
    if (editedConsent && editedConsent.consentId) {
      try {
        const updatedConsent = {
          ...editedConsent,
          receivedDate: formatDate(editedConsent.receivedDate),
          withdrawDate: formatDate(editedConsent.withdrawDate),
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/consents/${editedConsent.consentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedConsent),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error updating consent data:", errorData);
          throw new Error(
            `Failed to update consent data: ${
              errorData.message || errorData.error || "Unknown error"
            }`
          );
        }

        // Update the state with the latest consent data
        setConsent(editedConsent);
      } catch (error) {
        console.error("Error updating consent data:", error);
        throw error;
      }
    }
  };

  const updateContractInfo = async () => {
    const token = Cookies.get("token");
    if (editedContract && editedContract.contractId) {
      try {
        // Comment out fileId variable
        // let fileId = editedContract.fileId || null;

        // // If there is an edited contract file, upload it first
        // if (editedContractFile) {
        //   const formData = new FormData();
        //   formData.append("file", editedContractFile);
        //   formData.append("clientId", clientId); // Include if required by your backend
        //   formData.append("fileCategory", 1); // Include if required by your backend

        //   const fileUploadResponse = await fetch(
        //     `${process.env.NEXT_PUBLIC_BACKEND_IP}/files/upload`,
        //     {
        //       method: "POST",
        //       headers: {
        //         Authorization: `Bearer ${token}`,
        //       },
        //       body: formData,
        //     }
        //   );

        //   if (!fileUploadResponse.ok) {
        //     const errorData = await fileUploadResponse.json();
        //     console.error("Error uploading file:", errorData);
        //     throw new Error(
        //       `Failed to upload file: ${
        //         errorData.message || errorData.error || "Unknown error"
        //       }`
        //     );
        //   }

        //   const fileData = await fileUploadResponse.json();
        //   fileId = fileData.fileId; // Assuming the response contains fileId
        // }

        // Now update the contract without fileId
        const formattedStartDate = formatDate(editedContract.startDate);
        const formattedEndDate = formatDate(editedContract.endDate);
        const contractData = {
          clientId: clientId,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          COOhours: Number(editedContract.COOhours) || 0,
          PBChours: Number(editedContract.PBChours) || 0,
          SLPhours: Number(editedContract.SLPhours) || 0,
          OThours: Number(editedContract.OThours) || 0,
          PThours: Number(editedContract.PThours) || 0,
          AIDEhours: Number(editedContract.AIDEhours) || 0,
          COUShours: Number(editedContract.COUShours) || 0,
          CARhours: Number(editedContract.CARhours) || 0,
          // Comment out fileId
          // fileId: fileId, // Include the fileId
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/client-contract/${editedContract.contractId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(contractData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error updating contract data:", errorData);
          throw new Error(
            `Failed to update contract data: ${
              errorData.message || errorData.error || "Unknown error"
            }`
          );
        }

        await fetchContract();
        // alert("Contract information updated successfully!");
      } catch (error) {
        console.error("Error updating contract data:", error);
        alert(`Error updating contract data: ${error.message}`);
      }
    }
  };

  const updateAssignedTeamMembers = async () => {
    const token = Cookies.get("token");
    try {
      for (const member of editedAssignedTeamMembers) {
        const formatDate = (dateStr) => {
          if (!dateStr) return null;
          return dateStr.split("T")[0];
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/team-member/${member.teamMemberId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              startServiceDate: formatDate(member.startServiceDate),
              endServiceDate: formatDate(member.endServiceDate),
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error updating team member data:", errorText);
          throw new Error(
            `Failed to update team member data: ${
              response.statusText || "Unknown error"
            }`
          );
        }
      }
    } catch (error) {
      console.error("Error updating team members:", error);
      throw error;
    }
  };
  // get team member name
  const getTeamMemberName = (member) => {
    if (member.userFirstName && member.userLastName) {
      return `${member.userFirstName} ${member.userLastName} (${member.role})`;
    } else if (
      member.outsideProviderFirstName &&
      member.outsideProviderLastName
    ) {
      return `${member.outsideProviderFirstName} ${member.outsideProviderLastName} (Outside Provider)`;
    } else {
      return "Unknown Team Member";
    }
  };

  // add consent if no information
  const createConsentInfo = async () => {
    const token = Cookies.get("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/consents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newConsent),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating consent data:", errorData);
        throw new Error(
          `Failed to create consent data: ${
            errorData.message || errorData.error || "Unknown error"
          }`
        );
      }

      // Fetch the new consent data and update the state
      await fetchConsent();
      setAddingConsent(false);
      alert("Consent information added successfully!");
    } catch (error) {
      console.error("Error creating consent data:", error);
      alert(`Error creating consent data: ${error.message}`);
    }
  };

  // add insurance when no information
  const createInsuranceInfo = async () => {
    const token = Cookies.get("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/insurance-info`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newInsurance),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating insurance data:", errorData);
        throw new Error(
          `Failed to create insurance data: ${
            errorData.message || errorData.error || "Unknown error"
          }`
        );
      }

      // Fetch the new insurance data and update the state
      await fetchInsurance();
      setAddingInsurance(false);
      alert("Insurance information added successfully!");
    } catch (error) {
      console.error("Error creating insurance data:", error);
      alert(`Error creating insurance data: ${error.message}`);
    }
  };
  // add contract when no information
  const createContractInfo = async () => {
    const token = Cookies.get("token");
    try {
      let fileId = null;

      // If there is a new contract file, upload it first
      if (newContractFile) {
        const formData = new FormData();
        formData.append("file", newContractFile);
        formData.append("clientId", clientId); // Include if required by your backend
        formData.append("fileCategory", 1); // Include if required by your backend

        const fileUploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/files/upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!fileUploadResponse.ok) {
          const errorData = await fileUploadResponse.json();
          console.error("Error uploading file:", errorData);
          throw new Error(
            `Failed to upload file: ${
              errorData.message || errorData.error || "Unknown error"
            }`
          );
        }

        const fileData = await fileUploadResponse.json();
        fileId = fileData.fileId; // Assuming the response contains fileId
      }
      const formattedStartDate = formatDate(newContract.startDate);
      const formattedEndDate = formatDate(newContract.endDate);
      // Now create the contract
      const contractData = {
        clientId: clientId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        COOhours: Number(newContract.COOhours) || 0,
        PBChours: Number(newContract.PBChours) || 0,
        SLPhours: Number(newContract.SLPhours) || 0,
        OThours: Number(newContract.OThours) || 0,
        PThours: Number(newContract.PThours) || 0,
        AIDEhours: Number(newContract.AIDEhours) || 0,
        COUShours: Number(newContract.COUShours) || 0,
        CARhours: Number(newContract.CARhours) || 0,
        fileId: fileId, // Include the fileId if available
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/client-contract`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Set 'Content-Type' for JSON data
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(contractData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating contract data:", errorData);
        throw new Error(
          `Failed to create contract data: ${
            errorData.message || errorData.error || "Unknown error"
          }`
        );
      }

      // Fetch the new contract data and update the state
      await fetchContract();
      setAddingContract(false);
      alert("Contract information added successfully!");
    } catch (error) {
      console.error("Error creating contract data:", error);
      alert(`Error creating contract data: ${error.message}`);
    }
  };

  // Function to add a new guardian
  const createGuardianInfo = async () => {
    const token = Cookies.get("token");
  
    // Prepare data to send
    const guardianDataToSend = {
      ...newGuardian,
      clientId: clientId,
    };
  
    // Basic validation
    if (
      !guardianDataToSend.firstName ||
      !guardianDataToSend.lastName ||
      !guardianDataToSend.relationship ||
      !guardianDataToSend.phoneNumber ||
      !guardianDataToSend.email ||
      !guardianDataToSend.address ||
      !guardianDataToSend.city ||
      !guardianDataToSend.province ||
      !guardianDataToSend.postalCode
    ) {
      alert("Please fill in all required fields.");
      return;
    }
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/guardians/primary/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(guardianDataToSend),
        }
      );
  
      if (response.ok) {
        // Instead of manually updating the guardian state, fetch the updated guardians
        await fetchGuardian();
  
        // Reset the form
        setNewGuardian({
          firstName: "",
          lastName: "",
          relationship: "",
          custody: "",
          phoneNumber: "",
          email: "",
          address: "",
          city: "",
          province: "",
          postalCode: "",
          clientId: clientId,
        });
  
        setAddingGuardian(false);
        alert("Guardian added successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to add guardian: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding guardian:", error);
      alert("An error occurred while adding the guardian.");
    }
  };
  

  // Function to create a new diagnosis
  const createDiagnosisInfo = async () => {
    const token = Cookies.get("token");
    try {
      if (!newDiagnosis.diagnosis) {
        alert("Please enter a diagnosis.");
        return;
      }

      const diagnosisData = {
        clientId: clientId,
        diagnosis: newDiagnosis.diagnosis,
        aType: newDiagnosis.aType === "typical" ? 1 : 0,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/diagnosis/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(diagnosisData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating diagnosis data:", errorData);
        throw new Error(
          `Failed to create diagnosis data: ${
            errorData.message || errorData.error || "Unknown error"
          }`
        );
      }

      // Fetch the updated diagnoses list
      await fetchDiagnosis();
      setAddingDiagnosis(false);
      alert("Diagnosis information added successfully!");
    } catch (error) {
      console.error("Error creating diagnosis data:", error);
      alert(`Error creating diagnosis data: ${error.message}`);
    }
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    try {
      await updateClientInfo();
      await updateGuardianInfo();
      await updateDiagnosisInfo();
      await updateInsuranceInfo();
      await updateConsentInfo();
      await updateContractInfo();
      await updateAssignedTeamMembers();

      if (selectedUsers.length > 0) {
        await assignNewTeamMembers();
      }

      // Refresh assigned team members after updates
      await fetchAssignedTeamMembers();

      alert("Changes saved successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving changes:", error);
      alert(`Error saving changes: ${error.message}`);
    }
  };

  // Search functionality
  const handleSearch = (name, role) => {
    let filteredUsers = allUsers;

    if (name) {
      const nameLower = name.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.firstName.toLowerCase().includes(nameLower) ||
          user.lastName.toLowerCase().includes(nameLower)
      );
    }

    if (role) {
      const roleLower = role.toLowerCase();
      filteredUsers = filteredUsers.filter((user) =>
        user.role.toLowerCase().includes(roleLower)
      );
    }

    setSearchResults(filteredUsers);
  };

  // Handler for selecting a user
  const handleSelectUser = (user) => {
    // Check if user is already selected
    if (selectedUsers.some((u) => u.userId === user.userId)) {
      alert("User already selected");
      return;
    }
    setSelectedUsers([
      ...selectedUsers,
      {
        ...user,
        startServiceDate: "",
        endServiceDate: "",
      },
    ]);
  };

  // Handler for removing a selected user
  const handleRemoveSelectedUser = (index) => {
    const updatedUsers = [...selectedUsers];
    updatedUsers.splice(index, 1);
    setSelectedUsers(updatedUsers);
  };

  // Handler for changing dates of selected users
  const handleDateChange = (index, field, value) => {
    const updatedUsers = [...selectedUsers];
    updatedUsers[index][field] = value;
    setSelectedUsers(updatedUsers);
  };

  // Handle downloading the contract PDF
  const handleDownloadContract = async () => {
    if (contract && contract.fileId) {
      const token = Cookies.get("token");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/files/${contract.fileId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch contract file");
        }

        const fileData = await response.json();

        if (fileData.signedUrl) {
          const link = document.createElement("a");
          link.href = fileData.signedUrl;
          link.download = fileData.fileName || "contract.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          throw new Error("Signed URL not available");
        }
      } catch (error) {
        console.error("Error downloading contract:", error);
        alert("Error downloading contract. Please try again.");
      }
    } else {
      alert("No contract file available.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!patient) return <div>No client data found</div>;

  // Categorize team members based on endServiceDate
  const today = new Date();
  // for add consent when no information
  const handleNewConsentInputChange = (e) => {
    const { name, value } = e.target;
    setNewConsent({ ...newConsent, [name]: value });
  };
  // for add insurance when no information
  const handleNewInsuranceInputChange = (e) => {
    const { name, value } = e.target;
    setNewInsurance({ ...newInsurance, [name]: value });
  };

  // for add contract when no information
  const handleNewContractInputChange = (e) => {
    const { name, value } = e.target;
    setNewContract({ ...newContract, [name]: value });
  };
  // for add new contract file
  const handleNewContractFileChange = (e) => {
    setNewContractFile(e.target.files[0]);
  };

  const handleContractFileChange = (e) => {
    setEditedContractFile(e.target.files[0]);
  };
  // for add new guardian
  const handleNewGuardianInputChange = (e) => {
    const { name, value } = e.target;
    setNewGuardian({ ...newGuardian, [name]: value });
  };
  // for add new diagnosis
  const handleNewDiagnosisInputChange = (e) => {
    const { name, value } = e.target;
    setNewDiagnosis({ ...newDiagnosis, [name]: value });
  };

  // for add new outside provider
  const handleNewOutsideProviderChange = (e) => {
    const { name, value } = e.target;
    setNewOutsideProvider({
      ...newOutsideProvider,
      [name]: value,
    });
  };
  // Ensure editedAssignedTeamMembers is an array
  const assignedTeamMembersArray = Array.isArray(editedAssignedTeamMembers)
    ? editedAssignedTeamMembers
    : [];

  const currentTeamMembers = assignedTeamMembersArray.filter((member) => {
    const endDate = member.endServiceDate
      ? new Date(member.endServiceDate)
      : null;
    return !endDate || endDate >= today;
  });

  const pastTeamMembers = assignedTeamMembersArray.filter((member) => {
    const endDate = member.endServiceDate
      ? new Date(member.endServiceDate)
      : null;
    return endDate && endDate < today;
  });

  return (
    <div>
      <HoriNav user={user} />
      <div className="p-4 ml-8 mt-1 pt-20">
        <div className="flex items-center mb-4">
          <Link href="./View-Patient-Page">
            <div className="flex items-center mb-4 cursor-pointer">
              <ArrowLeftIcon className="h-6 w-6 mr-2" />
              <span>Back to Client List</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h1 className="text-4xl font-bold">{`${patient.firstName} ${patient.lastName}`}</h1>
            <Badge variant="default" className="ml-4">
              {patient.currentStatus ? "Active" : "Archived"}
            </Badge>
          </div>
          {!isEditing && <Button onClick={handleEditClick}>Edit</Button>}
          {isEditing && (
            <div>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
              <Button onClick={handleCancelEdit} className="ml-2">
                Cancel
              </Button>
            </div>
          )}
        </div>
        <Tabs defaultValue="personal-info" className="mb-6">
          <TabsList>
            <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
            <TabsTrigger value="medical-info">Medical Info</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="contract">Contract</TabsTrigger>
            <TabsTrigger value="additional-note">Additional Note</TabsTrigger>
          </TabsList>
          <TabsContent value="personal-info">
            {/* Patient Info */}
            <div style={styles.card}>
              <h2 style={styles.sectionHeader}>Basic Information</h2>
              <div style={styles.formContainer}>
                {/* First Name */}
                <div>
                  <Label className="text-muted-foreground">First Name</Label>
                  {isEditing ? (
                    <Input
                      name="firstName"
                      value={editedPatient.firstName || ""}
                      onChange={handlePatientInputChange}
                    />
                  ) : (
                    <p className="text-lg font-semibold">{patient.firstName}</p>
                  )}
                </div>
                {/* Last Name */}
                <div>
                  <Label className="text-muted-foreground">Last Name</Label>
                  {isEditing ? (
                    <Input
                      name="lastName"
                      value={editedPatient.lastName || ""}
                      onChange={handlePatientInputChange}
                    />
                  ) : (
                    <p className="text-lg font-semibold">{patient.lastName}</p>
                  )}
                </div>
                {/* Date of Birth */}
                <div>
                  <Label className="text-muted-foreground">Date Of Birth</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      name="birthDate"
                      value={
                        editedPatient.birthDate
                          ? editedPatient.birthDate.split("T")[0]
                          : ""
                      }
                      onChange={handlePatientInputChange}
                    />
                  ) : (
                    <p className="text-lg font-semibold">
                      {formatDisplayDate(patient.birthDate)}
                    </p>
                  )}
                </div>
                {/* Age */}
                <div>
                  <Label className="text-muted-foreground">Age</Label>
                  <p className="text-lg font-semibold">
                    {calculateAge(patient.birthDate)}
                  </p>
                </div>

                {/* Address */}
                <div>
                  <Label className="text-muted-foreground">Address</Label>
                  {isEditing ? (
                    <Input
                      name="address"
                      value={editedPatient.address || ""}
                      onChange={handlePatientInputChange}
                    />
                  ) : (
                    <p className="text-lg font-semibold">{patient.address}</p>
                  )}
                </div>
                {/* City */}
                <div>
                  <Label className="text-muted-foreground">City</Label>
                  {isEditing ? (
                    <Input
                      name="city"
                      value={editedPatient.city || ""}
                      onChange={handlePatientInputChange}
                    />
                  ) : (
                    <p className="text-lg font-semibold">{patient.city}</p>
                  )}
                </div>
                {/* Province */}
                <div>
                  <Label className="text-muted-foreground">Province</Label>
                  {isEditing ? (
                    <Input
                      name="province"
                      value={editedPatient.province || ""}
                      onChange={handlePatientInputChange}
                    />
                  ) : (
                    <p className="text-lg font-semibold">{patient.province}</p>
                  )}
                </div>
                {/* Postal Code */}
                <div>
                  <Label className="text-muted-foreground">Postal Code</Label>
                  {isEditing ? (
                    <Input
                      name="postalCode"
                      value={editedPatient.postalCode || ""}
                      onChange={handlePatientInputChange}
                    />
                  ) : (
                    <p className="text-lg font-semibold">
                      {patient.postalCode}
                    </p>
                  )}
                </div>
                {/* Gender */}
                <div>
                  <Label className="text-muted-foreground">Gender</Label>
                  {isEditing ? (
                    <Input
                      name="gender"
                      value={editedPatient.gender || ""}
                      onChange={handlePatientInputChange}
                    />
                  ) : (
                    <p className="text-lg font-semibold">{patient.gender}</p>
                  )}
                </div>
                {/* School */}
                <div>
                  <Label className="text-muted-foreground">School</Label>
                  {isEditing ? (
                    <Input
                      name="school"
                      value={editedPatient.school || ""}
                      onChange={handlePatientInputChange}
                    />
                  ) : (
                    <p className="text-lg font-semibold">{patient.school}</p>
                  )}
                </div>
                {/* FSCD ID# */}
                <div>
                  <Label className="text-muted-foreground">FSCD ID#</Label>
                  {isEditing ? (
                    <Input
                      name="fscdIdNum"
                      value={editedPatient.fscdIdNum || ""}
                      onChange={handlePatientInputChange}
                    />
                  ) : (
                    <p className="text-lg font-semibold">{patient.fscdIdNum}</p>
                  )}
                </div>
                {/* Email */}
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  {isEditing ? (
                    <Input
                      name="email"
                      value={editedPatient.email || ""}
                      onChange={handlePatientInputChange}
                    />
                  ) : (
                    <p className="text-lg font-semibold">{patient.email}</p>
                  )}
                </div>
                {/* Phone Number */}
                <div>
                  <Label className="text-muted-foreground">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      name="phoneNumber"
                      value={editedPatient.phoneNumber || ""}
                      onChange={handlePatientInputChange}
                    />
                  ) : (
                    <p className="text-lg font-semibold">
                      {patient.phoneNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Guardian Info */}
            <div style={styles.card}>
              <h2 style={styles.sectionHeader}>Guardian Information</h2>

              {/* Existing Guardians */}
              {guardian.length > 0
                ? guardian.map((guardianItem, index) => (
                    <div
                      key={guardianItem.guardianId || index}
                      style={styles.guardianBox}
                    >
                      <h3 style={styles.subHeader}>
                        {index === 0
                          ? "Primary Guardian"
                          : "Secondary Guardian"}
                      </h3>
                      <div style={styles.formContainer}>
                        {/* First Name */}
                        <div>
                          <Label className="text-muted-foreground">
                            First Name
                          </Label>
                          {isEditing ? (
                            <Input
                              name="firstName"
                              value={editedGuardian[index]?.firstName || ""}
                              onChange={(e) =>
                                handleGuardianInputChange(e, index)
                              }
                            />
                          ) : (
                            <p className="text-lg font-semibold">
                              {guardianItem.firstName}
                            </p>
                          )}
                        </div>
                        {/* Last Name */}
                        <div>
                          <Label className="text-muted-foreground">
                            Last Name
                          </Label>
                          {isEditing ? (
                            <Input
                              name="lastName"
                              value={editedGuardian[index]?.lastName || ""}
                              onChange={(e) =>
                                handleGuardianInputChange(e, index)
                              }
                            />
                          ) : (
                            <p className="text-lg font-semibold">
                              {guardianItem.lastName}
                            </p>
                          )}
                        </div>
                        {/* Relationship */}
                        <div>
                          <Label className="text-muted-foreground">
                            Relationship to Patient
                          </Label>
                          {isEditing ? (
                            <Input
                              name="relationship"
                              value={editedGuardian[index]?.relationship || ""}
                              onChange={(e) =>
                                handleGuardianInputChange(e, index)
                              }
                            />
                          ) : (
                            <p className="text-lg font-semibold">
                              {guardianItem.relationship}
                            </p>
                          )}
                        </div>
                        {/* Custody */}
                        <div>
                          <Label className="text-muted-foreground">
                            Custody
                          </Label>
                          {isEditing ? (
                            <Input
                              name="custody"
                              value={editedGuardian[index]?.custody || ""}
                              onChange={(e) =>
                                handleGuardianInputChange(e, index)
                              }
                            />
                          ) : (
                            <p className="text-lg font-semibold">
                              {guardianItem.custody}
                            </p>
                          )}
                        </div>
                        {/* Address */}
                        <div>
                          <Label className="text-muted-foreground">
                            Address
                          </Label>
                          {isEditing ? (
                            <Input
                              name="address"
                              value={editedGuardian[index]?.address || ""}
                              onChange={(e) =>
                                handleGuardianInputChange(e, index)
                              }
                            />
                          ) : (
                            <p className="text-lg font-semibold">
                              {guardianItem.address}
                            </p>
                          )}
                        </div>
                        {/* City */}
                        <div>
                          <Label className="text-muted-foreground">City</Label>
                          {isEditing ? (
                            <Input
                              name="city"
                              value={editedGuardian[index]?.city || ""}
                              onChange={(e) =>
                                handleGuardianInputChange(e, index)
                              }
                            />
                          ) : (
                            <p className="text-lg font-semibold">
                              {guardianItem.city}
                            </p>
                          )}
                        </div>
                        {/* Province */}
                        <div>
                          <Label className="text-muted-foreground">
                            Province
                          </Label>
                          {isEditing ? (
                            <Input
                              name="province"
                              value={editedGuardian[index]?.province || ""}
                              onChange={(e) =>
                                handleGuardianInputChange(e, index)
                              }
                            />
                          ) : (
                            <p className="text-lg font-semibold">
                              {guardianItem.province}
                            </p>
                          )}
                        </div>
                        {/* Postal Code */}
                        <div>
                          <Label className="text-muted-foreground">
                            Postal Code
                          </Label>
                          {isEditing ? (
                            <Input
                              name="postalCode"
                              value={editedGuardian[index]?.postalCode || ""}
                              onChange={(e) =>
                                handleGuardianInputChange(e, index)
                              }
                            />
                          ) : (
                            <p className="text-lg font-semibold">
                              {guardianItem.postalCode}
                            </p>
                          )}
                        </div>
                        {/* Email */}
                        <div>
                          <Label className="text-muted-foreground">Email</Label>
                          {isEditing ? (
                            <Input
                              name="email"
                              value={editedGuardian[index]?.email || ""}
                              onChange={(e) =>
                                handleGuardianInputChange(e, index)
                              }
                            />
                          ) : (
                            <p className="text-lg font-semibold">
                              {guardianItem.email}
                            </p>
                          )}
                        </div>
                        {/* Phone Number */}
                        <div>
                          <Label className="text-muted-foreground">
                            Phone Number
                          </Label>
                          {isEditing ? (
                            <Input
                              name="phoneNumber"
                              value={editedGuardian[index]?.phoneNumber || ""}
                              onChange={(e) =>
                                handleGuardianInputChange(e, index)
                              }
                            />
                          ) : (
                            <p className="text-lg font-semibold">
                              {guardianItem.phoneNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                : !addingGuardian &&
                  !isEditing && <p>No guardian found for this patient.</p>}

              {/* Add New Guardian */}
              {isEditing &&
                guardian.length < 2 &&
                (addingGuardian ? (
                  // Form to add new guardian
                  <div style={styles.guardianBox}>
                    <h3 style={styles.subHeader}>
                      {guardian.length === 0
                        ? "Primary Guardian"
                        : "Secondary Guardian"}
                    </h3>
                    <div style={styles.formContainer}>
                      {/* First Name */}
                      <div>
                        <Label className="text-muted-foreground">
                          First Name*
                        </Label>
                        <Input
                          name="firstName"
                          value={newGuardian.firstName}
                          onChange={handleNewGuardianInputChange}
                        />
                      </div>
                      {/* Last Name */}
                      <div>
                        <Label className="text-muted-foreground">
                          Last Name*
                        </Label>
                        <Input
                          name="lastName"
                          value={newGuardian.lastName}
                          onChange={handleNewGuardianInputChange}
                        />
                      </div>
                      {/* Relationship */}
                      <div>
                        <Label className="text-muted-foreground">
                          Relationship*
                        </Label>
                        <Input
                          name="relationship"
                          value={newGuardian.relationship}
                          onChange={handleNewGuardianInputChange}
                        />
                      </div>
                      {/* Custody */}
                      <div>
                        <Label className="text-muted-foreground">
                          Custody*
                        </Label>
                        <Input
                          name="custody"
                          value={newGuardian.custody}
                          onChange={handleNewGuardianInputChange}
                        />
                      </div>
                      {/* Phone Number */}
                      <div>
                        <Label className="text-muted-foreground">
                          Phone Number*
                        </Label>
                        <Input
                          name="phoneNumber"
                          value={newGuardian.phoneNumber}
                          onChange={handleNewGuardianInputChange}
                        />
                      </div>
                      {/* Email */}
                      <div>
                        <Label className="text-muted-foreground">Email*</Label>
                        <Input
                          name="email"
                          value={newGuardian.email}
                          onChange={handleNewGuardianInputChange}
                        />
                      </div>
                      {/* Address */}
                      <div>
                        <Label className="text-muted-foreground">
                          Address*
                        </Label>
                        <Input
                          name="address"
                          value={newGuardian.address}
                          onChange={handleNewGuardianInputChange}
                        />
                      </div>
                      {/* City */}
                      <div>
                        <Label className="text-muted-foreground">City*</Label>
                        <Input
                          name="city"
                          value={newGuardian.city}
                          onChange={handleNewGuardianInputChange}
                        />
                      </div>
                      {/* Province */}
                      <div>
                        <Label className="text-muted-foreground">
                          Province*
                        </Label>
                        <Input
                          name="province"
                          value={newGuardian.province}
                          onChange={handleNewGuardianInputChange}
                        />
                      </div>
                      {/* Postal Code */}
                      <div>
                        <Label className="text-muted-foreground">
                          Postal Code*
                        </Label>
                        <Input
                          name="postalCode"
                          value={newGuardian.postalCode}
                          onChange={handleNewGuardianInputChange}
                        />
                      </div>

                      {/* Save and Cancel Buttons */}
                      <div style={styles.fullWidth}>
                        <Button onClick={createGuardianInfo}>Save</Button>
                        <Button
                          onClick={() => setAddingGuardian(false)}
                          className="ml-2"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setAddingGuardian(true)}>
                    Add New Guardian
                  </Button>
                ))}
            </div>
          </TabsContent>

          {/* Medical Info Tab */}
          <TabsContent value="medical-info">
            <div>
              {/* Diagnosis Information */}
              <div style={styles.card}>
                <h3 style={styles.sectionHeader}>Diagnoses</h3>
                {diagnosis.length > 0 ? (
                  diagnosis.map((diagnosisItem, index) => (
                    <div
                      key={diagnosisItem.diagnosisId || index}
                      className="mb-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Diagnosis */}
                        <div>
                          <Label className="text-muted-foreground">
                            Diagnosis
                          </Label>
                          {isEditing ? (
                            <Input
                              name="diagnosis"
                              value={editedDiagnosis[index].diagnosis || ""}
                              onChange={(e) =>
                                handleDiagnosisInputChange(e, index)
                              }
                            />
                          ) : (
                            <p className="text-lg font-semibold">
                              {diagnosisItem.diagnosis}
                            </p>
                          )}
                        </div>
                        {/* aType */}
                        <div>
                          <Label className="text-muted-foreground">
                            Typicality
                          </Label>
                          {isEditing ? (
                            <select
                              name="aType"
                              value={editedDiagnosis[index].aType || "typical"}
                              onChange={(e) =>
                                handleDiagnosisInputChange(e, index)
                              }
                              className="border rounded p-2 w-full"
                            >
                              <option value="typical">Typical</option>
                              <option value="atypical">Atypical</option>
                            </select>
                          ) : (
                            <p className="text-lg font-semibold">
                              {diagnosisItem.aType}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No diagnosis data available.</p>
                )}

                {/* Add New Diagnosis */}
                {isEditing &&
                  (addingDiagnosis ? (
                    // Form to add new diagnosis
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Diagnosis */}
                      <div>
                        <Label className="text-muted-foreground">
                          Diagnosis*
                        </Label>
                        <Input
                          name="diagnosis"
                          value={newDiagnosis.diagnosis}
                          onChange={handleNewDiagnosisInputChange}
                        />
                      </div>
                      {/* Typicality */}
                      <div>
                        <Label className="text-muted-foreground">
                          Typicality*
                        </Label>
                        <select
                          name="aType"
                          value={newDiagnosis.aType}
                          onChange={handleNewDiagnosisInputChange}
                          className="border rounded p-2 w-full"
                        >
                          <option value="typical">Typical</option>
                          <option value="atypical">Atypical</option>
                        </select>
                      </div>
                      {/* Save and Cancel Buttons */}
                      <div style={styles.fullWidth}>
                        <Button onClick={createDiagnosisInfo}>Save</Button>
                        <Button
                          onClick={() => setAddingDiagnosis(false)}
                          className="ml-2"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={() => setAddingDiagnosis(true)}>
                      Add New Diagnosis
                    </Button>
                  ))}
              </div>

              {/* Insurance Information */}
              <div style={styles.card}>
                <h2 style={styles.sectionHeader}>Insurance</h2>
                {insurance ? (
                  isEditing ? (
                    // Code to edit existing insurance information
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Insurance Provider */}
                      <div>
                        <Label className="text-muted-foreground">
                          Insurance Provider
                        </Label>
                        <Input
                          name="insuranceProvider"
                          value={editedInsurance.insuranceProvider || ""}
                          onChange={handleInsuranceInputChange}
                        />
                      </div>
                      {/* Primary Plan Name */}
                      <div>
                        <Label className="text-muted-foreground">
                          Primary Plan Name
                        </Label>
                        <Input
                          name="primaryPlanName"
                          value={editedInsurance.primaryPlanName || ""}
                          onChange={handleInsuranceInputChange}
                        />
                      </div>
                      {/* Certificate ID */}
                      <div>
                        <Label className="text-muted-foreground">
                          Certificate ID
                        </Label>
                        <Input
                          name="certificateId"
                          value={editedInsurance.certificateId || ""}
                          onChange={handleInsuranceInputChange}
                        />
                      </div>
                      {/* Coverage Detail */}
                      <div>
                        <Label className="text-muted-foreground">
                          Coverage Detail
                        </Label>
                        <Input
                          name="coverateDetail"
                          value={editedInsurance.coverateDetail || ""}
                          onChange={handleInsuranceInputChange}
                        />
                      </div>
                      {/* Start Date */}
                      <div>
                        <Label className="text-muted-foreground">
                          Start Date
                        </Label>
                        <Input
                          type="date"
                          name="startDate"
                          value={
                            editedInsurance.startDate
                              ? editedInsurance.startDate.split("T")[0]
                              : ""
                          }
                          onChange={handleInsuranceInputChange}
                        />
                      </div>
                      {/* End Date */}
                      <div>
                        <Label className="text-muted-foreground">
                          End Date
                        </Label>
                        <Input
                          type="date"
                          name="endDate"
                          value={
                            editedInsurance.endDate
                              ? editedInsurance.endDate.split("T")[0]
                              : ""
                          }
                          onChange={handleInsuranceInputChange}
                        />
                      </div>
                    </div>
                  ) : (
                    // Display existing insurance information
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Insurance Provider */}
                      <div>
                        <Label className="text-muted-foreground">
                          Insurance Provider
                        </Label>
                        <p className="text-lg font-semibold">
                          {insurance.insuranceProvider || "N/A"}
                        </p>
                      </div>
                      {/* Primary Plan Name */}
                      <div>
                        <Label className="text-muted-foreground">
                          Primary Plan Name
                        </Label>
                        <p className="text-lg font-semibold">
                          {insurance.primaryPlanName || "N/A"}
                        </p>
                      </div>
                      {/* Certificate ID */}
                      <div>
                        <Label className="text-muted-foreground">
                          Certificate ID
                        </Label>
                        <p className="text-lg font-semibold">
                          {insurance.certificateId || "N/A"}
                        </p>
                      </div>
                      {/* Coverage Detail */}
                      <div>
                        <Label className="text-muted-foreground">
                          Coverage Detail
                        </Label>
                        <p className="text-lg font-semibold">
                          {insurance.coverateDetail || "N/A"}
                        </p>
                      </div>
                      {/* Start Date */}
                      <div>
                        <Label className="text-muted-foreground">
                          Start Date
                        </Label>
                        <p className="text-lg font-semibold">
                          {insurance.startDate
                            ? formatDisplayDate(insurance.startDate)
                            : "N/A"}
                        </p>
                      </div>
                      {/* End Date */}
                      <div>
                        <Label className="text-muted-foreground">
                          End Date
                        </Label>
                        <p className="text-lg font-semibold">
                          {insurance.endDate
                            ? formatDisplayDate(insurance.endDate)
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  )
                ) : isEditing ? (
                  addingInsurance ? (
                    // Code to add new insurance information
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Insurance Provider */}
                      <div>
                        <Label className="text-muted-foreground">
                          Insurance Provider
                        </Label>
                        <Input
                          name="insuranceProvider"
                          value={newInsurance.insuranceProvider || ""}
                          onChange={handleNewInsuranceInputChange}
                        />
                      </div>
                      {/* Primary Plan Name */}
                      <div>
                        <Label className="text-muted-foreground">
                          Primary Plan Name
                        </Label>
                        <Input
                          name="primaryPlanName"
                          value={newInsurance.primaryPlanName || ""}
                          onChange={handleNewInsuranceInputChange}
                        />
                      </div>
                      {/* Certificate ID */}
                      <div>
                        <Label className="text-muted-foreground">
                          Certificate ID
                        </Label>
                        <Input
                          name="certificateId"
                          value={newInsurance.certificateId || ""}
                          onChange={handleNewInsuranceInputChange}
                        />
                      </div>
                      {/* Coverage Detail */}
                      <div>
                        <Label className="text-muted-foreground">
                          Coverage Detail
                        </Label>
                        <Input
                          name="coverateDetail"
                          value={newInsurance.coverateDetail || ""}
                          onChange={handleNewInsuranceInputChange}
                        />
                      </div>
                      {/* Start Date */}
                      <div>
                        <Label className="text-muted-foreground">
                          Start Date
                        </Label>
                        <Input
                          type="date"
                          name="startDate"
                          value={newInsurance.startDate}
                          onChange={handleNewInsuranceInputChange}
                        />
                      </div>
                      {/* End Date */}
                      <div>
                        <Label className="text-muted-foreground">
                          End Date
                        </Label>
                        <Input
                          type="date"
                          name="endDate"
                          value={newInsurance.endDate}
                          onChange={handleNewInsuranceInputChange}
                        />
                      </div>
                      {/* Save and Cancel Buttons */}
                      <div style={styles.fullWidth}>
                        <Button onClick={createInsuranceInfo}>Save</Button>
                        <Button
                          onClick={() => setAddingInsurance(false)}
                          className="ml-2"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={() => setAddingInsurance(true)}>
                      Add Insurance Information
                    </Button>
                  )
                ) : (
                  <p>No insurance information available.</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <div style={styles.card}>
              <h2 style={styles.sectionHeader}>Team Members</h2>
              <Tabs defaultValue="current" className="mb-6">
                <TabsList>
                  <TabsTrigger value="current">
                    Current Team Members
                  </TabsTrigger>
                  <TabsTrigger value="past">Past Team Members</TabsTrigger>
                </TabsList>
                <TabsContent value="current">
                  {/* Currently Working with This Client */}
                  {currentTeamMembers.length > 0 && (
                    <div className="mb-4">
                      {/* <h3 className="text-xl font-semibold">
                        Currently Working with This Client
                      </h3> */}

                      <Table style={styles.table}>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Team Member</TableHead>
                            <TableHead>Service Start Date</TableHead>
                            <TableHead>Service End Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentTeamMembers.map((member) => (
                            <TableRow key={member.teamMemberId}>
                              {/* Display team member's name and role */}
                              <TableCell>{getTeamMemberName(member)}</TableCell>
                              {isEditing ? (
                                <>
                                  {/* Editable start service date */}
                                  <TableCell>
                                    <Input
                                      type="date"
                                      value={
                                        member.startServiceDate
                                          ? member.startServiceDate.split(
                                              "T"
                                            )[0]
                                          : ""
                                      }
                                      onChange={(e) =>
                                        handleAssignedDateChange(
                                          member.teamMemberId,
                                          "startServiceDate",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </TableCell>
                                  {/* Editable end service date */}
                                  <TableCell>
                                    <Input
                                      type="date"
                                      value={
                                        member.endServiceDate
                                          ? member.endServiceDate.split("T")[0]
                                          : ""
                                      }
                                      onChange={(e) =>
                                        handleAssignedDateChange(
                                          member.teamMemberId,
                                          "endServiceDate",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </TableCell>
                                </>
                              ) : (
                                <>
                                  {/* Display start service date */}
                                  <TableCell>
                                    {member.startServiceDate
                                      ? new Date(
                                          member.startServiceDate
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </TableCell>
                                  {/* Display end service date */}
                                  <TableCell>
                                    {member.endServiceDate
                                      ? new Date(
                                          member.endServiceDate
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </TableCell>
                                </>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="past">
                  {/* Past Working with This Client */}
                  {pastTeamMembers.length > 0 && (
                    <div className="mb-4">
                      {/* <h3 className="text-xl font-semibold">
                        Past Working with This Client
                      </h3> */}
                      <Table style={styles.table}>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Team Member</TableHead>
                            <TableHead>Service Start Date</TableHead>
                            <TableHead>Service End Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pastTeamMembers.map((member) => (
                            <TableRow key={member.teamMemberId}>
                              {/* Display team member's name and role */}
                              <TableCell>{getTeamMemberName(member)}</TableCell>
                              {isEditing ? (
                                <>
                                  {/* Editable start service date */}
                                  <TableCell>
                                    <Input
                                      type="date"
                                      value={
                                        member.startServiceDate
                                          ? member.startServiceDate.split(
                                              "T"
                                            )[0]
                                          : ""
                                      }
                                      onChange={(e) =>
                                        handleAssignedDateChange(
                                          member.teamMemberId,
                                          "startServiceDate",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </TableCell>
                                  {/* Editable end service date */}
                                  <TableCell>
                                    <Input
                                      type="date"
                                      value={
                                        member.endServiceDate
                                          ? member.endServiceDate.split("T")[0]
                                          : ""
                                      }
                                      onChange={(e) =>
                                        handleAssignedDateChange(
                                          member.teamMemberId,
                                          "endServiceDate",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </TableCell>
                                </>
                              ) : (
                                <>
                                  {/* Display start service date */}
                                  <TableCell>
                                    {member.startServiceDate
                                      ? new Date(
                                          member.startServiceDate
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </TableCell>
                                  {/* Display end service date */}
                                  <TableCell>
                                    {member.endServiceDate
                                      ? new Date(
                                          member.endServiceDate
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </TableCell>
                                </>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              {/* Editing Mode */}
              {isEditing && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Assign New Team Member
                  </h3>
                  <Tabs defaultValue="assigned" className="mb-6">
                    <TabsList>
                      <TabsTrigger value="assigned">Assigned Staff</TabsTrigger>
                      <TabsTrigger value="outsideProvider">
                        Add Outside Provider
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="assigned">
                      {/* Search Inputs */}
                      <div className="flex items-center mb-4">
                        <Input
                          placeholder="Search by name"
                          value={searchName}
                          onChange={(e) => {
                            setSearchName(e.target.value);
                            handleSearch(e.target.value, searchRole);
                          }}
                          className="mr-2"
                        />
                        <Input
                          placeholder="Search by role"
                          value={searchRole}
                          onChange={(e) => {
                            setSearchRole(e.target.value);
                            handleSearch(searchName, e.target.value);
                          }}
                          className="mr-2"
                        />
                      </div>

                      {/* Search Results */}
                      {searchResults.length > 0 && (
                        <div className="mb-4">
                          {/* <h3 className="text-xl font-semibold">
                            Search Results
                          </h3> */}
                          <Table style={styles.table}>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {searchResults.map((user) => (
                                <TableRow key={user.userId}>
                                  {/* Display user's full name */}
                                  <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                                  {/* Display user's role */}
                                  <TableCell>{user.role}</TableCell>
                                  {/* Action button to select user */}
                                  <TableCell>
                                    <Button
                                      onClick={() => handleSelectUser(user)}
                                    >
                                      Select
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}

                      {/* Selected Team Members */}
                      {selectedUsers.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold">
                            Selected Team Members
                          </h3>
                          <Table style={styles.table}>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Service Start Date</TableHead>
                                <TableHead>Service End Date</TableHead>
                                <TableHead>Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedUsers.map((user, index) => (
                                <TableRow key={user.userId}>
                                  {/* Display user's full name */}
                                  <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                                  {/* Display user's role */}
                                  <TableCell>{user.role}</TableCell>
                                  {/* Editable start service date */}
                                  <TableCell>
                                    <Input
                                      type="date"
                                      value={user.startServiceDate}
                                      onChange={(e) =>
                                        handleDateChange(
                                          index,
                                          "startServiceDate",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </TableCell>
                                  {/* Editable end service date */}
                                  <TableCell>
                                    <Input
                                      type="date"
                                      value={user.endServiceDate}
                                      onChange={(e) =>
                                        handleDateChange(
                                          index,
                                          "endServiceDate",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </TableCell>
                                  {/* Action button to remove user */}
                                  <TableCell>
                                    <Button
                                      onClick={() =>
                                        handleRemoveSelectedUser(index)
                                      }
                                      variant="destructive"
                                    >
                                      Remove
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="outsideProvider">
                      <div className="mb-4">
                        {/* <h3 className="text-xl font-semibold">
                          Add Outside Provider
                        </h3> */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-muted-foreground">
                              First Name
                            </Label>
                            <Input
                              name="firstName"
                              value={newOutsideProvider.firstName}
                              onChange={handleNewOutsideProviderChange}
                            />
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Last Name
                            </Label>
                            <Input
                              name="lastName"
                              value={newOutsideProvider.lastName}
                              onChange={handleNewOutsideProviderChange}
                            />
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Email
                            </Label>
                            <Input
                              name="email"
                              value={newOutsideProvider.email}
                              onChange={handleNewOutsideProviderChange}
                            />
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Phone Number
                            </Label>
                            <Input
                              name="phoneNumber"
                              value={newOutsideProvider.phoneNumber}
                              onChange={handleNewOutsideProviderChange}
                            />
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Agency
                            </Label>
                            <Input
                              name="agency"
                              value={newOutsideProvider.agency}
                              onChange={handleNewOutsideProviderChange}
                            />
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Service Start Date
                            </Label>
                            <Input
                              type="date"
                              name="startServiceDate"
                              value={newOutsideProvider.startServiceDate}
                              onChange={handleNewOutsideProviderChange}
                            />
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Service End Date
                            </Label>
                            <Input
                              type="date"
                              name="endServiceDate"
                              value={newOutsideProvider.endServiceDate}
                              onChange={handleNewOutsideProviderChange}
                            />
                          </div>
                        </div>
                        <Button
                          onClick={handleAddOutsideProvider}
                          className="mt-4"
                        >
                          Add Outside Provider
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="contract">
            {/* Contract Information */}
            <div style={styles.card}>
              <h2 style={styles.sectionHeader}>Contract</h2>
              {contract ? (
                isEditing ? (
                  // Edit existing contract information
                  <div>
                    <div className="mb-4">
                      {/* Start Date */}
                      <div className="mb-2">
                        <Label className="text-muted-foreground">
                          Start Date
                        </Label>
                        <Input
                          type="date"
                          name="startDate"
                          value={
                            editedContract.startDate
                              ? editedContract.startDate.split("T")[0]
                              : ""
                          }
                          onChange={handleContractInputChange}
                        />
                      </div>
                      {/* End Date */}
                      <div className="mb-6">
                        <Label className="text-muted-foreground">
                          End Date
                        </Label>
                        <Input
                          type="date"
                          name="endDate"
                          value={
                            editedContract.endDate
                              ? editedContract.endDate.split("T")[0]
                              : ""
                          }
                          onChange={handleContractInputChange}
                        />
                      </div>
                      {/* Service Hours */}
                      <Table style={styles.table}>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>Hours</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Coordinator */}
                          <TableRow>
                            <TableCell>Coordinator</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                name="COOhours"
                                value={editedContract.COOhours || 0}
                                onChange={handleContractInputChange}
                              />
                            </TableCell>
                          </TableRow>
                          {/* Psychologist/Behavioral Consultant */}
                          <TableRow>
                            <TableCell>
                              Psychologist/Behavioral Consultant
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                name="PBChours"
                                value={editedContract.PBChours || 0}
                                onChange={handleContractInputChange}
                              />
                            </TableCell>
                          </TableRow>
                          {/* Speech-Language Pathologist */}
                          <TableRow>
                            <TableCell>SLP</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                name="SLPhours"
                                value={editedContract.SLPhours || 0}
                                onChange={handleContractInputChange}
                              />
                            </TableCell>
                          </TableRow>
                          {/* Additional services */}
                          {/* OT */}
                          <TableRow>
                            <TableCell>OT</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                name="OThours"
                                value={editedContract.OThours || 0}
                                onChange={handleContractInputChange}
                              />
                            </TableCell>
                          </TableRow>
                          {/* PT */}
                          <TableRow>
                            <TableCell>PT</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                name="PThours"
                                value={editedContract.PThours || 0}
                                onChange={handleContractInputChange}
                              />
                            </TableCell>
                          </TableRow>
                          {/* Aide */}
                          <TableRow>
                            <TableCell>Aide</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                name="AIDEhours"
                                value={editedContract.AIDEhours || 0}
                                onChange={handleContractInputChange}
                              />
                            </TableCell>
                          </TableRow>
                          {/* Counseling */}
                          <TableRow>
                            <TableCell>Counseling</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                name="COUShours"
                                value={editedContract.COUShours || 0}
                                onChange={handleContractInputChange}
                              />
                            </TableCell>
                          </TableRow>
                          {/* Community Aide Respite */}
                          <TableRow>
                            <TableCell>Community Aide Respite</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                name="CARhours"
                                value={editedContract.CARhours || 0}
                                onChange={handleContractInputChange}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    {/* File Upload */}
                    {/* <div>
                      <Label className="text-muted-foreground">
                        Upload New Contract
                      </Label>
                      <Input
                        type="file"
                        name="contractFile"
                        onChange={handleContractFileChange}
                      />
                    </div> */}
                  </div>
                ) : (
                  // Display existing contract information
                  <div>
                    {/* Start Date */}
                    <div className="mb-2">
                      <Label className="text-muted-foreground">
                        Start Date
                      </Label>
                      <p className="text-lg font-semibold">
                        {contract.startDate
                          ? formatDisplayDate(contract.startDate)
                          : "N/A"}
                      </p>
                    </div>
                    {/* End Date */}
                    <div className="mb-6">
                      <Label className="text-muted-foreground">End Date</Label>
                      <p className="text-lg font-semibold">
                        {contract.endDate
                          ? formatDisplayDate(contract.endDate)
                          : "N/A"}
                      </p>
                    </div>
                    {/* Service Hours */}
                    <Table style={styles.table}>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Hours</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contract.COOhours !== 0 && (
                          <TableRow>
                            <TableCell>Coordinator</TableCell>
                            <TableCell>{contract.COOhours}</TableCell>
                          </TableRow>
                        )}
                        {contract.PBChours !== 0 && (
                          <TableRow>
                            <TableCell>
                              Psychologist/Behavioral Consultant
                            </TableCell>
                            <TableCell>{contract.PBChours}</TableCell>
                          </TableRow>
                        )}
                        {contract.SLPhours !== 0 && (
                          <TableRow>
                            <TableCell>SLP</TableCell>
                            <TableCell>{contract.SLPhours}</TableCell>
                          </TableRow>
                        )}
                        {contract.OThours !== 0 && (
                          <TableRow>
                            <TableCell>OT</TableCell>
                            <TableCell>{contract.OThours}</TableCell>
                          </TableRow>
                        )}
                        {/* Additional services */}
                        {contract.PThours !== 0 && (
                          <TableRow>
                            <TableCell>PT</TableCell>
                            <TableCell>{contract.PThours}</TableCell>
                          </TableRow>
                        )}
                        {contract.AIDEhours !== 0 && (
                          <TableRow>
                            <TableCell>Aide</TableCell>
                            <TableCell>{contract.AIDEhours}</TableCell>
                          </TableRow>
                        )}
                        {contract.COUShours !== 0 && (
                          <TableRow>
                            <TableCell>Counseling</TableCell>
                            <TableCell>{contract.COUShours}</TableCell>
                          </TableRow>
                        )}
                        {contract.CARhours !== 0 && (
                          <TableRow>
                            <TableCell>Community Aide Respite</TableCell>
                            <TableCell>{contract.CARhours}</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    {/* View Contract File */}
                    <div className="pt-4">
                      <Button onClick={handleDownloadContract}>
                        View Contract
                      </Button>
                    </div>
                  </div>
                )
              ) : isEditing ? (
                addingContract ? (
                  // Add new contract information
                  <div>
                    <div className="mb-4">
                      {/* Start Date */}
                      <div className="mb-2">
                        <Label className="text-muted-foreground">
                          Start Date
                        </Label>
                        <Input
                          type="date"
                          name="startDate"
                          value={newContract.startDate}
                          onChange={handleNewContractInputChange}
                        />
                      </div>
                      {/* End Date */}
                      <div className="mb-6">
                        <Label className="text-muted-foreground">
                          End Date
                        </Label>
                        <Input
                          type="date"
                          name="endDate"
                          value={newContract.endDate}
                          onChange={handleNewContractInputChange}
                        />
                      </div>
                      {/* Service Hours */}
                      <Table style={styles.table}>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>Hours</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Coordinator */}
                          <TableRow>
                            <TableCell>Coordinator</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                name="COOhours"
                                value={newContract.COOhours}
                                onChange={handleNewContractInputChange}
                              />
                            </TableCell>
                          </TableRow>
                          {/* Psychologist/Behavioral Consultant */}
                          <TableRow>
                            <TableCell>
                              Psychologist/Behavioral Consultant
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                name="PBChours"
                                value={newContract.PBChours}
                                onChange={handleNewContractInputChange}
                              />
                            </TableCell>
                          </TableRow>
                          {/* SLP */}
                          <TableRow>
                            <TableCell>SLP</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                name="SLPhours"
                                value={newContract.SLPhours}
                                onChange={handleNewContractInputChange}
                              />
                            </TableCell>
                          </TableRow>
                          {/* OT */}
                          <TableRow>
                            <TableCell>OT</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                name="OThours"
                                value={newContract.OThours}
                                onChange={handleNewContractInputChange}
                              />
                            </TableCell>
                          </TableRow>
                          {/* PT */}
                          <TableRow>
                            <TableCell>PT</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                name="PThours"
                                value={newContract.PThours}
                                onChange={handleNewContractInputChange}
                              />
                            </TableCell>
                          </TableRow>
                          {/* Aide */}
                          <TableRow>
                            <TableCell>Aide</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                name="AIDEhours"
                                value={newContract.AIDEhours}
                                onChange={handleNewContractInputChange}
                              />
                            </TableCell>
                          </TableRow>
                          {/* Counseling */}
                          <TableRow>
                            <TableCell>Counseling</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                name="COUShours"
                                value={newContract.COUShours}
                                onChange={handleNewContractInputChange}
                              />
                            </TableCell>
                          </TableRow>
                          {/* Community Aide Respite */}
                          <TableRow>
                            <TableCell>Community Aide Respite</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                name="CARhours"
                                value={newContract.CARhours}
                                onChange={handleNewContractInputChange}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    {/* File Upload */}
                    <div>
                      <Label className="text-muted-foreground">
                        Contract Upload*
                      </Label>
                      <Input
                        type="file"
                        onChange={handleNewContractFileChange}
                      />
                    </div>
                    {/* Save and Cancel Buttons */}
                    <div className="mt-4">
                      <Button onClick={createContractInfo}>Save</Button>
                      <Button
                        onClick={() => setAddingContract(false)}
                        className="ml-2"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Button to add contract information
                  <Button onClick={() => setAddingContract(true)}>
                    Add Contract Information
                  </Button>
                )
              ) : (
                // No contract information available
                <p>No contract information available.</p>
              )}
            </div>
          </TabsContent>

          {/* Additional Note Tab */}
          <TabsContent value="additional-note">
            <div style={styles.card}>
              {/* Consent Information */}
              <h2 style={styles.sectionHeader}>Consent</h2>
              {consent ? (
                isEditing ? (
                  // Code to edit existing consent information
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Permission Note */}
                    <div style={styles.fullWidth}>
                      <Label className="text-muted-foreground">
                        Permission Note
                      </Label>
                      <Input
                        name="permissionNote"
                        value={editedConsent.permissionNote || ""}
                        onChange={handleConsentInputChange}
                      />
                    </div>
                    {/* Received Date */}
                    <div>
                      <Label className="text-muted-foreground">
                        Received Date
                      </Label>
                      <Input
                        type="date"
                        name="receivedDate"
                        value={
                          editedConsent.receivedDate
                            ? editedConsent.receivedDate.split("T")[0]
                            : ""
                        }
                        onChange={handleConsentInputChange}
                      />
                    </div>
                    {/* Withdraw Date */}
                    <div>
                      <Label className="text-muted-foreground">
                        Withdraw Date
                      </Label>
                      <Input
                        type="date"
                        name="withdrawDate"
                        value={
                          editedConsent.withdrawDate
                            ? editedConsent.withdrawDate.split("T")[0]
                            : ""
                        }
                        onChange={handleConsentInputChange}
                      />
                    </div>
                  </div>
                ) : (
                  // Display existing consent information
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Permission Note */}
                    <div style={styles.fullWidth}>
                      <Label className="text-muted-foreground">
                        Permission Note
                      </Label>
                      <p className="text-lg font-semibold">
                        {consent.permissionNote || "N/A"}
                      </p>
                    </div>
                    {/* Received Date */}
                    <div>
                      <Label className="text-muted-foreground">
                        Received Date
                      </Label>
                      <p className="text-lg font-semibold">
                        {consent.receivedDate
                          ? formatDisplayDate(consent.receivedDate)
                          : "N/A"}
                      </p>
                    </div>
                    {/* Withdraw Date */}
                    <div>
                      <Label className="text-muted-foreground">
                        Withdraw Date
                      </Label>
                      <p className="text-lg font-semibold">
                        {consent.withdrawDate
                          ? formatDisplayDate(consent.withdrawDate)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                )
              ) : isEditing ? (
                addingConsent ? (
                  // Code to add new consent information
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Permission Note */}
                    <div style={styles.fullWidth}>
                      <Label className="text-muted-foreground">
                        Permission Note
                      </Label>
                      <Input
                        name="permissionNote"
                        value={newConsent.permissionNote || ""}
                        onChange={handleNewConsentInputChange}
                      />
                    </div>
                    {/* Received Date */}
                    <div>
                      <Label className="text-muted-foreground">
                        Received Date
                      </Label>
                      <Input
                        type="date"
                        name="receivedDate"
                        value={newConsent.receivedDate}
                        onChange={handleNewConsentInputChange}
                      />
                    </div>
                    {/* Withdraw Date */}
                    <div>
                      <Label className="text-muted-foreground">
                        Withdraw Date
                      </Label>
                      <Input
                        type="date"
                        name="withdrawDate"
                        value={newConsent.withdrawDate}
                        onChange={handleNewConsentInputChange}
                      />
                    </div>
                    {/* Save and Cancel Buttons */}
                    <div style={styles.fullWidth}>
                      <Button onClick={createConsentInfo}>Save</Button>
                      <Button
                        onClick={() => setAddingConsent(false)}
                        className="ml-2"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setAddingConsent(true)}>
                    Add Consent Information
                  </Button>
                )
              ) : (
                <p>No consent information available.</p>
              )}
            </div>
            {/* Additional Note */}
            <div style={styles.card}>
              <h2 style={styles.sectionHeader}>Additional</h2>
              <Label className="text-muted-foreground">Note</Label>
              {isEditing ? (
                <Input
                  name="psNote"
                  value={editedPatient.psNote || ""}
                  onChange={handlePatientInputChange}
                />
              ) : (
                <p className="text-lg font-semibold">{patient.psNote}</p>
              )}
              <Label className="text-muted-foreground">Status</Label>
              {isEditing ? (
                <select
                  name="currentStatus"
                  value={editedPatient.currentStatus || ""}
                  onChange={handlePatientInputChange}
                  className="border rounded p-2 w-full"
                >
                  <option value={0}>Archived</option>
                  <option value={1}>Active</option>
                </select>
              ) : (
                <div className="text-lg font-bold">
                  {patient.currentStatus === 1 ? "Active" : "Archived"}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Function to calculate age based on birthDate
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}
// format date to store in the database
function formatDate(dateStr) {
  if (!dateStr) return null;
  return dateStr.split("T")[0];
}
function formatDisplayDate(dateStr) {
  if (!dateStr) return "N/A";
  const [year, month, day] = dateStr.split("T")[0].split("-");
  return `${month}/${day}/${year}`;
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

const styles = {
  table: {
    width: "100%",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    padding: "16px",
    border: "1px solid #ccc",
  },
  formContainer: {
    borderRadius: "16px",
    padding: "24px",
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))", // Four columns for the form
    gap: "20px",
    overflow: "visible",
    height: "auto",
  },
  fieldContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  fullWidth: {
    gridColumn: "span 4", // Full width row (used for buttons or large elements)
  },
  halfWidth: {
    gridColumn: "span 2", // For two-column text areas
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between", // Align "Back" button to the left, "Submit" to the right
    gridColumn: "span 4", // Full width for the button container
  },

  divider: {
    border: "none",
    borderTop: "2px solid #ccc",
    margin: "10px 0",
    width: "100%",
  },
  sectionHeader: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "16px",
    borderBottom: "1px solid #ccc", // Optional underline
    paddingBottom: "4px",
  },
  card: {
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px",
  },
  subHeader: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "12px",
    paddingBottom: "4px",
    color: "#333",
  },

  guardianBox: {
    backgroundColor: "#F9FAFB", // Subtle light gray
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
  },
};
