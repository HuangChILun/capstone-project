"use client";
import React from 'react';
import { useEffect, useState } from "react";
import { Label } from "../HomeUi/label";
import { Input } from "../HomeUi/input";
import { Button } from "../HomeUi/button";

export default function OtherForm({
  clientData,
  SendConsent,
  SendInsurance,
  SendContract,
}) {
  const [noConsent, setNoConsent] = useState(false);
  const [noInsurance, setNoInsurance] = useState(false);
  const [noContract, setNoContract] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [disableButton, setDisableButton] = useState(true);

  const [consentData, setConsentData] = useState({
    clientId: null,
    permissionNote: "",
    receivedDate: null,
  });
  const [insuranceData, setInsuranceData] = useState({
    clientId: null,
    insuranceProvider: "",
    primaryPlanName: `${clientData.firstName} ${clientData.lastName}`,
    certificateId: "",
    coverateDetail: "",
    startDate: null,
    endDate: null,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [contractData, setContractData] = useState({
    clientId: null,
    startDate: null,
    endDate: null,
    COOhours: 0,
    PBChours: 0,
    SLPhours: 0,
    OThours: 0,
    PThours: 0,
    AIDEhours: 0,
    COUShours: 0,
    CARhours: 0,
  });
  const serviceProviderOptions = [
    { label: "Coordinator", value: "COOhours" },
    { label: "Psychologist/Behavioral Consultant", value: "PBChours" },
    { label: "SLP", value: "SLPhours" },
    { label: "OT", value: "OThours" },
    { label: "PT", value: "PThours" },
    { label: "Aide", value: "AIDEhours" },
    { label: "Counseling", value: "COUShours" },
    { label: "Community Aide Respite", value: "CARhours" },
  ];

  // Hour-related keys in contractData
  const hourFields = [
    "COOhours",
    "PBChours",
    "SLPhours",
    "OThours",
    "PThours",
    "AIDEhours",
    "COUShours",
    "CARhours",
  ];
  const [selectedProvider, setSelectedProvider] = useState("");
  const [hours, setHours] = useState("");

  const handleAddHours = () => {
    if (selectedProvider && hours) {
      setContractData((prevData) => ({
        ...prevData,
        [selectedProvider]: Number(hours),
      }));
      setSelectedProvider(""); // Reset dropdown
      setHours(""); // Reset hours input
    }
    console.log(contractData);
  };

  const handleRemoveHours = (providerKey) => {
    setContractData((prevData) => ({
      ...prevData,
      [providerKey]: null,
    }));
    console.log(contractData);
  };
  // Function to handle input changes and set corresponding data
  const handleInputChange = (e, setData) => {
    const { id, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    // Validate field on change
    validateField(id, value);
  };

  // Regular expressions for validation
  const nameRegex = /^[A-Za-z'()\-\s]+$/;

  const validateField = (id, value) => {
    let error = "";
    switch (id) {
      case "insuranceProvider":
      case "primaryPlanName":
        if (!nameRegex.test(value)) {
          error = "Only letters, space and -()' are allowed.";
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
    const consentRequiredFields = ["permissionNote", "receivedDate"];
    const insuranceRequiredFields = [
      "insuranceProvider",
      "primaryPlanName",
      "certificateId",
      "startDate",
      "endDate",
    ];
    const contractRequiredFields = ["startDate", "endDate"];

    // Check if all consent fields are filled or skipConsent is checked
    const isConsentFilled =
      noConsent || consentRequiredFields.every((field) => consentData[field]);

    // Check if all insurance fields are filled or skipInsurance is checked
    const isInsuranceFilled =
      noInsurance ||
      insuranceRequiredFields.every((field) => insuranceData[field]);

    //Check if the contract dates are selected
    const isContractDateFilled = contractRequiredFields.every(
      (field) => contractData[field]
    );
    // Check if contract data has at least one non-zero, non-null hour field
    const isContractHoursValid = hourFields.some(
      (field) => contractData[field] && contractData[field] !== 0
    );

    // Check if a file is selected
    const isFileSelected = selectedFile !== null;
    // Check if all contract fields (excluding hours) are filled or skipContract is checked
    const isContractFilled =
      noContract ||
      (isContractDateFilled && isFileSelected && isContractHoursValid); // Ensures at least one hour field is filled

    // Return true if all required sections are filled or skipped
    return isConsentFilled && isInsuranceFilled && isContractFilled;
  };

  useEffect(() => {
    setDisableButton(!areRequiredFieldsFilled());
  }, [
    consentData,
    insuranceData,
    contractData,
    selectedFile,
    noConsent,
    noInsurance,
    noContract,
  ]);

  // Function to check if Add button should be disabled
  const isAddButtonDisabled = () => {
    return !selectedProvider || !hours || Number(hours) <= 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check for validation errors
    const hasErrors = Object.values(validationErrors).some((error) => error);
    if (hasErrors) {
      alert("Please check all fields before submitting.");
      return;
    }
    if (!noConsent) {
      SendConsent(consentData);
    }
    if (!noInsurance) {
      SendInsurance(insuranceData);
    }
    if (!noContract) {
      SendContract(selectedFile, contractData);
    } else {
      SendContract(null, null);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <div style={styles.formContainer}>
          <legend className="text-lg font-semibold mb-4">
            Consent Information
          </legend>
          <div style={styles.fullWidth}>
            <label>
              <input
                type="checkbox"
                checked={noConsent}
                onChange={() => setNoConsent(!noConsent)}
              />
              No consent
            </label>
          </div>
          {!noConsent && (
            <>
              <div style={styles.halfWidth}>
                <Label htmlFor="permissionNote">Permission*</Label>
                <textarea
                  id="permissionNote"
                  className="w-full h-32 p-2 border border-gray-300 rounded-md"
                  value={consentData.permissionNote}
                  onChange={(e) => handleInputChange(e, setConsentData)}
                  placeholder="Enter permission"
                />
              </div>
              <div style={styles.fieldContainer}>
                <Label htmlFor="receivedDate">Received Date*</Label>
                <Input
                  id="receivedDate"
                  type="date"
                  className="w-full"
                  value={consentData.receivedDate}
                  onChange={(e) => handleInputChange(e, setConsentData)}
                />
              </div>
            </>
          )}
        </div>

        <div style={styles.formContainer}>
          <legend className="text-lg font-semibold mb-4">
            Insurance Information
          </legend>
          <div style={styles.fullWidth}>
            <label>
              <input
                type="checkbox"
                checked={noInsurance}
                onChange={() => setNoInsurance(!noInsurance)}
              />
              No Insurance
            </label>
          </div>
          {!noInsurance && (
            <>
              <div style={styles.fieldContainer}>
                <Label htmlFor="insuranceProvider">Insurance Provider*</Label>
                <Input
                  id="insuranceProvider"
                  placeholder=""
                  className="w-full"
                  value={insuranceData.insuranceProvider}
                  onChange={(e) => handleInputChange(e, setInsuranceData)}
                />
                {validationErrors.insuranceProvider && (
                  <p style={{ color: "red" }}>
                    {validationErrors.insuranceProvider}
                  </p>
                )}
              </div>
              <div style={styles.fieldContainer}>
                <Label htmlFor="primaryPlanName">Primary Plan Name*</Label>
                <Input
                  id="primaryPlanName"
                  placeholder=""
                  className="w-full"
                  value={insuranceData.primaryPlanName}
                  onChange={(e) => handleInputChange(e, setInsuranceData)}
                />
                {validationErrors.primaryPlanName && (
                  <p style={{ color: "red" }}>
                    {validationErrors.primaryPlanName}
                  </p>
                )}
              </div>
              <div style={styles.fieldContainer}>
                <Label htmlFor="certificateId">Certificate ID*</Label>
                <Input
                  id="certificateId"
                  placeholder=""
                  className="w-full"
                  value={insuranceData.certificateId}
                  onChange={(e) => handleInputChange(e, setInsuranceData)}
                />
              </div>
              <div style={styles.halfWidth}>
                <Label htmlFor="coverageDetail">Coverage Detail</Label>
                <textarea
                  id="coverateDetail"
                  className="w-full h-32 p-2 border border-gray-300 rounded-md"
                  value={insuranceData.coverageDetail}
                  onChange={(e) => handleInputChange(e, setInsuranceData)}
                  placeholder="Enter Coverage Detail..."
                />
              </div>
              <div style={styles.fieldContainer}>
                <Label htmlFor="startDate">Start Date*</Label>
                <Input
                  id="startDate"
                  type="date"
                  className="w-full"
                  value={insuranceData.startDate}
                  onChange={(e) => handleInputChange(e, setInsuranceData)}
                />
              </div>
              <div style={styles.fieldContainer}>
                <Label htmlFor="endDate">End Date*</Label>
                <Input
                  id="endDate"
                  type="date"
                  className="w-full"
                  value={insuranceData.endDate}
                  min={insuranceData.startDate}
                  onChange={(e) => handleInputChange(e, setInsuranceData)}
                />
              </div>
            </>
          )}
        </div>
        <div style={styles.formContainer}>
          <legend className="text-lg font-semibold mb-4">
            Contract Information
          </legend>
          <div style={styles.fullWidth}>
            <label>
              <input
                type="checkbox"
                checked={noContract}
                onChange={() => setNoContract(!noContract)}
              />
              No Contract
            </label>
          </div>
          {!noContract && (
            <>
              <div style={styles.halfWidth}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.header}>Service Provider*</th>
                      <th style={styles.header}>Hours*</th>
                      <th style={styles.header}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hourFields.map((key) => {
                      const provider = serviceProviderOptions.find(
                        (option) => option.value === key
                      );
                      const hours = contractData[key];
                      return hours !== 0 && hours != null && provider ? (
                        <tr key={key}>
                          <td style={styles.cell}>{provider.label}</td>
                          <td style={styles.cell}>{hours}</td>
                          <td>
                            <Button
                              type="button"
                              onClick={() => handleRemoveHours(key)}
                              style={styles.removeButton}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ) : null;
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>
                        <select
                          value={selectedProvider}
                          onChange={(e) => setSelectedProvider(e.target.value)}
                          style={styles.input}
                        >
                          <option value="">Select Service Provider</option>
                          {serviceProviderOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <Input
                          type="number"
                          min="0"
                          value={hours}
                          onChange={(e) => setHours(e.target.value)}
                          placeholder="Enter hours"
                          style={styles.input}
                        />
                      </td>
                      <td>
                        <Button
                          type="button"
                          onClick={handleAddHours}
                          style={styles.addButton}
                          disabled={isAddButtonDisabled()}
                        >
                          Add
                        </Button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div style={styles.fieldContainer}>
                <div>
                  <Label htmlFor="startDate">Start Date*</Label>
                  <Input
                    id="startDate"
                    type="date"
                    className="w-full"
                    value={contractData.startDate}
                    onChange={(e) => handleInputChange(e, setContractData)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date*</Label>
                  <Input
                    id="endDate"
                    type="date"
                    className="w-full"
                    value={contractData.endDate}
                    min={contractData.startDate}
                    onChange={(e) => handleInputChange(e, setContractData)}
                  />
                </div>
              </div>
              <div style={styles.fieldContainer}>
                <Label htmlFor="contractUpload">Contract Upload*</Label>
                <Input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>
            </>
          )}
        </div>
        <div style={styles.buttonContainer}>
          <Button type="submit" className="mt-4" disabled={disableButton}>
            Next: Primary Guardian
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
  threeWidth: {
    gridColumn: "span 3",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between", // Align "Back" button to the left, "Submit" to the right
    gridColumn: "span 4", // Full width for the button container
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
    fontFamily: "inherit",
  },
  header: {
    textAlign: "left",
    fontWeight: "bold",
    fontSize: "16px",
    paddingBottom: "8px",
    color: "#4A4A4A",
  },
  cell: {
    padding: "8px",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    outline: "none",
    fontFamily: "inherit",
  },
  addButton: {
    width: "100%",
    fontSize: "14px",
    padding: "8px",
  },
  removeButton: {
    backgroundColor: "red",
    width: "100%",
    fontSize: "14px",
    padding: "8px",
  },
};
