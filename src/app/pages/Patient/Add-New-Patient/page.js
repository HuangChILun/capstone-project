"use client"

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/pages/Patient/Add-New-Patient/tabs"
import AdminNav from "/src/components/Navigation-Bar/AdminNav.js"; // can't use {Nav} cause of bug
import ServiceProviderNav from "/src/components/Navigation-Bar/ServiceProviderNav.js"; // can't use {Nav} cause of bug
import { Label } from "@/app/pages/Patient/Add-New-Patient/label"
import { Input } from "@/app/pages/Patient/Add-New-Patient/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/pages/Patient/Add-New-Patient/select"
import { Button } from "@/app/pages/Patient/Add-New-Patient/button"
const user = JSON.parse(localStorage.getItem('user'));
export default function ImprovedAddNewPatient() {
  return (
    <div className="flex h-screen bg-gray-100">
    {user.role === "admin" ? <AdminNav /> : <ServiceProviderNav />} 
    <main className="flex-1 overflow-y-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Add New Patient</h1>
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active" className="px-4 py-2">Active</TabsTrigger>
          <TabsTrigger value="waitlist" className="px-4 py-2">Waitlist</TabsTrigger>
        </TabsList>
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
                  <Label htmlFor="fscd-id">FSCD ID#</Label>
                  <Input id="fscd-id" placeholder="Input" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date Of Birth</Label>
                  <Input id="dob" type="date" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input id="gender" placeholder="Input" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="Input" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school">School</Label>
                  <Input id="school" placeholder="Input" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
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
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="province1">Province 1</SelectItem>
                      <SelectItem value="province2">Province 2</SelectItem>
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
                <div className="space-y-2">
                  <Label htmlFor="consent">Consent</Label>
                  <Button variant="outline" className="w-full">Upload</Button>
                </div>
              </div>
            </fieldset>
            <Button type="submit" className="mt-6">Submit</Button>
          </form>
        </TabsContent>
        <TabsContent value="waitlist">
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
                  <Label htmlFor="fscd-id">FSCD ID#</Label>
                  <Input id="fscd-id" placeholder="Input" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date Of Birth</Label>
                  <Input id="dob" type="date" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input id="gender" placeholder="Input" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="Input" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school">School</Label>
                  <Input id="school" placeholder="Input" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
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
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="province1">Province 1</SelectItem>
                      <SelectItem value="province2">Province 2</SelectItem>
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
                <div className="space-y-2">
                  <Label htmlFor="consent">Consent</Label>
                  <Button variant="outline" className="w-full">Upload</Button>
                </div>
              </div>
            </fieldset>
            <Button type="submit" className="mt-6">Submit</Button>
          </form>
        </TabsContent>
      </Tabs>
    </main>
  </div>
  );
}