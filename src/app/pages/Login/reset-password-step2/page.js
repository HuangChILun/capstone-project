import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";

export default function ResetPasswordStep2() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { resetToken } = router.query;


  const jwt = require("jsonwebtoken");
const { getUserByEmail, updateUserByEmail } = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const results = await new Promise((resolve, reject) =>
      getUserByEmail(email, (err, results) => {
        if (err) {
          console.error("Error finding user by email:", err);
          reject(err);
        } else {
          resolve(results);
        }
      })
    );

    if (results.length === 0) {
      return res.status(404).send("not found the user");
    }

    const user = results[0];
    const resetPasswordToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const resetPasswordExpires = new Date(Date.now() + 3600000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    await new Promise((resolve, reject) =>
      updateUserByEmail(
        email,
        { resetPasswordToken, resetPasswordExpires },
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      )
    );

    const resetUrl = `http://${req.headers.host}/reset-password/${resetPasswordToken}`;

    await sendEmail(
      user.email,
      "reset password",
      `if you received this email that because someone is trying to reset password。\n\n
      please click the link to reset the password：\n\n
      ${resetUrl}\n\n
      if you don't do this, ignored the email。\n`
    );

    res.status(200).send("the link was sent to your email");
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).send("error，please try again later");
  }
};
const handleSubmit = async (e) => {
  console.log("test");
  e.preventDefault();
  try {
    const response = await fetch('./pages/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    if (response.ok) {
      console.log("successful");
    } else {
      console.log("not work");
    }
  } catch (error) {
    console.log("error");
  }
};

  return (
    <div className="flex flex-col items-center justify-center bg-white">
      {/* Header */}
      <div className="relative w-full bg-[#0B2C59] text-white text-center py-10">
        <img src="/assets/Bridging_Abilities_Logo.jpg" alt="Logo" className="mx-auto mb-4 w-24 h-24" />
        <h1 className="text-2xl font-bold">Bridging Abilities Database System</h1>
        <div className="absolute bottom-[-20px] left-0 right-0 h-10 bg-white rounded-t-full" />
      </div>
      
      {/* Form */}
      <div className="w-full max-w-md pt-20 p-8 mt-8">
        <div className="flex mb-8">
          {/* Step indicators */}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="password"
              className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Re-enter New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-[#1a73e8] text-white rounded-lg hover:bg-[#1765cc] focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
          </button>
        </form>
      </div>
    </div>
  );
}