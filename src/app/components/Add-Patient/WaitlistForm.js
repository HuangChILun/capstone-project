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

export default function WaitlistForm({ onSubmit }) {
  const [step, setStep] = useState(1); // Track the current step
  const [formData, setFormData] = useState({
    // Initial state for form data
    firstName: null,
    lastName: null,
    gender: null,
    birthDate: null,
    address: null,
    city: "Calgary",
    province: "AB",
    postalCode: null,
    phoneNumber: null,
    email: null,
    parentName: null,
    community: null,
    // Step 2 data
    fscdIdNum: null,
    caseWorkerName: null,
    serviceType: null,
    serviceProvidersNeeded: [],
    datePlaced: null,
    dateContacted: null,
    dateConsultationBooked: null,
    dateServicesOffered: null,
    dateStartedServices: null,
    nextMeetingDate: null,
    paperworkDeadline: null,
    fundingSource: null,
    feeDiscussed: null,
    followUp: null,
    referralFrom: null,
    availability: null,
    locationOfService: null,
    previousService: null,
    concerns: null,
    consultationHistory: null,
    isArchived: false,
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [disableS1Button, setDisableS1Button] = useState(true);
  const [disableS2Button, setDisableS2Button] = useState(true);

  // Regular expressions for validation
  const nameRegex = /^[A-Za-z'-\s]+$/;
  const sinRegex = /^\d{9}$/;
  const phoneRegex = /^\d{10}$/;
  const postalCodeRegex = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Function to handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData({
      ...formData,
      [id]: value,
    });

    // Validate field on change
    validateField(id, value);
  };

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

  // Function to check if required fields are filled in step 1
  const firstStepRequiredFieldsFilled = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "gender",
      "email",
      "phoneNumber",
      "birthDate",
      "address",
      "city",
      "province",
      "postalCode",
    ];
    return requiredFields.every((field) => formData[field]);
  };

  // Function to check if required fields are filled for step 2
  const secondStepRequiredFieldsFilled = () => {
    const requiredFieldsStep2 = [
      "fscdIdNum",
      "caseWorkerName",
      "serviceType",
      "serviceProvidersNeeded",
      "availability",
      "fundingSource",
      "datePlaced",
      // add other fields required in step 2 here
    ];
    return requiredFieldsStep2.every((field) => formData[field]);
  };
  // Monitor formData and update button state for Step 1
  useEffect(() => {
    setDisableS1Button(!firstStepRequiredFieldsFilled());
  }, [formData]);

  // Monitor formData and update button state for Step 2
  useEffect(() => {
    setDisableS2Button(!secondStepRequiredFieldsFilled());
  }, [formData]);
  const handleSelectChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Check for validation errors
    const hasErrors = Object.values(validationErrors).some((error) => error);
    if (hasErrors) {
      alert("Please check all fields before submitting.");
      return;
    }
    console.log("Form Submitted:", formData);
    onSubmit(formData); // Call the onSubmit prop passed from parent component
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset style={styles.formContainer}>
        {step === 1 && (
          <>
            {/* Step 1: Personal Information */}
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
                value={formData.firstName}
                onChange={handleChange}
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
                value={formData.lastName}
                onChange={handleChange}
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
                value={formData.gender}
                onChange={handleChange}
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
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>

            {/* Second row: Address, City, Province, Postal Code */}
            <div style={styles.fieldContainer}>
              <Label htmlFor="address">Address*</Label>
              <Input
                id="address"
                placeholder=""
                className="w-full"
                value={formData.address}
                onChange={handleChange}
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
                value={formData.city}
                onChange={handleChange}
              />
              {validationErrors.city && (
                <p style={{ color: "red" }}>{validationErrors.city}</p>
              )}
            </div>
            <div style={styles.fieldContainer}>
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
            <div style={styles.fieldContainer}>
              <Label htmlFor="postalCode">Postal Code*</Label>
              <Input
                id="postalCode"
                placeholder=""
                className="w-full"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>

            {/* Third row: Parent Name, Phone Number, Email, Community */}
            <div style={styles.fieldContainer}>
              <Label htmlFor="parentName">Parent Name</Label>
              <Input
                id="parentName"
                placeholder=""
                className="w-full"
                value={formData.parentName}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="phoneNumber">Phone Number*</Label>
              <Input
                id="phoneNumber"
                placeholder=""
                className="w-full"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                placeholder=""
                className="w-full"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="community">Community</Label>
              <Input
                id="community"
                placeholder=""
                className="w-full"
                value={formData.community}
                onChange={handleChange}
              />
            </div>

            <div style={styles.fullWidth}>
              <Button
                type="button"
                className="mt-4"
                onClick={() => setStep(2)} // Move to step 2
                disabled={disableS1Button}
              >
                Next: Service Information
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {/* Step 2: Service Information */}
            <legend className="text-lg font-semibold mb-4">
              Service Information
            </legend>

            {/* First row: FSCD Number, Caseworker Name, Service Type, Service Providers Needed */}
            <div style={styles.fieldContainer}>
              <Label htmlFor="fscdIdNum">FSCD Number</Label>
              <Input
                id="fscdIdNum"
                placeholder=""
                className="w-full"
                value={formData.fscdIdNum}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="caseWorkerName">Caseworker Name</Label>
              <Input
                id="caseWorkerName"
                placeholder=""
                className="w-full"
                value={formData.caseWorkerName}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="serviceType">Service Type</Label>
              <Input
                id="serviceType"
                placeholder=""
                className="w-full"
                value={formData.serviceType}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="serviceProvidersNeeded">
                Service Providers Needed
              </Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("serviceProviderNeeded", value)
                }
              >
                <SelectTrigger id="serviceProviderNeeded" className="w-full">
                  <SelectValue placeholder="Select Service Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Psychologist">Psychologist</SelectItem>
                  <SelectItem value="BC">BC</SelectItem>
                  <SelectItem value="SLP">SLP</SelectItem>
                  <SelectItem value="OT">OT</SelectItem>
                  <SelectItem value="PT">PT</SelectItem>
                  <SelectItem value="Aide">Aide</SelectItem>
                  <SelectItem value="Counsellor">Counsellor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Second row: Date Placed on Waitlist, Date Contacted, Date Consultation Booked, Date Services Offered */}
            <div style={styles.fieldContainer}>
              <Label htmlFor="datePlaced">Date Placed on Waitlist</Label>
              <Input
                id="datePlaced"
                type="date"
                className="w-full"
                value={formData.datePlaced}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="dateContacted">Date Contacted</Label>
              <Input
                id="dateContacted"
                type="date"
                className="w-full"
                value={formData.dateContacted}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="dateConsultationBooked">
                Date Consultation Booked
              </Label>
              <Input
                id="dateConsultationBooked"
                type="date"
                className="w-full"
                value={formData.dateConsultationBooked}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="dateServicesOffered">Date Services Offered</Label>
              <Input
                id="dateServicesOffered"
                type="date"
                className="w-full"
                value={formData.dateServicesOffered}
                onChange={handleChange}
              />
            </div>

            {/* Third row: Date Started Services, Next Meeting Date, Paperwork Deadline (4-column grid, last column empty) */}
            <div style={styles.fieldContainer}>
              <Label htmlFor="dateStartedServices">Date Started Services</Label>
              <Input
                id="dateStartedServices"
                type="date"
                className="w-full"
                value={formData.dateStartedServices}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="nextMeetingDate">Next Meeting Date</Label>
              <Input
                id="nextMeetingDate"
                type="date"
                className="w-full"
                value={formData.nextMeetingDate}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="paperworkDeadline">Paperwork Deadline</Label>
              <Input
                id="paperworkDeadline"
                type="date"
                className="w-full"
                value={formData.paperworkDeadline}
                onChange={handleChange}
              />
            </div>
            {/* Empty column */}
            <div></div>

            {/* Fourth row: Funding Source, Fees Discussed, Referral From, Follow Up */}
            <div style={styles.fieldContainer}>
              <Label htmlFor="fundingSource">Funding Source</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("fundingSource", value)
                }
              >
                <SelectTrigger id="fundingSource" className="w-full">
                  <SelectValue placeholder="Select Funding Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FSCD - SS">FSCD - SS</SelectItem>
                  <SelectItem value="FSCD - DBS">FSCD - DBS</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                  <SelectItem value="Private Pay">Private Pay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="feeDiscussed">Fees Discussed</Label>
              <Input
                id="feeDiscussed"
                placeholder=""
                className="w-full"
                value={formData.feeDiscussed}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="referralFrom">Referral From</Label>
              <Input
                id="referralFrom"
                placeholder=""
                className="w-full"
                value={formData.referralFrom}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="followUp">Follow Up</Label>
              <Input
                id="followUp"
                placeholder=""
                className="w-full"
                value={formData.followUp}
                onChange={handleChange}
              />
            </div>

            {/* Fifth row: Availability, Location of Service, Previous Service, Archived */}
            <div style={styles.fieldContainer}>
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                placeholder=""
                className="w-full"
                value={formData.availability}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="locationOfService">Location of Service</Label>
              <Input
                id="locationOfService"
                placeholder=""
                className="w-full"
                value={formData.locationOfService}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="previousService">Previous Service</Label>
              <Input
                id="previousService"
                placeholder=""
                className="w-full"
                value={formData.previousService}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="isArchived">Archived</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("isArchived", value)
                }
              >
                <SelectTrigger id="isArchived" className="w-full">
                  <SelectValue placeholder="Select Archived Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sixth row: Concerns, Consultation History (Grid 2 for both) */}
            <div style={styles.halfWidth}>
              <Label htmlFor="concerns">Concerns</Label>
              <textarea
                id="concerns"
                className="w-full h-32 p-2 border border-gray-300 rounded-md"
                value={formData.concerns}
                onChange={handleChange}
                placeholder="Enter any concerns"
              />
            </div>
            <div style={styles.halfWidth}>
              <Label htmlFor="consultationHistory">Consultation History</Label>
              <textarea
                id="consultationHistory"
                className="w-full h-32 p-2 border border-gray-300 rounded-md"
                value={formData.consultationHistory}
                onChange={handleChange}
                placeholder="Enter consultation history"
              />
            </div>

            <div style={styles.buttonContainer}>
              <Button
                type="button"
                className="mt-4"
                onClick={() => setStep(1)} // Go back to step 1
              >
                Back to Personal Information
              </Button>
              <Button type="submit" className="mt-4" disabled={disableS2Button}>
                Submit Form
              </Button>
            </div>
          </>
        )}
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