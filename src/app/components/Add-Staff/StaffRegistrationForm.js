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
    password: '12345',
    phoneNumber: '',
    address: '',
    postalCode: '',
    city: '',
    province: 'AB',
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

  const [validationErrors, setValidationErrors] = useState({});
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

  const validateField = (id, value) => {
    if (!value.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        [id]: `${id.replace(/([A-Z])/g, ' $1')} cannot be empty`,
      }));
    } else {
      setValidationErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    validateField(id, value);
  };

  const handleSelectChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
    validateField(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('No authentication token available. Please log in again.');
      return;
    }

    if (Object.keys(validationErrors).length > 0) {
      setError('Please fix all errors before submitting.');
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
      setError("Successfully registered the staff");
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        if (error.response.status === 403) {
          setError('Access forbidden. Your session may have expired or you may not have the necessary permissions.');
        } else {
          setError(`Error: ${error.response.data.message || 'The field cannot be empty, and some fields must not exceed the maximum word length.'}`);
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
            {/*if the black was too long, className="w-fsll" can set w-64*/}
            <Input id="firstName" placeholder="Input" className="w-full" value={formData.firstName} onChange={handleInputChange} />
            {validationErrors.firstName && <p className="text-red-500">{validationErrors.firstName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Input" className="w-full" value={formData.lastName} onChange={handleInputChange} />
            {validationErrors.lastName && <p className="text-red-500">{validationErrors.lastName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="SIN">SIN</Label>
            <Input id="SIN" placeholder="Input" className="w-full" value={formData.SIN} onChange={handleInputChange} />
            {validationErrors.SIN && <p className="text-red-500">{validationErrors.SIN}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" placeholder="Input" className="w-full" value={formData.role} onChange={handleInputChange} />
            {validationErrors.role && <p className="text-red-500">{validationErrors.role}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="licencingCollege">Licensing College</Label>
            <Input id="licencingCollege" placeholder="Input" className="w-full" value={formData.licencingCollege} onChange={handleInputChange} />
            {validationErrors.licencingCollege && <p className="text-red-500">{validationErrors.licencingCollege}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input id="registrationNumber" placeholder="Input" className="w-full" value={formData.registrationNumber} onChange={handleInputChange} />
            {validationErrors.registrationNumber && <p className="text-red-500">{validationErrors.registrationNumber}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate">Rate</Label>
            <Input id="rate" placeholder="Input" className="w-full" value={formData.rate} onChange={handleInputChange} />
            {validationErrors.rate && <p className="text-red-500">{validationErrors.rate}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="Input" className="w-full" value={formData.address} onChange={handleInputChange} />
            {validationErrors.address && <p className="text-red-500">{validationErrors.address}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="Input" className="w-full" value={formData.city} onChange={handleInputChange} />
            {validationErrors.city && <p className="text-red-500">{validationErrors.city}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="province">Province</Label>
            <Select 
              value={formData.province}
              onValueChange={(value) => handleSelectChange('province', value)}
            >
              <SelectTrigger id="province" className="w-full">
                <SelectValue placeholder="Select Province" />
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
            {validationErrors.province && <p className="text-red-500">{validationErrors.province}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input id="postalCode" placeholder="Input" className="w-full" value={formData.postalCode} onChange={handleInputChange} />
            {validationErrors.postalCode && <p className="text-red-500">{validationErrors.postalCode}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" type="tel" placeholder="Input" className="w-full" value={formData.phoneNumber} onChange={handleInputChange} />
            {validationErrors.phoneNumber && <p className="text-red-500">{validationErrors.phoneNumber}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Input" className="w-full" value={formData.email} onChange={handleInputChange} />
            {validationErrors.email && <p className="text-red-500">{validationErrors.email}</p>}
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
            {validationErrors.isAdmin && <p className="text-red-500">{validationErrors.isAdmin}</p>}
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
            {validationErrors.isOutsideProvider && <p className="text-red-500">{validationErrors.isOutsideProvider}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="beneficiary">Beneficiary</Label>
            <Input id="beneficiary" placeholder="Input" className="w-full" value={formData.beneficiary} onChange={handleInputChange} />
            {validationErrors.beneficiary && <p className="text-red-500">{validationErrors.beneficiary}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractStartDate">Contract Start Date</Label>
            <Input id="contractStartDate" type="date" placeholder="Input" className="w-full" value={formData.contractStartDate} onChange={handleInputChange} />
            {validationErrors.contractStartDate && <p className="text-red-500">{validationErrors.contractStartDate}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractEndDate">Contract End Date</Label>
            <Input id="contractEndDate" type="date" placeholder="Input" className="w-full" value={formData.contractEndDate} onChange={handleInputChange} />
            {validationErrors.contractEndDate && <p className="text-red-500">{validationErrors.contractEndDate}</p>}
          </div>
        </div>
      </fieldset>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Button type="submit" className="mt-6" disabled={!token || Object.keys(validationErrors).length > 0}>Submit</Button>
    </form>
  );
}
