'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader, Grid, Card } from '@/components/adil/citizenDashboard/ContentGrid';
import { SummaryCard, QuickActions, NotificationList } from '@/components/adil/citizenDashboard/SummaryCard';
import { CalendarIcon, DocumentIcon, CheckIcon } from '@/components/adil/citizenDashboard/icons';
import { dashboardAPI } from '@/lib/adil/dashboard.api';
import { CitizenProfile, VaccinationRecord, Appointment, Notification, DashboardStats } from '@/types/adil/dashboard.types';
import { formatDate, getVaccinationProgress, getUpcomingAppointments } from '@/utils/adil/dashboard.utils';
import { QUICK_ACTIONS } from '@/constants/adil/dashboard.const';

export default function DashboardOverview() {
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [vaccinationRecords, setVaccinationRecords] = useState<VaccinationRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileData, recordsData, appointmentsData, notificationsData] = await Promise.all([
          dashboardAPI.getProfile(),
          dashboardAPI.getVaccinationRecords(),
          dashboardAPI.getAppointments(),
          dashboardAPI.getNotifications(),
        ]);

        setProfile(profileData);
        setVaccinationRecords(recordsData);
        setAppointments(appointmentsData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Calculate stats
  const completedVaccinations = vaccinationRecords.filter(r => r.status === 'completed').length;
  const upcomingAppointments = getUpcomingAppointments(appointments).length;
  const totalDoses = vaccinationRecords.reduce((sum, record) => sum + record.totalDoses, 0);
  const completedDoses = vaccinationRecords.filter(r => r.status === 'completed').length;

  // Get next appointment
  const nextAppointment = getUpcomingAppointments(appointments)[0];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${profile?.fullName?.split(' ')[0] || 'Citizen'}!`}
        description="Here's an overview of your vaccination status and upcoming appointments."
      />

      {/* Summary Cards */}
      <Grid columns={4}>
        <SummaryCard
          title="Total Vaccinations"
          value={completedVaccinations}
          subtitle="vaccines completed"
          icon={<CheckIcon className="w-5 h-5 text-green-600" />}
        />

        <SummaryCard
          title="Upcoming Appointments"
          value={upcomingAppointments}
          subtitle={nextAppointment ? `Next: ${formatDate(nextAppointment.appointmentDate)}` : 'No upcoming appointments'}
          icon={<CalendarIcon className="w-5 h-5 text-blue-600" />}
        />

        <SummaryCard
          title="Dose Progress"
          value={`${completedDoses}/${totalDoses}`}
          subtitle={`${Math.round((completedDoses / totalDoses) * 100)}% complete`}
          icon={<DocumentIcon className="w-5 h-5 text-purple-600" />}
        />

        <SummaryCard
          title="Registration Status"
          value={profile?.registrationStatus || 'Unknown'}
          subtitle="Profile verification"
          status={profile?.registrationStatus}
        />
      </Grid>

      {/* Quick Actions & Notifications */}
      <Grid columns={2}>
        <QuickActions actions={QUICK_ACTIONS} />

        <NotificationList
          notifications={notifications}
          maxItems={3}
        />
      </Grid>

      {/* Vaccination Progress */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vaccination Progress</h3>
        <div className="space-y-4">
          {['COVID-19', 'Measles', 'Polio', 'DPT', 'Hepatitis B'].map((vaccineType) => {
            const progress = getVaccinationProgress(vaccinationRecords, vaccineType);
            if (progress.total === 0) return null;

            return (
              <div key={vaccineType} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">{vaccineType}</span>
                  <span className="text-gray-600">{progress.completed}/{progress.total} doses</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-green-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percentage}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
