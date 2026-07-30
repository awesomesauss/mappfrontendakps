'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  activeColor?: 'cyan' | 'emerald' | 'amber' | 'blue' | 'purple';
}

export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  size = 'md',
  className,
  activeColor = 'blue',
}: SwitchProps) {
  const sizeMap = {
    sm: { track: 'w-8 h-4.5 p-0.5', thumb: 'w-3.5 h-3.5', translate: 14 },
    md: { track: 'w-11 h-6 p-0.5', thumb: 'w-5 h-5', translate: 20 },
    lg: { track: 'w-13 h-7 p-0.5', thumb: 'w-6 h-6', translate: 24 },
  };

  const activeColorClasses = {
    blue: checked ? 'bg-blue-600 border-blue-500' : 'bg-zinc-800 border-zinc-700/60',
    emerald: checked ? 'bg-emerald-600 border-emerald-500' : 'bg-zinc-800 border-zinc-700/60',
    amber: checked ? 'bg-amber-600 border-amber-500' : 'bg-zinc-800 border-zinc-700/60',
    cyan: checked ? 'bg-sky-600 border-sky-500' : 'bg-zinc-800 border-zinc-700/60',
    purple: checked ? 'bg-violet-600 border-violet-500' : 'bg-zinc-800 border-zinc-700/60',
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={cn(
        'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border transition-colors duration-200 focus:outline-none',
        sizeMap[size].track,
        activeColorClasses[activeColor],
        disabled && 'opacity-40 cursor-not-allowed',
        className
      )}
    >
      <motion.span
        layout
        animate={{ x: checked ? sizeMap[size].translate : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={cn(
          'pointer-events-none inline-block rounded-full bg-white shadow-sm ring-0',
          sizeMap[size].thumb
        )}
      />
    </button>
  );
}
