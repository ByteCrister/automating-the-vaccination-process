import { Shield, Calendar, MapPin, Bell, FileText, Users } from 'lucide-react';
import { Container } from '@/components/ui/adil/Container';

const features = [
  {
    icon: Calendar,
    title: 'Easy Scheduling',
    description: 'Book vaccination appointments online and manage your family\'s immunization calendar.',
  },
  {
    icon: MapPin,
    title: 'Find Centers',
    description: 'Locate nearby vaccination centers with real-time availability and directions.',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Never miss a dose with automated SMS and email reminders for upcoming vaccinations.',
  },
  {
    icon: FileText,
    title: 'Digital Records',
    description: 'Access and download vaccination certificates anytime, anywhere.',
  },
  {
    icon: Shield,
    title: 'Safety First',
    description: 'All vaccines are WHO-approved and stored under strict quality control.',
  },
  {
    icon: Users,
    title: 'Family Management',
    description: 'Manage vaccination records for your entire family in one place.',
  },
];

export function Features() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Everything You Need for Vaccination
          </h2>
          <p className="text-lg text-gray-600">
            A comprehensive platform designed to make immunization simple, accessible, and stress-free.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}