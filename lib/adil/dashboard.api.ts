// Dashboard API functions
import { CitizenProfile, VaccinationRecord, Appointment, VaccinationCenter, Notification, VaccineCard } from '@/types/adil/dashboard.types';

class DashboardAPI {
  private baseURL = '/api';

  // Citizen Profile
  async getProfile(): Promise<CitizenProfile> {
    const response = await fetch(`${this.baseURL}/me`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  }

  async updateProfile(data: Partial<CitizenProfile>): Promise<CitizenProfile> {
    const response = await fetch(`${this.baseURL}/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  }

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    const response = await fetch(`${this.baseURL}/appointments`);
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return response.json();
  }

  async createAppointment(data: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> {
    const response = await fetch(`${this.baseURL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create appointment');
    return response.json();
  }

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
    const response = await fetch(`${this.baseURL}/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update appointment');
    return response.json();
  }

  async cancelAppointment(id: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/appointments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to cancel appointment');
  }

  // Vaccination Centers
  async getCenters(): Promise<VaccinationCenter[]> {
    const response = await fetch(`${this.baseURL}/centers`);
    if (!response.ok) throw new Error('Failed to fetch centers');
    return response.json();
  }

  // Vaccination Records
  async getVaccinationRecords(): Promise<VaccinationRecord[]> {
    const response = await fetch(`${this.baseURL}/vaccines`);
    if (!response.ok) throw new Error('Failed to fetch vaccination records');
    return response.json();
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    const response = await fetch(`${this.baseURL}/notifications`);
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  }

  async markNotificationRead(id: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/notifications/${id}/read`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
  }

  // Digital Card
  async getVaccineCard(): Promise<VaccineCard> {
    const response = await fetch(`${this.baseURL}/vaccine-card`);
    if (!response.ok) throw new Error('Failed to fetch vaccine card');
    return response.json();
  }

  async downloadVaccineCard(format: 'pdf' | 'png' = 'pdf'): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/vaccine-card/download?format=${format}`);
    if (!response.ok) throw new Error('Failed to download vaccine card');
    return response.blob();
  }
}

export const dashboardAPI = new DashboardAPI();
