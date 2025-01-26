"use client";

import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { usePathname } from 'next/navigation';
import Navbar from './navbar/page';
import "@coreui/coreui/dist/css/coreui.min.css";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = typeof window !== 'undefined' ? usePathname() : '';
  const publicPages = ["/", "/sign-in", "/sign-up"];
  const showNavbar = !publicPages.includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClerkProvider navigate={(to) => router.push(to)}>
          {showNavbar && <Navbar />}
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 min-h-screen">
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}
