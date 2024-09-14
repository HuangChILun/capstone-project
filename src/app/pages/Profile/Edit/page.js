"use client";

import Link from "next/link";
import { Button } from "@/app/pages/Account/Edit/button";
import { Input } from "@/app/pages/Account/Edit/input";
import AdminNav from "/src/components/Navigation-Bar/AdminNav.js";
import ServiceProviderNav from "/src/components/Navigation-Bar/ServiceProviderNav.js";
import Header from "@/app/components/Header/header";

export default function Edit() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="flex min-h-screen">
      {/* Nav */}
      {user.role === "admin" ? <AdminNav /> : <ServiceProviderNav />}

      <main className="flex-1 p-8 relative">
        {/* Header Component */}
        <Header user={user} />
        
        {/* Edit Profile */}
        <div className="border p-8 rounded-lg mt-8 relative">
          {/* Save Button inside the profile box */}
          <div className="absolute top-5 right-5">
            <Link href="../Account/View-Profile">
              <Button className="bg-blue-500 text-white">Save</Button>
            </Link>
          </div>

          <div className="flex items-center mb-8">
            <div className="relative w-32 h-32 border rounded-full flex items-center justify-center">
              <UserIcon className="w-16 h-16 text-muted-foreground" />
              <FilePenIcon className="absolute top-0 right-0 w-6 h-6 text-muted-foreground cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="font-semibold mb-2">First Name</p>
              <Input defaultValue="John" />
            </div>
            <div>
              <p className="font-semibold mb-2">Last Name</p>
              <Input defaultValue="Doe" />
            </div>
            <div>
              <p className="font-semibold mb-2">Email</p>
              <Input defaultValue="john@gmail.com" />
            </div>
            <div>
              <p className="font-semibold mb-2">Phone Number</p>
              <Input defaultValue="123-456-7890" />
            </div>
            <div>
              <p className="font-semibold mb-2">Address</p>
              <Input defaultValue="1234 Placeholder Hill SE" />
            </div>
            <div>
              <p className="font-semibold mb-2">City</p>
              <Input defaultValue="Calgary" />
            </div>
            <div>
              <p className="font-semibold mb-2">Postal Code</p>
              <Input defaultValue="T3R 1A2" />
            </div>
            <div>
              <p className="font-semibold mb-2">Province</p>
              <Input defaultValue="Alberta" />
            </div>
            <div>
              <p className="font-semibold mb-2">Role</p>
              <Input defaultValue={user.role === "admin" ? "Administrator" : "Service Provider"} disabled />
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