'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LuMenu, LuX, LuHouse, LuUserPlus, LuDownload, LuFileText, LuLogIn, LuLogOut } from 'react-icons/lu';
import { Container } from '@/components/ui/adil/Container';
import { Button } from '@/components/ui/adil/Button';
import LogoutDialog from '@/components/ui/LogoutConfirmDialog';
import { cn } from '@/lib/utils';
import { signIn, signOut } from 'next-auth/react';
import { useAuthStore } from '@/store/shakib/user-auth.store';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  logo?: string;
  navItems?: Array<{
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
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
    { label: 'home', href: '/', icon: LuHouse },
    { label: 'register', href: '/register', icon: LuUserPlus },
    { label: 'vaccine card download', href: '/vaccine-card', icon: LuDownload },
    { label: 'vaccine certificate download', href: '/certificate', icon: LuFileText },
    { label: 'login', href: '/signin', icon: LuLogIn },
  ];

  const navItemsToUse = navItems.length > 0 ? navItems : defaultNavItems;
  const user = useAuthStore((s) => s.user);
  const router = useRouter();


  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
    } catch (e) {
      // ignore signOut errors
    } finally {
      useAuthStore.getState().clear();
      router.push('/signin');
    }
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

  return (
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-white'
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Upper Header - 3 Images */}
      {!hideUpperNav && (
        <div className="bg-green-50 border-b transition-all duration-300">
          <Container>
            <div className="flex justify-between items-center py-2">
              <div className="flex justify-center">
                <img
                  src="/adil/logo_1.svg"
                  alt="Partner Logo 1"
                  className="h-10 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex justify-center">
                <img
                  src="/adil/logo_2.png"
                  alt="Partner Logo 2"
                  className="h-10 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex justify-center">
                <img
                  src="/adil/logo_3.png"
                  alt="Partner Logo 3"
                  className="h-10 w-auto object-contain"
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
      <Container className="bg-white/20 backdrop-blur-lg">
        <nav className="flex items-center justify-between h-12 md:h-16" aria-label="Main navigation">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 font-bold text-xl md:text-2xl text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded-md"
            aria-label="VaxEPI Home"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm md:text-base font-extrabold">V</span>
            </div>
            <span>{logo}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItemsToUse.map((item) => {
              const IconComponent = item.icon;
              if (item.label === 'login') {
                // If user is signed in, show logout instead of login
                if (user) {
                  return (
                    <React.Fragment key={item.href}>
                      <button
                        onClick={() => setLogoutDialogOpen(true)}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 text-lg font-medium text-emerald-600 hover:text-white hover:bg-emerald-600 bg-emerald-50 rounded-md transition-colors',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500'
                        )}
                      >
                        <LuLogOut className="w-4 h-4" />
                        logout
                      </button>
                      <LogoutDialog
                        open={logoutDialogOpen}
                        onConfirm={() => {
                          setLogoutDialogOpen(false);
                          handleSignOut();
                        }}
                        onClose={() => setLogoutDialogOpen(false)}
                      />
                    </React.Fragment>
                  );
                }
                return (
                  <button
                    key={item.href}
                    onClick={() => handleSignIn()}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-lg font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500'
                    )}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    {item.label}
                  </button>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-lg font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500'
                  )}
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* CTA & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {ctaButton && (
              <Button
                href={ctaButton.href}
                variant="primary"
                size="md"
                className="hidden md:inline-flex"
              >
                {ctaButton.label}
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LuX className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LuMenu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 top-32 bg-white z-40 overflow-y-auto"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Container className="py-6">
              <motion.div
                className="space-y-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                {navItemsToUse.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, x: 5 }}
                    >
                      {item.label === 'login' ? (
                        // Mobile: show logout when user exists
                        user ? (
                          <>
                            <button
                              onClick={() => setLogoutDialogOpen(true)}
                              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-emerald-600 hover:text-white hover:bg-emerald-600 bg-emerald-50 rounded-md transition-colors"
                            >
                              <LuLogOut className="w-5 h-5" />
                              logout
                            </button>
                            <LogoutDialog
                              open={logoutDialogOpen}
                              onConfirm={() => {
                                setLogoutDialogOpen(false);
                                setIsMobileMenuOpen(false);
                                handleSignOut();
                              }}
                              onClose={() => setLogoutDialogOpen(false)}
                            />
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              handleSignIn();
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600 rounded-md transition-colors"
                          >
                            {IconComponent && <IconComponent className="w-5 h-5" />}
                            {item.label}
                          </button>
                        )
                      ) : (
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-green-600 rounded-md transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {IconComponent && <IconComponent className="w-5 h-5" />}
                          {item.label}
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>

              {ctaButton && (
                <motion.div
                  className="mt-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Button
                    href={ctaButton.href}
                    variant="primary"
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {ctaButton.label}
                  </Button>
                </motion.div>
              )}
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
