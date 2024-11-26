"use client";

import React, { useEffect, useState } from "react";
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

export default function GuardianForm({ SendGuardian, clientData, primary }) {
  const [guardianData, setGuardianData] = useState({
    custody: "",
    firstName: "",
    lastName: "",
    relationship: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "Calgary",
    province: "AB",
    postalCode: "",
  });
  const [noGuardian, setNoGuardian] = useState(false);
  const [sameAsClient, setSameAsClient] = useState({
    address: false,
    phoneNumber: false,
    email: false,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [disableButton, setDisableButton] = useState(true);

  // Regular expressions for validation
  const nameRegex = /^[A-Za-z'-\s]+$/;
  const phoneRegex = /^\d{10}$/;
  const postalCodeRegex = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setGuardianData({
      ...guardianData,
      [id]: value,
    });

    // Validate field on change
    validateField(id, value);
  };
  const handleSelectChange = (field, value) => {
    setGuardianData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handleCheckboxChange = (field) => {
    setSameAsClient((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const validateField = (id, value) => {
    let error = "";
    switch (id) {
      case "firstName":
      case "lastName":
      case "relationship":
      case "custody":
      case "city":
        if (!nameRegex.test(value)) {
          error = "Only letters, hyphens(-), and apostrophes(') are allowed.";
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

  // Function to check if required fields are filled
  const areRequiredFieldsFilled = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "custody",
      "relationship",
      "email",
      "phoneNumber",
      "address",
      "city",
      "province",
      "postalCode",
    ];
    return requiredFields.every((field) => guardianData[field]);
  };

  // useEffect to monitor changes in guardianData and update button state
  useEffect(() => {
    if (noGuardian) {
      setDisableButton(false); // Enable the button if no guardian
    } else {
      setDisableButton(!areRequiredFieldsFilled());
    }
  }, [guardianData, noGuardian]);
  // Monitor check box to autofill fields based on clientData
  useEffect(() => {
    if (sameAsClient.address) {
      setGuardianData((prevData) => ({
        ...prevData,
        address: clientData.address || "",
        city: clientData.city || "",
        province: clientData.province || "AB",
        postalCode: clientData.postalCode || "",
      }));
      // Clear validation errors for autofilled fields
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        address: "",
        city: "",
        province: "",
        postalCode: "",
      }));
    }
    if (sameAsClient.phoneNumber) {
      setGuardianData((prevData) => ({
        ...prevData,
        phoneNumber: clientData.phoneNumber || "",
      }));
      //Clear validation errors when autofilled
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "",
      }));
    }
    if (sameAsClient.email) {
      setGuardianData((prevData) => ({
        ...prevData,
        email: clientData.email || "",
      }));
      //clear validation erros when autofilled
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        email: "",
      }));
    }
  }, [sameAsClient, clientData]);
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (noGuardian) {
      SendGuardian(null);
    } else {
      if (!noGuardian) {
        const hasErrors = Object.values(validationErrors).some(
          (error) => error
        );
        if (hasErrors) {
          alert("Please check all fields before submitting.");
          return;
        }
      }
      console.log("Form Submitted:", guardianData);
      SendGuardian(guardianData);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <fieldset style={styles.card}>
        <div style={styles.sectionHeader}>
          {primary
            ? "Primary Guardian Information"
            : "Secondary Guardian Information"}
        </div>
        <div style={styles.formContainer}>
        {/* Checkbox for no guardian */}
        {primary && (
          <div style={styles.fullWidth}>
            <label>
              <input
                type="checkbox"
                checked={noGuardian}
                onChange={() => setNoGuardian(!noGuardian)}
              />
              This client does not have a guardian
            </label>
          </div>
        )}
        {!primary && (
          <div style={styles.fullWidth}>
            <label>
              <input
                type="checkbox"
                checked={noGuardian}
                onChange={() => setNoGuardian(!noGuardian)}
              />
              No Secondary Guardian
            </label>
          </div>
        )}
        {/* Conditionally render guardian fields based on checkbox */}
        {!noGuardian && (
          <>
            <div style={styles.fieldContainer}>
              <Label htmlFor="firstName">First Name*</Label>
              <Input
                id="firstName"
                placeholder=""
                className="w-full"
                value={guardianData.firstName}
                onChange={handleInputChange}
              />
              {validationErrors.firstName && (
                <p style={{ color: "red" }}>{validationErrors.firstName}</p>
              )}
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="lastName">Last Name*</Label>
              <Input
                id="lastName"
                placeholder=""
                className="w-full"
                value={guardianData.lastName}
                onChange={handleInputChange}
              />
              {validationErrors.lastName && (
                <p style={{ color: "red" }}>{validationErrors.lastName}</p>
              )}
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="custody">Custody*</Label>
              <Select
                onValueChange={(value) => handleSelectChange("custody", value)}
              >
                <SelectTrigger id="custody" className="w-full">
                  <SelectValue
                    placeholder={guardianData.custody || "Select custody"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="living together">
                    Living Together
                  </SelectItem>
                  <SelectItem value="joint custody">Joint Custody</SelectItem>
                  <SelectItem value="sole custody">Sole Custody</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                placeholder=""
                className="w-full"
                value={guardianData.relationship}
                onChange={handleInputChange}
              />
              {validationErrors.relationship && (
                <p style={{ color: "red" }}>{validationErrors.relationship}</p>
              )}
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="address">Address*</Label>
              <Input
                id="address"
                placeholder=""
                className="w-full"
                value={guardianData.address}
                onChange={handleInputChange}
                disabled={sameAsClient.address} // Disable if autofilled
              />
              <label>
                <input
                  type="checkbox"
                  checked={sameAsClient.address}
                  onChange={() => handleCheckboxChange("address")}
                />
                Same as client
              </label>
              {validationErrors.address && (
                <p style={{ color: "red" }}>{validationErrors.address}</p>
              )}
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="city">City*</Label>
              <Input
                id="city"
                placeholder=""
                className="w-full"
                value={guardianData.city}
                onChange={handleInputChange}
                disabled={sameAsClient.address}
              />
              {validationErrors.city && (
                <p style={{ color: "red" }}>{validationErrors.city}</p>
              )}
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="province">Province*</Label>
              <Select
                value={guardianData.province}
                onValueChange={(value) => handleSelectChange("province", value)}
                disabled={sameAsClient.address}
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
            <div style={styles.fieldContainer}>
              <Label htmlFor="postalCode">Postal Code*</Label>
              <Input
                id="postalCode"
                placeholder=""
                className="w-full"
                value={guardianData.postalCode}
                onChange={handleInputChange}
                disabled={sameAsClient.address}
              />
              {validationErrors.postalCode && (
                <p style={{ color: "red" }}>{validationErrors.postalCode}</p>
              )}
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="phoneNumber">Phone Number*</Label>
              <Input
                id="phoneNumber"
                placeholder=""
                className="w-full"
                value={guardianData.phoneNumber}
                onChange={handleInputChange}
                maxLength={10}
                disabled={sameAsClient.phoneNumber} // Disable if autofilled
              />{" "}
              {validationErrors.phoneNumber && (
                <p style={{ color: "red" }}>{validationErrors.phoneNumber}</p>
              )}
              <label>
                <input
                  type="checkbox"
                  checked={sameAsClient.phoneNumber}
                  onChange={() => handleCheckboxChange("phoneNumber")}
                />
                Same as client
              </label>
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                placeholder=""
                className="w-full"
                value={guardianData.email}
                onChange={handleInputChange}
                disabled={sameAsClient.email} // Disable if autofilled
              />
              {validationErrors.email && (
                <p style={{ color: "red" }}>{validationErrors.email}</p>
              )}
              <label>
                <input
                  type="checkbox"
                  checked={sameAsClient.email}
                  onChange={() => handleCheckboxChange("email")}
                />
                Same as client
              </label>
            </div>
          </>
        )}
        <div style={styles.buttonContainer}>
          <Button type="submit" className="mt-4" disabled={disableButton}>
            {noGuardian
              ? "Complete"
              : primary
              ? "Next: Secondary Guardian"
              : "Submit"}
          </Button>
        </div>
        </div>
      </fieldset>
    </form>
  );
}

const styles = {
  formContainer: {
    backgroundColor: "white",
    padding: "24px",
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))", // Four columns for the form
    gap: "20px",
    overflow: "visible",
    height: "auto",
  },
  fieldContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  fullWidth: {
    gridColumn: "span 4", // Full width row (used for buttons or large elements)
  },
  halfWidth: {
    gridColumn: "span 2", // For two-column text areas
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between", // Align "Back" button to the left, "Submit" to the right
    gridColumn: "span 4", // Full width for the button container
  },
  sectionHeader: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "16px",
    borderBottom: "1px solid #ccc", // Optional underline
    paddingBottom: "4px",
  },
  card: {
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px",
  },
  subHeader: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "12px",
    paddingBottom: "4px",
    color: "#333",
  },

  guardianBox: {
    backgroundColor: "#F9FAFB", // Subtle light gray
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
  },
};
