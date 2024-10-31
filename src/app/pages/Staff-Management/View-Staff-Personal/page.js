"use client";
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

export default function ViewStaffPersonal() {
  const [staffData, setStaffData] = useState(null);
  const [editedStaffData, setEditedStaffData] = useState(null); // For editing
  const [assignedClients, setAssignedClients] = useState([]); // Updated
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Changed to boolean
  const user = JSON.parse(localStorage.getItem("user"));
  const router = useRouter();
  const searchParams = useSearchParams();
  const staffId = searchParams.get("userId");

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
      return;
    }

    const fetchStaffData = async () => {
      try {
        setIsLoading(true);
        if (!staffId) {
          throw new Error("Staff ID is missing from URL");
        }

        // Fetch staff data
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/users/${staffId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch staff data. Status: ${response.status}`
          );
        }

        const data = await response.json();
        setStaffData(data);
        setEditedStaffData(data); // Initialize editedStaffData

        // Fetch assigned clients
        const clientsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/team-member/user/${staffId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!clientsResponse.ok) {
          throw new Error(
            `Failed to fetch assigned clients. Status: ${clientsResponse.status}`
          );
        }

        const clientsData = await clientsResponse.json();
        console.log('clientsData:', clientsData);

        // Assuming clientsData has the structure { data: [ { client }, { client }, ... ] }
        const clients = clientsData.data || [];

        setAssignedClients(clients);
      } catch (error) {
        console.error("Error fetching staff data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffData();
  }, [router, staffId]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedStaffData(staffData);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedStaffData(staffData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStaffData({
      ...editedStaffData,
      [name]: name === "isAdmin" ? parseInt(value) : value,
    });
  };

  const handleSaveChanges = async () => {
    const token = Cookies.get("token");
    try {
      const updatedData = { ...editedStaffData };

      // Validate required fields if necessary

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/users/${staffId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to update staff data: ${
            errorData.message || response.statusText
          }`
        );
      }

      alert("Staff data updated successfully!");
      setStaffData(updatedData); // Update staffData with saved data
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating staff data:", error);
      alert(`Error updating staff data: ${error.message}`);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!staffData) return <div>No staff data found.</div>;

  const styles = {
    viewButton: {
      border: "1px solid #e5e5e5",
      padding: "8px 16px",
      cursor: "pointer",
      marginLeft: "10px",
    },
  };

  return (
    <div>
      <HoriNav user={user} />
      <div className="p-4 ml-8 mt-2 pt-20">
        <Link href="./View-Staff">
          <div className="flex items-center mb-4">
            <ArrowLeftIcon className="h-6 w-6 mr-2" />
            <span>Back to Staff List</span>
          </div>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="text-4xl font-bold">{`${staffData.firstName} ${staffData.lastName}`}</div>
            <div className="text-xl ml-2">{staffData.role}</div>
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

        <Tabs defaultValue="personal-info">
          <TabsList>
            <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
            <TabsTrigger value="assigned-client">Assigned Clients</TabsTrigger>
            <TabsTrigger value="account-access">Account Access</TabsTrigger>
          </TabsList>

          <TabsContent value="personal-info">
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label>First Name</Label>
                {isEditing ? (
                  <Input
                    name="firstName"
                    value={editedStaffData.firstName || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">{staffData.firstName}</div>
                )}
              </div>
              <div>
                <Label>Last Name</Label>
                {isEditing ? (
                  <Input
                    name="lastName"
                    value={editedStaffData.lastNameName || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {staffData.lastNameName}
                  </div>
                )}
              </div>
              <div>
                <Label>Email</Label>
                {isEditing ? (
                  <Input
                    name="email"
                    value={editedStaffData.email || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">{staffData.email}</div>
                )}
              </div>
              <div>
                <Label>Phone Number</Label>
                {isEditing ? (
                  <Input
                    name="phoneNumber"
                    value={editedStaffData.phoneNumber || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {staffData.phoneNumber}
                  </div>
                )}
              </div>
              <div>
                <Label>Address</Label>
                {isEditing ? (
                  <Input
                    name="address"
                    value={editedStaffData.address || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">{staffData.address}</div>
                )}
              </div>
              <div>
                <Label>City</Label>
                {isEditing ? (
                  <Input
                    name="city"
                    value={editedStaffData.city || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">{staffData.city}</div>
                )}
              </div>
              <div>
                <Label>Postal Code</Label>
                {isEditing ? (
                  <Input
                    name="postalCode"
                    value={editedStaffData.postalCode || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {staffData.postalCode}
                  </div>
                )}
              </div>
              <div>
                <Label>Province</Label>
                {isEditing ? (
                  <Input
                    name="province"
                    value={editedStaffData.province || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">{staffData.province}</div>
                )}
              </div>
              <div>
                <Label>SIN</Label>
                {isEditing ? (
                  <Input
                    name="SIN"
                    value={editedStaffData.SIN || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">{staffData.SIN}</div>
                )}
              </div>
              <div>
                <Label>Rate</Label>
                {isEditing ? (
                  <Input
                    name="Rate"
                    value={editedStaffData.rate || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">{staffData.rate}</div>
                )}
              </div>
              <div>
                <Label>Beneficiary</Label>
                {isEditing ? (
                  <Input
                    name="beneficiary"
                    value={editedStaffData.beneficiary || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {staffData.beneficiary}
                  </div>
                )}
              </div>
              <div>
                <Label>Licensing College</Label>
                {isEditing ? (
                  <Input
                    name="licensingCollege"
                    value={editedStaffData.licensingCollege}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {editedStaffData.licensingCollege}
                  </div>
                )}
              </div>
              <div>
                <Label>Registration Number</Label>
                {isEditing ? (
                  <Input
                    name="registrationNumber"
                    value={editedStaffData.registrationNumber}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {editedStaffData.registrationNumber}
                  </div>
                )}
              </div>
              <div>
                <Label>Contract Start Date</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    name="contractStartDate"
                    value={editedStaffData.contractStartDate || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {editedStaffData.contractStartDate}
                  </div>
                )}
              </div>
              <div>
                <Label>Contract End Date</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    name="contractEndDate"
                    value={editedStaffData.contractEndDate || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {editedStaffData.contractEndDate}
                  </div>
                )}
              </div>
              <div>
                <Label>Role</Label>
                {isEditing ? (
                  <Input
                    name="role"
                    value={editedStaffData.role}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {editedStaffData.role}
                  </div>
                )}
              </div>
              <div>
                <Label>Agency</Label>
                {isEditing ? (
                  <Input
                    name="agency"
                    value={editedStaffData.agency}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="text-lg font-bold">
                    {editedStaffData.agency}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Assigned Clients Tab */}
          <TabsContent value="assigned-client">
            <div className="mt-4">
              {assignedClients.length === 0 ? (
                <p>No clients assigned.</p>
              ) : (
                <ul>
                  <Label>Client</Label>
                  {assignedClients.map((client) => (
                    <li key={client.clientId} className="flex items-center mb-2">
                      <div className="text-lg font-bold mr-2">
                        {`${client.firstName} ${client.lastName}`}
                      </div>
                      <Link
                        href={`../Patient/View-Patient-Personal?clientId=${client.clientId}`}
                      >
                        <Button style={styles.viewButton}>View</Button>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </TabsContent>

          {/* Account Access Tab */}
          <TabsContent value="account-access">
            <div className="mt-4">
              <div>
                <Label>Account Type</Label>
                {isEditing ? (
                  <select
                    name="isAdmin"
                    value={editedStaffData.isAdmin}
                    onChange={handleInputChange}
                    className="border rounded p-2 w-full"
                  >
                    <option value={0}>Service Provider</option>
                    <option value={1}>Admin</option>
                  </select>
                ) : (
                  <div className="text-lg font-bold">
                    {staffData.isAdmin === 1 ? "Admin" : "Service Provider"}
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
