"use client";

/** @UI.Brand.Logo */
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PraiLogoProps {
  className?: string;
  white?: boolean;
  animate?: boolean;
}

/** @Component.PraiLogo */
export function PraiLogo({ className, white = false, animate = false }: PraiLogoProps) {
  return (
    <div className={cn(
      "flex items-center select-none font-display font-black text-2xl tracking-tighter uppercase",
      white ? "text-white" : "text-slate-900 dark:text-white",
      className
    )}>
      <motion.span
        initial={animate ? { clipPath: 'inset(0 100% 0 0)', opacity: 0 } : { clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
        animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.22, 1, 0.36, 1],
          delay: 0.2
        }}
        className="inline-block"
      >
        PR\AI
      </motion.span>
    </div>
  );
}
