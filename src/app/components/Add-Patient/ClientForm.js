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
import Diagnosis from "./Diagnosis";

export default function ClientForm({
  onSubmit,
  isConversion = false,
  waitlistClientData = null,
  note = null,
}) {
  const [clientData, setClientData] = useState(
    isConversion && waitlistClientData
      ? {
          firstName: waitlistClientData.firstName || "",
          lastName: waitlistClientData.lastName || "",
          gender: waitlistClientData.gender || "",
          birthDate:
            new Date(waitlistClientData.birthDate)
              .toISOString()
              .split("T")[0] || null,
          address: waitlistClientData.address || "",
          city: waitlistClientData.city || "Calgary",
          province: waitlistClientData.province || "AB",
          postalCode: waitlistClientData.postalCode || "",
          phoneNumber: waitlistClientData.phoneNumber || "",
          email: waitlistClientData.email || "",
          school: waitlistClientData.school || "",
          age: waitlistClientData.age || 0,
          currentStatus: true,
          fscdIdNum: waitlistClientData.fscdIdNum || "",
          grade: waitlistClientData.grade || undefined,
          serviceStartDate: waitlistClientData.serviceStartDate || null,
          serviceEndDate: waitlistClientData.serviceEndDate || null,
          psNote: note || null,
        }
      : {
          psNote: "",
          firstName: "",
          lastName: "",
          gender: "",
          birthDate: null,
          address: "",
          city: "Calgary",
          province: "AB",
          postalCode: "",
          phoneNumber: "",
          email: "",
          school: "",
          age: 0,
          currentStatus: true,
          fscdIdNum: "",
          grade: undefined,
          serviceStartDate: null,
          serviceEndDate: null,
        }
  );

  const [diagnosisName, setDiagnosisName] = useState(null);
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [disableButton, setDisableButton] = useState(true);

  useEffect(() => {
    if (waitlistClientData != null) {
      setDiagnosisName(waitlistClientData.diagnosis);
    }
  }, [waitlistClientData]);

  // Regular expressions for validation
  const nameRegex = /^[A-Za-z'()\-\s]+$/;
  const phoneRegex = /^\d{10}$/;
  const postalCodeRegex = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setClientData({
      ...clientData,
      [id]: value,
    });

    // Validate field on change
    validateField(id, value);
  };

  const handleSelectChange = (field, value) => {
    setClientData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const validateField = (id, value) => {
    let error = "";
    switch (id) {
      case "firstName":
      case "lastName":
      case "gender":
      case "school":
      case "city":
        if (!nameRegex.test(value)) {
          error = "Only letters, space and -()' are allowed.";
        }
        break;
      case "grade":
        if (value === "") {
          error = "";
        } else if (value > 12 || value < 1) {
          error = "Grade must be between 1 to 12";
        }
        break;
      case "phoneNumber":
        if (!phoneRegex.test(value)) {
          error = "Phone number must be number only and exactly 10 digits";
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
  // Callback function to add a new diagnosis
  const handleAddDiagnosis = (newDiagnosis) => {
    setDiagnosisData((prevData) => [...prevData, newDiagnosis]);
  };

  // Callback function to remove a diagnosis by index
  const handleRemoveDiagnosis = (indexToRemove) => {
    setDiagnosisData((prevData) =>
      prevData.filter((_, index) => index !== indexToRemove)
    );
  };
  // Function to check if required fields are filled
  const areRequiredFieldsFilled = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "birthDate",
      "gender",
      "email",
      "phoneNumber",
      "address",
      "city",
      "province",
      "postalCode",
      "serviceStartDate",
    ];
    return (
      requiredFields.every((field) => clientData[field]) &&
      diagnosisData.length > 0
    );
  };

  // useEffect to monitor changes in clientData and update button state
  useEffect(() => {
    setDisableButton(!areRequiredFieldsFilled());
  }, [clientData, diagnosisData]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Check for validation errors
    const hasErrors = Object.values(validationErrors).some((error) => error);
    if (hasErrors) {
      alert("Please check all fields before submitting.");
      return;
    }
    // Convert new lines to \n just before submission
    const preparedData = {
      ...clientData
      //,      psNote: clientData.psNote.replace(/\n/g, "\\n"),
    };

    console.log("Form Submitted:", preparedData);
    onSubmit(preparedData, diagnosisData);
  };
  return (
    <form onSubmit={handleSubmit}>
      <fieldset style={styles.formContainer}>
        <legend className="text-lg font-semibold mb-4">
          Personal Information
        </legend>

        {/* First row: First Name, Last Name, Gender, Birth Date */}
        <div style={styles.fieldContainer}>
          <Label htmlFor="firstName">First Name*</Label>
          <Input
            id="firstName"
            placeholder=""
            className="w-full"
            value={clientData.firstName}
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
            value={clientData.lastName}
            onChange={handleInputChange}
          />
          {validationErrors.lastName && (
            <p style={{ color: "red" }}>{validationErrors.lastName}</p>
          )}
        </div>
        <div style={styles.fieldContainer}>
          <Label htmlFor="gender">Gender*</Label>
          <Input
            id="gender"
            placeholder=""
            className="w-full"
            value={clientData.gender}
            onChange={handleInputChange}
          />
          {validationErrors.gender && (
            <p style={{ color: "red" }}>{validationErrors.gender}</p>
          )}
        </div>
        <div style={styles.fieldContainer}>
          <Label htmlFor="birthDate">Birth Date*</Label>
          <Input
            id="birthDate"
            type="date"
            className="w-full"
            value={clientData.birthDate}
            onChange={handleInputChange}
          />
        </div>

        {/* Second row: Address, City, Province, Postal Code */}
        <div style={styles.fieldContainer}>
          <Label htmlFor="address">Address*</Label>
          <Input
            id="address"
            placeholder=""
            className="w-full"
            value={clientData.address}
            onChange={handleInputChange}
          />
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
            value={clientData.city}
            onChange={handleInputChange}
          />
          {validationErrors.city && (
            <p style={{ color: "red" }}>{validationErrors.city}</p>
          )}
        </div>
        <div style={styles.fieldContainer}>
          <Label htmlFor="province">Province*</Label>
          <Select
            value={clientData.province}
            onValueChange={(value) => handleSelectChange("province", value)}
          >
            <SelectTrigger id="province" className="w-full">
              <SelectValue
                placeholder={clientData.province || "Select Province"}
              />
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
            value={clientData.postalCode}
            onChange={handleInputChange}
          />
          {validationErrors.postalCode && (
            <p style={{ color: "red" }}>{validationErrors.postalCode}</p>
          )}
        </div>
        <div style={styles.fieldContainer}>
          <Label htmlFor="phoneNumber">Phone Number*</Label>
          <Input
            type="text"
            id="phoneNumber"
            placeholder=""
            className="w-full"
            value={clientData.phoneNumber}
            onChange={handleInputChange}
            maxLength={10}
            pattern="\d{10}"
          />
          {validationErrors.phoneNumber && (
            <p style={{ color: "red" }}>{validationErrors.phoneNumber}</p>
          )}
        </div>
        <div style={styles.fieldContainer}>
          <Label htmlFor="email">Email*</Label>
          <Input
            type="email"
            id="email"
            placeholder=""
            className="w-full"
            value={clientData.email}
            onChange={handleInputChange}
          />
          {validationErrors.email && (
            <p style={{ color: "red" }}>{validationErrors.email}</p>
          )}
        </div>
        <div style={styles.fieldContainer}>
          <Label htmlFor="fscdIdNum">FSCD Number</Label>
          <Input
            id="fscdIdNum"
            placeholder=""
            className="w-full"
            value={clientData.fscdNum}
            onChange={handleInputChange}
          />
        </div>
        <div style={styles.fieldContainer}>
          <Label htmlFor="school">School</Label>
          <Input
            id="school"
            placeholder=""
            className="w-full"
            value={clientData.school}
            onChange={handleInputChange}
          />
          {validationErrors.school && (
            <p style={{ color: "red" }}>{validationErrors.school}</p>
          )}
        </div>
        <div style={styles.fieldContainer}>
          <Label htmlFor="grade">Grade</Label>
          <Input
            id="grade"
            type="number"
            placeholder=""
            className="w-full"
            value={clientData.grade}
            min={1}
            max={12}
            onChange={handleInputChange}
          />
          {validationErrors.grade && (
            <p style={{ color: "red" }}>{validationErrors.grade}</p>
          )}
        </div>
        <div style={styles.fieldContainer}>
          <Label htmlFor="serviceStartDate">Service Start Date*</Label>
          <Input
            id="serviceStartDate"
            type="date"
            className="w-full"
            value={clientData.serviceStartDate}
            onChange={handleInputChange}
          />
        </div>
        <div style={styles.fieldContainer}>
          <Label htmlFor="serviceEndDate">Service End Date</Label>
          <Input
            id="serviceEndDate"
            type="date"
            className="w-full"
            value={clientData.serviceEndDate}
            min={clientData.serviceStartDate}
            onChange={handleInputChange}
          />
        </div>
        <div style={styles.halfWidth}>
          <Label htmlFor="psNote">Note</Label>
          <textarea
            id="psNote"
            className="w-full h-32 p-2 border border-gray-300 rounded-md"
            value={clientData.psNote}
            onChange={handleInputChange}
            placeholder="Enter any additional Notes"
          />
        </div>
        <div style={styles.halfWidth}>
          <Diagnosis
            diagnosisData={diagnosisData}
            onAddDiagnosis={handleAddDiagnosis}
            onRemoveDiagnosis={handleRemoveDiagnosis}
            convertDiagnosis={diagnosisName}
          />
        </div>
        <div style={styles.buttonContainer}>
          <Button type="submit" className="mt-4" disabled={disableButton}>
            Next: Consent, Insurance, Contract
          </Button>
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
};
