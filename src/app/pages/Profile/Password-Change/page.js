"use client"

import { useEffect, useState } from 'react';
import { Label } from "@/app/components/HomeUi/label"
import { Input } from "@/app/components/HomeUi/input"
import { Button } from "@/app/components/HomeUi/button"
import Nav from "@/app/components/Navigation-Bar/NavBar"
import Cookies from 'js-cookie';

const user = JSON.parse(localStorage.getItem('user'));

export default function PasswordChange() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage]                 = useState('');

  const isAdmin =() =>{
    if (user.isAdmin === 1){
      return true;
    } else {
      return false;
    }
  }
  const token = Cookies.get('token');
    if (!token) {
      router.push('/');
      console.log("need login");
      return;
  }

  const ChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match.');
      return;
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/users/${user.id}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, newPassword }),
      });

      if (response.ok) {
        setMessage('Password has been changed successfully.');
        // Navigate to the view-profile page
        router.push('./view-profile');
      } else {
        const data = await response.json();
        setMessage(data.error || 'Incorrect Current Password.');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred. Please try again later.');
    }

    setConfirmPassword('');
    setCurrentPassword('');
    setNewPassword('');
  };
  
  return (
    <div className="flex min-h-screen">
      <Nav access={isAdmin()} />
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <form onSubmit={ChangePassword} className="space-y-4">
            {message && <p className="text-red-500">{message}</p>}
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="bg-blue-500 text-white w-full">
              Change Password
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}