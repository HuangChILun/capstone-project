"use client";
import Link from "next/link";
export default function ResetPasswordStep2() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full bg-[#0B2C59] text-white text-center py-10 relative">
        <img src="/assets/Bridging_Abilities_Logo.png" alt="Bridging Abilities Inc. Logo" className="mx-auto mb-4 w-24 h-24" />
        <h1 className="text-2xl font-bold">Bridging Abilities Database System</h1>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white" style={{ clipPath: 'url(#wave)' }}></div>
        <svg width="0" height="0">
          <defs>
            <clipPath id="wave" clipPathUnits="objectBoundingBox">
              <path d="M0,1 C0.3,0.8 0.7,0.8 1,1 V1 H0 V1"></path>
            </clipPath>
          </defs>
        </svg>
      </div>
      <div className="w-full max-w-md mt-12 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <span className="text-gray-500">Step 1</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-sm">2</span>
            </div>
            <span className="text-blue-500 font-medium">Step 2</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
              <span className="text-gray-500 text-sm">3</span>
            </div>
            <span className="text-gray-500">Step 3</span>
          </div>
        </div>
        <form>
          <div className="mb-6">
            <input
              type="password"
              className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="New Password"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Re-enter New Password"
            />
          </div>
          <Link href="./Password-Reset-Confirmation">
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          >
            RESET PASSWORD
          </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
