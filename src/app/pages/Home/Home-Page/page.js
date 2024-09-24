"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header/header';
import Nav from '@/app/components/Navigation-Bar/NavBar';
import Cookies from 'js-cookie';

export default function ViewPatient() {
  const [activeClients, setActiveClients] = useState(0);
  const [waitlistClients, setWaitlistClients] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0); // Placeholder for pending tasks
  const [invoiceAmount, setInvoiceAmount] = useState(0); // Placeholder for invoice amount
  const user = JSON.parse(localStorage.getItem('user'));
  const router = useRouter();

  // Role-based logic
  
  const isAdmin =() =>{
    if (user.isAdmin === 1){
      return true;
    } else {
      return false;
    }
  }
  useEffect(() => {
    const fetchPatients = async () => {
      const token = Cookies.get('token');
      if (!token) {
        router.push('/');
        console.log("need login");
        return;
      }

      try {
        // Fetch clients data (if necessary for both roles)
        const allPatients = [];
        let active = 0;
        let waitlist = 0;

        for (let i = 1; i <= 4; i++) {
          const response = await fetch(`/patients/${i}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            if (response.status === 404) continue;
            throw new Error(`Failed to fetch patient ${i}`);
          }
          const data = await response.json();
          allPatients.push(data);
          if (data.status === 'active') active++;
          if (data.status === 'waitlist') waitlist++;
        }

        setActiveClients(active);
        setWaitlistClients(waitlist);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, [router]);

  return (
    <div className="flex h-screen">
      <Nav access = {isAdmin} />
      <main className="flex-1 p-6 bg-white">
      <Header user={user} />

        {/* Conditional rendering based on role */}
        {isAdmin && (
          <div>
            {/* Admin Dashboard */}
            <h2 className="text-xl font-bold mt-6">Admin Dashboard</h2>
            <div className="grid grid-cols-3 gap-4 mt-6">
              {/* Active Clients */}
              <div className="p-4 bg-white shadow rounded-lg">
                <p className="text-lg font-medium">Active Clients</p>
                <p className="text-3xl font-bold">{activeClients}</p>
                <p className="text-sm text-green-600">Increase 12% compared to last year</p>
              </div>

              {/* Waitlisted Clients */}
              <div className="p-4 bg-white shadow rounded-lg">
                <p className="text-lg font-medium">Waitlisted Clients</p>
                <p className="text-3xl font-bold">{waitlistClients}</p>
              </div>

              {/* Pending Tasks (Placeholder) */}
              <div className="p-4 bg-white shadow rounded-lg">
                <p className="text-lg font-medium">Pending Tasks</p>
                <p className="text-3xl font-bold">{pendingTasks}</p>
              </div>

              {/* Invoice (Placeholder) */}
              <div className="col-span-3 p-4 bg-white shadow rounded-lg mt-6">
                <p className="text-lg font-medium">Invoice Received</p>
                <p className="text-3xl font-bold">$ {invoiceAmount}</p>
                {/* Placeholder Pie Chart for now */}
                <div className="w-full h-40 bg-gray-200 mt-4"></div>
              </div>
            </div>
          </div>
        )}

        {!isAdmin && (
          <div>
            {/* Service Provider Dashboard */}
            <h2 className="text-xl font-bold mt-6">Service Provider Dashboard</h2>
            {/* Add the components and layout specific for service provider */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {/* Example: Clients assigned to the service provider */}
              <div className="p-4 bg-white shadow rounded-lg">
                <p className="text-lg font-medium">Assigned Clients</p>
                <p className="text-3xl font-bold">{activeClients}</p>
              </div>

              {/* Example: Placeholder for Tasks assigned to the service provider */}
              <div className="p-4 bg-white shadow rounded-lg">
                <p className="text-lg font-medium">Your Pending Tasks</p>
                <p className="text-3xl font-bold">{pendingTasks}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

