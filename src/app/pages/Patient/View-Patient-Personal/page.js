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
  const [guardian, setGuardian] = useState(null); // Changed to single guardian
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

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
          `${process.env.NEXT_PUBLIC_BACKEND_IP}/patients/${clientId}`,
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

        // Fetch guardian by guardianId (assuming guardianId is part of patient data)
        const guardianId = data.guardianId; // Assuming patient data includes guardianId
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
        } else {
          setGuardian(null);
        }
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!patient) return <div>No patient data found</div>;

  return (
    <div>
      <HoriNav user={user} />
      <div className="p-6">
        <div className="flex items-center mb-4">
          <ArrowLeftIcon className="w-6 h-6 text-muted-foreground" />
          <Link href="./View-Patient-Page">
            <span className="ml-2 text-lg font-semibold text-muted-foreground">
              Back to Patient List
            </span>
          </Link>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h1 className="text-4xl font-bold">{`${patient.firstName} ${patient.lastName}`}</h1>
            <Badge variant="default" className="ml-4">
              {patient.currentStatus ? "Active" : "Inactive"}
            </Badge>
          </div>
          <Button>Edit</Button>
        </div>
        <Tabs defaultValue="personal-info" className="mb-6">
          <TabsList>
            <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
            <TabsTrigger value="medical-info">Medical Info</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="additional-note">
              Additional Note
            </TabsTrigger>
          </TabsList>
          <TabsContent value="personal-info">
            {/* Patient Info */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Patient Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">First Name</Label>
                  <p className="text-lg font-semibold">{patient.firstName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Name</Label>
                  <p className="text-lg font-semibold">{patient.lastName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Address</Label>
                  <p className="text-lg font-semibold">{patient.address}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">City</Label>
                  <p className="text-lg font-semibold">{patient.city}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Province</Label>
                  <p className="text-lg font-semibold">{patient.province}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Postal Code</Label>
                  <p className="text-lg font-semibold">{patient.postalCode}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date Of Birth</Label>
                  <p className="text-lg font-semibold">
                    {new Date(patient.birthDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Age</Label>
                  <p className="text-lg font-semibold">
                    {calculateAge(patient.birthDate)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Gender</Label>
                  <p className="text-lg font-semibold">{patient.gender}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">School</Label>
                  <p className="text-lg font-semibold">{patient.school}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">FSCD ID#</Label>
                  <p className="text-lg font-semibold">{patient.fscdIdNum}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="text-lg font-semibold">{patient.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone Number</Label>
                  <p className="text-lg font-semibold">{patient.phoneNumber}</p>
                </div>
              </div>
            </div>
            {/* Guardian Info */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Guardian Information</h2>
              {guardian ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="text-lg font-semibold">{`${guardian.firstName} ${guardian.lastName}`}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Address</Label>
                    <p className="text-lg font-semibold">{guardian.address}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">City</Label>
                    <p className="text-lg font-semibold">{guardian.city}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Province</Label>
                    <p className="text-lg font-semibold">{guardian.province}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Postal Code</Label>
                    <p className="text-lg font-semibold">{guardian.postalCode}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Relation to Patient
                    </Label>
                    <p className="text-lg font-semibold">{guardian.relationship}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Custody</Label>
                    <p className="text-lg font-semibold">{guardian.custody}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="text-lg font-semibold">{guardian.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone Number</Label>
                    <p className="text-lg font-semibold">{guardian.phoneNumber}</p>
                  </div>
                </div>
              ) : (
                <p>No guardian found for this patient.</p>
              )}
            </div>
          </TabsContent>
          {/* Medical info and other tabs remain the same */}
          <TabsContent value="additional-note">
          <div className="mb-6"> 
            <p>{patient.psNote}</p>
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
