// components/navbar/Navbar.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export type NavLink = { label: string; href: string; external?: boolean };

type Props = {
  links?: NavLink[];
  locale?: "bn" | "en";
  user?: { name?: string; email?: string; image?: string } | null;
};

export default function Navbar({ links = [], locale = "bn", user = null }: Props) {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/signin");
  };

  return (
    <header className="bg-white border-b" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <nav className="hidden md:flex md:items-center md:gap-6" aria-label="Primary">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-slate-700 hover:text-slate-900">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {!user ? (
              <button 
                onClick={handleLoginClick}
                className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
              >
                Login
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {user.image ? (
                  <Image src={user.image} alt={user.name ?? "avatar"} width={28} height={28} className="rounded-full" />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-slate-200" />
                )}
                <span className="text-sm text-slate-700">{user.name ?? user.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}