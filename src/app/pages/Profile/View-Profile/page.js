"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/app/components/HomeUi/button";
import Cookies from "js-cookie";
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";


export default function Profile() {
  const [userData, setUserData] = useState(null);
  const token = Cookies.get("token");
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch user data from API
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/users/${user.userId}`, {
        headers: {
          Method: "GET",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/");
      console.log("need login");
      return;
    }
    
    fetchUserData();
  }, [token]);

  
  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div style={styles.pageContainer}>
      {/* Nav */}
      <HoriNav user={user} />

      <main style={styles.mainContent}>
        {/* Profile */}
        <div style={styles.profileContainer}>
          {/* Edit and Change Password Buttons */}
          <div style={styles.buttonContainer}>
            <Link href="../Profile/Edit">
              <Button >Edit</Button>
            </Link>
            <Link href="../Profile/Password-Change">
              <Button >Change Password</Button>
            </Link>
          </div>

          <div style={styles.profileGrid}>
            <div>
              <p style={styles.fieldLabel}>First Name</p>
              <p>{userData.firstName}</p>
            </div>
            <div>
              <p style={styles.fieldLabel}>Last Name</p>
              <p>{userData.lastName}</p>
            </div>
            <div>
              <p style={styles.fieldLabel}>Email</p>
              <p>{userData.email}</p>
            </div>
            <div>
              <p style={styles.fieldLabel}>Phone Number</p>
              <p>{userData.phoneNumber}</p>
            </div>
            <div>
              <p style={styles.fieldLabel}>Address</p>
              <p>{userData.address}</p>
            </div>
            <div>
              <p style={styles.fieldLabel}>City</p>
              <p>{userData.city}</p>
            </div>
            <div>
              <p style={styles.fieldLabel}>Postal Code</p>
              <p>{userData.postalCode}</p>
            </div>
            <div>
              <p style={styles.fieldLabel}>Province</p>
              <p>{userData.province}</p>
            </div>
            <div>
              <p style={styles.fieldLabel}>Role</p>
              <p>{userData.isAdmin === 1 ? "Admin" : "Service Provider"}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Styles
const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  mainContent: {
    flex: 1,
    padding: "84px 32px 32px 32px", // Adding padding to move content below the navbar
    backgroundColor: "#ffffff",
  },
  profileContainer: {
    border: "1px solid #e5e5e5",
    padding: "32px",
    borderRadius: "8px",
    marginTop: "16px",
    position: "relative",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px", // Adds some space between buttons
    marginBottom: "16px", // Adds some space below the buttons and profile content
  },
  editButtonStyle: {
    backgroundColor: "#007BFF",
    color: "#ffffff",
  },
  profileGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "32px",
  },
  fieldLabel: {
    fontWeight: "600",
  },
};

