"use client";

import React from 'react';
import { Label } from '@/app/components/HomeUi/label';
import { Input } from '@/app/components/HomeUi/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/HomeUi/select";
import { Button } from '@/app/components/HomeUi/button';

const GuardianForm = ({ guardianData, handleGuardianChange, handleGuardianSelectChange, handleSubmit, goBack }) => {
  return (
    <form className="bg-white shadow-sm rounded-lg p-6" onSubmit={handleSubmit}>
      <fieldset>
        <legend className="text-lg font-semibold mb-4">Guardian Information</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="guardianFirstName">First Name</Label>
            <Input
              id="guardianFirstName"
              name="firstName"
              placeholder="Input"
              className="w-full"
              value={guardianData.firstName}
              onChange={handleGuardianChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianLastName">Last Name</Label>
            <Input
              id="guardianLastName"
              name="lastName"
              placeholder="Input"
              className="w-full"
              value={guardianData.lastName}
              onChange={handleGuardianChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianBirthDate">Date Of Birth</Label>
            <Input
              id="guardianBirthDate"
              name="birthDate"
              type="date"
              className="w-full"
              value={guardianData.birthDate}
              onChange={handleGuardianChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianAddress">Address</Label>
            <Input
              id="guardianAddress"
              name="address"
              placeholder="Input"
              className="w-full"
              value={guardianData.address}
              onChange={handleGuardianChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianCity">City</Label>
            <Input
              id="guardianCity"
              name="city"
              placeholder="Input"
              className="w-full"
              value={guardianData.city}
              onChange={handleGuardianChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianProvince">Province</Label>
            <Select onValueChange={(value) => handleGuardianSelectChange('province', value)}>
              <SelectTrigger id="guardianProvince" className="w-full">
                <SelectValue placeholder={guardianData.province || "Select province"} />
              </SelectTrigger>
              <SelectContent>
                {/* Options for selecting province */}
                {["AB", "BC", "MB", "NB", "NL", "NS", "ON", "PE", "QC", "SK", "NT", "YT", "NU"].map((prov) => (
                  <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianPostalCode">Postal Code</Label>
            <Input
              id="guardianPostalCode"
              name="postalCode"
              placeholder="Input"
              className="w-full"
              value={guardianData.postalCode}
              onChange={handleGuardianChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianPhoneNumber">Phone Number</Label>
            <Input
              id="guardianPhoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="Input"
              className="w-full"
              value={guardianData.phoneNumber}
              onChange={handleGuardianChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianEmail">Email</Label>
            <Input
              id="guardianEmail"
              name="email"
              type="email"
              placeholder="Input"
              className="w-full"
              value={guardianData.email}
              onChange={handleGuardianChange}
            />
          </div>
        </div>
      </fieldset>
      <div className="mt-4 flex">
        <Button type="button" onClick={goBack} className="mr-2">Back</Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default GuardianForm;
