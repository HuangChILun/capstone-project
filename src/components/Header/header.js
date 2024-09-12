"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/app/pages/Patient/View-Patient-Page/avatar";
import Link from "next/link";

export default function Header({ user }) {
  return (
    <header className="flex items-center justify-between pb-6 border-b">
      <div>
        <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}, Welcome!</h1>
        <p className="text-gray-600">{user.role}</p>
      </div>
      <div className="flex items-center space-x-4">
        <BellIcon className="w-6 h-6 text-gray-600" />
        <Link href="../Account/View-Profile"> 
        <Avatar>
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        </Link>
      </div>
    </header>
  );
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