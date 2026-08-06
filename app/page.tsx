'use client';

import React, { useState } from 'react';
import { WelcomeScreen } from '@/components/dashboard/welcome-screen';
import { HeroHeader } from '@/components/dashboard/hero-header';
import { BentoGrid } from '@/components/dashboard/bento-grid';
import { ThemeSelector } from '@/components/dashboard/theme-selector';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <WelcomeScreen onEnterDashboard={() => setShowWelcome(false)} />
          </motion.div>
        ) : (
          <motion.main
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen bg-app text-app p-4 sm:p-6 lg:p-8 selection:bg-orange-500 selection:text-black"
          >
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Navigation back to Welcome Screen */}
              <div className="flex items-center justify-between pb-2">
                <button
                  onClick={() => setShowWelcome(true)}
                  className="flex items-center gap-2 text-xs font-mono text-muted hover:text-app transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Welcome Screen</span>
                </button>

              </div>

              {/* Top Header Hero */}
              <HeroHeader />

              {/* Main Bento Grid Dashboard */}
              <BentoGrid />
            </div>
          </motion.main>
        )}
      </AnimatePresence>
      <ThemeSelector />
    </>
  );
}
