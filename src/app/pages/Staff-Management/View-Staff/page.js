"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import Link from "next/link"
import { Input } from "@/app/components/HomeUi/input"
import { Button } from "@/app/components/HomeUi/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/HomeUi/avatar"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/app/components/HomeUi/table"
import Nav from '@/app/components/Navigation-Bar/NavBar';

export default function ViewStaff() {
  const router = useRouter();

  const isAdmin =() =>{
    if (user.isAdmin === 1){
      return true;
    } else {
      return false;
    }
  }  
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/');
    }
  }, [router]);
  return (
    <div className="flex h-screen">
      <Nav access = {isAdmin} />
      <main className="flex-1 p-6 bg-gray-50">
      <header className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center space-x-2">
            <Input type="text" placeholder="input Staff name..." className="w-64" />
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
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Kevin Huang</TableCell>
                <TableCell>OT</TableCell>
                <TableCell>403-123-8888</TableCell>
                <TableCell>kevin@gmail.com</TableCell>
                <TableCell>
                        <Link href="./View-Staff-Personal">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      </Link>
                    </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bella Jones</TableCell>
                <TableCell>Aide</TableCell>
                <TableCell>587-324-7656</TableCell>
                <TableCell>bella@gmail.com</TableCell>
                <TableCell>
                        <Link href="./View-Staff-Personal">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      </Link>
                    </TableCell>
              </TableRow>
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
  