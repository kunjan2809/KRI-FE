'use client';

import { usePathname } from 'next/navigation';
import ThemeProvider from 'src/theme';
import { SnackbarProvider } from 'src/components/snackbar';
import { AuthProvider } from 'src/auth/context/jwt';
import { SettingsProvider } from 'src/components/settings';
import { LocalizationProvider } from 'src/locales';
import UserHeader from 'src/components/user-header';
import ConditionalFooter from 'src/components/conditional-footer';

// ----------------------------------------------------------------------

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

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
              {!isAdminPage && <UserHeader />}
              {children}
              <ConditionalFooter />
            </SnackbarProvider>
          </ThemeProvider>
        </LocalizationProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
