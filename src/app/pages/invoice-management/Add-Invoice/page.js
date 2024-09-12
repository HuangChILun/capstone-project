"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/pages/invoice-management/Add-Invoice/tabs"
import AdminNav from "/src/components/Navigation-Bar/AdminNav.js";
import ServiceProviderNav from "/src/components/Navigation-Bar/ServiceProviderNav.js";
import Header from '@/components/Header/header';
import { Label } from "@/app/pages/invoice-management/Add-Invoice/label"
import { Input } from "@/app/pages/invoice-management/Add-Invoice/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/pages/invoice-management/Add-Invoice/select"
import { Button } from "@/app/pages/invoice-management/Add-Invoice/button"

export default function ImprovedAddNewPatient() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!user) {
    return null; // or a loading indicator
  }

  const isAdmin = user.role === "admin";
  const isServiceProvider = user.role === "service_provider";

  return (
    <div className="flex h-screen bg-gray-100">
      {isAdmin ? <AdminNav /> : <ServiceProviderNav />}
      <main className="flex-1 overflow-y-auto p-8">
        <Header user={user} />
        <h1 className="text-2xl font-bold mb-6 mt-6">Add New Invoice</h1>
        <Tabs defaultValue="active" className="w-full">
          <TabsContent value="active">
            <form className="bg-white shadow-sm rounded-lg p-6">
              <fieldset>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Role</Label>
                    <Input id="gender" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Rate</Label>
                    <Input id="grade" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hours">Hours</Label>
                    <Input id="hours" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract">Timesheet</Label>
                    <Button variant="outline" className="w-full">Upload</Button>
                  </div>
                </div>
              </fieldset>
              <Button type="submit" className="mt-6">Submit</Button>
            </form>
          </TabsContent>
          <TabsContent value="waitlist">
            <p>Waitlist content goes here.</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}