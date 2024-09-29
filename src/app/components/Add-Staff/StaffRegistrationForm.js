import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Label } from "@/app/components/HomeUi/label";
import { Input } from "@/app/components/HomeUi/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/HomeUi/select";
import { Button } from "@/app/components/HomeUi/button";
import Cookies from 'js-cookie';

export default function StaffRegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'Bridging',
    phoneNumber: '',
    address: '',
    postalCode: '',
    city: '',
    province: 'province1',
    SIN: '',
    rate: '',
    isAdmin: '0',
    isOutsideProvider: '0',
    agency: 'Bridging Abilities',
    beneficiary: '',
    licencingCollege: '',
    registrationNumber: '',
    contractStartDate: '',
    contractEndDate: '',
    role: ''
  });

  const [token, setToken] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setError('No authentication token found. Please log in again.');
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('No authentication token available. Please log in again.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/auth/register`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      // Handle successful registration, e.g., show success message or redirect
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        if (error.response.status === 403) {
          setError('Access forbidden. Your session may have expired or you may not have the necessary permissions.');
        } else {
          setError(`Error: ${error.response.data.message || 'An unknown error occurred'}`);
        }
      } else if (error.request) {
        setError('No response received from the server. Please try again later.');
      } else {
        setError('Error setting up the request. Please try again.');
      }
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
            <Label htmlFor="SIN">SIN</Label>
            <Input id="SIN" placeholder="Input" className="w-full" value={formData.SIN} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" placeholder="Input" className="w-full" value={formData.role} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licencingCollege">Licensing College</Label>
            <Input id="licencingCollege" placeholder="Input" className="w-full" value={formData.licencingCollege} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number</Label>
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
            <Select onValueChange={(value) => setFormData({ ...formData, province: value })}>
              <SelectTrigger id="province" className="w-full">
                <SelectValue placeholder="Select Province" />
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
            <Label htmlFor="isAdmin">Is Admin</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, isAdmin: value })}>
              <SelectTrigger id="isAdmin" className="w-full">
                <SelectValue placeholder="Select Admin Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Yes</SelectItem>
                <SelectItem value="0">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="isOutsideProvider">Is Outside Provider</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, isOutsideProvider: value })}>
              <SelectTrigger id="isOutsideProvider" className="w-full">
                <SelectValue placeholder="Select Provider Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Yes</SelectItem>
                <SelectItem value="0">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="beneficiary">Beneficiary</Label>
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
        </div>
      </fieldset>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Button type="submit" className="mt-6" disabled={!token}>Submit</Button>
    </form>
  );
}