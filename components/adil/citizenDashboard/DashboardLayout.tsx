'use client';

import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ContentGrid } from './ContentGrid';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    name?: string;
    email?: string;
    image?: string;
  } | null;
  unreadNotifications?: number;
  progressBadge?: boolean;
  onLogout?: () => void;
}

export function DashboardLayout({
  children,
  user,
  unreadNotifications = 0,
  progressBadge = false,
  onLogout
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        unreadNotifications={unreadNotifications}
        onLogout={onLogout}
      />

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          progressBadge={progressBadge}
        />

        <ContentGrid sidebarOpen={sidebarOpen}>
          {children}
        </ContentGrid>
      </div>
    </div>
  );
}
