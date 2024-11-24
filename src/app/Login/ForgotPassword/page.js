"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = 'force-dynamic';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // Manage steps
  const router = useRouter();
  const [validations, setValidations] = useState({
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
    minLength: false,
  });
// Check new password criteria
const handleNewPasswordChange = (e) => {
  const password = e.target.value;
  setNewPassword(password);

  // Validation checks
  setValidations({
    upperCase: /[A-Z]/.test(password),
    lowerCase: /[a-z]/.test(password),
    number: /\d/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    minLength: password.length >= 8,
  });
};
  // Handle sending the CAPTCHA code
  const handleSendCode = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/auth/forgot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage("Verification code sent to your email.");
        setCurrentStep(2); // Move to step 2
      } else {
        setMessage(data.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    }
  };

  //Handle resetting the password
  const handleResetPassword = async () => {
    if (
      !validations.upperCase ||
      !validations.lowerCase ||
      !validations.number ||
      !validations.specialChar ||
      !validations.minLength
    ) {
      alert("New password does not meet the required criteria.");
      return;
    }
    if (newPassword != confirmPassword){
      alert("New password does not match confirm password")
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/auth/reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            captchaCode,
            newPassword,
          }),
        }
      );

      if (response.ok) {
        setMessage("Password has been reset successfully.");
        setCurrentStep(3); // Move to success step
      } else {
        setMessage(data.error || "Invalid verification code or expired code.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Section */}
      <div className="relative w-full bg-[#0B2C59] text-white text-center py-10">
        <img
          src="/assets/Bridging_Abilities_Logo.jpg"
          alt="Logo"
          className="mx-auto mb-4 w-24 h-24"
        />
        <h1 className="text-2xl font-bold">
          Bridging Abilities Database System
        </h1>
        <div className="absolute bottom-[-20px] left-0 right-0 h-10 bg-white rounded-t-full" />
      </div>

      {/* Content Section */}
      <div className="flex-grow flex justify-center items-start pt-20">
        <div className="w-full max-w-md p-8">
          {/* Step Indicator */}
          <div className="flex mb-8">
            {/* Step 1 */}
            <div
              className={`flex-1 text-center ${
                currentStep >= 1
                  ? "border-b-2 border-blue-500"
                  : "text-gray-400"
              } pb-2`}
            >
              <span
                className={`${
                  currentStep === 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-400"
                } rounded-full px-3 py-1 text-sm mr-2`}
              >
                1
              </span>
              Step 1
            </div>
            {/* Step 2 */}
            <div
              className={`flex-1 text-center ${
                currentStep >= 2
                  ? "border-b-2 border-blue-500"
                  : "text-gray-400"
              } pb-2`}
            >
              <span
                className={`${
                  currentStep === 2
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-400"
                } rounded-full px-3 py-1 text-sm mr-2`}
              >
                2
              </span>
              Step 2
            </div>
            {/* Step 3 */}
            <div
              className={`flex-1 text-center ${
                currentStep >= 3
                  ? "border-b-2 border-blue-500"
                  : "text-gray-400"
              } pb-2`}
            >
              <span
                className={`${
                  currentStep === 3
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-400"
                } rounded-full px-3 py-1 text-sm mr-2`}
              >
                3
              </span>
              Step 3
            </div>
          </div>

          {/* Step 1: Enter Email */}
          {currentStep === 1 && (
            <form>
              <div className="mb-6">
                <input
                  type="email"
                  className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="w-full px-4 py-2 text-white bg-[#1a73e8] rounded-lg hover:bg-[#1765cc] focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
                >
                  SEND CODE
                </button>
              </div>
              {message && (
                <p className="mb-6 text-center text-green-500">{message}</p>
              )}
            </form>
          )}

          {/* Step 2: Enter CAPTCHA Code and New Password */}
          {currentStep === 2 && (
            <form>
              <div className="mb-6">
                <input
                  type="text"
                  className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="CAPTCHA Code"
                  value={captchaCode}
                  onChange={(e) => setCaptchaCode(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                />
                <ul style={styles.validationList}>
                  <li>
                    {validations.upperCase ? "✔️" : "❌"} At least one uppercase
                    letter
                  </li>
                  <li>
                    {validations.lowerCase ? "✔️" : "❌"} At least one lowercase
                    letter
                  </li>
                  <li>
                    {validations.number ? "✔️" : "❌"} At least one number
                  </li>
                  <li>
                    {validations.specialChar ? "✔️" : "❌"} At least one special
                    character (!@#$%^&*)
                  </li>
                  <li>
                    {validations.minLength ? "✔️" : "❌"} At least 8 characters
                    long
                  </li>
                </ul>
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="w-full px-4 py-2 text-white bg-[#1a73e8] rounded-lg hover:bg-[#1765cc] focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
                >
                  RESET PASSWORD
                </button>
              </div>
              {message && (
                <p className="mb-6 text-center text-red-500">{message}</p>
              )}
            </form>
          )}

          {/* Step 3: Success Message */}
          {currentStep === 3 && (
            <div>
              <p className="mb-6 text-center text-green-500">
                Your password has been reset successfully.
              </p>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full px-4 py-2 text-white bg-[#1a73e8] rounded-lg hover:bg-[#1765cc] focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  validationList: {
    listStyleType: "none",
    padding: 0,
    margin: "10px 0",
    color: "#333",
  },
}
