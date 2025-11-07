'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/adil/Button';
import { Container } from '@/components/ui/adil/Container';
import { Shield, Calendar, MapPin, FileCheck } from 'lucide-react';

export function Hero() {
  return (
    <motion.section
      className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Background Decoration */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </motion.div>

      <Container>
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {/* Content */}
          <motion.div
            className="space-y-6 md:space-y-8"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                initial={{ rotate: -10, opacity: 0 }}
                whileInView={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Shield className="w-4 h-4" />
              </motion.div>
              <span>Official Government Portal</span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Protect Your Family with Safe Vaccination
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-600 leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
            >
              Access vaccination schedules, find nearby centers, and keep your family healthy with Bangladesh's comprehensive immunization program.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button href="/schedule" variant="primary" size="lg">
                  Schedule Vaccination
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button href="/centers" variant="outline" size="lg">
                  Find Centers
                </Button>
              </motion.div>

            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex items-center gap-6 pt-4 text-sm text-gray-600"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 10 }}
                >
                  <FileCheck className="w-4 h-4 text-green-600" />
                </motion.div>
                <span>50M+ Vaccinated</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 10 }}
                >
                  <MapPin className="w-4 h-4 text-green-600" />
                </motion.div>
                <span>5,000+ Centers</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Hero Image/Illustration */}
          <motion.div
            className="relative"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="aspect-square bg-gradient-to-br from-green-100 to-purple-100 rounded-3xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="text-center space-y-4 p-8"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="w-32 h-32 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Shield className="w-16 h-16 text-green-600" />
                  </motion.div>
                  <motion.p
                    className="text-2xl font-bold text-gray-900"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    viewport={{ once: true }}
                  >
                    Your Health,
                  </motion.p>
                  <motion.p
                    className="text-2xl font-bold text-green-600"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    viewport={{ once: true }}
                  >
                    Our Priority
                  </motion.p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Floating Cards */}
            <motion.div
              className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 hidden lg:block"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div
                className="flex items-center gap-3"
                initial={{ x: 10, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.2 }}
                viewport={{ once: true }}
              >
                <motion.div whileHover={{ rotate: 10 }}>
                  <Calendar className="w-8 h-8 text-green-600" />
                </motion.div>
                <div>
                  <p className="text-xs text-gray-500">Next Dose</p>
                  <p className="font-semibold text-sm">15 Dec 2024</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </motion.section>
  );
}
