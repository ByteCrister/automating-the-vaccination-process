// components/layout/Layout.tsx
import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

type Props = {
  children: React.ReactNode;
  links?: { label: string; href: string }[];
  user?: { name?: string; email?: string; image?: string } | null;
  locale?: "bn" | "en";
};

export default function Layout({ children, links = [], user = null, locale = "bn" }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed top-4 left-4 z-50 bg-white p-2 rounded shadow">Skip to content</a>

      <Navbar />

      <main id="main-content" className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}