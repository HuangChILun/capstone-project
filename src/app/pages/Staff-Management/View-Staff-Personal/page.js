"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { Button } from "@/app/components/HomeUi/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/HomeUi/tabs";
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";

export default function ViewStaffPersonal() {
  const [staffData, setStaffData] = useState(null);
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [accountAccess, setAccountAccess] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const staffId = searchParams.get('id');  // Ensure 'id' exists in the URL
  
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
        <Button className="ml-auto">Edit</Button>
      </div>
      <Tabs defaultValue="personal-info">
        <TabsList>
          <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
          <TabsTrigger value="assigned-patient">Assigned Patients</TabsTrigger>
          <TabsTrigger value="account-access">Account Access</TabsTrigger>
        </TabsList>

        {/* Personal Info */}
        <TabsContent value="personal-info">
          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Display Personal Information */}
            <div><div className="text-muted-foreground">First Name</div><div className="text-lg font-bold">{staffData.firstName}</div></div>
            <div><div className="text-muted-foreground">Last Name</div><div className="text-lg font-bold">{staffData.lastName}</div></div>
            <div><div className="text-muted-foreground">Role</div><div className="text-lg font-bold">{staffData.role}</div></div>
            <div><div className="text-muted-foreground">Email</div><div className="text-lg font-bold">{staffData.email}</div></div>
            <div><div className="text-muted-foreground">Phone Number</div><div className="text-lg font-bold">{staffData.phoneNumber}</div></div>
            <div><div className="text-muted-foreground">address</div><div className="text-lg font-bold">{staffData.address}</div></div>
            <div><div className="text-muted-foreground">city</div><div className="text-lg font-bold">{staffData.city}</div></div>
            <div><div className="text-muted-foreground">Postal Code</div><div className="text-lg font-bold">{staffData.postalCode}</div></div>
            <div><div className="text-muted-foreground">province</div><div className="text-lg font-bold">{staffData.province}</div></div>
            <div><div className="text-muted-foreground">SIN</div><div className="text-lg font-bold">{staffData.SIN}</div></div>
            <div><div className="text-muted-foreground">rate</div><div className="text-lg font-bold">{staffData.rate}</div></div>
            <div><div className="text-muted-foreground">beneficiary</div><div className="text-lg font-bold">{staffData.beneficiary}</div></div>
            <div><div className="text-muted-foreground">Licensing College</div><div className="text-lg font-bold">{staffData.licencingCollege}</div></div>
            <div><div className="text-muted-foreground">Registration Number</div><div className="text-lg font-bold">{staffData.registrationNumber}</div></div>
            <div><div className="text-muted-foreground">Contract Start Date</div><div className="text-lg font-bold">{staffData.contractStartDate}</div></div>
            <div><div className="text-muted-foreground">contract End Date</div><div className="text-lg font-bold">{staffData.contractEndDate}</div></div>
            
            {/* Continue adding fields as needed... */}
          </div>
        </TabsContent>

        {/* Assigned Patients */}
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

        {/* Account Access */}
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
