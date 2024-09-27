"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/app/components/HomeUi/button";
import { Input } from "@/app/components/HomeUi/input";
import Nav from "@/app/components/Navigation-Bar/NavBar";
import Cookies from "js-cookie";

export default function Edit() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
    province: "",
  });

  const router = useRouter();
  const token = Cookies.get("token");
  const user = JSON.parse(localStorage.getItem("user"));
  
  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/auth/users/${user.id}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/auth/users/${user.id}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        router.push("/Profile/View-Profile");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Nav */}
      <Nav access={user.isAdmin} />

      <main className="flex-1 p-8 relative">
        <div className="border p-8 rounded-lg mt-8 relative">
          {/* Save Button inside the profile box */}
          <div className="absolute top-5 right-5">
            <Button className="bg-blue-500 text-white" onClick={handleSubmit}>
              Save
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="font-semibold mb-2">First Name</p>
              <Input name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div>
              <p className="font-semibold mb-2">Last Name</p>
              <Input name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            <div>
              <p className="font-semibold mb-2">Email</p>
              <Input name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <p className="font-semibold mb-2">Phone Number</p>
              <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </div>
            <div>
              <p className="font-semibold mb-2">Address</p>
              <Input name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div>
              <p className="font-semibold mb-2">City</p>
              <Input name="city" value={formData.city} onChange={handleChange} />
            </div>
            <div>
              <p className="font-semibold mb-2">Postal Code</p>
              <Input name="postalCode" value={formData.postalCode} onChange={handleChange} />
            </div>
            <div>
              <p className="font-semibold mb-2">Province</p>
              <Input name="province" value={formData.province} onChange={handleChange} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
