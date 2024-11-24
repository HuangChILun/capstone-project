"use client"
import React from 'react';
import { useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Nav({access}) {
  const isAdmin = access;
  const [isPatientOpen, setIsPatientOpen] = useState(false);
  const [isStaffOpen, setIsStaffOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const togglePatient = () => setIsPatientOpen(!isPatientOpen);
  const toggleStaff = () => setIsStaffOpen(!isStaffOpen);
  const toggleInvoice = () => setIsInvoiceOpen(!isInvoiceOpen);
  const toggleSchedule = () => setIsScheduleOpen(!isScheduleOpen);
  const toggleAccount = () => setIsAccountOpen(!isAccountOpen);
  const router = useRouter();
  const handleLogout = () => {
    // Clear user data from localStorage or cookies
    Cookies.remove("token");
    localStorage.removeItem("user");
    router.push("/"); // Navigate back to login after logout
  }; 

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <BuildingIcon className="w-6 h-6 mr-2" />
          <span className="text-lg font-bold">Bridging Abilities</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link href="../Home/Home-Page" className="flex items-center p-2 hover:bg-gray-700 rounded" prefetch={false}>
          <HomeIcon className="w-5 h-5 mr-2" />
          Home Page
        </Link>
        {isAdmin ? (<div>
          <button onClick={togglePatient} className="flex items-center w-full p-2 hover:bg-gray-700 rounded">
            <UserIcon className="w-5 h-5 mr-2" />
            Patient
            <ChevronDownIcon className={`w-4 h-4 ml-auto transform transition-transform ${isPatientOpen ? 'rotate-180' : ''}`} />
          </button>
          {isPatientOpen && (
            <div className="ml-6 mt-1 space-y-1">
              <Link href="../Patient/View-Patient-Page" className="flex items-center p-2 hover:bg-gray-700 rounded bg-blue-600" prefetch={false}>
                View Patient
              </Link>
              <Link href="../Patient/Add-New-Patient" className="flex items-center p-2 hover:bg-gray-700 rounded" prefetch={false}>
                Add New Patient
              </Link>
            </div>
          )}
        </div>):(<div>
          <button onClick={togglePatient} className="flex items-center w-full p-2 hover:bg-gray-700 rounded">
            <UserIcon className="w-5 h-5 mr-2" />
            Patient
            <ChevronDownIcon className={`w-4 h-4 ml-auto transform transition-transform ${isPatientOpen ? 'rotate-180' : ''}`} />
          </button>
          {isPatientOpen && (
            <div className="ml-6 mt-1 space-y-1">
              <Link href="../Patient/View-Patient-Page" className="flex items-center p-2 hover:bg-gray-700 rounded bg-blue-600" prefetch={false}>
                View Assigned Patient
              </Link>
            </div>
          )}
        </div>)}
        
        <div>
          <button onClick={toggleInvoice} className="flex items-center w-full p-2 hover:bg-gray-700 rounded">
            <FileTextIcon className="w-5 h-5 mr-2" />
            Invoice
            <ChevronDownIcon className={`w-4 h-4 ml-auto transform transition-transform ${isInvoiceOpen ? 'rotate-180' : ''}`} />
          </button>
          {isInvoiceOpen && (
            <div className="ml-6 mt-1 space-y-1">
              <Link href="../invoice-management/View-Invoice" className="flex items-center p-2 hover:bg-gray-700 rounded bg-blue-600" prefetch={false}>
                View Invoices
              </Link>
              <Link href="../invoice-management/Add-Invoice" className="flex items-center p-2 hover:bg-gray-700 rounded" prefetch={false}>
                Add New Invoice
              </Link>
            </div>
          )}
        </div>
        <div>
          <button onClick={toggleSchedule} className="flex items-center w-full p-2 hover:bg-gray-700 rounded">
            <CalendarIcon className="w-5 h-5 mr-2" />
            Schedule
            <ChevronDownIcon className={`w-4 h-4 ml-auto transform transition-transform ${isScheduleOpen ? 'rotate-180' : ''}`} />
          </button>
          {isScheduleOpen && (
            <div className="ml-6 mt-1 space-y-1">
              <Link href="../Schedule/View-Schedule" className="flex items-center p-2 hover:bg-gray-700 rounded bg-blue-600" prefetch={false}>
                View Schedule
              </Link>
              <Link href="../Schedule/Add-New-Appointment" className="flex items-center p-2 hover:bg-gray-700 rounded" prefetch={false}>
                Add New Appointment
              </Link>
            </div>
          )}
        </div>
        {isAdmin ? (<div>
          <button onClick={toggleStaff} className="flex items-center w-full p-2 hover:bg-gray-700 rounded">
            <UserIcon className="w-5 h-5 mr-2" />
            Staff Management
            <ChevronDownIcon className={`w-4 h-4 ml-auto transform transition-transform ${isStaffOpen ? 'rotate-180' : ''}`} />
          </button>
          {isStaffOpen && (
            <div className="ml-6 mt-1 space-y-1">
              <Link href="../Staff-Management/View-Staff" className="flex items-center p-2 hover:bg-gray-700 rounded bg-blue-600" prefetch={false}>
                View Staff
              </Link>
              <Link href="../Staff-Management/Add-New-Staff" className="flex items-center p-2 hover:bg-gray-700 rounded" prefetch={false}>
                Add New Staff
              </Link>
            </div>
          )}
        </div>):(<div></div>)}
        <div>
          <button onClick={toggleAccount} className="flex items-center w-full p-2 hover:bg-gray-700 rounded">
            <SettingsIcon className="w-5 h-5 mr-2" />
            Account
            <ChevronDownIcon className={`w-4 h-4 ml-auto transform transition-transform ${isAccountOpen ? 'rotate-180' : ''}`} />
          </button>
          {isAccountOpen && (
            <div className="ml-6 mt-1 space-y-1">
              <Link href="../Profile/View-Profile" className="flex items-center p-2 hover:bg-gray-700 rounded bg-blue-600" prefetch={false}>
                View Profile
              </Link>
              <Link href="../Profile/Password-Change" className="flex items-center p-2 hover:bg-gray-700 rounded" prefetch={false}>
                Password Change
              </Link>
            </div>
          )}
        </div>
      </nav>
      <div className="mt-auto p-4">
        <button onClick={handleLogout} className="flex items-center w-full p-2 hover:bg-red-700 rounded">
          <PowerIcon className="w-5 h-5 mr-2" />
          Log Out
        </button>
      </div>
    </aside>
  );
}

function PowerIcon(props) {
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
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
      <line x1="12" y1="2" x2="12" y2="12" />
    </svg>
  );
}

function BuildingIcon(props) {
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
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}

function CalendarIcon(props) {
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function ChevronDownIcon(props) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function FileTextIcon(props) {
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function HomeIcon(props) {
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function SettingsIcon(props) {
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
      className="w-5 h-5" // Consistent sizing
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V20a2 2 0 0 1-2 2h-1.52a2 2 0 0 1-2-2v-.17a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H4a2 2 0 0 1-2-2v-1.52a2 2 0 0 1 2-2h.17a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.06A1.65 1.65 0 0 0 9 4.17V4a2 2 0 0 1 2-2h1.52a2 2 0 0 1 2 2v.17a1.65 1.65 0 0 0 1.51 1h.06a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.06A1.65 1.65 0 0 0 19.4 9h.17a2 2 0 0 1 2 2v1.52a2 2 0 0 1-2 2h-.17a1.65 1.65 0 0 0-1.51 1v.06z" />
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
      className="w-5 h-5" // Consistent sizing
    >
      <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
