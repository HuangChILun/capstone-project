import React, { useState } from 'react';
import axios from 'axios';
import { Label } from "@/app/components/HomeUi/label";
import { Input } from "@/app/components/HomeUi/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/HomeUi/select";
import { Button } from "@/app/components/HomeUi/button";

export default function StaffRegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password:'Bridging',
    phoneNumber: '',
    address: '',
    postalCode: '',
    city: '',
    province: 'province1',
    rate: '',
    isAdmin: '0',
    isOutsideProvider: '0',
    agency: 'Bridging Abilities',
    sin: '',
    role: '',
    licensingCollege: '',
    registrationNumber: '',
    beneficiary: '',
    contractStartDate: '',
    contractEndDate: '',
  });

  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, contract: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_IP}/auth/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      // Handle successful registration, such as redirecting the user or displaying a success message
    } catch (error) {
      console.error(error);
      setError('There was an error submitting the form. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
      <fieldset>
        <legend className="text-lg font-semibold mb-4">Personal Information</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="Input" className="w-full" value={formData.firstName} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Input" className="w-full" value={formData.lastName} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sin">SIN</Label>
            <Input id="sin" placeholder="Input" className="w-full" value={formData.sin} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" placeholder="Input" className="w-full" value={formData.role} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licensingCollege">Licensing College</Label>
            <Input id="licensingCollege" placeholder="Input" className="w-full" value={formData.licensingCollege} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registeration Number</Label>
            <Input id="registrationNumber" placeholder="Input" className="w-full" value={formData.registrationNumber} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate">Rate</Label>
            <Input id="rate" placeholder="Input" className="w-full" value={formData.rate} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="Input" className="w-full" value={formData.address} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="Input" className="w-full" value={formData.city} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="province">Province</Label>
            <Select>
              <SelectTrigger id="province" className="w-full">
                <SelectValue placeholder="AB" value={formData.province} />
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
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input id="postalCode" placeholder="Input" className="w-full" value={formData.postalCode} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" type="tel" placeholder="Input" className="w-full" value={formData.phoneNumber} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Input" className="w-full" value={formData.email} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="isAdmin">isAdmin 1 for admin, 0 for not admin</Label>
            <Select>
              <SelectTrigger id="isAdmin" className="w-full">
                <SelectValue placeholder="0" value={formData.isAdmin} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="isAdmin1">1</SelectItem>
                <SelectItem value="isAdmin0">0</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="beneficiary">beneficiary</Label>
            <Input id="beneficiary" placeholder="Input" className="w-full" value={formData.beneficiary} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractStartDate">Contract Start Date</Label>
            <Input id="contractStartDate" type="date" placeholder="Input" className="w-full" value={formData.contractStartDate} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractEndDate">Contract End Date</Label>
            <Input id="contractEndDate" type="date" placeholder="Input" className="w-full" value={formData.contractEndDate} onChange={handleInputChange} />
          </div>
          {/*
          <div className="space-y-2">
            <Label htmlFor="contract">Contract</Label>
            <Button variant="outline" className="w-full" onClick={() => document.getElementById('contract').click()}>
              Upload
            </Button>
            <input id="contract" type="file" className="hidden" onChange={handleFileChange} />
          </div>
          */}
        </div>
      </fieldset>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Button type="submit" className="mt-6">Submit</Button>
    </form>
  );
}