"use client";

import Link from "next/link";

export default function ForgotPassword() {

  return (
    // header 
    <div className="flex flex-col min-h-screen bg-white">
      <div className="relative w-full bg-[#0B2C59] text-white text-center py-10">
        <img src="/assets/Bridging_Abilities_Logo.jpg" alt="Logo" className="mx-auto mb-4 w-24 h-24" />
        <h1 className="text-2xl font-bold"> <p style={{ color: 'white' }}>Bridging Abilities Database System</p></h1>
        <div className="absolute bottom-[-20px] left-0 right-0 h-10 bg-white rounded-t-full" />
      </div>
      
      <div className="flex-grow flex justify-center items-start pt-20">
        <div className="w-full max-w-md p-8">
          <div className="flex mb-8">
            <div className="flex-1 text-center border-b-2 border-blue-500 pb-2">
              <span className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm mr-2">1</span>
              Step 1
            </div>
            <div className="flex-1 text-center text-gray-400">
              <span className="bg-gray-200 text-gray-400 rounded-full px-3 py-1 text-sm mr-2">2</span>
              Step 2
            </div>
            <div className="flex-1 text-center text-gray-400">
              <span className="bg-gray-200 text-gray-400 rounded-full px-3 py-1 text-sm mr-2">3</span>
              Step 3
            </div>
          </div>
          <form>
            <div className="mb-6">
              <input
                type="email"
                className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email Address"
              />
            </div>
            <div className="mb-6">
              <button
                type="button"
                className="w-full px-4 py-2 text-white bg-[#1a73e8] rounded-lg hover:bg-[#1765cc] focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
              >
                <p style={{ color: 'white' }}>SEND CODE</p>
              </button>
            </div>
            <div className="mb-6">
              <input
                type="text"
                className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Verification Code"
              />
            </div>
            <Link href="./reset-password-step2">
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-[#1a73e8] rounded-lg hover:bg-[#1765cc] focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
              >
                <p style={{ color: 'white' }}>RESET PASSWORD</p>
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
