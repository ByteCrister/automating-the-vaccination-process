// Dashboard types for citizen vaccination portal

export interface CitizenProfile {
  id: string;
  nid: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address: {
    district: string;
    upazila: string;
    union: string;
    village?: string;
  };
  photoUrl?: string;
  registrationStatus: 'draft' | 'submitted' | 'verified';
  createdAt: string;
  updatedAt: string;
}

export interface VaccinationRecord {
  id: string;
  citizenId: string;
  vaccineType: string;
  doseNumber: number;
  totalDoses: number;
  vaccinationDate: string;
  vaccinationCenter: string;
  batchNumber?: string;
  administeredBy?: string;
  nextDueDate?: string;
  certificateUrl?: string;
  status: 'completed' | 'scheduled' | 'overdue';
}

export interface Appointment {
  id: string;
  citizenId: string;
  centerId: string;
  centerName: string;
  vaccineType: string;
  doseNumber: number;
  appointmentDate: string;
  appointmentTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'missed';
  qrCode?: string;
  notes?: string;
  createdAt: string;
}

export interface VaccinationCenter {
  id: string;
  name: string;
  address: string;
  district: string;
  upazila: string;
  phone: string;
  capacity: number;
  availableSlots: number;
  vaccines: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Notification {
  id: string;
  citizenId: string;
  type: 'appointment_reminder' | 'vaccine_due' | 'record_update' | 'system_update';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface DashboardStats {
  totalVaccinations: number;
  upcomingAppointments: number;
  completedDoses: number;
  pendingRecords: number;
}

export interface VaccineCard {
  citizenId: string;
  fullName: string;
  nid: string;
  dateOfBirth: string;
  vaccinations: VaccinationRecord[];
  qrCode: string;
  issuedAt: string;
  expiresAt?: string;
}

export interface RegistrationForm {
  personal: {
    fullName: string;
    nid: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
  };
  contact: {
    phone: string;
    email?: string;
    address: {
      district: string;
      upazila: string;
      union: string;
      village?: string;
    };
  };
  documents: {
    photo?: File;
    nidDocument?: File;
  };
}
