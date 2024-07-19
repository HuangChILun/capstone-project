"use client";

import Link from "next/link";



export default function ResetPasswordStep3() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full bg-[#0B2C59] text-white text-center py-10 relative">
        <img src="/assets/Bridging_Abilities_Logo.jpg" alt="Logo" className="mx-auto mb-4 w-24 h-24" />
        <h1 className="text-2xl font-bold">Bridging Abilities Database System</h1>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white" 
             style={{clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 75% 50%, 50% 0%, 25% 50%, 0% 0%)"}}></div>
      </div>
      <div className="w-full max-w-md mt-20 p-8">
        <div className="flex justify-between mb-12">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-2">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-sm text-gray-600">Step 1</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-2">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-sm text-gray-600">Step 2</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
              <span className="text-white text-xs">3</span>
            </div>
            <span className="text-sm text-blue-500 font-medium">Step 3</span>
          </div>
        </div>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center text-green-500 text-xl mb-6">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>PASSWORD CHANGED!</span>
          </div>
          <Link href="page.js">
          <button
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          >
            RETURN TO LOGIN
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}