import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// lib/types/component.types.ts
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface CTAButton {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}
