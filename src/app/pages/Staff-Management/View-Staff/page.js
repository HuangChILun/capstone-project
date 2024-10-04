"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from "next/link"
import { Input } from "@/app/components/HomeUi/input"
import { Button } from "@/app/components/HomeUi/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/HomeUi/avatar"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/app/components/HomeUi/table"
import Nav from '@/app/components/Navigation-Bar/NavBar';

export default function ViewStaff() {
  const [staff, setStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const router = useRouter();

  useEffect(() => {
    const fetchStaff = async () => {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/');
        console.log("need login");
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/users`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch staff');
        }
        const data = await response.json();
        setStaff(data);
      } catch (error) {
        console.error('Error fetching staff:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [router]);

  const filteredStaff = staff.filter(s => 
    s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const access =() =>{
    if (user.isAdmin === 1){
      return true;
    } else {
      return false;
    }
  }
  const isAdmin = access();

  return (
    <div className="flex h-screen">
      <Nav access={isAdmin} />
      <main className="flex-1 p-6 bg-gray-50">
        <header className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center space-x-2">
            <Input 
              type="text" 
              placeholder="Input Staff name..." 
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
        <section className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>{`${staff.firstName} ${staff.lastName}`}</TableCell>
                  <TableCell>{staff.role || 'N/A'}</TableCell>
                  <TableCell>{staff.phoneNumber}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>
                    <Link href={`./View-Staff-Personal?id=${staff.staffId}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
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