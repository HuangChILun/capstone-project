"use client"

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/pages/invoice-management/Add-Invoice/tabs"
import Nav from "@/components/Navigation-Bar/nav";
import { Label } from "@/app/pages/invoice-management/Add-Invoice/label"
import { Input } from "@/app/pages/invoice-management/Add-Invoice/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/pages/invoice-management/Add-Invoice/select"
import { Button } from "@/app/pages/invoice-management/Add-Invoice/button"

export default function ImprovedAddNewPatient() {
  return (
    <div className="flex h-screen bg-gray-100">
    <Nav className="w-64 bg-white shadow-md" />
    <main className="flex-1 overflow-y-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Add New Invoice</h1>
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
                  <Label htmlFor="email">Hours</Label>
                  <Input id="email" type="email" placeholder="Input" className="w-full" />
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