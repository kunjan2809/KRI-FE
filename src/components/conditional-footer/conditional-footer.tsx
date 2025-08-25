'use client';

import { usePathname } from 'next/navigation';
import UserFooter from 'src/components/user-footer';

// ----------------------------------------------------------------------

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return null;
  }

  return <UserFooter />;
}
