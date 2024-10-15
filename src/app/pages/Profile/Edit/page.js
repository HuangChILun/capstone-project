"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/app/components/HomeUi/button";
import { Input } from "@/app/components/HomeUi/input";
import Cookies from "js-cookie";
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";
{/*!!! notice when the 
  user or admin tried to edit 
  the information(profile and edit staff page), the user can not 
  login duo to some unknown error*/}
export default function Edit() {
  const [formData, setFormData] = useState({
    //firstName: "",
    //lastName: "",
    //email: "",
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/users/${user.userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setFormData({
          phoneNumber: data.phoneNumber,
    address: data.address,
    city: data.city,
    postalCode: data.postalCode,
    province: data.province,
        });
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/users/${user.userId}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      console.log(formData);
      if (response.ok) {
        alert("Profile updated successfully!");
        window.location.href = "./View-Profile"; //window.location.href will allow redirecting to another page after user click on the ok button in alert
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  

  return (
    <div style={styles.pageContainer}>
      <HoriNav user={user} />
      <main style={styles.mainContent}>
        <div style={styles.profileContainer}>
          {/* Save and Cancel Buttons */}
          <div style={styles.buttonContainer}>
            <Button onClick={handleSubmit}>
              Save
            </Button>
            <Button style={styles.cancelButton} onClick={() => router.push("./View-Profile")}>
              Cancel
            </Button>
          </div>
  
          {/* Edit Profile Form */}
          <div style={styles.profileGrid}>
            {/* <div>
              <p style={styles.fieldLabel}>First Name</p>
              <Input name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div>
              <p style={styles.fieldLabel}>Last Name</p>
              <Input name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            <div>
              <p style={styles.fieldLabel}>Email</p>
              <Input name="email" value={formData.email} onChange={handleChange} />
            </div> */}
            <div>
              <p style={styles.fieldLabel}>Phone Number</p>
              <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </div>
            <div>
              <p style={styles.fieldLabel}>Address</p>
              <Input name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div>
              <p style={styles.fieldLabel}>City</p>
              <Input name="city" value={formData.city} onChange={handleChange} />
            </div>
            <div>
              <p style={styles.fieldLabel}>Postal Code</p>
              <Input name="postalCode" value={formData.postalCode} onChange={handleChange} />
            </div>
            <div>
              <p style={styles.fieldLabel}>Province</p>
              <Input name="province" value={formData.province} onChange={handleChange} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  mainContent: {
    flex: 1,
    padding: "84px 32px 32px 32px", // Padding to ensure content is below the navbar
    backgroundColor: "#f8f9fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
    marginBottom: "24px",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
  },
  profileGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "32px",
  },
  fieldLabel: {
    fontWeight: "600",
    marginBottom: "8px",
  },
};
