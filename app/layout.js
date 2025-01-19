"use client";

import { Inter } from 'next/font/google';
import { ClerkProvider, RedirectToSignIn } from '@clerk/nextjs';
import './globals.css';
import Link from 'next/link';
import { Home, BarChart2, FileInput, Utensils, MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/dashboard', icon: BarChart2, label: 'Dashboard' },
  { href: '/healthInput', icon: FileInput, label: 'Health Input' },
  { href: '/chat', icon: MessageSquare, label: 'Chat' },
];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const publicPages = ["/", "/sign-in", "/sign-up"];

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <nav className="bg-white shadow-md">
            <div className="max-w-3xl sm:px-6 lg:px-8 mx-auto">
              <div className="flex justify-between h-14">
                <div className="flex ml-28 space-x-9">
                  {navItems.map((item, index) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 ${
                        index === 0 ? 'hover:text-blue-500' :
                        index === 1 ? 'hover:text-green-500' :
                        index === 2 ? 'hover:text-red-500' :
                        index === 3 ? 'hover:text-purple-500' :
                        'text-yellow-500'
                      }`}
                    >
                      <item.icon className={`h-5 w-5 mr-1 ${
                        index === 0 ? 'text-blue-500' :
                        index === 1 ? 'text-green-500' :
                        index === 2 ? 'text-red-500' :
                        index === 3 ? 'text-purple-500' :
                        'text-yellow-500'
                      }`} />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 min-h-screen pt-16 pl-4">
            {publicPages.includes(pathname) ? (
              children
            ) : (
              <RedirectToSignIn />
            )}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
