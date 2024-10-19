import React, { useState } from "react";
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
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phoneNumber: "",
    email: "",
    parentName: "",
    community: "",
    // Step 2 data
    fscdNum: "",
    caseWorkerName: "",
    serviceType: "",
    serviceProvidersNeeded: [],
    datePlaced: "",
    dateContacted: "",
    dateConsultationBooked: "",
    dateServicesOffered: "",
    dateStartedServices: "",
    nextMeetingDate: "",
    paperworkDeadline: "",
    fundingSource: "",
    feeDiscussed: "",
    followUp: "",
    referralFrom: "",
    availability: "",
    locationOfService: "",
    previousService: "",
    concerns: "",
    consultationHistory: "",
    isArchived: false,
  });

  // Function to handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const serviceProviderOptions = [
    "Psychologist",
    "BC",
    "SLP",
    "OT",
    "PT",
    "Aide",
    "Counsellor",
  ];

  // Handle selection and deselection
  const handleSelectChange = (provider) => {
    const updatedProviders = formData.serviceProvidersNeeded.includes(provider)
      ? formData.serviceProvidersNeeded.filter((p) => p !== provider) // Remove if deselected
      : [...formData.serviceProvidersNeeded, provider]; // Add if selected

    setFormData({ ...formData, serviceProvidersNeeded: updatedProviders });
  };
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
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
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Input"
                className="w-full"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Input"
                className="w-full"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                placeholder="Input"
                className="w-full"
                value={formData.gender}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="birthDate">Birth Date</Label>
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
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Input"
                className="w-full"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Input"
                className="w-full"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="province">Province</Label>
              <Input
                id="province"
                placeholder="Input"
                className="w-full"
                value={formData.province}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                placeholder="Input"
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
                placeholder="Input"
                className="w-full"
                value={formData.parentName}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="Input"
                className="w-full"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Input"
                className="w-full"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="community">Community</Label>
              <Input
                id="community"
                placeholder="Input"
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
              <Label htmlFor="fscdNum">FSCD Number</Label>
              <Input
                id="fscdNum"
                placeholder="Input"
                className="w-full"
                value={formData.fscdNum}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="caseWorkerName">Caseworker Name</Label>
              <Input
                id="caseWorkerName"
                placeholder="Input"
                className="w-full"
                value={formData.caseWorkerName}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="serviceType">Service Type</Label>
              <Input
                id="serviceType"
                placeholder="Input"
                className="w-full"
                value={formData.serviceType}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
            <Label htmlFor="serviceProvidersNeeded">Service Providers Needed</Label>
          <Select
            multiple // Allow multiple selections
            onValueChange={(value) => handleSelectChange(value)}
          >
            <SelectTrigger id="serviceProvidersNeeded" className="w-full">
              {/* Display selected items in the dropdown */}
              <SelectValue>
                {formData.serviceProvidersNeeded.length > 0
                  ? formData.serviceProvidersNeeded.join(", ")
                  : "Select Service Providers"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {serviceProviderOptions.map((provider) => (
                <SelectItem
                  key={provider}
                  value={provider}
                  selected={formData.serviceProvidersNeeded.includes(provider)} // Native checkmark handling
                >
                  {provider}
                </SelectItem>
              ))}
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
                placeholder="Input"
                className="w-full"
                value={formData.feeDiscussed}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="referralFrom">Referral From</Label>
              <Input
                id="referralFrom"
                placeholder="Input"
                className="w-full"
                value={formData.referralFrom}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="followUp">Follow Up</Label>
              <Input
                id="followUp"
                placeholder="Input"
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
                placeholder="Input"
                className="w-full"
                value={formData.availability}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="locationOfService">Location of Service</Label>
              <Input
                id="locationOfService"
                placeholder="Input"
                className="w-full"
                value={formData.locationOfService}
                onChange={handleChange}
              />
            </div>
            <div style={styles.fieldContainer}>
              <Label htmlFor="previousService">Previous Service</Label>
              <Input
                id="previousService"
                placeholder="Input"
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
              <Button type="submit" className="mt-4">
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
