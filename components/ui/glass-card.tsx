'use client';

import React from 'react';
import { HTMLMotionProps } from 'framer-motion';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'emerald' | 'amber' | 'blue' | 'purple' | 'none';
  hoverEffect?: boolean;
}

const colorMap = {
  cyan: 'rgba(6, 182, 212, 0.18)',
  emerald: 'rgba(16, 185, 129, 0.18)',
  amber: 'rgba(245, 158, 11, 0.18)',
  blue: 'rgba(59, 130, 246, 0.18)',
  purple: 'rgba(168, 85, 247, 0.18)',
  none: 'rgba(255, 255, 255, 0.05)',
};

export function GlassCard({
  children,
  className,
  glowColor = 'cyan',
  hoverEffect = true,
  ...props
}: GlassCardProps) {
  return (
    <SpotlightCard
      spotlightColor={colorMap[glowColor]}
      className={cn(
        'rounded-2xl border-zinc-800/90 bg-zinc-950/90 p-5',
        hoverEffect && 'hover:bg-zinc-950/95',
        className
      )}
      {...props}
    >
      {children}
    </SpotlightCard>
  );
}
