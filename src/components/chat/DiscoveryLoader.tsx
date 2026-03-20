'use client'

import React from 'react'
import { motion } from 'framer-motion'

/** @UI.Component.DiscoveryLoader */
export function DiscoveryLoader({ className }: { className?: string }) {
  const dotSequence = [0, 1, 2, 3]

  return (
    <div className={`grid grid-cols-2 gap-1.5 ${className}`}>
      {dotSequence.map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut' as const,
          }}
          className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]"
        />
      ))}
    </div>
  )
}
