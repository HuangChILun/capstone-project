"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/app/components/HomeUi/input";
import { Button } from "@/app/components/HomeUi/button";
import HoriNav from "@/app/components/Navigation-Bar/HoriNav";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export const dynamic = 'force-dynamic';

export default function PasswordChange() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [validations, setValidations] = useState({
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
    minLength: false,
  });
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();

  
  useEffect(() => {
    const token = Cookies.get("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/");
      console.log("need login");
      return;
    }

    setToken(token);
    setUser(JSON.parse(storedUser));
  }, [router]);

  if (!user || !token) {
    return <div>Loading...</div>;
  }

  // Check new password criteria
  const handleNewPasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);

    // Validation checks
    setValidations({
      upperCase: /[A-Z]/.test(password),
      lowerCase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      minLength: password.length >= 8,
    });
  };

  const ChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      alert("Current password is required.");
      return;
    }

    if (
      !validations.upperCase ||
      !validations.lowerCase ||
      !validations.number ||
      !validations.specialChar ||
      !validations.minLength
    ) {
      alert("New password does not meet the required criteria.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    if (currentPassword === newPassword){
      alert("New password cannot be same as current password");
      return;
    }
    

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_IP}/users/${user.userId}/change-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: currentPassword,
            newPassword: newPassword,
          }),
        }
      );

      if (response.ok) {
        alert("Password has been changed successfully.");
        window.location.href = "./View-Profile";
      } else {
        const data = await response.json();
        alert(data.error || "Password change failed");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later.");
    }

    setConfirmPassword("");
    setCurrentPassword("");
    setNewPassword("");
  };

  const closeModal = () => {
    setModalVisible(false);
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
                onChange={handleNewPasswordChange}
                style={styles.input}
              />
              <ul style={styles.validationList}>
                <li>
                  {validations.upperCase ? "✔️" : "❌"} At least one uppercase letter
                </li>
                <li>
                  {validations.lowerCase ? "✔️" : "❌"} At least one lowercase letter
                </li>
                <li>
                  {validations.number ? "✔️" : "❌"} At least one number
                </li>
                <li>
                  {validations.specialChar ? "✔️" : "❌"} At least one special character
                  (!@#$%^&*)
                </li>
                <li>
                  {validations.minLength ? "✔️" : "❌"} At least 8 characters long
                </li>
              </ul>
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
            <div style={styles.buttonContainer}>
              <Button type="submit">Change Password</Button>
              <Button
                type="button"
                style={styles.cancelButton}
                onClick={() => router.push("./View-Profile")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>

      {modalVisible && (
        <Modal message={message} onClose={closeModal} />
      )}
    </div>
  );
}

// Modal Component
const Modal = ({ message, onClose }) => {
  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <p>{message}</p>
        <Button onClick={onClose}>OK</Button>
      </div>
    </div>
  );
};

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
    alignItems: "start",
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
  validationList: {
    listStyleType: "none",
    padding: 0,
    margin: "10px 0",
    color: "#333",
  },
};
// Modal Styles
const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
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
