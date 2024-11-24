"use client";
import React from 'react';
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function HoriNav({ user }) {
  const [isNarrow, setIsNarrow] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Function to get user's initials for the profile button
  const getInitials = (user) => {
    return `${user.firstName[0]}${user.lastName[0]}`;
  };
  // Function to check admin access
  const CheckAdmin = (user) => {
    if (user.isAdmin === 1) {
      return true;
    } else {
      return false;
    }
  };
  // Track window width to determine mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsNarrow(window.innerWidth <= 1175);
    };

    handleResize(); // Initialize state on mount
    window.addEventListener("resize", handleResize); // Add event listener for resize

    // Cleanup the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const userAccess = CheckAdmin(user);
  const userInitial = getInitials(user);
  const router = useRouter();
  const handleLogout = () => {
    // Clear user data from localStorage or cookies
    Cookies.remove("token");
    localStorage.removeItem("user");
    router.push("/"); // Navigate back to login after logout
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <nav style={navStyles.navBar}>
      {isNarrow ? (
        <div style={navStyles.leftSection}>
          <div style={navStyles.hamburgerMenu} onClick={toggleMenu}>
            <HamburgerIcon />
          </div>
          {isNarrow && isMenuOpen && (
            <div style={navStyles.mobileMenu}>
              <NavItem
                icon={<HomeIcon />}
                label="Home"
                page="../Home/Home-Page"
              />
              <NavItem
                icon={<PatientIcon />}
                label="Client"
                page="../Patient/View-Patient-Page"
              />
              {userAccess && (
                <NavItem
                  icon={<StaffIcon />}
                  label="Staff"
                  page="../Staff-Management/View-Staff"
                />
              )}
              <NavItem
                icon={<InvoiceIcon />}
                label="Invoice"
                page="../invoice-management/View-Invoice"
              />
              {/* <NavItem
                icon={<ScheduleIcon />}
                label="Schedule"
                page="../Test/"
              /> */}
            </div>
          )}
        </div>
      ) : (
        <div style={navStyles.leftSection}>
          <NavItem icon={<HomeIcon />} label="Home" page="../Home/Home-Page" />
          <NavItem
            icon={<PatientIcon />}
            label="Client"
            page="../Patient/View-Patient-Page"
          />
          {userAccess && (
            <NavItem
              icon={<StaffIcon />}
              label="Staff"
              page="../Staff-Management/View-Staff"
            />
          )}
          <NavItem
            icon={<InvoiceIcon />}
            label="Invoice"
            page="../invoice-management/View-Invoice"
          />
          {/* <NavItem icon={<ScheduleIcon />} label="Schedule" page="../Test/" /> */}
        </div>
      )}

      <div style={navStyles.centerSection}>
        <img
          src="/icon/logo-1.png"
          alt="Bridging Abilities"
          style={navStyles.organizationLogo}
        />
        <span style={navStyles.organizationName}>Bridging Abilities</span>
      </div>

      <div style={navStyles.rightSection}>
        {/* Profile Button with User Initials */}
        <Link href="../Profile/View-Profile">
          <div style={navStyles.profile}>
            <div style={navStyles.profileCircle}>{userInitial}</div>

            {/* Hover Overlay */}
            {/* {isHovered && (
            <div style={navStyles.overlayContainer}>
              <div style={navStyles.overlay}>
                <p style={navStyles.overlayItem}>Profile</p>
                <p style={navStyles.overlayItem}>Logout</p>
              </div>
            </div>
          )} */}
          </div>
        </Link>
        {/* Log out Button with Power Icon */}
        <div onClick={handleLogout} style={navStyles.navItem}>
          <PowerIcon style={navStyles.iconStyle} />
          <span>Log out</span>
        </div>
      </div>
    </nav>
  );
}
//Nav components

function NavItem({ icon, label, page }) {
  return (
    <Link href={page} passHref>
      <div style={navStyles.navItem}>
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
}

function HamburgerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  );
}

function HomeIcon(props) {
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
      {/* House outline */}
      <path d="M3 12L12 3l9 9" />
      <rect x="5" y="12" width="14" height="9" rx="2" ry="2" />

      {/* Door in the middle */}
      <rect x="10" y="15" width="4" height="6" />
    </svg>
  );
}

function PatientIcon(props) {
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
      {/* Head (larger to represent a child) */}
      <circle cx="12" cy="8" r="4" />

      {/* Body (shorter and smaller) */}
      <path d="M10 14v4" />
      <path d="M14 14v4" />

      {/* Arms (slightly raised for a playful stance) */}
      <path d="M8 14L6 12" />
      <path d="M16 14L18 12" />

      {/* Legs */}
      <path d="M10 18L8 20" />
      <path d="M14 18L16 20" />
    </svg>
  );
}

function StaffIcon(props) {
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
      className="w-5 h-5" // Consistent sizing
    >
      <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function InvoiceIcon(props) {
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
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function ScheduleIcon(props) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PowerIcon(props) {
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
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
      <line x1="12" y1="2" x2="12" y2="12" />
    </svg>
  );
}

//Nav Style
const navStyles = {
  navBar: {
    display: "flex",
    justifyContent: "space-between", // Align items on left, center, and right
    alignItems: "center", // Center items vertically
    padding: "10px 20px",
    //background: "linear-gradient(90deg, #5A6378, #4A90E2, #2E8B57)", // Gradient from greyish blue to greenish blue
    background: "linear-gradient(90deg, #2b538b, #61A86F, #2b538b)", // Gradient from greyish blue to greenish blue
    color: "#fff",
    position: "fixed", // Fixes the navbar at the top
    top: 0,
    width: "100%",
    height: "60px",
    zIndex: 1000,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px", // Spacing between icon and text
    cursor: "pointer",
  },
  hamburgerMenu: {
    cursor: "pointer",
  },
  mobileMenu: {
    position: "absolute",
    top: "60px",
    left: 0,
    background: "#2b538b",
    width: "200px",
    padding: "10px",
    zIndex: 999, // Ensure it's above other content
  },
  leftSection: {
    display: "flex",
    gap: "20px",
  },
  centerSection: {
    position: "absolute", // Make the center section absolutely positioned
    left: "50%", // Move the center section to the middle of the screen
    transform: "translateX(-50%)", // Shift the center section left by 50% of its width to keep it centered
    display: "flex",
    alignItems: "center", // Vertically center items in the section
    justifyContent: "center", // Center items horizontally
  },
  organizationLogo: {
    height: "40px",
    cursor: "pointer",
  },
  organizationName: {
    fontSize: "20px",
    marginLeft: "10px", // Space between the logo and organization name
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  icon: {
    fontSize: "18px",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    color: "#003F87",
    fontWeight: "bold",
    cursor: "pointer",
    position: "relative", // Make the profile container relative for the overlay to work
  },
  profileCircle: {
    textAlign: "center",
    lineHeight: "40px",
  },
  overlayContainer: {
    display: "none", // Initially hidden
    position: "absolute",
    top: "60px", // Position below the profile circle
    right: 0, // Align to the right of the profile circle
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
    zIndex: 10,
    padding: "10px",
  },
  overlayItem: {
    padding: "10px 20px",
    cursor: "pointer",
    color: "#003F87",
    borderBottom: "1px solid #ddd",
    fontSize: "14px",
    textAlign: "left",
  },
  overlayItemLast: {
    padding: "10px 20px",
    cursor: "pointer",
    color: "#003F87",
    fontSize: "14px",
    textAlign: "left",
  },
};
