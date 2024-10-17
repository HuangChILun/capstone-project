"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { Button } from "@/app/components/HomeUi/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/HomeUi/tabs";
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";
import { Input } from "@/app/components/HomeUi/input";

export default function ViewStaffPersonal() {
  const [staffData, setStaffData] = useState(null);
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [accountAccess, setAccountAccess] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle for editing mode
  const user = JSON.parse(localStorage.getItem('user'));
  const router = useRouter();
  const searchParams = useSearchParams();
  const staffId = searchParams.get('userId');  // Ensure 'id' exists in the URL
  
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

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/users/${staffId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch staff data. Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data) {
          throw new Error("No data found for this staff member");
        }

        setStaffData(data);
        setAssignedPatients(data.assignedPatients || []);  // Fallback to empty array if no assigned patients
        setAccountAccess(data.accountAccess || []);        // Fallback to empty array if no account access info

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
    setIsEditing(true); // Enable editing mode
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Cancel editing mode
  };

  const handleInputChange = (e) => {
    setStaffData({
      ...staffData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveChanges = async () => {
    const token = Cookies.get("token");
    try {
      // Ensure all NOT NULL fields are included and valid
      const updatedData = {
        firstName: staffData.firstName || '',
        lastName: staffData.lastName || '',
        email: staffData.email || '',
        password: staffData.password || 'defaultPassword123', // If password is required
        phoneNumber: staffData.phoneNumber || '',
        address: staffData.address || '',
        postalCode: staffData.postalCode || '',
        city: staffData.city || '',
        province: staffData.province || '',
        SIN: staffData.SIN || '',
        rate: parseFloat(staffData.rate) || 0,
        isAdmin: staffData.isAdmin !== undefined ? staffData.isAdmin : 0,
        isOutsideProvider: staffData.isOutsideProvider !== undefined ? staffData.isOutsideProvider : 0,
        agency: staffData.agency || '',
        contractStartDate: staffData.contractStartDate || '',
        contractEndDate: staffData.contractEndDate || '',
        role: staffData.role || '',
        // Include other NOT NULL fields as necessary
      };
  
      // Validate that all required fields are not empty
      for (const [key, value] of Object.entries(updatedData)) {
        if ((value === '' || value === null || value === undefined) && key !== 'password') {
          throw new Error(`Field ${key} is required and cannot be empty.`);
        }
      }
  
      // Format dates to 'YYYY-MM-DD'
      if (updatedData.contractStartDate) {
        updatedData.contractStartDate = updatedData.contractStartDate.split('T')[0];
      }
      if (updatedData.contractEndDate) {
        updatedData.contractEndDate = updatedData.contractEndDate.split('T')[0];
      }
  
      console.log('Updated Data:', updatedData);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/users/${staffId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update staff data: ${errorData.message || response.statusText}`);
      }
  
      alert("Staff data updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating staff data:", error);
      alert(`Error updating staff data: ${error.message}`);
    }
  };
  
  
  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!staffData) return <div>No staff data found.</div>;

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
          <div className="text-4xl font-bold">{`${staffData.firstName} ${staffData.lastName}`}</div>
          <div className="text-xl ml-2">{staffData.role}</div>
          {!isEditing && (
            <Button className="ml-auto mr-2" onClick={handleEditClick}>Edit</Button>
          )}
        </div>

        {isEditing ? (
          <div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p>First Name</p>
                <Input name="firstName" value={staffData.firstName} onChange={handleInputChange} />
              </div>
              <div>
                <p>Last Name</p>
                <Input name="lastName" value={staffData.lastName} onChange={handleInputChange} />
              </div>
              <div>
                <p>Email</p>
                <Input name="email" value={staffData.email} onChange={handleInputChange} />
              </div>
              <div>
                <p>Phone Number</p>
                <Input name="phoneNumber" value={staffData.phoneNumber} onChange={handleInputChange} />
              </div>
              <div>
                <p>Address</p>
                <Input name="address" value={staffData.address} onChange={handleInputChange} />
              </div>
              <div>
                <p>City</p>
                <Input name="city" value={staffData.city} onChange={handleInputChange} />
              </div>
              <div>
                <p>Postal Code</p>
                <Input name="postalCode" value={staffData.postalCode} onChange={handleInputChange} />
              </div>
              <div>
                <p>Province</p>
                <Input name="province" value={staffData.province} onChange={handleInputChange} />
              </div>
              <div>
                <p>SIN</p>
                <Input name="SIN" value={staffData.SIN} onChange={handleInputChange} />
              </div>
              <div>
                <p>Rate</p>
                <Input name="rate" value={staffData.rate} onChange={handleInputChange} />
              </div>
              <div>
                <p>Beneficiary</p>
                <Input name="beneficiary" value={staffData.beneficiary} onChange={handleInputChange} />
              </div>
              <div>
                <p>Licensing College</p>
                <Input name="licencingCollege" value={staffData.licencingCollege} onChange={handleInputChange} />
              </div>
              <div>
                <p>Registration Number</p>
                <Input name="registrationNumber" value={staffData.registrationNumber} onChange={handleInputChange} />
              </div>
              <div>
  <p>Contract Start Date</p>
  <Input
    type="date"
    name="contractStartDate"
    value={staffData.contractStartDate || ''}
    onChange={handleInputChange}
  />
</div>
<div>
  <p>Contract End Date</p>
  <Input
    type="date"
    name="contractEndDate"
    value={staffData.contractEndDate || ''}
    onChange={handleInputChange}
  />
</div>

              <div>
                <p>Role</p>
                <Input name="role" value={staffData.role} onChange={handleInputChange} />
              </div>
              <div>
                <p>Agency</p>
                <Input name="agency" value={staffData.agency} onChange={handleInputChange} />
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={handleSaveChanges}>Save Changes</Button>
              <Button className="ml-4" onClick={handleCancelEdit}>Cancel</Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="personal-info">
            <TabsList>
              <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
              <TabsTrigger value="assigned-patient">Assigned Patients</TabsTrigger>
              <TabsTrigger value="account-access">Account Access</TabsTrigger>
            </TabsList>

            <TabsContent value="personal-info">
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-muted-foreground">First Name</div>
                  <div className="text-lg font-bold">{staffData.firstName}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Last Name</div>
                  <div className="text-lg font-bold">{staffData.lastName}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Role</div>
                  <div className="text-lg font-bold">{staffData.role}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Email</div>
                  <div className="text-lg font-bold">{staffData.email}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Phone Number</div>
                  <div className="text-lg font-bold">{staffData.phoneNumber}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Address</div>
                  <div className="text-lg font-bold">{staffData.address}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">City</div>
                  <div className="text-lg font-bold">{staffData.city}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Postal Code</div>
                  <div className="text-lg font-bold">{staffData.postalCode}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Province</div>
                  <div className="text-lg font-bold">{staffData.province}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">SIN</div>
                  <div className="text-lg font-bold">{staffData.SIN}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Rate</div>
                  <div className="text-lg font-bold">{staffData.rate}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Beneficiary</div>
                  <div className="text-lg font-bold">{staffData.beneficiary}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Licensing College</div>
                  <div className="text-lg font-bold">{staffData.licencingCollege}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Registration Number</div>
                  <div className="text-lg font-bold">{staffData.registrationNumber}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Contract Start Date</div>
                  <div className="text-lg font-bold">{staffData.contractStartDate}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Contract End Date</div>
                  <div className="text-lg font-bold">{staffData.contractEndDate}</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assigned-patient">
              <div className="mt-4">
                {assignedPatients.length === 0 ? (
                  <p>No patients assigned.</p>
                ) : (
                  <ul>
                    {assignedPatients.map((patient) => (
                      <li key={patient.id}>
                        <div className="text-lg font-bold">{`${patient.firstName} ${patient.lastName}`}</div>
                        <div className="text-muted-foreground">Condition: {patient.condition}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </TabsContent>

            <TabsContent value="account-access">
              <div className="mt-4">
                {accountAccess.length === 0 ? (
                  <p>No account access details available.</p>
                ) : (
                  <ul>
                    {accountAccess.map((access) => (
                      <li key={access.id}>
                        <div className="text-lg font-bold">Access Level: {access.level}</div>
                        <div className="text-muted-foreground">Permissions: {access.permissions.join(', ')}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
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
