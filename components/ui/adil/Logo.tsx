// components/ui/Logo.tsx
import React from "react";
import Image from "next/image";

export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  // Prefer inline SVG or next/image for production (replace /logo.png)
  return (
    <Image src="/logo.png" alt="VaxEPI" width={160} height={40} className={className} priority />
  );
}
