import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import ClientLayout from './client-layout';

import 'src/global.css';

// ----------------------------------------------------------------------

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KRI Platform',
  description: 'Discover unique handmade treasures from independent artists and creators',
  icons: {
    icon: '/assets/mini-logo.svg',
    shortcut: '/assets/mini-logo.svg',
    apple: '/assets/mini-logo.svg',
  },
};

// ----------------------------------------------------------------------

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/assets/mini-logo.svg" />
      </head>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
