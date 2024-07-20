"use client"
import Link from "next/link";


export default function Login() {

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full bg-[#0B2C59] text-white text-center py-10 relative">
        <img src="./assets/Bridging_Abilities_Logo.jpg" alt="Logo" className="mx-auto mb-4 w-24 h-24" />
        <h1 className="text-2xl font-bold">Bridging Abilities Database System</h1>
        <div className="absolute bottom-[-20px] left-0 right-0 h-10 bg-gray-100 rounded-t-full" />
      </div>
      <div className="w-full max-w-md mt-20 p-8 bg-white shadow-md rounded-lg">
        <form>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email Address"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
            />
          </div>
          <div className="mb-6 text-right">
            <Link href="./pages/Login/ForgotPassword" className="text-sm text-blue-600 hover:underline">
              Forgot your password?
            </Link>
          </div>
          <Link href="/">
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          >
            SIGN IN
          </button>
          </Link>
        </form>
      </div>
    </div>
    
  );
}
