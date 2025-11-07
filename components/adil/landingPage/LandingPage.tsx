'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/adil/layout/Navbar';
import { Footer } from '@/components/adil/layout/Footer';
import { Hero } from '@/components/adil/sections/Hero';
import { Features } from '@/components/adil/sections/Features';
import Steps from '@/components/adil/sections/steps';
import { CTA } from '@/components/adil/sections/CTA';
import { DetailsCard } from '../sections/detailsCard';
import { LuHouse, LuCalendar, LuMapPin, LuDownload, LuLogIn } from 'react-icons/lu';
// Navigation items
const navItems = [
  { label: 'home', href: '/', icon: LuHouse },
  { label: 'schedule vaccination', href: '/schedule', icon: LuCalendar },
  { label: 'find centers', href: '/centers', icon: LuMapPin },
  { label: 'download certificate', href: '/certificate', icon: LuDownload },
  { label: 'login', href: '/signin', icon: LuLogIn },
];

// Footer columns
const footerColumns = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Schedule Vaccination', href: '/schedule' },
      { label: 'Find Centers', href: '/centers' },
      { label: 'Vaccination Records', href: '/records' },
      { label: 'Download Certificate', href: '/certificate' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Vaccine Information', href: '/vaccines' },
      { label: 'Health Guidelines', href: '/guidelines' },
      { label: 'News & Updates', href: '/news' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Report Issue', href: '/report' },
      { label: 'Feedback', href: '/feedback' },
    ],
  },
];

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com', icon: 'facebook' as const },
  { name: 'Twitter', href: 'https://twitter.com', icon: 'twitter' as const },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' as const },
];

const contactInfo = {
  phone: '+880 1234-567890',
  email: 'info@vaxepi.gov.bd',
  address: 'Ministry of Health, Dhaka, Bangladesh',
};

export default function LandingPage() {
  return (
    <motion.main
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Navbar
          navItems={navItems}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <Hero />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <DetailsCard />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <Features />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <Steps />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        <CTA />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Footer
          columns={footerColumns}
          socialLinks={socialLinks}
          contactInfo={contactInfo}
        />
      </motion.div>
    </motion.main>
  );
}
