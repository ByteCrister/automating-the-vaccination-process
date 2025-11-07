// components/layout/Layout.tsx
import React from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

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

      <Navbar links={links} user={user} locale={locale} />

      <main id="main-content" className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <Footer
        contact={{ email: "vaxepi@mis.dghs.gov.bd" }}
        quickLinks={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "EPI Card", href: "/card" },
        ]}
        lastUpdated={new Date().toISOString().split("T")[0]}
      />
    </div>
  );
}