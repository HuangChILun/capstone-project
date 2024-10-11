"use client";

import { useEffect, useState } from "react";
import { Label } from "@/app/components/HomeUi/label";
import { Input } from "@/app/components/HomeUi/input";
import { Button } from "@/app/components/HomeUi/button";
import Nav from "@/app/components/Navigation-Bar/NavBar";
import Cookies from "js-cookie";
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";
import { useRouter } from "next/navigation";

export default function PasswordChange() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const router = useRouter();
  const token = Cookies.get("token");
  if (!token) {
    router.push("/");
    console.log("need login");
    return;
  }

  const ChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/users/${user.id}/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      if (response.ok) {
        setMessage("Password has been changed successfully.");
      } else {
        const data = await response.json();
        setMessage(data.error || "Incorrect Current Password.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred. Please try again later.");
    }

    setConfirmPassword("");
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div style={styles.pageContainer}>
      <HoriNav user={user} />
      <main style={styles.mainContent}>
        <div style={styles.frame}>
          <div style={styles.formHeader}>
            <LockIcon style={styles.headerIcon} />
            <h2 style={styles.headerText}>Change Password</h2>
          </div>
          <form onSubmit={ChangePassword} style={styles.form}>
            {message && <p style={styles.errorMessage}>{message}</p>}
            <div style={styles.inputGroup}>
              <label htmlFor="current-password" style={styles.label}>
                Current Password
              </label>
              <Input
                id="current-password"
                type="password"
                placeholder="Input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="new-password" style={styles.label}>
                New Password
              </label>
              <Input
                id="new-password"
                type="password"
                placeholder="Input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="confirm-password" style={styles.label}>
                Confirm Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
              />
            </div>
            {/* Buttons for "Change Password" and "Cancel" */}
          <div style={styles.buttonContainer}>
            <Button type="submit">
              Change Password
            </Button>
            <Button type="button" style={styles.cancelButton} onClick={() => router.push('./View-Profile')}>
              Cancel
            </Button>
          </div>
          </form>
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f7f7",
  },
  frame: {
    width: "100%",
    maxWidth: "400px",
    padding: "32px",
    border: "1px solid #e5e5e5",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  },
  formHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
  },
  headerIcon: {
    width: "24px",
    height: "24px",
    color: "#007BFF",
  },
  headerText: {
    fontSize: "24px",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  errorMessage: {
    color: "#d9534f",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontWeight: "600",
  },
  input: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "24px",
  },
  changePasswordButton: {
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
};

function LockIcon(props) {
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
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
