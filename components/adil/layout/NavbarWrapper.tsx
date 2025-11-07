'use client';

import { usePathname } from 'next/navigation';
import Header from '../navbar/Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/signin' || pathname === '/signup' || pathname === '/forgot';

  if (isAuthPage) {
    return null;
  }

  return <Header />;
}