"use client"

import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/compat/router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/HomeUi/tabs";
import { Label } from '@/app/components/HomeUi/label';
import { Input } from '@/app/components/HomeUi/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/HomeUi/select";
import { Button } from '@/app/components/HomeUi/button';
import Nav from '@/app/components/Navigation-Bar/NavBar';

export default function ImprovedAddNewPatient() {
  const router = useRouter();
  const token = Cookies.get('token');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    address: '',
    city: '',
    province: '',
    postalCode: '', 
    phoneNumber: '',
    email: '',
    school: '',
    age: '',  
    fscdIdNum: '',
    contractId: '',
    guardianId: '',
    //grade: '',
  });

  if (!token) {
    router.push('/');
    console.log("need login");
    return;
  }

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = () => {
    return user?.isAdmin === 1;
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/patient/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Patient added successfully!');
        router.push('/View-Patient-Page'); // Redirect to patient list page
      } else {
        alert('Failed to add patient');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the patient');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Nav access={isAdmin} />
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Add New Patient</h1>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="active" className="px-4 py-2">Active</TabsTrigger>
            <TabsTrigger value="waitlist" className="px-4 py-2">Waitlist</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <form className="bg-white shadow-sm rounded-lg p-6" onSubmit={handleSubmit}>
              <fieldset>
                <legend className="text-lg font-semibold mb-4">Personal Information</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Input" className="w-full" value={formData.firstName} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Input" className="w-full" value={formData.lastName} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fscdIdNum">FSCD ID#</Label>
                    <Input id="fscdIdNum" placeholder="Input" className="w-full" value={formData.fscdIdNum} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Date Of Birth</Label>
                    <Input id="birthDate" type="date" className="w-full" value={formData.birthDate} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Input id="gender" placeholder="Input" className="w-full" value={formData.gender} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" type="number" placeholder="Input" className="w-full" value={formData.age} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school">School</Label>
                    <Input id="school" placeholder="Input" className="w-full" value={formData.school} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade</Label>
                    <Input id="grade" placeholder="Input" className="w-full" value={formData.grade} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Input" className="w-full" value={formData.address} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Input" className="w-full" value={formData.city} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label value="AB"htmlFor="province">Province</Label>
                    <Select>
                      <SelectTrigger id="province" className="w-full">
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AB">AB</SelectItem>
                        <SelectItem value="BC">BC</SelectItem>
                        <SelectItem value="MB">MB</SelectItem>
                        <SelectItem value="NB">NB</SelectItem>
                        <SelectItem value="NL">NL</SelectItem>
                        <SelectItem value="NS">NS</SelectItem>
                        <SelectItem value="ON">ON</SelectItem>
                        <SelectItem value="PE">PE</SelectItem>
                        <SelectItem value="QC">QC</SelectItem>
                        <SelectItem value="SK">SK</SelectItem>
                        <SelectItem value="NT">NT</SelectItem>
                        <SelectItem value="YT">YT</SelectItem>
                        <SelectItem value="NU">NU</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" placeholder="Input" className="w-full" value={formData.postalCode} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" type="tel" placeholder="Input" className="w-full" value={formData.phoneNumber} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Input" className="w-full" value={formData.email} onChange={handleChange} />
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
