'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/adil/Button';
import { Container } from '@/components/ui/adil/Container';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <motion.section
      className="py-16 md:py-24 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Container>
        <motion.div
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-8 md:p-12 lg:p-16 text-center text-white relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Background Pattern */}
          <motion.div
            className="absolute inset-0 opacity-10"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 translate-y-1/2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </motion.div>

          <motion.div
            className="relative z-10 max-w-3xl mx-auto space-y-6"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-green-50"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
            >
              Join millions of Bangladeshi families in protecting their loved ones. Schedule your vaccination today.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  href="/register"
                  variant="secondary"
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100"
                >
                  Create Account
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  href="/schedule"
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Schedule Now
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </motion.section>
  );
}
