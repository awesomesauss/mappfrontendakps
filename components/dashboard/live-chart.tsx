'use client';

import React, { useState, useCallback } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { TelemetryHistoryPoint } from '@/lib/types';
import { useSmartHome } from '@/lib/store/smart-home-context';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Activity, Thermometer, Droplets, Zap, Clock, X, ChevronLeft, ChevronRight, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveChartProps {
  data: TelemetryHistoryPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const items = [
      { label: 'Temperature', value: payload[0]?.value, unit: '°C', color: 'text-blue-400' },
      { label: 'Humidity', value: payload[1]?.value, unit: '%', color: 'text-cyan-400' },
      { label: 'Power', value: payload[2]?.value, unit: 'kW', color: 'text-amber-400' },
    ];
    const date = payload[0]?.payload?.date;
    return (
      <div className="rounded-xl bg-card border border-app p-3 shadow-xl text-xs space-y-1">
        <p className="text-dim flex items-center gap-1 pb-1.5 border-b border-app">
          <Clock className="w-3 h-3 text-blue-400" />
          <span>{date ? `${date} · ${label}` : label}</span>
        </p>
        {items.map((item, i) => (
          <p key={i} className={item.color}>
            {item.label}: {item.value} {item.unit}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function BouncyDot({ cx, cy, stroke }: any) {
  if (cx == null || cy == null) return null;
  return (
    <motion.circle
      initial={{ r: 0, opacity: 0 }}
      animate={{ r: 7, opacity: 1 }}
      exit={{ r: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 12, mass: 0.5 }}
      cx={cx}
      cy={cy}
      r={7}
      stroke={stroke}
      strokeWidth={2.5}
      fill="rgba(0,0,0,0.6)"
      style={{ cursor: 'pointer' }}
    />
  );
}

const springItem = {
  hidden: { opacity: 0, y: 12, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 250, damping: 18, delay: i * 0.08 },
  }),
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.15 } },
};

function DetailCard({ point, onClose }: { point: TelemetryHistoryPoint; onClose: () => void }) {
  const items = [
    { label: 'Indoor Temp', value: point.temperature, unit: '°C', icon: Thermometer, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Rel. Humidity', value: point.humidity, unit: '%', icon: Droplets, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Power Cons.', value: point.power, unit: 'kW', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22, mass: 0.8 }}
      className="w-full max-w-md p-4 rounded-2xl bg-elevated border border-app shadow-2xl"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono text-dim flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-blue-400" />
          Snapshot at {point.time} · {point.date}
        </span>
        <motion.button
          onClick={onClose}
          whileTap={{ scale: 0.85 }}
          className="p-1 rounded-lg hover:bg-zinc-800 text-dim hover:text-app transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </motion.button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              custom={i}
              variants={springItem}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 + i * 0.08 }}
                className={`p-2 rounded-lg ${item.bg} ${item.color}`}
              >
                <Icon className="w-4 h-4" />
              </motion.div>
              <span className="text-[9px] text-dim uppercase tracking-wider">{item.label}</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className={`text-lg font-bold ${item.color}`}
              >
                {item.value}{item.unit}
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function LiveChart({ data }: LiveChartProps) {
  const [selectedPoint, setSelectedPoint] = useState<TelemetryHistoryPoint | null>(null);
  const { viewOffset, goBackDay, goForwardDay, goToLive, isMockMode } = useSmartHome();

  const handleClick = useCallback((point: TelemetryHistoryPoint | null) => {
    setSelectedPoint(point);
  }, []);

  const viewedDay = new Date();
  viewedDay.setDate(viewedDay.getDate() - viewOffset);
  const dayLabel = viewedDay.toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short' });

  return (
    <GlassCard glowColor="cyan" className="col-span-1 lg:col-span-3 flex flex-col min-h-[420px]">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
          <Activity className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-app">
            Environmental Telemetry Stream
          </h3>
          <p className="text-[11px] text-muted">Tap any point for a full snapshot</p>
        </div>

        {/* Date navigation */}
        <div className="ml-auto flex items-center gap-1 shrink-0">
          {!isMockMode && viewOffset > 0 && (
            <button
              onClick={goToLive}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-[10px] font-mono font-semibold transition-colors"
            >
              <History className="w-3 h-3" />
              Live
            </button>
          )}
          <button
            onClick={goBackDay}
            disabled={isMockMode}
            title={isMockMode ? 'Unavailable in mock mode' : 'Previous day'}
            className="p-1 rounded-lg bg-elevated text-muted hover:text-app disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-muted px-2 py-1 rounded-lg bg-elevated whitespace-nowrap">
            {dayLabel}
          </span>
          <button
            onClick={goForwardDay}
            disabled={isMockMode || viewOffset === 0}
            title={isMockMode ? 'Unavailable in mock mode' : 'Next day'}
            className="p-1 rounded-lg bg-elevated text-muted hover:text-app disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="h-64 sm:h-72 lg:h-80 xl:h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              onClick={(e) => {
                if (e?.activePayload?.[0]?.payload) {
                  handleClick(e.activePayload[0].payload as TelemetryHistoryPoint);
                }
              }}
            >
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
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
              />
              <YAxis
                yAxisId="left"
                hide
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                hide
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                stroke="#60a5fa"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#tempGradient)"
                activeDot={<BouncyDot stroke="#60a5fa" />}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="humidity"
                stroke="#38bdf8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#humGradient)"
                activeDot={<BouncyDot stroke="#38bdf8" />}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="power"
                stroke="#fbbf24"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#powerGradient)"
                activeDot={<BouncyDot stroke="#fbbf24" />}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {viewOffset > 0 && data.length === 0 && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 text-center pointer-events-none">
            <History className="w-6 h-6 text-muted" />
            <p className="text-sm font-semibold text-secondary">No data recorded on {dayLabel}</p>
            <p className="text-[11px] text-dim">The sensor stream was offline this day.</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {selectedPoint && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <DetailCard key={selectedPoint.date + selectedPoint.time} point={selectedPoint} onClose={() => handleClick(null)} />
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-3 border-t border-app flex items-center text-xs text-muted">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              viewOffset === 0 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="text-secondary font-medium">
            {viewOffset === 0 ? 'Realtime' : 'Viewing History'}
          </span>
          {viewOffset > 0 && <span className="text-dim ml-2">— {dayLabel}</span>}
        </div>
      </div>
    </GlassCard>
  );
}
