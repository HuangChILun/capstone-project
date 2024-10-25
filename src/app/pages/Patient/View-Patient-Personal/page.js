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

// Helper function to calculate age from birthDate
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}

export default function ViewPatientPersonal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const [patient, setPatient] = useState(null);
  const [guardian, setGuardian] = useState(null);
  const [editedPatient, setEditedPatient] = useState(null);
  const [editedGuardian, setEditedGuardian] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Team tab states
  const [searchName, setSearchName] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assignedTeamMembers, setAssignedTeamMembers] = useState([]);
  const [editedAssignedTeamMembers, setEditedAssignedTeamMembers] = useState([]);

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

        // Fetch patient data
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
        if (guardianId) {
          const guardianResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_IP}/guardians/primary/${guardianId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!guardianResponse.ok) {
            throw new Error("Failed to fetch guardian data");
          }

          const guardianData = await guardianResponse.json();
          setGuardian(guardianData);
          setEditedGuardian(guardianData);
        } else {
          setGuardian(null);
          setEditedGuardian(null);
        }

        // Fetch assigned team members
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

  // Handle Edit mode
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedPatient(patient);
    setEditedGuardian(guardian);
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
      // Format date fields if any (e.g., birthDate)
      const formattedGuardianData = {
        ...editedGuardian,
        // birthDate: editedGuardian.birthDate
        //   ? editedGuardian.birthDate.split("T")[0]
        //   : null,
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

  const updateAssignedTeamMembers = async () => {
    const token = Cookies.get("token");
    try {
      for (const member of editedAssignedTeamMembers) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/team-member/${member.teamMemberId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              startServiceDate: member.startServiceDate,
              endServiceDate: member.endServiceDate,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error updating team member data:", errorData);
          throw new Error(
            `Failed to update team member data: ${
              errorData.message || errorData.error || "Unknown error"
            }`
          );
        }
      }
    } catch (error) {
      console.error("Error updating team members:", error);
      throw error;
    }
  };

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
  // Handle saving changes
  const handleSaveChanges = async () => {
    try {
      await updateClientInfo();
      await updateGuardianInfo();
      await updateAssignedTeamMembers();

      if (selectedUsers.length > 0) {
        await assignNewTeamMembers();
      }

      alert("Changes saved successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving changes:", error);
      alert(`Error saving changes: ${error.message}`);
    }
  };

  // Search functionality
  const handleSearch = async (name, role) => {
    if (!name && !role) {
      setSearchResults([]);
      return;
    }

    const token = Cookies.get("token");
    try {
      let url = `${process.env.NEXT_PUBLIC_BACKEND_IP}/users`;
      const params = new URLSearchParams();
      if (name) params.append("name", name);
      if (role) params.append("role", role);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const users = await response.json();
      setSearchResults(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Optionally handle errors here
    }
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

  // Handler for assigning team members
  // (Already defined as assignNewTeamMembers)

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
    const endDate = member.endServiceDate ? new Date(member.endServiceDate) : null;
    return !endDate || endDate >= today;
  });

  const pastTeamMembers = assignedTeamMembersArray.filter((member) => {
    const endDate = member.endServiceDate ? new Date(member.endServiceDate) : null;
    return endDate && endDate < today;
  });


  return (
    <div>
      <HoriNav user={user} />
      <div className="p-6">
        <div className="flex items-center mb-4">
          
        <Link href="./View-Patient-Page">
          <div className="flex items-center mb-4">
          
            <ArrowLeftIcon className="h-6 w-6 mr-2" />
            
            <span>Back to Client List</span>
          </div>
          </Link>

        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h1 className="text-4xl font-bold">{`${patient.firstName} ${patient.lastName}`}</h1>
            <Badge variant="default" className="ml-4">
              {patient.currentStatus ? "Active" : "Inactive"}
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
              <h2 className="text-2xl font-semibold mb-4">Client Information</h2>
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
                    <p className="text-lg font-semibold">{patient.postalCode}</p>
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
                      {new Date(patient.birthDate).toLocaleDateString()}
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
                    <p className="text-lg font-semibold">{patient.phoneNumber}</p>
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
                      <p className="text-lg font-semibold">{guardian.firstName}</p>
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
                      <p className="text-lg font-semibold">{guardian.lastName}</p>
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
                      <p className="text-lg font-semibold">{guardian.address}</p>
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
                      <p className="text-lg font-semibold">{guardian.province}</p>
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
                      <p className="text-lg font-semibold">{guardian.custody}</p>
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
                    <Label className="text-muted-foreground">Phone Number</Label>
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
                  {currentTeamMembers.map((member) => (
                    <div key={member.teamMemberId} className="flex items-center mb-2">
                      <p>
                        {`${member.userFirstName} ${member.userLastName} (${member.role})`}
                      </p>
                      <div className="ml-4">
                        {isEditing ? (
                          <div className="flex items-center">
                            <Label>Service Start Date:</Label>
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
                              className="ml-2 mr-4"
                            />
                            <Label>Service End Date:</Label>
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
                              className="ml-2 mr-4"
                            />
                          </div>
                        ) : (
                          <>
                            <p>
                              Service Start Date:{" "}
                              {member.startServiceDate
                                ? new Date(member.startServiceDate).toLocaleDateString()
                                : "N/A"}
                            </p>
                            <p>
                              Service End Date:{" "}
                              {member.endServiceDate
                                ? new Date(member.endServiceDate).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Past Working with This Client */}
              {pastTeamMembers.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-3">
                    Past Working with This Client
                  </h3>
                  {pastTeamMembers.map((member) => (
                    <div key={member.teamMemberId} className="flex items-center mb-2">
                    <p className="mr-4">
                      {`${member.userFirstName} ${member.userLastName} (${member.role})`}
                    </p>
                    <div className="flex items-center">
                      {isEditing ? (
                        <div className="flex items-center">
                          <Label className="mr-2">Service Start Date:</Label>
                          <Input
                            type="date"
                            value={member.startServiceDate ? member.startServiceDate.split("T")[0] : ""}
                            onChange={(e) => handleAssignedDateChange(member.teamMemberId, "startServiceDate", e.target.value)}
                            className="mr-4"
                          />
                          <Label className="mr-2">Service End Date:</Label>
                          <Input
                            type="date"
                            value={member.endServiceDate ? member.endServiceDate.split("T")[0] : ""}
                            onChange={(e) => handleAssignedDateChange(member.teamMemberId, "endServiceDate", e.target.value)}
                          />
                        </div>
                      ) : (
                        <div className="flex">
                          <p className="mr-4">Service Start Date: {member.startServiceDate ? new Date(member.startServiceDate).toLocaleDateString() : "N/A"}</p>
                          <p>Service End Date: {member.endServiceDate ? new Date(member.endServiceDate).toLocaleDateString() : "N/A"}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  ))}
                </div>
              )}

              {/* Editing Mode */}
              {isEditing && (
                <div>
                  {/* Live Search Inputs */}
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
                      {searchResults.map((user) => (
                        <div key={user.userId} className="flex items-center mb-2">
                          <p>{`${user.firstName} ${user.lastName} (${user.role})`}</p>
                          <Button
                            className="ml-2"
                            onClick={() => handleSelectUser(user)}
                          >
                            Select
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Selected Users for Assignment */}
                  {selectedUsers.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold">Selected Team Members</h3>
                      {selectedUsers.map((user, index) => (
                        <div key={user.userId} className="mb-2">
                          <p>{`${user.firstName} ${user.lastName} (${user.role})`}</p>
                          <div className="flex items-center">
                            <Label>Service Start Date:</Label>
                            <Input
                              type="date"
                              value={user.startServiceDate}
                              onChange={(e) =>
                                handleDateChange(index, "startServiceDate", e.target.value)
                              }
                              className="ml-2 mr-4"
                            />
                            <Label>Service End Date:</Label>
                            <Input
                              type="date"
                              value={user.endServiceDate}
                              onChange={(e) =>
                                handleDateChange(index, "endServiceDate", e.target.value)
                              }
                              className="ml-2 mr-4"
                            />
                            <Button
                              className="ml-2"
                              onClick={() => handleRemoveSelectedUser(index)}
                              variant="destructive"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          {/* Additional Note Tab */}
          <TabsContent value="additional-note">
            <div className="mb-6">
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
