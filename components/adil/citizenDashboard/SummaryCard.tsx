'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './ContentGrid';
import { formatDate, getStatusColor } from '@/utils/adil/dashboard.utils';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
  status?: string;
  className?: string;
}

export function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  status,
  className
}: SummaryCardProps) {
  return (
    <Card className={className} hover>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 bg-green-50 rounded-lg">
                {icon}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          {trend && (
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`text-sm font-medium ${
                  trend.positive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.positive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500">{trend.label}</span>
            </div>
          )}

          {status && (
            <div className="mt-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}
              >
                {status}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

interface QuickActionsProps {
  actions: Array<{
    label: string;
    href: string;
    icon: React.ReactNode;
    primary?: boolean;
  }>;
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <motion.a
            key={action.href}
            href={action.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
              action.primary
                ? 'border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300'
                : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div className={`p-2 rounded-lg ${action.primary ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {action.icon}
            </div>
            <span className="font-medium text-gray-900">{action.label}</span>
          </motion.a>
        ))}
      </div>
    </Card>
  );
}

interface NotificationListProps {
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    type: string;
  }>;
  maxItems?: number;
}

export function NotificationList({ notifications, maxItems = 3 }: NotificationListProps) {
  const displayNotifications = notifications.slice(0, maxItems);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
        <a href="/dashboard/notifications" className="text-sm text-green-600 hover:text-green-700">
          View all
        </a>
      </div>

      <div className="space-y-3">
        {displayNotifications.length === 0 ? (
          <p className="text-gray-500 text-sm">No notifications</p>
        ) : (
          displayNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-3 rounded-lg border ${
                notification.read
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  notification.read ? 'bg-gray-400' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{formatDate(notification.createdAt)}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}
