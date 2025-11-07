'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/adil/Container';
import { Button } from '@/components/ui/adil/Button';
import { UserPlus, Calendar, MapPin, FileCheck, ArrowRight, Check } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: UserPlus,
    title: 'Create Account',
    description: 'Register with your NID and create a secure account to access vaccination services.',
  },
  {
    id: 2,
    icon: Calendar,
    title: 'Schedule Appointment',
    description: 'Choose your preferred date, time, and vaccination center from available slots.',
  },
  {
    id: 3,
    icon: MapPin,
    title: 'Visit Center',
    description: 'Arrive at your scheduled center with required documents and get vaccinated safely.',
  },
  {
    id: 4,
    icon: FileCheck,
    title: 'Get Certificate',
    description: 'Receive your digital vaccination certificate instantly after completion.',
  },
];

// 🔹 Fade-in animation using IntersectionObserver
function useReveal() {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

export default function Steps() {
  return (
    <motion.section
      className="py-8 md:py-12 bg-gradient-to-b from-white via-green-50 to-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 opacity-30 pointer-events-none"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-green-200 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </motion.div>

      <Container className="relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            Simple & Secure Process
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            Your Vaccination Journey in 4 Simple Steps
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            viewport={{ once: true }}
          >
            Follow these easy steps to get vaccinated and protect yourself and your family.
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="max-w-5xl mx-auto relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-200 via-green-300 to-green-200"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            viewport={{ once: true }}
          />

          {steps.map((step, index) => {
            const isEven = index % 2 === 1;
            const { ref, visible } = useReveal();

            return (
              <motion.div
                ref={ref}
                key={step.id}
                className={`relative mb-16 last:mb-0 flex ${
                  isEven ? 'justify-end' : 'justify-start'
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 * index }}
                viewport={{ once: true }}
              >
                <motion.div
                  className={`flex items-center gap-6 w-full md:w-1/2 ${
                    isEven ? 'flex-row-reverse text-right mr-8' : 'text-left ml-8'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Step icon */}
                  <motion.div
                    className="relative flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center z-10"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + 0.2 * index }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full bg-red-800 opacity-20"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br from-green-500 to-green-600 shadow-green-200"
                      whileHover={{ rotate: 10 }}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                    </motion.div>
                  </motion.div>

                  {/* Step content */}
                  <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-md hover:shadow-lg border border-green-100"
                    initial={{ x: isEven ? 50 : -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 + 0.2 * index }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <motion.div
                      className="flex items-center gap-2 mb-2 justify-start"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 + 0.2 * index }}
                      viewport={{ once: true }}
                    >
                      <motion.span
                        className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200"
                        whileHover={{ scale: 1.05 }}
                      >
                        Step {step.id}
                      </motion.span>
                    </motion.div>
                    <motion.h3
                      className="text-xl font-semibold text-gray-900 mb-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 + 0.2 * index }}
                      viewport={{ once: true }}
                    >
                      {step.title}
                    </motion.h3>
                    <motion.p
                      className="text-gray-600 text-sm leading-relaxed"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.7 + 0.2 * index }}
                      viewport={{ once: true }}
                    >
                      {step.description}
                    </motion.p>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              href="/schedule"
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl"
            >
              Start Your Journey
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </motion.section>
  );
}
