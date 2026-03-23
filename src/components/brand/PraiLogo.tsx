"use client";

/** @UI.Component.Brand.PraiLogo */
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PraiLogoProps {
  className?: string;
  white?: boolean;
  animate?: boolean;
  size?: number | string;
}

/** @Component.PraiLogo */
export function PraiLogo({ className, white = false, animate = false, size }: PraiLogoProps) {
  const sizeStyle = size ? { fontSize: typeof size === 'number' ? `${size}px` : size } : {};

  return (
    <div 
      style={sizeStyle}
      className={cn(
        "flex items-center select-none font-display font-black tracking-tighter uppercase",
        !size && "text-2xl",
        white ? "text-white" : "text-slate-900 dark:text-white",
        className
      )}
    >
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
