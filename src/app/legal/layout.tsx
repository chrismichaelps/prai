"use client";

import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import heroMorro from '@/assets/hero-morro.png';

/** @Layout.Legal */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      {/* Background image + overlay (Synced structure with IndexPage, but with El Morro) */}
      <div className="absolute inset-0">
        <Image
          src={heroMorro}
          alt="El Morro, San Juan al atardecer"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-accent/70" />
      </div>

      {/* Content Structure (Identical to IndexPage) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex flex-col py-16 px-6 md:px-10 lg:px-16 max-w-7xl mx-auto w-full">
           <div className="flex-1">
             {children}
           </div>
        </main>

        <Footer className="mt-auto bg-transparent border-t-0 pt-32 pb-16" />
      </div>
    </div>
  );
}
