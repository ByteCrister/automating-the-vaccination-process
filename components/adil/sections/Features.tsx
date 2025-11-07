'use client';

import { motion } from 'framer-motion';
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
    <motion.section
      className="py-16 md:py-24 bg-gray-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Container>
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Everything You Need for Vaccination
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            A comprehensive platform designed to make immunization simple, accessible, and stress-free.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <motion.div
                className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <feature.icon className="w-6 h-6 text-green-600" />
              </motion.div>
              <motion.h3
                className="text-xl font-semibold text-gray-900 mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 + 0.1 * index }}
                viewport={{ once: true }}
              >
                {feature.title}
              </motion.h3>
              <motion.p
                className="text-gray-600"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + 0.1 * index }}
                viewport={{ once: true }}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </motion.section>
  );
}
