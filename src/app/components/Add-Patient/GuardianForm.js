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
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Input"
              className="w-full"
              value={guardianData.firstName}
              onChange={handleGuardianChange}
            />
          </div>
          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Input"
              className="w-full"
              value={guardianData.lastName}
              onChange={handleGuardianChange}
            />
          </div>
          {/* Relationship */}
          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Input
              id="relationship"
              name="relationship"
              placeholder="Input"
              className="w-full"
              value={guardianData.relationship}
              onChange={handleGuardianChange}
            />
          </div>
          {/* Custody */}
          <div className="space-y-2">
            <Label htmlFor="custody">Custody</Label>
            <Select onValueChange={(value) => handleGuardianSelectChange('custody', value)}>
              <SelectTrigger id="custody" className="w-full">
                <SelectValue placeholder={guardianData.custody || "Select custody"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="living together">Living Together</SelectItem>
                <SelectItem value="joint custody">Joint Custody</SelectItem>
                <SelectItem value="sole custody">Sole Custody</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Input"
              className="w-full"
              value={guardianData.phoneNumber}
              onChange={handleGuardianChange}
            />
          </div>
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="Input"
              className="w-full"
              value={guardianData.email}
              onChange={handleGuardianChange}
            />
          </div>
          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="Input"
              className="w-full"
              value={guardianData.address}
              onChange={handleGuardianChange}
            />
          </div>
          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              placeholder="Input"
              className="w-full"
              value={guardianData.city}
              onChange={handleGuardianChange}
            />
          </div>
          {/* Province */}
          <div className="space-y-2">
            <Label htmlFor="province">Province</Label>
            <Select onValueChange={(value) => handleGuardianSelectChange('province', value)}>
              <SelectTrigger id="province" className="w-full">
                <SelectValue placeholder={guardianData.province || "Select province"} />
              </SelectTrigger>
              <SelectContent>
                {["AB", "BC", "MB", "NB", "NL", "NS", "ON", "PE", "QC", "SK", "NT", "YT", "NU"].map((prov) => (
                  <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Postal Code */}
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              placeholder="Input"
              className="w-full"
              value={guardianData.postalCode}
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
