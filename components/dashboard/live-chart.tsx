'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { TelemetryHistoryPoint } from '@/lib/types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Activity, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveChartProps {
  data: TelemetryHistoryPoint[];
}

type MetricKey = 'temperature' | 'humidity' | 'power';

const metricConfig: Record<
  MetricKey,
  { label: string; unit: string; color: string; gradientId: string; stroke: string }
> = {
  temperature: {
    label: 'Temperature',
    unit: '°C',
    color: '#3b82f6',
    gradientId: 'tempGradient',
    stroke: '#60a5fa',
  },
  humidity: {
    label: 'Humidity',
    unit: '%',
    color: '#06b6d4',
    gradientId: 'humGradient',
    stroke: '#38bdf8',
  },
  power: {
    label: 'Power Load',
    unit: 'kW',
    color: '#f59e0b',
    gradientId: 'powerGradient',
    stroke: '#fbbf24',
  },
};

function CustomTooltip({ active, payload, label, unit }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-card p-3 shadow-md font-mono text-xs">
        <p className="text-muted mb-1 flex items-center gap-1">
          <Clock className="w-3 h-3 text-blue-400" />
          <span>{label}</span>
        </p>
        <p className="text-app font-bold text-sm">
          {payload[0].value} {unit}
        </p>
      </div>
    );
  }
  return null;
}

export function LiveChart({ data }: LiveChartProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('temperature');

  const currentMetric = metricConfig[activeMetric];

  return (
    <GlassCard glowColor="cyan" className="col-span-1 lg:col-span-3 flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-app font-mono">
              Environmental Telemetry Stream
            </h3>
            <p className="text-[11px] text-muted font-mono">Rolling 24-hour sensor log</p>
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1 bg-elevated p-1 rounded-xl self-start sm:self-auto">
          {(Object.keys(metricConfig) as MetricKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={cn(
                'px-3 py-1 text-xs font-mono rounded-lg transition-colors',
                activeMetric === key
                  ? 'bg-elevated text-app font-semibold'
                  : 'text-muted hover:text-secondary'
              )}
            >
              {metricConfig[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#71717a"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              fontFamily="monospace"
            />
            <YAxis
              stroke="#71717a"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              fontFamily="monospace"
            />
            <Tooltip content={<CustomTooltip unit={currentMetric.unit} />} />
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={currentMetric.stroke}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${currentMetric.gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer controls */}
      <div className="mt-3 pt-3 border-t border-app flex items-center text-xs text-muted font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-secondary font-medium">Socket Streaming</span>
        </div>
      </div>
    </GlassCard>
  );
}
