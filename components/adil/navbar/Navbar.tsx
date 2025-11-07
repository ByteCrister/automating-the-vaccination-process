// components/navbar/Navbar.tsx
import React from "react";
import Link from "next/link";
import Logo from "../../ui/adil/Logo";
import NavClient from "./Navbar.client"; // client interactive part

export type NavLink = { label: string; href: string; external?: boolean };

type Props = {
  links?: NavLink[];
  locale?: "bn" | "en";
  user?: { name?: string; email?: string; image?: string } | null;
};

export default function Navbar({ links = [], locale = "bn", user = null }: Props) {
  // Server component: render stable HTML, minimal logic here
  return (
    <header className="bg-white border-b" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Home" className="inline-flex items-center">
              <Logo className="h-8 w-auto" />
            </Link>
          </div>

          <nav className="hidden md:flex md:items-center md:gap-6" aria-label="Primary">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-slate-700 hover:text-slate-900">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Client-only interactive area: language, auth, mobile toggle */}
          <div className="flex items-center">
            <NavClient initialLocale={locale} links={links} user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}