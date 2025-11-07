// Dashboard utility functions

import { format, isAfter, isBefore, addDays } from 'date-fns';
import { VaccinationRecord, Appointment, CitizenProfile } from '@/types/adil/dashboard.types';

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy');
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy, HH:mm');
}

export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function getNextDueVaccinations(records: VaccinationRecord[]): VaccinationRecord[] {
  const now = new Date();
  return records
    .filter(record => record.nextDueDate && isAfter(new Date(record.nextDueDate), now))
    .sort((a, b) => new Date(a.nextDueDate!).getTime() - new Date(b.nextDueDate!).getTime());
}

export function getUpcomingAppointments(appointments: Appointment[]): Appointment[] {
  const now = new Date();
  const nextWeek = addDays(now, 7);

  return appointments
    .filter(apt => apt.status === 'scheduled' && isBefore(new Date(apt.appointmentDate), nextWeek))
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
}

export function getVaccinationProgress(records: VaccinationRecord[], vaccineType: string): {
  completed: number;
  total: number;
  percentage: number;
} {
  const vaccineRecords = records.filter(r => r.vaccineType === vaccineType);
  const completed = vaccineRecords.filter(r => r.status === 'completed').length;
  const total = vaccineRecords[0]?.totalDoses || 0;

  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export function generateQRCodeData(profile: CitizenProfile, records: VaccinationRecord[]): string {
  // Create a hashed token for QR code (not raw PII)
  const data = {
    id: profile.id,
    name: profile.fullName,
    dob: profile.dateOfBirth,
    vaccines: records.length,
    lastUpdate: new Date().toISOString(),
  };

  return btoa(JSON.stringify(data));
}

export function validateNID(nid: string): boolean {
  // Bangladesh NID validation (simplified)
  const nidRegex = /^\d{10,17}$/;
  return nidRegex.test(nid);
}

export function validatePhone(phone: string): boolean {
  // Bangladesh phone validation
  const phoneRegex = /^(\+880|880|0)?1[3-9]\d{8}$/;
  return phoneRegex.test(phone);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
    case 'verified':
      return 'text-green-600 bg-green-50';
    case 'scheduled':
    case 'submitted':
      return 'text-blue-600 bg-blue-50';
    case 'cancelled':
    case 'draft':
      return 'text-gray-600 bg-gray-50';
    case 'overdue':
    case 'missed':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

export function getPriorityColor(priority: 'high' | 'medium' | 'low'): string {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50';
    case 'low':
      return 'text-green-600 bg-green-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}
