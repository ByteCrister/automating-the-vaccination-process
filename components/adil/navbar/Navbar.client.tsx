// components/navbar/Navbar.client.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NavLink } from "./Navbar";
import Image from "next/image";

type Props = {
  initialLocale: "bn" | "en";
  links: NavLink[];
  user: { name?: string; email?: string; image?: string } | null;
};

export default function NavClient({ initialLocale, links, user }: Props) {
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState(initialLocale);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) btnRef.current?.focus();
  }, [open]);

  function toggleMenu() {
    setOpen((v) => !v);
  }

  function changeLocale(next: "bn" | "en") {
    setLocale(next);
    // minimal client-side behavior: update pathname for i18n or call router.push
    // router.push(`/${next}${router.pathname}`) // wire to your i18n routing
  }

  return (
    <div className="flex items-center gap-3">

      <div className="hidden md:block">
        {user ? (
          <div className="flex items-center gap-2">
            {user.image ? (
              <Image src={user.image} alt={user.name ?? "avatar"} width={28} height={28} className="rounded-full" />
            ) : (
              <div className="h-7 w-7 rounded-full bg-slate-200" />
            )}
            <span className="text-sm text-slate-700">{user.name ?? user.email}</span>
          </div>
        ) : (
          <Link href="/signin" className="px-3 py-1 rounded bg-green-600 text-white text-sm">
            Sign in
          </Link>
        )}
      </div>

      {/* Mobile toggle */}
      <button
        ref={btnRef}
        onClick={toggleMenu}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="md:hidden inline-flex items-center justify-center p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
      >
        <span className="sr-only">Open menu</span>
        <svg className="h-5 w-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          {open ? <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      </button>

      {/* Mobile menu */}
      <div id="mobile-menu" className={`${open ? "fixed" : "hidden"} inset-0 z-50`}>
        {open && (
          <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden />
        )}

        <aside
          className={`fixed right-0 top-0 h-full w-72 bg-white shadow-lg p-4 transform ${open ? "translate-x-0" : "translate-x-full"} transition-transform`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">Menu</div>
            <button onClick={() => setOpen(false)} className="p-2" aria-label="Close menu">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <nav className="space-y-3" aria-label="Mobile primary">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="block text-base font-medium text-slate-700" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}

            <div className="pt-4 border-t mt-4">
              {user ? (
                <div className="flex items-center gap-3">
                  {user.image ? <img src={user.image} alt={user.name ?? "avatar"} className="h-10 w-10 rounded-full" /> : <div className="h-10 w-10 rounded-full bg-slate-200" />}
                  <div>
                    <div className="text-sm font-medium">{user.name ?? user.email}</div>
                    <Link href="/profile" className="text-sm text-green-600">Profile</Link>
                  </div>
                </div>
              ) : (
                <Link href="/signin" className="block mt-2 px-3 py-2 rounded bg-green-600 text-white text-center">
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        </aside>
      </div>
    </div>
  );
}