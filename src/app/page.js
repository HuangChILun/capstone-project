"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://capstone-project-backend-weld.vercel.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set('token', data.token, { expires: 7 }); // set cookie will expire in 7 days
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log("Login Success"); //test
        router.push("/pages/Home/Home-Page");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="w-full bg-[#0B2C59] text-white text-center py-10">
        <img src="/assets/Bridging_Abilities_Logo.jpg" alt="Logo" className="mx-auto mb-4 w-24 h-24" />
        <h1 className="text-2xl font-bold" ><p style={{ color: 'white' }}>Bridging Abilities Database System</p></h1>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
          <form onSubmit={handleSignIn}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email Address"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Password"
                required
              />
            </div>
            <div className="mb-6 text-right">
              <Link href="/pages/Login/ForgotPassword" className="text-sm text-[#0000FF] hover:underline">
                Forgot your password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2  bg-[#1a73e8] rounded-lg hover:bg-[#1765cc] focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            >
              <p style={{ color: 'white' }}>SIGN IN</p>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

