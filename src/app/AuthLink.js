"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AuthLink({ href, children, ...props }) {
  const router = useRouter();

  const handleClick = (e) => {
    const token = Cookies.get('token');
    const publicPaths = ['/login', '/register', '/forgot-password']; //

    if (!token && !publicPaths.includes(href)) {
      e.preventDefault();
      router.push('/login');
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}