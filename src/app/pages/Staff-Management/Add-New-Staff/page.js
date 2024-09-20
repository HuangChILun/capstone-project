"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header/header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/HomeUi/tabs"
import { Label } from "@/app/components/HomeUi/label"
import { Input } from "@/app/components/HomeUi/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/HomeUi/select"
import { Button } from "@/app/components/HomeUi/button"
import Nav from '@/app/components/Navigation-Bar/NavBar';

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
      <h1 className="text-2xl font-bold mb-6 ">Add New Staff</h1>
      {/* the field for user to input TabsContent value="active for one tab the other value for the another tab*/ }
      <Tabs defaultValue="active" className="w-full">
        <TabsContent value="active">
          <form className="bg-white shadow-sm rounded-lg p-6">
            <fieldset>
              <legend className="text-lg font-semibold mb-4">Personal Information</legend>
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
                  <Label htmlFor="fscd-id">SIN</Label>
                  <Input id="fscd-id" placeholder="Input" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date Of Birth</Label>
                  <Input id="dob" type="date" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Role</Label>
                  <Input id="gender" placeholder="Input" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Licensing College</Label>
                  <Input id="age" type="number" placeholder="Input" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school">Registeration Number</Label>
                  <Input id="school" placeholder="Input" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Rate</Label>
                  <Input id="grade" placeholder="Input" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Input" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Input" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <Select>
                    <SelectTrigger id="province" className="w-full">
                      <SelectValue placeholder="AB" value="province1" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="province1">AB</SelectItem>
                      <SelectItem value="province2">BC</SelectItem>
                      <SelectItem value="province3">MB</SelectItem>
                      <SelectItem value="province4">NB</SelectItem>
                      <SelectItem value="province5">NL</SelectItem>
                      <SelectItem value="province6">NS</SelectItem>
                      <SelectItem value="province7">ON</SelectItem>
                      <SelectItem value="province8">PE</SelectItem>
                      <SelectItem value="province9">QC</SelectItem>
                      <SelectItem value="province10">SK</SelectItem>
                      <SelectItem value="province11">NT</SelectItem>
                      <SelectItem value="province12">YT</SelectItem>
                      <SelectItem value="province13">NU</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal-code">Postal Code</Label>
                  <Input id="postal-code" placeholder="Input" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input id="phone-number" type="tel" placeholder="Input" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Input" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contract">Contract</Label>
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