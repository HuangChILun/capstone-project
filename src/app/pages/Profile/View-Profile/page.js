"use client";

import Link from "next/link";
import { Button } from "@/app/components/HomeUi/button";
import Header from "@/app/components/Header/header"; 
import Nav from "@/app/components/Navigation-Bar/NavBar";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin =() =>{
    if (user.isAdmin === 1){
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Nav */}
      <Nav access = {isAdmin} />

      <main className="flex-1 p-8 relative">
        {/* Header Component */}
        <Header user={user} />
        
        {/* Profile */}
        <div className="border p-8 rounded-lg mt-8 relative">
          {/* Edit Button inside the profile box */}
          <div className="absolute top-5 right-5">
            <Link href="../Account/Edit">
              <Button className="bg-blue-500 text-white">Edit</Button>
            </Link>
          </div>

          <div className="flex items-center mb-8">
            <div className="relative w-32 h-32 border rounded-full flex items-center justify-center">
              <UserIcon className="w-16 h-16 text-muted-foreground" />
              <FilePenIcon className="absolute top-0 right-0 w-6 h-6 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="font-semibold">First Name</p>
              <p>John</p>
            </div>
            <div>
              <p className="font-semibold">Last Name</p>
              <p>Doe</p>
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <p>john@gmail.com</p>
            </div>
            <div>
              <p className="font-semibold">Phone Number</p>
              <p>123-456-7890</p>
            </div>
            <div>
              <p className="font-semibold">Address</p>
              <p>1234 Placeholder Hill SE</p>
            </div>
            <div>
              <p className="font-semibold">City</p>
              <p>Calgary</p>
            </div>
            <div>
              <p className="font-semibold">Postal Code</p>
              <p>T3R 1A2</p>
            </div>
            <div>
              <p className="font-semibold">Province</p>
              <p>Alberta</p>
            </div>
            <div>
              <p className="font-semibold">Role</p>
              <p>{user.role === "admin" ? "Administrator" : "Service Provider"}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FilePenIcon(props) {
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
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function UserIcon(props) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}