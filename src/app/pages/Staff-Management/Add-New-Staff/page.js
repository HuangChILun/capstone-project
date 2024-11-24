"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent } from "@/app/components/HomeUi/tabs"
import StaffRegistrationForm from '@/app/components/Add-Staff/StaffRegistrationForm';
import HoriNav from '@/app/components/Navigation-Bar/HoriNav';



export default function AddStaff() {
  const router = useRouter();
  const admin = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/');
    }
  }, [router]);

  return (
    <div style={styles.pageContainer}>
      <HoriNav user={admin} />
      <main style={styles.mainContent}>
        <Tabs defaultValue="active" style={styles.tabs}>
          <TabsContent value="active">
            <StaffRegistrationForm />
          </TabsContent>
          <TabsContent value="waitlist">
            <p>Waitlist content goes here.</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Styles
const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  mainContent: {
    flex: 1,
    padding: "60px",
    backgroundColor: "#ffffff",
  },
  tabs: {
    width: "100%",
  },
};

