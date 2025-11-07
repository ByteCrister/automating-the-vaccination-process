'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BellIcon, ProfileIcon, SettingsIcon, LogoutIcon } from './icons';
import { Button } from '@/components/ui/adil/Button';

interface HeaderProps {
  user?: {
    name?: string;
    email?: string;
    image?: string;
  } | null;
  unreadNotifications?: number;
  onLogout?: () => void;
}

export function Header({ user, unreadNotifications = 0, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3" aria-label="Home">
              <Image src="/logo.png" alt="VaxEPI" width={32} height={32} className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900">VaxEPI</span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label={`Notifications ${unreadNotifications > 0 ? `(${unreadNotifications} unread)` : ''}`}
            >
              <BellIcon />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'Profile'}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <ProfileIcon className="h-4 w-4 text-gray-600" />
                </div>
              )}

              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              {/* Dropdown Menu */}
              <div className="relative group">
                <button
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label="User menu"
                >
                  <SettingsIcon />
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <ProfileIcon className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <SettingsIcon className="h-4 w-4" />
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogoutIcon className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
