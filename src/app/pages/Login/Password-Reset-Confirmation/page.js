"use client";

import Link from "next/link";



export default function ResetPasswordStep3() {
  return (
    <div className="flex flex-col items-center justify-center bg-white">
      {/* header*/}
      <div className="w-full bg-[#0B2C59] text-white text-center py-10">
        <img src="/assets/Bridging_Abilities_Logo.jpg" alt="Logo" className="mx-auto mb-4 w-24 h-24" />
        <h1 className="text-2xl font-bold" ><p style={{ color: 'white' }}>Bridging Abilities Database System</p></h1>
      </div>
      {/* step bar */}
      <div className="w-full max-w-md pt-20 p-8 mt-8 ">
        <div className="flex mb-8">
            <div className="flex-1 text-center text-gray-400">
              <span className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm mr-2">1</span>
              Step 1
            </div>
            <div className="flex-1 text-center text-gray-400">
              <span className="bg-gray-200 text-gray-400 rounded-full px-3 py-1 text-sm mr-2">2</span>
              Step 2
            </div>
            <div className="flex-1 text-center text-gray-400  border-b-2 border-blue-500 pb-2">
              <span className="bg-gray-200 text-gray-400 rounded-full px-3 py-1 text-sm mr-2">3</span>
              Step 3
            </div>
          </div>
        {/* step bar end */}

        <div className="text-center mb-8">
          <div className="flex items-center justify-center text-green-500 text-xl mb-6">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>PASSWORD CHANGED!</span>
          </div>
          <Link href="/">
          <button
            className="w-full px-4 py-2  bg-[#1a73e8] rounded-lg hover:bg-[#1765cc] focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
          >
            <p style={{ color: 'white' }}>RETURN TO LOGIN</p>
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}