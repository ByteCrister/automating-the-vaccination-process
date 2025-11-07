// MSW handlers for dashboard API
import { http, HttpResponse } from 'msw';
import { CitizenProfile, VaccinationRecord, Appointment, VaccinationCenter, Notification } from '@/types/adil/dashboard.types';
import { faker } from '@faker-js/faker';

// Mock data generators
function generateMockProfile(): CitizenProfile {
  return {
    id: faker.string.uuid(),
    nid: faker.string.numeric(17),
    fullName: faker.person.fullName(),
    dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }).toISOString().split('T')[0],
    gender: faker.helpers.arrayElement(['male', 'female', 'other']),
    phone: faker.phone.number('+8801#########'),
    email: faker.internet.email(),
    address: {
      district: faker.location.city(),
      upazila: faker.location.city(),
      union: faker.location.city(),
    },
    registrationStatus: faker.helpers.arrayElement(['draft', 'submitted', 'verified']),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  };
}

function generateMockVaccinationRecord(citizenId: string): VaccinationRecord {
  const vaccineTypes = ['COVID-19', 'Measles', 'Polio', 'DPT', 'Hepatitis B'];
  const type = faker.helpers.arrayElement(vaccineTypes);
  const totalDoses = type === 'COVID-19' ? 2 : type === 'Measles' ? 2 : type === 'Polio' ? 4 : 3;

  return {
    id: faker.string.uuid(),
    citizenId,
    vaccineType: type,
    doseNumber: faker.number.int({ min: 1, max: totalDoses }),
    totalDoses,
    vaccinationDate: faker.date.past().toISOString().split('T')[0],
    vaccinationCenter: faker.company.name(),
    batchNumber: faker.string.alphanumeric(10).toUpperCase(),
    status: faker.helpers.arrayElement(['completed', 'scheduled', 'overdue']),
  };
}

function generateMockAppointment(citizenId: string): Appointment {
  return {
    id: faker.string.uuid(),
    citizenId,
    centerId: faker.string.uuid(),
    centerName: faker.company.name(),
    vaccineType: faker.helpers.arrayElement(['COVID-19', 'Measles', 'Polio']),
    doseNumber: faker.number.int({ min: 1, max: 2 }),
    appointmentDate: faker.date.future().toISOString().split('T')[0],
    appointmentTime: faker.helpers.arrayElement(['09:00', '10:00', '11:00', '14:00', '15:00']),
    status: faker.helpers.arrayElement(['scheduled', 'completed', 'cancelled']),
    qrCode: faker.string.alphanumeric(20),
    createdAt: faker.date.recent().toISOString(),
  };
}

function generateMockCenter(): VaccinationCenter {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    district: faker.location.city(),
    upazila: faker.location.city(),
    phone: faker.phone.number('+8802#######'),
    capacity: faker.number.int({ min: 50, max: 200 }),
    availableSlots: faker.number.int({ min: 0, max: 50 }),
    vaccines: faker.helpers.arrayElements(['COVID-19', 'Measles', 'Polio', 'DPT'], { min: 1, max: 3 }),
    coordinates: {
      lat: parseFloat(faker.location.latitude()),
      lng: parseFloat(faker.location.longitude()),
    },
  };
}

function generateMockNotification(citizenId: string): Notification {
  const types = ['appointment_reminder', 'vaccine_due', 'record_update', 'system_update'] as const;
  const titles = {
    appointment_reminder: 'Upcoming Vaccination Appointment',
    vaccine_due: 'Vaccination Due Soon',
    record_update: 'Vaccination Record Updated',
    system_update: 'System Maintenance Notice',
  };

  const type = faker.helpers.arrayElement(types);

  return {
    id: faker.string.uuid(),
    citizenId,
    type,
    title: titles[type],
    message: faker.lorem.sentence(),
    read: faker.datatype.boolean(),
    createdAt: faker.date.recent().toISOString(),
  };
}

// Mock data storage (in-memory)
let mockProfile: CitizenProfile = generateMockProfile();
let mockVaccinationRecords: VaccinationRecord[] = Array.from({ length: 5 }, () => generateMockVaccinationRecord(mockProfile.id));
let mockAppointments: Appointment[] = Array.from({ length: 3 }, () => generateMockAppointment(mockProfile.id));
let mockCenters: VaccinationCenter[] = Array.from({ length: 10 }, generateMockCenter);
let mockNotifications: Notification[] = Array.from({ length: 8 }, () => generateMockNotification(mockProfile.id));

// MSW handlers
export const handlers = [
  // Profile endpoints
  http.get('/api/me', () => {
    return HttpResponse.json(mockProfile);
  }),

  http.put('/api/me', async ({ request }) => {
    const updates = await request.json() as Partial<CitizenProfile>;
    mockProfile = { ...mockProfile, ...updates, updatedAt: new Date().toISOString() };
    return HttpResponse.json(mockProfile);
  }),

  // Appointments endpoints
  http.get('/api/appointments', () => {
    return HttpResponse.json(mockAppointments);
  }),

  http.post('/api/appointments', async ({ request }) => {
    const data = await request.json() as Omit<Appointment, 'id' | 'createdAt'>;
    const newAppointment: Appointment = {
      ...data,
      id: faker.string.uuid(),
      createdAt: new Date().toISOString(),
    };
    mockAppointments.push(newAppointment);
    return HttpResponse.json(newAppointment);
  }),

  http.put('/api/appointments/:id', async ({ request, params }) => {
    const { id } = params;
    const updates = await request.json() as Partial<Appointment>;
    const index = mockAppointments.findIndex(apt => apt.id === id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockAppointments[index] = { ...mockAppointments[index], ...updates };
    return HttpResponse.json(mockAppointments[index]);
  }),

  http.delete('/api/appointments/:id', ({ params }) => {
    const { id } = params;
    const index = mockAppointments.findIndex(apt => apt.id === id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockAppointments.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // Centers endpoints
  http.get('/api/centers', () => {
    return HttpResponse.json(mockCenters);
  }),

  // Vaccines endpoints
  http.get('/api/vaccines', () => {
    return HttpResponse.json(mockVaccinationRecords);
  }),

  // Notifications endpoints
  http.get('/api/notifications', () => {
    return HttpResponse.json(mockNotifications);
  }),

  // Vaccine card endpoint
  http.get('/api/vaccine-card', () => {
    const vaccineCard = {
      citizenId: mockProfile.id,
      fullName: mockProfile.fullName,
      nid: mockProfile.nid,
      dateOfBirth: mockProfile.dateOfBirth,
      vaccinations: mockVaccinationRecords,
      qrCode: faker.string.alphanumeric(20),
      issuedAt: new Date().toISOString(),
    };
    return HttpResponse.json(vaccineCard);
  }),

  http.get('/api/vaccine-card/download', () => {
    // Mock PDF download
    const mockPdf = new Blob(['Mock PDF content'], { type: 'application/pdf' });
    return new HttpResponse(mockPdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="vaccine-card.pdf"',
      },
    });
  }),
];
