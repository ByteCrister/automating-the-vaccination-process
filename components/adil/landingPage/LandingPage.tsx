import { Navbar } from '@/components/adil/layout/Navbar';
import { Footer } from '@/components/adil/layout/Footer';
import { Hero } from '@/components/adil/sections/Hero';
import { Features } from '@/components/adil/sections/Features';
import { CTA } from '@/components/adil/sections/CTA';

// Navigation items
const navItems = [
  { label: 'home', href: '/' },
  { label: 'schedule vaccination', href: '/schedule' },
  { label: 'find centers', href: '/centers' },
  { label: 'download certificate', href: '/certificate' },
  { label: 'login', href: '/login' },
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
    <main className="min-h-screen bg-white">
      <Navbar
        navItems={navItems}
      />
      
      <Hero />
      <Features />
      <CTA />
      
      <Footer
        columns={footerColumns}
        socialLinks={socialLinks}
        contactInfo={contactInfo}
      />
    </main>
  );
}
