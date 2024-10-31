"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/app/components/HomeUi/label";
import { Input } from "@/app/components/HomeUi/input";
import { useRouter, useSearchParams } from "next/navigation";
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";

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
export default function ViewPatientPersonal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const [patient, setPatient] = useState(null);
  const [guardian, setGuardian] = useState(null);
  const [editedPatient, setEditedPatient] = useState(null);
  const [editedGuardian, setEditedGuardian] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [editedDiagnosis, setEditedDiagnosis] = useState(null);
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

  // Team tab states
  const [searchName, setSearchName] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assignedTeamMembers, setAssignedTeamMembers] = useState([]);
  const [editedAssignedTeamMembers, setEditedAssignedTeamMembers] = useState(
    []
  );

  const user = JSON.parse(localStorage.getItem("user"));

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

      // Check if diagnosisData is an array
      let diagnosisItem;
      if (Array.isArray(diagnosisData)) {
        if (diagnosisData.length > 0) {
          diagnosisItem = diagnosisData[0]; // Use the first item
        } else {
          diagnosisItem = null; // No diagnosis data available
        }
      } else {
        diagnosisItem = diagnosisData;
      }

      // Map aType to "typical" or "atypical" for display
      if (diagnosisItem) {
        diagnosisItem.aType =
          diagnosisItem.aType === 1 ? "typical" : "atypical";
      }

      setDiagnosis(diagnosisItem);
      setEditedDiagnosis(diagnosisItem);
    } catch (error) {
      console.error("Error fetching assigned diagnosis:", error);
    }
  };

  // fetch insurance table
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
      setContract(contractData);
      setEditedContract(contractData);
    } catch (error) {
      console.error("Error fetching contract information:", error);
    }
  };

  // fetch client and guardian by this effect
  useEffect(() => {
    const fetchPatientAndGuardian = async () => {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/");
        console.log("need login");
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

        // Fetch guardian by guardianId
        const guardianId = data.clientId; // as known as clientId
        try {
          const guardianResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_IP}/guardians/primary/${guardianId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!guardianResponse.ok) {
            // If guardian data is not found, set guardian to null
            setGuardian(null);
            setEditedGuardian({});
          } else {
            const guardianData = await guardianResponse.json();
            setGuardian(guardianData);
            setEditedGuardian(guardianData);
          }
        } catch (error) {
          console.error("Error fetching guardian data:", error);
          // Set guardian to null and initialize editedGuardian
          setGuardian(null);
          setEditedGuardian({});
        }

        // Fetch assigned team members
        await fetchConsent();
        await fetchDiagnosis();
        await fetchInsurance();
        await fetchContract();
        await fetchAssignedTeamMembers();
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (clientId) {
      fetchPatientAndGuardian();
    }
  }, [clientId, router]);

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

  const handleGuardianInputChange = (e) => {
    const { name, value } = e.target;
    setEditedGuardian({ ...editedGuardian, [name]: value });
  };

  const handleDiagnosisInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDiagnosis({ ...editedDiagnosis, [name]: value });
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
    if (editedGuardian && editedGuardian.guardianId) {
      try {
        const formattedGuardianData = {
          ...editedGuardian,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/guardians/primary/${editedGuardian.guardianId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formattedGuardianData),
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

        // Update the state with the latest guardian data
        setGuardian(formattedGuardianData);
      } catch (error) {
        console.error("Error updating guardian data:", error);
        throw error;
      }
    }
  };

  const updateDiagnosisInfo = async () => {
    const token = Cookies.get("token");
    if (editedDiagnosis && editedDiagnosis.diagnosisId) {
      try {
        // Map "typical"/"atypical" back to 1/0
        const aTypeValue = editedDiagnosis.aType === "typical" ? 1 : 0;

        const updatedDiagnosis = {
          ...editedDiagnosis,
          aType: aTypeValue,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/diagnosis/${editedDiagnosis.diagnosisId}`,
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

        // Update the state with the latest diagnosis data
        setDiagnosis({
          ...editedDiagnosis,
          aType: editedDiagnosis.aType,
        });
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/client-contract/${editedContract.contractId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(editedContract),
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

        // Update the state with the latest contract data
        setContract(editedContract);
      } catch (error) {
        console.error("Error updating contract data:", error);
        throw error;
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
  const handleDownloadContract = () => {
    if (contract && contract.fileId) {
      const fileUrl = `${process.env.NEXT_PUBLIC_BACKEND_IP}/files/${contract.fileId}`;
      window.open(fileUrl, "_blank");
    } else {
      alert("No contract file available.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!patient) return <div>No client data found</div>;

  // Categorize team members based on endServiceDate
  const today = new Date();

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
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Link href="/View-Patient-Page">
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
            <TabsTrigger value="additional-note">Additional Note</TabsTrigger>
          </TabsList>
          <TabsContent value="personal-info">
            {/* Patient Info */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                Client Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                Guardian Information
              </h2>
              {guardian ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* First Name */}
                  <div>
                    <Label className="text-muted-foreground">First Name</Label>
                    {isEditing ? (
                      <Input
                        name="firstName"
                        value={editedGuardian.firstName || ""}
                        onChange={handleGuardianInputChange}
                      />
                    ) : (
                      <p className="text-lg font-semibold">
                        {guardian.firstName}
                      </p>
                    )}
                  </div>
                  {/* Last Name */}
                  <div>
                    <Label className="text-muted-foreground">Last Name</Label>
                    {isEditing ? (
                      <Input
                        name="lastName"
                        value={editedGuardian.lastName || ""}
                        onChange={handleGuardianInputChange}
                      />
                    ) : (
                      <p className="text-lg font-semibold">
                        {guardian.lastName}
                      </p>
                    )}
                  </div>
                  {/* Address */}
                  <div>
                    <Label className="text-muted-foreground">Address</Label>
                    {isEditing ? (
                      <Input
                        name="address"
                        value={editedGuardian.address || ""}
                        onChange={handleGuardianInputChange}
                      />
                    ) : (
                      <p className="text-lg font-semibold">
                        {guardian.address}
                      </p>
                    )}
                  </div>
                  {/* City */}
                  <div>
                    <Label className="text-muted-foreground">City</Label>
                    {isEditing ? (
                      <Input
                        name="city"
                        value={editedGuardian.city || ""}
                        onChange={handleGuardianInputChange}
                      />
                    ) : (
                      <p className="text-lg font-semibold">{guardian.city}</p>
                    )}
                  </div>
                  {/* Province */}
                  <div>
                    <Label className="text-muted-foreground">Province</Label>
                    {isEditing ? (
                      <Input
                        name="province"
                        value={editedGuardian.province || ""}
                        onChange={handleGuardianInputChange}
                      />
                    ) : (
                      <p className="text-lg font-semibold">
                        {guardian.province}
                      </p>
                    )}
                  </div>
                  {/* Postal Code */}
                  <div>
                    <Label className="text-muted-foreground">Postal Code</Label>
                    {isEditing ? (
                      <Input
                        name="postalCode"
                        value={editedGuardian.postalCode || ""}
                        onChange={handleGuardianInputChange}
                      />
                    ) : (
                      <p className="text-lg font-semibold">
                        {guardian.postalCode}
                      </p>
                    )}
                  </div>
                  {/* Relation to Patient */}
                  <div>
                    <Label className="text-muted-foreground">
                      Relation to Patient
                    </Label>
                    {isEditing ? (
                      <Input
                        name="relationship"
                        value={editedGuardian.relationship || ""}
                        onChange={handleGuardianInputChange}
                      />
                    ) : (
                      <p className="text-lg font-semibold">
                        {guardian.relationship}
                      </p>
                    )}
                  </div>
                  {/* Custody */}
                  <div>
                    <Label className="text-muted-foreground">Custody</Label>
                    {isEditing ? (
                      <Input
                        name="custody"
                        value={editedGuardian.custody || ""}
                        onChange={handleGuardianInputChange}
                      />
                    ) : (
                      <p className="text-lg font-semibold">
                        {guardian.custody}
                      </p>
                    )}
                  </div>
                  {/* Email */}
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    {isEditing ? (
                      <Input
                        name="email"
                        value={editedGuardian.email || ""}
                        onChange={handleGuardianInputChange}
                      />
                    ) : (
                      <p className="text-lg font-semibold">{guardian.email}</p>
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
                        value={editedGuardian.phoneNumber || ""}
                        onChange={handleGuardianInputChange}
                      />
                    ) : (
                      <p className="text-lg font-semibold">
                        {guardian.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p>No guardian found for this patient.</p>
              )}
            </div>
          </TabsContent>

          {/* Medical Info Tab */}
          <TabsContent value="medical-info">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                Medical Information
              </h2>
              {/* Diagnosis Information */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Diagnosis</h3>
                {diagnosis ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Diagnosis */}
                    <div>
                      <Label className="text-muted-foreground">Diagnosis</Label>
                      {isEditing ? (
                        <Input
                          name="diagnosis"
                          value={editedDiagnosis.diagnosis || ""}
                          onChange={handleDiagnosisInputChange}
                        />
                      ) : (
                        <p className="text-lg font-semibold">
                          {diagnosis.diagnosis}
                        </p>
                      )}
                    </div>
                    {/* aType */}
                    <div>
                      <Label className="text-muted-foreground">Type</Label>
                      {isEditing ? (
                        <div>
                          <select
                            name="aType"
                            value={editedDiagnosis.aType || "typical"}
                            onChange={(e) =>
                              setEditedDiagnosis({
                                ...editedDiagnosis,
                                aType: e.target.value,
                              })
                            }
                            className="border rounded p-2 w-full"
                          >
                            <option value="typical">Typical</option>
                            <option value="atypical">Atypical</option>
                          </select>
                        </div>
                      ) : (
                        <p className="text-lg font-semibold">
                          {diagnosis.aType}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p>No diagnosis data available.</p>
                )}
              </div>
              {/* Insurance Information */}
              <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-4">Insurance</h2>
                {insurance ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Insurance Provider */}
                    <div>
                      <Label className="text-muted-foreground">
                        Insurance Provider
                      </Label>
                      {isEditing ? (
                        <Input
                          name="insuranceProvider"
                          value={editedInsurance.insuranceProvider || ""}
                          onChange={handleInsuranceInputChange}
                        />
                      ) : (
                        <p className="text-lg font-semibold">
                          {insurance.insuranceProvider || "N/A"}
                        </p>
                      )}
                    </div>
                    {/* Primary Plan Name */}
                    <div>
                      <Label className="text-muted-foreground">
                        Primary Plan Name
                      </Label>
                      {isEditing ? (
                        <Input
                          name="primaryPlanName"
                          value={editedInsurance.primaryPlanName || ""}
                          onChange={handleInsuranceInputChange}
                        />
                      ) : (
                        <p className="text-lg font-semibold">
                          {insurance.primaryPlanName || "N/A"}
                        </p>
                      )}
                    </div>
                    {/* Certificate ID */}
                    <div>
                      <Label className="text-muted-foreground">
                        Certificate ID
                      </Label>
                      {isEditing ? (
                        <Input
                          name="certificateId"
                          value={editedInsurance.certificateId || ""}
                          onChange={handleInsuranceInputChange}
                        />
                      ) : (
                        <p className="text-lg font-semibold">
                          {insurance.certificateId || "N/A"}
                        </p>
                      )}
                    </div>
                    {/* Coverage Detail */}
                    <div>
                      <Label className="text-muted-foreground">
                        Coverage Detail
                      </Label>
                      {isEditing ? (
                        <Input
                          name="coverateDetail"
                          value={editedInsurance.coverateDetail || ""}
                          onChange={handleInsuranceInputChange}
                        />
                      ) : (
                        <p className="text-lg font-semibold">
                          {insurance.coverateDetail || "N/A"}
                        </p>
                      )}
                    </div>
                    {/* Start Date */}
                    <div>
                      <Label className="text-muted-foreground">
                        Start Date
                      </Label>
                      {isEditing ? (
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
                      ) : (
                        <p className="text-lg font-semibold">
                          {insurance.startDate
                            ? formatDisplayDate(insurance.startDate)
                            : "N/A"}
                        </p>
                      )}
                    </div>
                    {/* End Date */}
                    <div>
                      <Label className="text-muted-foreground">End Date</Label>
                      {isEditing ? (
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
                      ) : (
                        <p className="text-lg font-semibold">
                          {insurance.endDate
                            ? formatDisplayDate(insurance.endDate)
                            : "N/A"}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p>No insurance data available.</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Team Members</h2>

              {/* Currently Working with This Client */}
              {currentTeamMembers.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">
                    Currently Working with This Client
                  </h3>
                  <table className="w-full table-auto">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-center">Team Member</th>
                        <th className="px-4 py-2 text-center">
                          Service Start Date
                        </th>
                        <th className="px-4 py-2 text-center">
                          Service End Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTeamMembers.map((member) => (
                        <tr key={member.teamMemberId}>
                          <td className="border px-4 py-2 text-center">
                            {`${member.userFirstName} ${member.userLastName} (${member.role})`}
                          </td>
                          {isEditing ? (
                            <>
                              <td className="border px-4 py-2 text-center">
                                <Input
                                  type="date"
                                  value={
                                    member.startServiceDate
                                      ? member.startServiceDate.split("T")[0]
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
                              </td>
                              <td className="border px-4 py-2 text-center">
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
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="border px-4 py-2 text-center">
                                {member.startServiceDate
                                  ? new Date(
                                      member.startServiceDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td className="border px-4 py-2 text-center">
                                {member.endServiceDate
                                  ? new Date(
                                      member.endServiceDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Past Working with This Client */}
              {pastTeamMembers.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-3">
                    Past Working with This Client
                  </h3>
                  <table className="w-full table-auto">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-center">Team Member</th>
                        <th className="px-4 py-2 text-center">
                          Service Start Date
                        </th>
                        <th className="px-4 py-2 text-center">
                          Service End Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pastTeamMembers.map((member) => (
                        <tr key={member.teamMemberId}>
                          <td className="border px-4 py-2 text-center">
                            {`${member.userFirstName} ${member.userLastName} (${member.role})`}
                          </td>
                          {isEditing ? (
                            <>
                              <td className="border px-4 py-2 text-center">
                                <Input
                                  type="date"
                                  value={
                                    member.startServiceDate
                                      ? member.startServiceDate.split("T")[0]
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
                              </td>
                              <td className="border px-4 py-2 text-center">
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
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="border px-4 py-2 text-center">
                                {member.startServiceDate
                                  ? new Date(
                                      member.startServiceDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td className="border px-4 py-2 text-center">
                                {member.endServiceDate
                                  ? new Date(
                                      member.endServiceDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Editing Mode */}
              {isEditing && (
                <div>
                   <h3 className="text-xl font-semibold mb-4">Assign New Team Member</h3>
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
                      <h3 className="text-xl font-semibold">Search Results</h3>
                      <table className="w-full table-auto">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Role</th>
                            <th className="px-4 py-2 text-center">
                              Action
                            </th>{" "}
                            {/* Center align header */}
                          </tr>
                        </thead>
                        <tbody>
                          {searchResults.map((user) => (
                            <tr key={user.userId}>
                              <td className="border px-4 py-2">
                                {`${user.firstName} ${user.lastName}`}
                              </td>
                              <td className="border px-4 py-2">{user.role}</td>
                              <td className="border px-4 py-2 text-center">
                                {" "}
                                {/* Center align cell */}
                                <Button onClick={() => handleSelectUser(user)}>
                                  Select
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Selected Team Members */}
                  {selectedUsers.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold">
                        Selected Team Members
                      </h3>
                      <table className="w-full table-auto">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Role</th>
                            <th className="px-4 py-2 text-left">
                              Service Start Date
                            </th>
                            <th className="px-4 py-2 text-left">
                              Service End Date
                            </th>
                            <th className="px-4 py-2 text-center">Action</th>{" "}
                            {/* Center align header */}
                          </tr>
                        </thead>
                        <tbody>
                          {selectedUsers.map((user, index) => (
                            <tr key={user.userId}>
                              <td className="border px-4 py-2">
                                {`${user.firstName} ${user.lastName}`}
                              </td>
                              <td className="border px-4 py-2">{user.role}</td>
                              <td className="border px-4 py-2">
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
                              </td>
                              <td className="border px-4 py-2">
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
                              </td>
                              <td className="border px-4 py-2 text-center">
                                {" "}
                                {/* Center align cell */}
                                <Button
                                  onClick={() =>
                                    handleRemoveSelectedUser(index)
                                  }
                                  variant="destructive"
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="contract">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Contract</h2>
              {contract ? (
                <div>
                  {/* Display contract details */}
                  <div className="mb-4">
                    {/* Start Date */}
                    <div>
                      <Label className="text-muted-foreground">
                        Start Date
                      </Label>
                      {isEditing ? (
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
                      ) : (
                        <p className="text-lg font-semibold">
                          {formatDisplayDate(contract.startDate)}
                        </p>
                      )}
                    </div>
                    {/* End Date */}
                    <div>
                      <Label className="text-muted-foreground">End Date</Label>
                      {isEditing ? (
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
                      ) : (
                        <p className="text-lg font-semibold">
                          {formatDisplayDate(contract.endDate)}
                        </p>
                      )}
                    </div>
                    {/* Hours fields can be added here if needed */}
                  </div>
                  {/* View or Update Contract File */}
                  <div>
                    {isEditing ? (
                      <div>
                        <Label className="text-muted-foreground">
                          Upload New Contract
                        </Label>
                        <Input
                          type="file"
                          name="contractFile"
                          onChange={handleContractInputChange}
                        />
                      </div>
                    ) : (
                      <Button onClick={handleDownloadContract}>
                        View Contract
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <p>No contract information available.</p>
              )}
            </div>
          </TabsContent>

          {/* Additional Note Tab */}
          <TabsContent value="additional-note">
            <div className="mb-6">
              {/* Consent Information */}
              <h2 className="text-2xl font-semibold mb-4">Consent</h2>
              {consent ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Permission Note */}
                  <div>
                    <Label className="text-muted-foreground">
                      Permission Note
                    </Label>
                    {isEditing ? (
                      <Input
                        name="permissionNote"
                        value={editedConsent.permissionNote || ""}
                        onChange={handleConsentInputChange}
                      />
                    ) : (
                      <p className="text-lg font-semibold">
                        {consent.permissionNote || "N/A"}
                      </p>
                    )}
                  </div>
                  {/* Received Date */}
                  <div>
                    <Label className="text-muted-foreground">
                      Received Date
                    </Label>
                    {isEditing ? (
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
                    ) : (
                      <p className="text-lg font-semibold">
                        {consent.receivedDate
                          ? formatDisplayDate(consent.receivedDate)
                          : "N/A"}
                      </p>
                    )}
                  </div>
                  {/* Withdraw Date */}
                  <div>
                    <Label className="text-muted-foreground">
                      Withdraw Date
                    </Label>
                    {isEditing ? (
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
                    ) : (
                      <p className="text-lg font-semibold">
                        {consent.withdrawDate
                          ? formatDisplayDate(consent.withdrawDate)
                          : "N/A"}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p>No consent information available.</p>
              )}

              {/* Additional Note */}
              <div className="mt-6">
                <Label className="text-muted-foreground">Additional Note</Label>
                {isEditing ? (
                  <Input
                    name="psNote"
                    value={editedPatient.psNote || ""}
                    onChange={handlePatientInputChange}
                  />
                ) : (
                  <p>{patient.psNote}</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
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
