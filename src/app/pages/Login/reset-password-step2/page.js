"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ResetPasswordStep2() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { token } = router.query;

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('https://capstone-project-backend-weld.vercel.app/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Password has been reset successfully.');
        router.push('/Password-Reset-Confirmation');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white">
      <div className="relative w-full bg-[#0B2C59] text-white text-center py-10">
        <img src="/assets/Bridging_Abilities_Logo.jpg" alt="Logo" className="mx-auto mb-4 w-24 h-24" />
        <h1 className="text-2xl font-bold">
          <p style={{ color: 'white' }}>Bridging Abilities Database System</p>
        </h1>
        <div className="absolute bottom-[-20px] left-0 right-0 h-10 bg-white rounded-t-full" />
      </div>
      
      <div className="w-full max-w-md pt-20 p-8 mt-8">
        <div className="flex mb-8">
          <div className="flex-1 text-center text-gray-400">
            <span className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm mr-2">1</span>
            Step 1
          </div>
          <div className="flex-1 text-center text-gray-400 border-b-2 border-blue-500 pb-2">
            <span className="bg-gray-200 text-gray-400 rounded-full px-3 py-1 text-sm mr-2">2</span>
            Step 2
          </div>
          <div className="flex-1 text-center text-gray-400">
            <span className="bg-gray-200 text-gray-400 rounded-full px-3 py-1 text-sm mr-2">3</span>
            Step 3
          </div>
        </div>
        
        <form onSubmit={handleResetPassword}>
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
          <button
            type="submit"
            className="w-full px-4 py-2 bg-[#1a73e8] rounded-lg hover:bg-[#1765cc] focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
          >
            <p style={{ color: 'white' }}>RESET PASSWORD</p>
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
}
