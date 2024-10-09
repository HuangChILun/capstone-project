"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Cookies from 'js-cookie';
import { Badge } from "@/app/components/HomeUi/badge"
import { Button } from "@/app/components/HomeUi/button"
import { Tabs, TabsList, TabsTrigger, TabsContent} from "@/app/components/HomeUi/tabs"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/app/components/HomeUi/table"
import { useRouter } from 'next/navigation';
import { Label } from "@/app/components/HomeUi/label"
import { Checkbox } from "@/app/components/HomeUi/checkbox"
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";

export default function ViewPatientPersonal() {
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchPatient = async () => {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/');
        console.log("need login");
        return;
      }

      try {
        setIsLoading(true);
        // Assuming you're passing the patient ID as a query parameter
        const patientId = new URLSearchParams(window.location.search).get('id');
        const response = await fetch(`https://capstone-project-backend-weld.vercel.app/patients/${patientId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }
        const data = await response.json();
        setPatient(data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchPatient();
  }, [router]);

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
          <span className="ml-2 text-lg font-semibold text-muted-foreground">Back to Patient List</span>
        </Link>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h1 className="text-4xl font-bold">{`${patient.firstName} ${patient.lastName}`}</h1>
          <Badge variant="default" className="ml-4">
            {patient.currentStatus ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <Button>Edit</Button>
      </div>
      <Tabs defaultValue="personal-info" className="mb-6">
        <TabsList>
          <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
          <TabsTrigger value="medical-info">Medical Info</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="additional-note">Additional Note</TabsTrigger>
        </TabsList>
        <TabsContent value="personal-info">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Label className="text-muted-foreground">First Name</Label>
                  <p className="text-lg font-semibold">{patient.firstName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Name</Label>
                  <p className="text-lg font-semibold">{patient.lastName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Gender</Label>
                  <p className="text-lg font-semibold">{patient.gender}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Age</Label>
                  <p className="text-lg font-semibold">{patient.age}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Address</Label>
                  <p className="text-lg font-semibold">{patient.address}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone Number</Label>
                  <p className="text-lg font-semibold">{patient.phone}</p>
                </div>
              </div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold">Primary Guardian</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="text-lg font-semibold">[Primary Guardian Name]</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Relation to Patient</Label>
                    <p className="text-lg font-semibold">[Relation]</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Address</Label>
                    <p className="text-lg font-semibold">[Guardian Address]</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone Number</Label>
                    <p className="text-lg font-semibold">[Guardian Phone]</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="text-lg font-semibold">[Guardian Email]</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Secondary Guardian</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="text-lg font-semibold">[Secondary Guardian Name]</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Relation to Patient</Label>
                    <p className="text-lg font-semibold">[Relation]</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Label className="text-muted-foreground">FSCD ID#</Label>
                  <p className="text-lg font-semibold">{patient.fscdIdNum}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date Of Birth</Label>
                  <p className="text-lg font-semibold">{new Date(patient.birthDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">School</Label>
                  <p className="text-lg font-semibold">{patient.school}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Postal Code</Label>
                  <p className="text-lg font-semibold">{patient.postalCode}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="text-lg font-semibold">{patient.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Contract</Label>
                  <Button variant="outline">Open</Button>
                </div>
                <div>
                  <Label className="text-muted-foreground">Consent</Label>
                  <Button variant="outline">Open</Button>
                </div>
                <div>
                  <Label className="text-muted-foreground">Insurance</Label>
                  <Button variant="outline">Open</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="medical-info">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Diagnoses</TableHead>
                <TableHead>Typicality</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patient.diagnosis.split(',').map((diagnosis, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{diagnosis.trim()}</TableCell>
                  <TableCell>
                    <Checkbox id={`diagnosis-${index}`} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="team">
          <div>Team member information not available in the current data model</div>
        </TabsContent>
        <TabsContent value="additional-note">
          <div className="p-4 bg-gray-200 rounded-md">
            {patient.psNote || "No additional notes available."}
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </div>
  )
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
  )
}

