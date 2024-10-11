// components/GuardianForm.js
import React from 'react';
import { Label } from '@/app/components/HomeUi/label';
import { Input } from '@/app/components/HomeUi/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/HomeUi/select";
import { Button } from '../HomeUi/button';
const GuardianForm = ({ formData, handleChange }) => {
  return (
    <form className="bg-white shadow-sm rounded-lg p-6">
      <fieldset>
        <legend className="text-lg font-semibold mb-4">Guardian Information</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="guardianFirstName">First Name</Label>
            <Input id="guardianFirstName" placeholder="Input" className="w-full" value={formData.firstName} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianLastName">Last Name</Label>
            <Input id="guardianLastName" placeholder="Input" className="w-full" value={formData.lastName} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianBirthDate">Date Of Birth</Label>
            <Input id="guardianBirthDate" type="date" className="w-full" value={formData.birthDate} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianGender">Gender</Label>
            <Input id="guardianGender" placeholder="Input" className="w-full" value={formData.gender} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianAge">Age</Label>
            <Input id="guardianAge" type="number" placeholder="Input" className="w-full" value={formData.age} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianAddress">Address</Label>
            <Input id="guardianAddress" placeholder="Input" className="w-full" value={formData.address} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianCity">City</Label>
            <Input id="guardianCity" placeholder="Input" className="w-full" value={formData.city} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianProvince">Province</Label>
            <Select>
              <SelectTrigger id="guardianProvince" className="w-full">
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
            <Label htmlFor="guardianPostalCode">Postal Code</Label>
            <Input id="guardianPostalCode" placeholder="Input" className="w-full" value={formData.postalCode} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianPhoneNumber">Phone Number</Label>
            <Input id="guardianPhoneNumber" type="tel" placeholder="Input" className="w-full" value={formData.phoneNumber} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianEmail">Email</Label>
            <Input id="guardianEmail" type="email" placeholder="Input" className="w-full" value={formData.email} onChange={handleChange} />
          </div>
        </div>
      </fieldset>
      <Button type="submit" className="mt-4">Submit</Button>
    </form>
  );
};

export default GuardianForm;
