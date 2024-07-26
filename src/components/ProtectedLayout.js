"use client"
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('token');
      const publicPaths = ['/login', '/register', '/forgot-password']; // add the page without authentication

      if (!token && !publicPaths.includes(pathname)) {
        router.push('/');
      } else if (token && publicPaths.includes(pathname)) {
        router.push('/pages/Home/Home-Page'); // if the user already login 
        //but they tried to go to login page, they will redirect to home page 
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (!isAuthorized) {

    return <div>Loading...</div>;
  }

  return <>{children}</>;
}