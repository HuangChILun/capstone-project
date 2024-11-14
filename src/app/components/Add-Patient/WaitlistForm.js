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
    diagnosis: null,
    school: null,
    language: null,
    siblings: null,
    pets: null,

    // Step 2 data
    caseWorkerName: null,
    serviceType: null, //dropdown menu with counselling, SS, DBS, private
    serviceProvidersNeeded: [], //check all that apply with psychologist, BC, SLP, OT, PT, aide
    fscdIdNum: null, // extra field
    datePlaced: null,
    dateContact: null,
    dateConsultationBooked: null,
    dateServiceOffered: null,
    dateStartedService: null,
    nextMeetingDate: null,
    paperworkDeadline: null,
    fundingSources: null,
    feeDiscussed: false, //(check box)
    followUp: null,
    referralFrom: null, //dropdown menu with FSCD, Children's Link, SCOPE, Autism Calgary, friend, other (able to enter additional options)
    availability: null,
    locationOfService: null, //dropdown menu with home, clinic, online
    previousService: null,
    concerns: null,
    consultationHistory: null,
    isArchived: 0,
    hasConverted: false, //this shows status of being transfer to active or not.
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [disableS1Button, setDisableS1Button] = useState(true);
  const [disableS2Button, setDisableS2Button] = useState(true);

  // Regular expressions for validation
  const nameRegex = /^[A-Za-z'()\-\s]+$/;
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
      case "parentName":
      case "community":
      case "city":
      case "caseWorkerName":
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
      "serviceType",
      "fundingSources",
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

  const handleCheckboxChange = (value, isChecked) => {
    setFormData((prevFormData) => {
      const currentServiceProviderNeeded = Array.isArray(
        prevFormData.serviceProvidersNeeded
      )
        ? prevFormData.serviceProvidersNeeded
        : [];

      const updatedServiceProviderNeeded = isChecked
        ? [...currentServiceProviderNeeded, value] // Add value if checked
        : currentServiceProviderNeeded.filter((item) => item !== value); // Remove value if unchecked

      return {
        ...prevFormData,
        serviceProvidersNeeded: updatedServiceProviderNeeded,
      };
    });
    console.log(formData.serviceProvidersNeeded);
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
              {validationErrors.postalCode && (
                <p style={{ color: "red" }}>{validationErrors.postalCode}</p>
              )}
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
              />{" "}
              {validationErrors.parentName && (
                <p style={{ color: "red" }}>{validationErrors.parentName}</p>
              )}
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
              {validationErrors.phoneNumber && (
                <p style={{ color: "red" }}>{validationErrors.phoneNumber}</p>
              )}
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
              {validationErrors.email && (
                <p style={{ color: "red" }}>{validationErrors.email}</p>
              )}
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
              {validationErrors.community && (
                <p style={{ color: "red" }}>{validationErrors.community}</p>
              )}
            </div>
            {/* Fourth row: Language, Pets, Siblings, School */}
            <div style={styles.fieldContainer}>
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                placeholder=""
                className="w-full"
                value={formData.language}
                onChange={handleChange}
              />
              {validationErrors.language && (
                <p style={{ color: "red" }}>{validationErrors.language}</p>
              )}
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="pets">Pets</Label>
              <Input
                id="pets"
                placeholder=""
                className="w-full"
                value={formData.pets}
                onChange={handleChange}
              />
              {validationErrors.pets && (
                <p style={{ color: "red" }}>{validationErrors.pets}</p>
              )}
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="siblings">Siblings</Label>
              <Input
                id="siblings"
                placeholder=""
                className="w-full"
                value={formData.siblings}
                onChange={handleChange}
              />
              {validationErrors.siblings && (
                <p style={{ color: "red" }}>{validationErrors.siblings}</p>
              )}
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="school">School</Label>
              <Input
                id="school"
                placeholder=""
                className="w-full"
                value={formData.school}
                onChange={handleChange}
              />
              {validationErrors.school && (
                <p style={{ color: "red" }}>{validationErrors.school}</p>
              )}
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
              {validationErrors.caseWorkerName && (
                <p style={{ color: "red" }}>
                  {validationErrors.caseWorkerName}
                </p>
              )}
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="serviceType">Service Type*</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("serviceType", value)
                }
              >
                <SelectTrigger id="serviceType" className="w-full">
                  <SelectValue placeholder="Select Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Counselling">Counselling</SelectItem>
                  <SelectItem value="SS">SS</SelectItem>
                  <SelectItem value="DBS">DBS</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="serviceProvidersNeeded">
                Service Providers Needed
              </Label>
              <div id="serviceProvidersNeeded" className="w-full">
                {[
                  { label: "Psychologist", value: "Psychologist" },
                  { label: "BC", value: "BC" },
                  { label: "SLP", value: "SLP" },
                  { label: "OT", value: "OT" },
                  { label: "PT", value: "PT" },
                  { label: "Aide", value: "Aide" },
                ].map((item) => (
                  <div key={item.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={item.value}
                      value={item.value}
                      checked={
                        Array.isArray(formData.serviceProvidersNeeded) &&
                        formData.serviceProvidersNeeded.includes(item.value)
                      }
                      onChange={(e) =>
                        handleCheckboxChange(item.value, e.target.checked)
                      }
                      className="form-checkbox"
                    />
                    <Label htmlFor={item.value}>{item.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Second row: Date Placed on Waitlist, Date Contacted, Date Consultation Booked, Date Services Offered */}
            <div style={styles.fieldContainer}>
              <Label htmlFor="datePlaced">Date Placed on Waitlist*</Label>
              <Input
                id="datePlaced"
                type="date"
                className="w-full"
                value={formData.datePlaced}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="dateContact">Date Contacted*</Label>
              <Input
                id="dateContact"
                type="date"
                className="w-full"
                value={formData.dateContact}
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
              <Label htmlFor="dateServiceOffered">Date Services Offered</Label>
              <Input
                id="dateServiceOffered"
                type="date"
                className="w-full"
                value={formData.dateServiceOffered}
                onChange={handleChange}
              />
            </div>

            {/* Third row: Date Started Services, Next Meeting Date, Paperwork Deadline (4-column grid, last column empty) */}
            <div style={styles.fieldContainer}>
              <Label htmlFor="dateStartedService">Date Started Services</Label>
              <Input
                id="dateStartedService"
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
              <Label htmlFor="fundingSources">Funding Source*</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("fundingSources", value)
                }
              >
                <SelectTrigger id="fundingSources" className="w-full">
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
              <input
                type="checkbox"
                id="feeDiscussed"
                className="w-full"
                checked={formData.feeDiscussed}
                onChange={(e) => setFormData({ ...formData, feeDiscussed: e.target.checked })}
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
              <Label htmlFor="availability">Availability*</Label>
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
              <Select
                onValueChange={(value) =>
                  handleSelectChange("locationOfService", value)
                }
              >
                <SelectTrigger id="locationOfService" className="w-full">
                  <SelectValue placeholder="Select Service Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Clinic">Clinic</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                </SelectContent>
              </Select>
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
            {/* <div style={styles.fieldContainer}>
              <Label htmlFor="isArchived">Archived</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("isArchived", value ===0 ?("No"):("Yes"))
                }
              >
                <SelectTrigger id="isArchived" className="w-full">
                  <SelectValue placeholder="Select Archived Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={1}>Yes</SelectItem>
                  <SelectItem value={0}>No</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

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
