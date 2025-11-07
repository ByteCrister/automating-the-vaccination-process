// Dashboard constants for citizen vaccination portal

export const DASHBOARD_NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: 'home' },
  { label: 'Registration', href: '/dashboard/registration', icon: 'user-plus' },
  { label: 'Vaccine Record', href: '/dashboard/vaccine-record', icon: 'file-text' },
  { label: 'Digital Card', href: '/dashboard/digital-card', icon: 'credit-card' },
  { label: 'Appointments', href: '/dashboard/appointments', icon: 'calendar' },
  { label: 'Notifications', href: '/dashboard/notifications', icon: 'bell' },
  { label: 'Help', href: '/dashboard/help', icon: 'help-circle' },
];

export const QUICK_ACTIONS = [
  { label: 'Book Appointment', href: '/dashboard/appointments', icon: 'calendar', primary: true },
  { label: 'View Vaccine Card', href: '/dashboard/digital-card', icon: 'credit-card' },
  { label: 'Update Info', href: '/dashboard/registration', icon: 'user' },
];

export const VACCINE_TYPES = [
  { id: 'covid19', name: 'COVID-19', doses: 2 },
  { id: 'measles', name: 'Measles', doses: 2 },
  { id: 'polio', name: 'Polio', doses: 4 },
  { id: 'dpt', name: 'DPT', doses: 3 },
  { id: 'hepb', name: 'Hepatitis B', doses: 3 },
  { id: 'hib', name: 'Hib', doses: 3 },
];

export const APPOINTMENT_STATUSES = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  MISSED: 'missed',
} as const;

export const REGISTRATION_STEPS = [
  { id: 'personal', label: 'Personal Info', completed: false },
  { id: 'contact', label: 'Contact Details', completed: false },
  { id: 'documents', label: 'Documents', completed: false },
  { id: 'verification', label: 'Verification', completed: false },
];

export const NOTIFICATION_TYPES = {
  APPOINTMENT_REMINDER: 'appointment_reminder',
  VACCINE_DUE: 'vaccine_due',
  RECORD_UPDATE: 'record_update',
  SYSTEM_UPDATE: 'system_update',
} as const;

export const DASHBOARD_METRICS = {
  TOTAL_VACCINATIONS: 'total_vaccinations',
  UPCOMING_APPOINTMENTS: 'upcoming_appointments',
  COMPLETED_DOSES: 'completed_doses',
  PENDING_RECORDS: 'pending_records',
};
