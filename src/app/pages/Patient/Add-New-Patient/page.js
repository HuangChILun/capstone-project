"use client"

import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/compat/router';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/HomeUi/tabs";
import { Label } from '@/app/components/HomeUi/label';
import { Input } from '@/app/components/HomeUi/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/HomeUi/select";
import { Button } from '@/app/components/HomeUi/button';
import HoriNav from '@/app/components/Navigation-Bar/HoriNav';
import GuardianForm from '@/app/components/Add-Patient/GuardianForm';

export default function ImprovedAddNewPatient() {
  const router = useRouter();
  const token = Cookies.get('token');
  
  // State to store the form data
  const [formData, setFormData] = useState({
    psNote: '',
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
    currentStatus: true,
    age: "",
    fscdIdNum: '',
    contractId: '',
    guardianId: '',
    grade: '',
  });

  // State to control the form step (personal info or guardian info)
  const [step, setStep] = useState(1); // Step 1 is the default for personal information

  // Redirect if the token is not present (i.e., user not logged in)
  if (!token) {
    router.push('/');
    console.log("need login");
    return;
  }

  const user = JSON.parse(localStorage.getItem('user'));

  // Function to handle input changes and update form data
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handles personal info form submission and moves to the next step
  const handleSubmitPersonalInfo = (e) => {
    e.preventDefault();
    setStep(2); // Proceed to Step 2 for guardian information
  };

  // Handles submission of the full form including personal and guardian information
  const handleSubmitGuardianInfo = async (e) => {
    e.preventDefault();
    
    try {
      // Sending patient data to the backend server
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/patient/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      // Handling the response after submission
      if (response.ok) {
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
      {/* Horizontal Navigation Bar */}
      <HoriNav user={user} />
      
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Add New Patient</h1>

        {/* Tabbed layout for Active/Waitlist sections */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="active" className="px-4 py-2">Active</TabsTrigger>
            <TabsTrigger value="waitlist" className="px-4 py-2">Waitlist</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {/* Step 1: Personal Information Form */}
            {step === 1 && (
              <form className="bg-white shadow-sm rounded-lg p-6" onSubmit={handleSubmitPersonalInfo}>
                <fieldset>
                  <legend className="text-lg font-semibold mb-4">Personal Information</legend>

                  {/* Personal Information Fields */}
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
                      <Label htmlFor="province">Province</Label>
                      <Select>
                        <SelectTrigger id="province" className="w-full">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Options for selecting province */}
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
                    <div className="space-y-2">
                      <Label htmlFor="psNote">Note</Label>
                      <Input id="psNote" placeholder="note" className="w-full" value={formData.psNote} onChange={handleChange} />
                    </div>
                  </div>
                </fieldset>
                <Button type="submit" className="mt-4">Next: Guardian Info</Button>
              </form>
            )}

            {/* Step 2: Guardian Information Form */}
            {step === 2 && <GuardianForm formData={formData} setFormData={setFormData} handleSubmit={handleSubmitGuardianInfo} />}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
