'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader, Card, Grid } from '@/components/adil/citizenDashboard/ContentGrid';
import { Button } from '@/components/ui/adil/Button';
import { dashboardAPI } from '@/lib/adil/dashboard.api';
import { Appointment, VaccinationCenter } from '@/types/adil/dashboard.types';
import { formatDateTime, getStatusColor } from '@/utils/adil/dashboard.utils';
import { FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [centers, setCenters] = useState<VaccinationCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<VaccinationCenter | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsData, centersData] = await Promise.all([
          dashboardAPI.getAppointments(),
          dashboardAPI.getCenters()
        ]);

        setAppointments(appointmentsData);
        setCenters(centersData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBookAppointment = async () => {
    if (!selectedCenter || !bookingDate || !bookingTime) return;

    try {
      const newAppointment: Partial<Appointment> = {
        centerId: selectedCenter.id,
        centerName: selectedCenter.name,
        appointmentDate: bookingDate,
        appointmentTime: bookingTime,
        status: 'scheduled',
      };

      const result = await dashboardAPI.createAppointment(newAppointment as Omit<Appointment, 'id' | 'createdAt'>);
      setAppointments(prev => [result, ...prev]);
      setShowBookingForm(false);
      setSelectedCenter(null);
      setBookingDate('');
      setBookingTime('');
      alert('Appointment booked successfully!');
    } catch (error) {
      console.error('Failed to book appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await dashboardAPI.cancelAppointment(appointmentId);
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
        )
      );
      alert('Appointment cancelled successfully.');
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'missed':
        return 'Missed';
      default:
        return status;
    }
  };

  const upcomingAppointments = appointments.filter(apt => apt.status === 'scheduled');
  const pastAppointments = appointments.filter(apt => apt.status !== 'scheduled');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Appointments"
        description="Manage your vaccination appointments"
      />

      {/* Book New Appointment Button */}
      <div className="flex justify-between items-center">
        <div></div>
        <Button onClick={() => setShowBookingForm(true)} className="flex items-center gap-2">
          <FiCalendar className="w-5 h-5" />
          Book New Appointment
        </Button>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowBookingForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Book New Appointment</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vaccination Center
                </label>
                <select
                  value={selectedCenter?.id || ''}
                  onChange={(e) => {
                    const center = centers.find(c => c.id === e.target.value);
                    setSelectedCenter(center || null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a center</option>
                  {centers.map(center => (
                    <option key={center.id} value={center.id}>
                      {center.name} - {center.address}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleBookAppointment}
                disabled={!selectedCenter || !bookingDate || !bookingTime}
                className="flex-1"
              >
                Book Appointment
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowBookingForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
        {upcomingAppointments.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
              <p className="text-gray-600 mb-4">Book your vaccination appointment to get started.</p>
              <Button onClick={() => setShowBookingForm(true)}>
                Book First Appointment
              </Button>
            </div>
          </Card>
        ) : (
          <Grid columns={1}>
            {upcomingAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <FiCalendar className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Vaccination Appointment
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Center:</span>
                          <div className="font-medium">{appointment.centerName}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Date & Time:</span>
                          <div className="font-medium">
                            {formatDateTime(`${appointment.appointmentDate}T${appointment.appointmentTime}`)}
                          </div>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="mt-3">
                          <span className="text-gray-600 text-sm">Notes:</span>
                          <p className="text-sm text-gray-900 mt-1">{appointment.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Grid>
        )}
      </div>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Appointments</h2>
          <Grid columns={1}>
            {pastAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <FiClock className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Vaccination Appointment
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Center:</span>
                          <div className="font-medium">{appointment.centerName}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Date & Time:</span>
                          <div className="font-medium">
                            {formatDateTime(`${appointment.appointmentDate}T${appointment.appointmentTime}`)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </div>
      )}

      {/* Available Centers */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Vaccination Centers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {centers.slice(0, 6).map((center) => (
            <div key={center.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-green-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{center.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{center.address}</p>
                  <p className="text-sm text-gray-600">{center.district}, {center.upazila}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-green-600">Available slots: {center.availableSlots}</span>
                    <span className="text-gray-600">📞 {center.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
