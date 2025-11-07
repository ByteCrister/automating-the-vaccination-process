'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Container } from '@/components/ui/adil/Container';
import { Button } from '@/components/ui/adil/Button';
import { cn } from '@/lib/utils';

interface NavbarProps {
  logo?: string;
  navItems?: Array<{
    label: string;
    href: string;
    children?: Array<{ label: string; href: string }>;
  }>;
  ctaButton?: {
    label: string;
    href: string;
  };
}

export function Navbar({ logo = 'VaxEPI', navItems = [], ctaButton }: NavbarProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [hideUpperNav, setHideUpperNav] = React.useState(false);

  // Handle scroll detection
  React.useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
      setHideUpperNav(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Default nav items for the lower nav
  const defaultNavItems = [
    { label: 'home', href: '/' },
    { label: 'register', href: '/register' },
    { label: 'vaccine card download', href: '/vaccine-card' },
    { label: 'vaccine certificate download', href: '/certificate' },
    { label: 'login', href: '/login' },
  ];

  const navItemsToUse = navItems.length > 0 ? navItems : defaultNavItems;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-white'
      )}
    >
      {/* Upper Header - 3 Images */}
      {!hideUpperNav && (
        <div className="bg-blue-50 border-b transition-all duration-300">
          <Container>
            <div className="flex justify-between items-center py-3">
              <div className="flex justify-center">
                <img
                  src="/adil/logo_1.svg"
                  alt="Partner Logo 1"
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex justify-center">
                <img
                  src="/adil/logo_2.png"
                  alt="Partner Logo 2"
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex justify-center">
                <img
                  src="/adil/logo_3.png"
                  alt="Partner Logo 3"
                  className="h-12 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </Container>
        </div>
      )}

      {/* Lower Nav */}
      <Container>
        <nav className="flex items-center justify-between h-16 md:h-20" aria-label="Main navigation">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 font-bold text-xl md:text-2xl text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
            aria-label="VaxEPI Home"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm md:text-base font-extrabold">V</span>
            </div>
            <span>{logo}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItemsToUse.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {ctaButton && (
              <Button
                href={ctaButton.href}
                variant="primary"
                size="sm"
                className="hidden md:inline-flex"
              >
                {ctaButton.label}
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-32 bg-white z-40 overflow-y-auto">
          <Container className="py-6">
            <div className="space-y-2">
              {navItemsToUse.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>

            {ctaButton && (
              <div className="mt-6">
                <Button
                  href={ctaButton.href}
                  variant="primary"
                  className="w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {ctaButton.label}
                </Button>
              </div>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}
