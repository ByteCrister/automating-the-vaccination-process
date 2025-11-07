'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ProfileIcon,
  NIDIcon,
  CalendarIcon,
  DocumentIcon,
  QRIcon,
  BellIcon,
  SettingsIcon,
  ChevronIcon
} from './icons';
import { DASHBOARD_NAV_ITEMS } from '@/constants/adil/dashboard.const';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  progressBadge?: boolean;
}

const iconMap = {
  home: ProfileIcon,
  'user-plus': NIDIcon,
  'file-text': DocumentIcon,
  'credit-card': QRIcon,
  calendar: CalendarIcon,
  bell: BellIcon,
  'help-circle': SettingsIcon,
};

export function Sidebar({ isOpen, onToggle, progressBadge = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {DASHBOARD_NAV_ITEMS.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap] || ProfileIcon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                        isActive
                          ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => {
                        if (window.innerWidth < 1024) onToggle();
                      }}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>

                      {/* Progress Badge */}
                      {item.label === 'Overview' && progressBadge && (
                        <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                          75%
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              VaxEPI Dashboard v1.0
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-20 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={isOpen}
        aria-controls="sidebar"
      >
        <ChevronIcon direction={isOpen ? 'left' : 'right'} className="h-5 w-5 text-gray-600" />
      </button>
    </>
  );
}
