"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button } from "@/app/components/HomeUi/button"
import { Input } from "@/app/components/HomeUi/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/HomeUi/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/HomeUi/tabs"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/app/components/HomeUi/table"
import Nav from "@/app/components/Navigation-Bar/NavBar";

export default function ViewPatient() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/');
        console.log("need login");
        return;
      }

      try {
        setIsLoading(true);
        const allPatients = [];
        for (let i = 1; i <= 4; i++) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/auth/patients/${i}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            if (response.status === 404) {
              // If patient not found, skip to the next one
              continue;
            }
            throw new Error(`Failed to fetch patient ${i}`);
          }
          const data = await response.json();
          allPatients.push(data);
        }
        setPatients(allPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchPatients();
  }, [router]);

  const filteredPatients = patients.filter(patient =>
    patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const isAdmin =() =>{
    if (user.isAdmin === 1){
      return true;
    } else {
      return false;
    }
  }
  return (
    <div className="flex h-screen">
      <Nav access = {isAdmin} />
      <main className="flex-1 p-6 bg-white">
        <header className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center space-x-2">
            <Input 
              type="text" 
              placeholder="input patient name..." 
              className="w-64" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="flex items-center">
              <SearchIcon className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <BellIcon className="w-6 h-6 text-gray-600" />
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span>John Doe</span>
          </div>
        </header>
        <Tabs defaultValue="active" className="mt-4">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Primary Guardian</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.clientId}>
                    <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                    <TableCell>{patient.guardianName || 'N/A'}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>
                      <Link href={`./View-Patient-Personal?id=${patient.clientId}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          {/* Waitlist and Archived tabs content remain the same */}
        </Tabs>
      </main>
    </div>
  )
}

function BellIcon(props) {
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}