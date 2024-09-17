"use client"

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/pages/Patient/Add-New-Patient/tabs"
import AdminNav from "/src/components/Navigation-Bar/AdminNav.js"; // can't use {Nav} cause of bug
import ServiceProviderNav from "/src/app/components/Navigation-Bar/ServiceProviderNav.js"; // can't use {Nav} cause of bug
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

            <fieldset className="mt-6">
                <legend className="text-lg font-semibold mb-4">Primary Guardian</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pg-name">Name</Label>
                    <Input id="pg-name" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pg-relation">Relation to Patient</Label>
                    <Input id="pg-relation" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pg-address">Address</Label>
                    <Input id="pg-address" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pg-city">City</Label>
                    <Input id="pg-city" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pg-province">Province</Label>
                    <Select>
                      <SelectTrigger id="pg-province" className="w-full">
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="province1">Province 1</SelectItem>
                        <SelectItem value="province2">Province 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pg-postal-code">Postal Code</Label>
                    <Input id="pg-postal-code" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pg-phone">Phone Number</Label>
                    <Input id="pg-phone" type="tel" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pg-email">Email</Label>
                    <Input id="pg-email" type="email" placeholder="Input" className="w-full" />
                  </div>
                </div>
              </fieldset>

              <fieldset className="mt-6">
                <legend className="text-lg font-semibold mb-4">Secondary Guardian</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pg-name">Name</Label>
                    <Input id="pg-name" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pg-relation">Relation to Patient</Label>
                    <Input id="pg-relation" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pg-address">Address</Label>
                    <Input id="pg-address" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pg-city">City</Label>
                    <Input id="pg-city" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pg-province">Province</Label>
                    <Select>
                      <SelectTrigger id="pg-province" className="w-full">
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="province1">Province 1</SelectItem>
                        <SelectItem value="province2">Province 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pg-postal-code">Postal Code</Label>
                    <Input id="pg-postal-code" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pg-phone">Phone Number</Label>
                    <Input id="pg-phone" type="tel" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pg-email">Email</Label>
                    <Input id="pg-email" type="email" placeholder="Input" className="w-full" />
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

            <fieldset className="mt-6">
                <legend className="text-lg font-semibold mb-4">Service Information</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="case-worker-name">Case Worker Name</Label>
                    <Input id="case-worker-name" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service-type">Service Type</Label>
                    <Select>
                      <SelectTrigger id="service-type" className="w-full">
                        <SelectValue placeholder="Select Service Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="type1">Type 1</SelectItem>
                        <SelectItem value="type2">Type 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service-providers-needed">Service Providers Needed</Label>
                    <Select>
                      <SelectTrigger id="service-providers-needed" className="w-full">
                        <SelectValue placeholder="Select Service Providers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="provider1">Provider 1</SelectItem>
                        <SelectItem value="provider2">Provider 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location-of-service">Location of Service</Label>
                    <Select>
                      <SelectTrigger id="location-of-service" className="w-full">
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="location1">Location 1</SelectItem>
                        <SelectItem value="location2">Location 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fees-discussed">Fees Discussed</Label>
                    <Input id="fees-discussed" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="previous-services">Previous Services</Label>
                    <Input id="previous-services" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="concerns">Concerns</Label>
                    <Input id="concerns" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="follow-up-actions">Follow-up Actions</Label>
                    <Input id="follow-up-actions" placeholder="Input" className="w-full" />
                  </div>
                </div>
              </fieldset>

              <fieldset className="mt-6">
                <legend className="text-lg font-semibold mb-4">Waitlist Information</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="waitlist-date">Waitlist Date</Label>
                    <Input id="waitlist-date" type="date" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-date">Contact Date</Label>
                    <Input id="contact-date" type="date" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consultation-booked-date">Consultation Booked Date</Label>
                    <Input id="consultation-booked-date" type="date" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service-offered-date">Service Offered Date</Label>
                    <Input id="service-offered-date" type="date" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="available-next-meeting">Available Next Meeting</Label>
                    <Input id="available-next-meeting" type="date" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paperwork-deadline">Paperwork Deadline</Label>
                    <Input id="paperwork-deadline" type="date" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referred-from">Referred From</Label>
                    <Select>
                      <SelectTrigger id="referred-from" className="w-full">
                        <SelectValue placeholder="Select Referral" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="referral1">Referral 1</SelectItem>
                        <SelectItem value="referral2">Referral 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="community">Community</Label>
                    <Input id="community" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="funding-sources">Funding Sources</Label>
                    <Select>
                      <SelectTrigger id="funding-sources" className="w-full">
                        <SelectValue placeholder="Select Funding Sources" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="source1">Source 1</SelectItem>
                        <SelectItem value="source2">Source 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service-needed">Service Needed</Label>
                    <Input id="service-needed" placeholder="Input" className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consult-history">Consult History</Label>
                    <Input id="consult-history" placeholder="Input" className="w-full" />
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