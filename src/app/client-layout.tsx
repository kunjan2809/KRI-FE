'use client';

import { usePathname } from 'next/navigation';
import ThemeProvider from 'src/theme';
import { SnackbarProvider } from 'src/components/snackbar';
import { AuthProvider } from 'src/auth/context/jwt';
import { SettingsProvider } from 'src/components/settings';
import { LocalizationProvider } from 'src/locales';
import UserHeader from 'src/components/user-header';
import ConditionalFooter from 'src/components/conditional-footer';
import { Box } from '@mui/material';
// ----------------------------------------------------------------------

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const isAuthPage = pathname?.startsWith('/auth');

  return (
    <AuthProvider>
      <SettingsProvider
        defaultSettings={{
          themeMode: 'light',
          themeDirection: 'ltr',
          themeContrast: 'default',
          themeLayout: 'vertical',
          themeColorPresets: 'default',
          themeStretch: false,
        }}
      >
        <LocalizationProvider>
          <ThemeProvider>
            <SnackbarProvider>
              {!isAdminPage && !isAuthPage && <UserHeader />}
              <Box sx={{ paddingTop: !isAdminPage && !isAuthPage ? '80px' : '0px' }}>
                {children}
              </Box>
              <ConditionalFooter />
            </SnackbarProvider>
          </ThemeProvider>
        </LocalizationProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
