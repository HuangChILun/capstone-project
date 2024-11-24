"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent } from "@/app/components/HomeUi/tabs"
import StaffRegistrationForm from '@/app/components/Add-Staff/StaffRegistrationForm';
import HoriNav from '@/app/components/Navigation-Bar/HoriNav';

export const dynamic = 'force-dynamic';

export default function AddStaff() {
  const router = useRouter();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/');
    }
  }, [router]);
  if (!user) {
    return null; // or a loading indicator
  }
  return (
    <div style={styles.pageContainer}>
      <HoriNav user={user} />
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

