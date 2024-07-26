"use client"

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AuthWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('token');
      const publicPaths = ['/login', '/register', '/forgot-password']; // 添加其他不需要認證的路徑

      if (!token && !publicPaths.includes(pathname)) {
        router.push('/login');
      } else if (token && publicPaths.includes(pathname)) {
        router.push('/pages/Home/Home-Page'); // 如果已登錄用戶嘗試訪問登錄頁面，重定向到主頁
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (!isAuthorized) {
    return <div>Loading...</div>; // 或者返回一個加載指示器
  }

  return <>{children}</>;
}