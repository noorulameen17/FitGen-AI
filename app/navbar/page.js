"use client";

import Link from 'next/link';
import { Home, BarChart2, FileInput, MessageSquare, Menu } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { useState } from 'react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/dashboard', icon: BarChart2, label: 'Dashboard' },
  { href: '/healthInput', icon: FileInput, label: 'Health Input' },
  { href: '/healthChat', icon: MessageSquare, label: 'Chat' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop navigation - centered */}
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
            <div className="flex space-x-8">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-opacity-10 transition-all duration-300 ${
                    index === 0 ? 'hover:bg-blue-500 hover:text-blue-500 hover:shadow-[0_0_20px_3px_rgba(59,130,246,0.3)]' :
                    index === 1 ? 'hover:bg-green-500 hover:text-green-500 hover:shadow-[0_0_20px_3px_rgba(34,197,94,0.3)]' :
                    index === 2 ? 'hover:bg-red-500 hover:text-red-500 hover:shadow-[0_0_20px_3px_rgba(239,68,68,0.3)]' :
                    index === 3 ? 'hover:bg-purple-500 hover:text-purple-500 hover:shadow-[0_0_20px_3px_rgba(168,85,247,0.3)]' :
                    index === 4 ? 'hover:text-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]' :
                    'hover:bg-yellow-500 hover:text-yellow-500 hover:shadow-[0_0_20px_3px_rgba(234,179,8,0.3)]'
                  }`}
                >
                  <item.icon className={`h-5 w-5 mr-1 ${
                    index === 0 ? 'text-blue-500' :
                    index === 1 ? 'text-green-500' :
                    index === 2 ? 'text-red-500' :
                    index === 3 ? 'text-purple-500' :
                    index === 4 ? 'text-orange-500' :
                    'text-yellow-500'
                  }`} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* UserButton - absolute positioned */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-opacity-10 transition-all duration-300 ${
                  index === 0 ? 'hover:bg-blue-500 hover:text-blue-500 hover:shadow-[0_0_20px_3px_rgba(59,130,246,0.3)]' :
                  index === 1 ? 'hover:bg-green-500 hover:text-green-500 hover:shadow-[0_0_20px_3px_rgba(34,197,94,0.3)]' :
                  index === 2 ? 'hover:bg-red-500 hover:text-red-500 hover:shadow-[0_0_20px_3px_rgba(239,68,68,0.3)]' :
                  index === 3 ? 'hover:bg-purple-500 hover:text-purple-500 hover:shadow-[0_0_20px_3px_rgba(168,85,247,0.3)]' :
                  index === 4 ? 'hover:text-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]' :
                  'hover:bg-yellow-500 hover:text-yellow-500 hover:shadow-[0_0_20px_3px_rgba(234,179,8,0.3)]'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className={`h-5 w-5 mr-2 ${
                    index === 0 ? 'text-blue-500' :
                    index === 1 ? 'text-green-500' :
                    index === 2 ? 'text-red-500' :
                    index === 3 ? 'text-purple-500' :
                    index === 4 ? 'text-orange-500' :
                    'text-yellow-500'
                  }`} />
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}