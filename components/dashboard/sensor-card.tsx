'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Thermometer, Droplets, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SensorCardProps {
  title: string;
  value: number | string;
  unit: string;
  trend: number;
  type: 'temp' | 'humidity' | 'power';
  updatedAt: string;
}

export function SensorCard({ title, value, unit, trend, type, updatedAt }: SensorCardProps) {
  const isPositive = trend >= 0;

  const config = {
    temp: { icon: Thermometer, iconColor: 'text-rose-400', iconBg: 'bg-rose-500/10 border-rose-500/20' },
    humidity: { icon: Droplets, iconColor: 'text-sky-400', iconBg: 'bg-sky-500/10 border-sky-500/20' },
    power: { icon: Zap, iconColor: 'text-amber-400', iconBg: 'bg-amber-500/10 border-amber-500/20' },
  };

  const current = config[type];
  const Icon = current.icon;

  return (
    <GlassCard className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            {title}
          </span>
          <div className={cn('p-2 rounded-lg border', current.iconBg, current.iconColor)}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 my-1">
          <span className="text-3xl font-extrabold tracking-tight text-app">
            {value}
          </span>
          <span className="text-sm font-semibold text-muted">{unit}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-app flex items-center justify-between text-xs">
        <div
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-[11px]',
            isPositive
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-rose-500/10 text-rose-400'
          )}
        >
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>
            {isPositive ? '+' : ''}
            {trend}%
          </span>
        </div>

        <span className="text-[10px] text-dim">Sync: {updatedAt}</span>
      </div>
    </GlassCard>
  );
}
