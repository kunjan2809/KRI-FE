import { ReactNode } from 'react';
import { Box } from '@mui/material';

import UserHeader from 'src/components/user-header';
import UserFooter from 'src/components/user-footer';

// ----------------------------------------------------------------------

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <UserHeader />
      <Box component="main" sx={{ pt: 0 }}>
        {children}
      </Box>
      <UserFooter />
    </Box>
  );
}
