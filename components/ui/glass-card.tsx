'use client';

import React from 'react';
import { HTMLMotionProps } from 'framer-motion';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { useTheme } from '@/lib/store/theme-context';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'emerald' | 'amber' | 'blue' | 'purple' | 'none';
  hoverEffect?: boolean;
}

const darkColorMap = {
  cyan: 'rgba(6, 182, 212, 0.18)',
  emerald: 'rgba(16, 185, 129, 0.18)',
  amber: 'rgba(245, 158, 11, 0.18)',
  blue: 'rgba(59, 130, 246, 0.18)',
  purple: 'rgba(168, 85, 247, 0.18)',
  none: 'rgba(255, 255, 255, 0.05)',
};

const lightColorMap = {
  cyan: 'rgba(6, 182, 212, 0.1)',
  emerald: 'rgba(16, 185, 129, 0.1)',
  amber: 'rgba(245, 158, 11, 0.1)',
  blue: 'rgba(59, 130, 246, 0.1)',
  purple: 'rgba(168, 85, 247, 0.1)',
  none: 'rgba(0, 0, 0, 0.03)',
};

export function GlassCard({
  children,
  className,
  glowColor = 'cyan',
  hoverEffect = true,
  ...props
}: GlassCardProps) {
  const { isDark } = useTheme();
  const colorMap = isDark ? darkColorMap : lightColorMap;

  return (
    <SpotlightCard
      spotlightColor={colorMap[glowColor]}
      className={cn(
        'rounded-2xl border-card bg-card p-5',
        hoverEffect && 'dark:hover:bg-zinc-950/95 hover:bg-zinc-100/50',
        className
      )}
      {...props}
    >
      {children}
    </SpotlightCard>
  );
}
