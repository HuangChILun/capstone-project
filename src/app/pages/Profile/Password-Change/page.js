"use client"

import { useEffect, useState } from 'react';
import { Label } from "@/app/components/HomeUi/label"
import { Input } from "@/app/components/HomeUi/input"
import { Button } from "@/app/components/HomeUi/button"
import Nav from "@/app/components/Navigation-Bar/NavBar"
import Cookies from 'js-cookie';

const user = JSON.parse(localStorage.getItem('user'));

export default function PasswordChange() {


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
  return (
    <div className="flex min-h-screen">
  <Nav access={isAdmin} />
  <main className="flex-1 p-8 relative flex items-center justify-center">
    <div>
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <Input id="current-password" type="password" placeholder="Input" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input id="new-password" type="password" placeholder="Input" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input id="confirm-password" type="password" placeholder="Input" />
        </div>
        <Button className="bg-blue-500 text-white w-full">Change Password</Button>
      </form>
    </div>
  </main>
</div>
);
}