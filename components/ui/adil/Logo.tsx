// components/ui/Logo.tsx
'use client';

import React from "react";
import Image from "next/image";
import { motion } from 'framer-motion';

export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  // Prefer inline SVG or next/image for production (replace /logo.png)
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Image src="/logo.png" alt="VaxEPI" width={160} height={40} className={className} />
    </motion.div>
  );
}
