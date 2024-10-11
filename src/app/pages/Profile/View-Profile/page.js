"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/app/components/HomeUi/button";
import Nav from "@/app/components/Navigation-Bar/NavBar";
import Cookies from "js-cookie";
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";


export default function Profile() {
  const [userData, setUserData] = useState(null);
  const token = Cookies.get("token");
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!token) {
      router.push("/");
      console.log("need login");
      return;
    }
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
        setIsAdmin(data.role === "admin");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

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
              <p>{user.isAdmin === 1 ? "Admin" : "Service Provider"}</p>
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


function FilePenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
