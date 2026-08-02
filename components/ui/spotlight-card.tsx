'use client';

import React, { useRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SpotlightCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(6, 182, 212, 0.15)',
  ...props
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !spotlightRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    spotlightRef.current.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    spotlightRef.current.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
    spotlightRef.current.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    if (!spotlightRef.current) return;
    spotlightRef.current.style.opacity = '0';
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative rounded-3xl border border-app bg-card p-6 shadow-2xl overflow-hidden transition-colors duration-300 dark:hover:border-zinc-700/80 hover:border-zinc-300 group',
        className
      )}
      {...props}
    >
      {/* 21st.dev Mouse Spotlight Gradient */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute -inset-px transition-opacity duration-500 rounded-3xl"
        style={{
          opacity: 0,
          ['--spot-x' as string]: '0px',
          ['--spot-y' as string]: '0px',
          background: `radial-gradient(600px circle at var(--spot-x) var(--spot-y), ${spotlightColor}, transparent 40%)`,
        }}
      />

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
