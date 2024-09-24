"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header/header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/HomeUi/tabs"
import Nav from '@/app/components/Navigation-Bar/NavBar';
import StaffRegistrationForm from '@/app/components/Add-Staff/StaffRegistrationForm';

export default function AddStaff() {
  const router = useRouter();

  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/');
    }
  }, [router]);

  const isAdmin = () => {
    return user?.isAdmin === 1;
  };

  return (
    <div className="flex h-screen">
      <Nav access={isAdmin} />
      <main className="flex-1 p-6 bg-white">
        <h1 className="text-2xl font-bold mb-6">Add New Staff</h1>
        <Tabs defaultValue="active" className="w-full">
          <TabsContent value="active">
            <StaffRegistrationForm />
          </TabsContent>
          <TabsContent value="waitlist">
            <p>Waitlist content goes here.</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}