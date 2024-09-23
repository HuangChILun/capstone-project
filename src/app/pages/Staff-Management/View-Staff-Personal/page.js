"use client"
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from "next/link";
import { Button } from "@/app/components/HomeUi/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/HomeUi/tabs";
import { Badge } from "@/app/components/HomeUi/badge";

export default function ViewStaffPersonal() {
  const [staffData, setStaffData] = useState(null);
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [accountAccess, setAccountAccess] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const staffId = searchParams.get('id');

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchStaffData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/auth/staff/${staffId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch staff data');
        }
        const data = await response.json();
        setStaffData(data);
        setAssignedPatients(data.assignedPatients); // Assuming this comes from the API
        setAccountAccess(data.accountAccess); // Assuming this comes from the API
      } catch (error) {
        console.error('Error fetching staff data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffData();
  }, [router, staffId]);

  if (isLoading) return <div>Loading...</div>;
  if (!staffData) return <div>No staff data found.</div>;

  return (
    <div className="p-4 ml-8 mt-2">
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
          <div className="grid grid-cols-2 gap-4 mt-4 ">
            <div>
              <div className="text-muted-foreground">First Name</div>
              <div className="text-lg font-bold">{staffData.firstName}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Last Name</div>
              <div className="text-lg font-bold">{staffData.lastName}</div>
            </div>
            <div>
              <div className="text-muted-foreground">SIN</div>
              <div className="text-lg font-bold">{staffData.sin}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Rate</div>
              <div className="text-lg font-bold">{staffData.rate}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Licensing College</div>
              <div className="text-lg font-bold">{staffData.licensingCollege}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Registration Number</div>
              <div className="text-lg font-bold">{staffData.registrationNumber}</div>
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
              <div className="text-muted-foreground">Province</div>
              <div className="text-lg font-bold">{staffData.province}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Postal Code</div>
              <div className="text-lg font-bold">{staffData.postalCode}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Phone Number</div>
              <div className="text-lg font-bold">{staffData.phone}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Email</div>
              <div className="text-lg font-bold">{staffData.email}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Contract</div>
              <Badge variant="default">{staffData.contractStatus}</Badge>
            </div>
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
