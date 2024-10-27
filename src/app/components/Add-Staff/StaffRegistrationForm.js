import React, { useState, useEffect } from "react";
import axios from "axios";
import { Label } from "@/app/components/HomeUi/label";
import { Input } from "@/app/components/HomeUi/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/components/HomeUi/select";
import { Button } from "@/app/components/HomeUi/button";
import Cookies from "js-cookie";

export default function StaffRegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: null,
    lastName: null,
    email: null,
    password: "12345",
    phoneNumber: null,
    address: null,
    postalCode: null,
    city: "Calgary",
    province: "AB",
    SIN: null,
    rate: null,
    isAdmin: "0",
    isOutsideProvider: "0",
    agency: "Bridging Abilities",
    beneficiary: null,
    licencingCollege: null,
    registrationNumber: null,
    contractStartDate: null,
    contractEndDate: null,
    role: null,
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [token, setToken] = useState("");
  const [formError, setFormError] = useState(null); // General form error
  const [disableButton, setDisableButton] = useState(true);

  // Regular expressions for validation
  const nameRegex = /^[A-Za-z'-\s]+$/;
  const sinRegex = /^\d{9}$/;
  const phoneRegex = /^\d{10}$/;
  const postalCodeRegex = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check for token on mount
  useEffect(() => {
    const storedToken = Cookies.get("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setFormError("No authentication token found. Please log in again.");
    }
  }, []);

  // Validation function for individual fields
  const validateField = (id, value) => {
    let error = "";
    switch (id) {
      case "firstName":
      case "lastName":
      case "role":
      case "licencingCollege":
      case "city":
        if (!nameRegex.test(value)) {
          error = "Only letters, hyphens(-), and apostrophes(') are allowed.";
        }
        break;
      case "SIN":
        if (!sinRegex.test(value)) {
          error = "SIN must be exactly 9 digits.";
        }
        break;
      case "phoneNumber":
        if (!phoneRegex.test(value)) {
          error = "Phone number must be exactly 10 digits.";
        }
        break;
      case "postalCode":
        if (!postalCodeRegex.test(value)) {
          error = "Postal code must follow A1A1A1 format.";
        }
        break;
      case "email":
        if (!emailRegex.test(value)) {
          error = "Please enter a valid email address.";
        }
        break;
      default:
        break;
    }

    // Set or remove validation error
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [id]: error,
    }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setFormData({
      ...formData,
      [id]: value,
    });

    // Validate field on change
    validateField(id, value);
  };

  const handleSelectChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Function to check if required fields are filled
  const areRequiredFieldsFilled = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "SIN",
      "address",
      "city",
      "province",
      "postalCode",
      "contractStartDate",
      "contractEndDate",
      "role",
      "rate",
    ];
    return requiredFields.every((field) => formData[field]);
  };

  // useEffect to monitor changes in formData and update button state
  useEffect(() => {
    setDisableButton(!areRequiredFieldsFilled());
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for validation errors
    const hasErrors = Object.values(validationErrors).some((error) => error);
    if (hasErrors) {
      alert("Please check all fields before submitting.");
      return;
    }

    if (!token) {
      setFormError("No authentication token available. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      alert("Successfully registered the staff");
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response) {
        console.log(error.response);
        if (error.response.status === 403) {
          setFormError(
            "Access forbidden. Your session may have expired or you may not have the necessary permissions."
          );
        } else {
          if(error.response.data.errno === 1062){
            setFormError(
              "Duplicate User, Please Check Email Field"
          )} else{
            setFormError(
              `Error: ${
                error.response.data.sqlMessage
              }`
            );
          }
          
        }
      } else if (error.request) {
        setFormError(
          "No response received from the server. Please try again later."
        );
      } else {
        setFormError("Error setting up the request. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
      <fieldset>
        <legend className="text-lg font-semibold mb-4">
          Personal Information
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name*</Label>
            {/*if the black was too long, className="w-fsll" can set w-64*/}
            <Input
              id="firstName"
              placeholder="Input"
              className="w-full"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            {validationErrors.firstName && (
              <p style={{ color: "red" }}>{validationErrors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name*</Label>
            <Input
              id="lastName"
              placeholder="Input"
              className="w-full"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            {validationErrors.lastName && (
              <p style={{ color: "red" }}>{validationErrors.lastName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="SIN">SIN*</Label>
            <Input
              id="SIN"
              placeholder="Input"
              className="w-full"
              value={formData.SIN}
              onChange={handleInputChange}
            />
            {validationErrors.SIN && (
              <p style={{ color: "red" }}>{validationErrors.SIN}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role*</Label>
            <Input
              id="role"
              placeholder="Input"
              className="w-full"
              value={formData.role}
              onChange={handleInputChange}
            />
            {validationErrors.role && (
              <p style={{ color: "red" }}>{validationErrors.role}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="licencingCollege">Licensing College</Label>
            <Input
              id="licencingCollege"
              placeholder="Input"
              className="w-full"
              value={formData.licencingCollege}
              onChange={handleInputChange}
            />
            {validationErrors.licencingCollege && (
              <p style={{ color: "red" }}>
                {validationErrors.licencingCollege}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input
              id="registrationNumber"
              placeholder="Input"
              className="w-full"
              value={formData.registrationNumber}
              onChange={handleInputChange}
            />
            {validationErrors.registrationNumber && (
              <p style={{ color: "red" }}>
                {validationErrors.registrationNumber}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate">Rate*</Label>
            <Input
              id="rate"
              placeholder="Input"
              className="w-full"
              value={formData.rate}
              onChange={handleInputChange}
            />
            {validationErrors.rate && (
              <p style={{ color: "red" }}>{validationErrors.rate}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address*</Label>
            <Input
              id="address"
              placeholder="Input"
              className="w-full"
              value={formData.address}
              onChange={handleInputChange}
            />
            {validationErrors.address && (
              <p style={{ color: "red" }}>{validationErrors.address}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City*</Label>
            <Input
              id="city"
              placeholder="Input"
              className="w-full"
              value={formData.city}
              onChange={handleInputChange}
            />
            {validationErrors.city && (
              <p style={{ color: "red" }}>{validationErrors.city}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="province">Province*</Label>
            <Select
              value={formData.province}
              onValueChange={(value) => handleSelectChange("province", value)}
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
            {validationErrors.province && (
              <p style={{ color: "red" }}>{validationErrors.province}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code*</Label>
            <Input
              id="postalCode"
              placeholder="Input"
              className="w-full"
              value={formData.postalCode}
              onChange={handleInputChange}
            />
            {validationErrors.postalCode && (
              <p style={{ color: "red" }}>{validationErrors.postalCode}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number*</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Input"
              className="w-full"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
            {validationErrors.phoneNumber && (
              <p style={{ color: "red" }}>{validationErrors.phoneNumber}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email*</Label>
            <Input
              id="email"
              type="email"
              placeholder="Input"
              className="w-full"
              value={formData.email}
              onChange={handleInputChange}
            />
            {validationErrors.email && (
              <p style={{ color: "red" }}>{validationErrors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="isAdmin">Is Admin*</Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, isAdmin: value })
              }
            >
              <SelectTrigger id="isAdmin" className="w-full">
                <SelectValue placeholder="Select Admin Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Yes</SelectItem>
                <SelectItem value="0">No</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.isAdmin && (
              <p style={{ color: "red" }}>{validationErrors.isAdmin}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="beneficiary">Beneficiary</Label>
            <Input
              id="beneficiary"
              placeholder="Input"
              className="w-full"
              value={formData.beneficiary}
              onChange={handleInputChange}
            />
            {validationErrors.beneficiary && (
              <p style={{ color: "red" }}>{validationErrors.beneficiary}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractStartDate">Contract Start Date*</Label>
            <Input
              id="contractStartDate"
              type="date"
              placeholder="Input"
              className="w-full"
              value={formData.contractStartDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractEndDate">Contract End Date*</Label>
            <Input
              id="contractEndDate"
              type="date"
              placeholder="Input"
              className="w-full"
              value={formData.contractEndDate}
              onChange={handleInputChange}
              min={formData.contractStartDate}
            />
          </div>
        </div>
      </fieldset>
      {formError && <div className="text-red-500 mb-4">{formError}</div>}
      <Button type="submit" className="mt-6" disabled={disableButton}>
        Submit
      </Button>
    </form>
  );
}
