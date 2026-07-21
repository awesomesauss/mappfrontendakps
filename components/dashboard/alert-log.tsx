'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { useSmartHome } from '@/lib/store/smart-home-context';
import { AlertLog as AlertLogType } from '@/lib/types';
import {
  Bell,
  KeyRound,
  AlertTriangle,
  Info,
  CheckCircle,
  Radio,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function AlertLog() {
  const { logs, triggerMockRfidScan, clearLogs } = useSmartHome();
  const [filter, setFilter] = useState<'all' | 'rfid' | 'sensor' | 'control'>('all');

  const filteredLogs = logs.filter((log) => (filter === 'all' ? true : log.category === filter));

  const getLevelBadge = (level: AlertLogType['level']) => {
    switch (level) {
      case 'success':
        return { icon: CheckCircle, bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'warning':
        return { icon: AlertTriangle, bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'critical':
        return { icon: AlertTriangle, bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
      case 'info':
      default:
        return { icon: Info, bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    }
  };

  return (
    <GlassCard className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 font-mono">Hardware Event Feed</h3>
              <p className="text-[11px] text-zinc-400 font-mono">Real-time system interrupts & logs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerMockRfidScan}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors font-medium"
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-400" />
              <span>Simulate RFID</span>
            </button>
            <button
              onClick={clearLogs}
              title="Clear Logs"
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 bg-zinc-950/60 p-1 rounded-xl mb-3 font-mono text-xs">
          {(['all', 'rfid', 'sensor', 'control'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                'px-2.5 py-0.5 rounded-lg uppercase text-[10px] transition-colors',
                filter === cat
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed List */}
      <div className="max-h-64 min-h-48 overflow-y-auto pr-1 space-y-2 font-mono text-xs">
        <AnimatePresence initial={false}>
          {filteredLogs.length === 0 ? (
            <div className="py-8 text-center text-zinc-500">
              No events recorded for this category.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const badge = getLevelBadge(log.level);
              const BadgeIcon = badge.icon;

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-2.5 rounded-xl bg-zinc-950/60 flex items-start gap-2.5 text-xs"
                >
                  <div className={cn('p-1 rounded mt-0.5 flex-shrink-0', badge.bg)}>
                    <BadgeIcon className="w-3 h-3" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-zinc-200 leading-snug">{log.message}</div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500">
                      <span>{log.timestamp}</span>
                      <span>•</span>
                      <span className="uppercase text-zinc-400">{log.category}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer info */}
      <div className="mt-3 pt-3 border-t border-zinc-800/30 flex items-center justify-between text-[11px] font-mono text-zinc-500">
        <div className="flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-blue-400" />
          <span>UART / WebSockets Active</span>
        </div>
        <span>{logs.length} Total Events</span>
      </div>
    </GlassCard>
  );
}
