'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { useSmartHome } from '@/lib/store/smart-home-context';
import { AlertLog as AlertLogType } from '@/lib/types';
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  Radio,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function AlertLog() {
  const { logs, clearLogs } = useSmartHome();
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
              <h3 className="text-sm font-semibold text-app">Hardware Event Feed</h3>
              <p className="text-[11px] text-muted">Real-time system interrupts & logs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearLogs}
              title="Clear Logs"
              className="p-1.5 rounded-lg bg-elevated dark:hover:bg-zinc-700 hover:bg-zinc-200 text-muted hover:text-secondary transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 bg-elevated p-1 rounded-xl mb-3 text-xs">
          {(['all', 'rfid', 'sensor', 'control'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                'px-2.5 py-0.5 rounded-lg uppercase text-[10px] transition-colors',
                filter === cat
                  ? 'bg-elevated text-app font-semibold'
                  : 'text-muted hover:text-secondary'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed List */}
      <div className="max-h-64 min-h-48 overflow-y-auto pr-1 space-y-2 text-xs">
        <AnimatePresence initial={false}>
          {filteredLogs.length === 0 ? (
            <div className="py-8 text-center text-dim">
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
                  className="p-2.5 rounded-xl bg-elevated flex items-start gap-2.5 text-xs"
                >
                  <div className={cn('p-1 rounded mt-0.5 flex-shrink-0', badge.bg)}>
                    <BadgeIcon className="w-3 h-3" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-secondary leading-snug">{log.message}</div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-dim">
                      <span>{log.timestamp}</span>
                      <span>•</span>
                      <span className="uppercase text-muted">{log.category}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer info */}
      <div className="mt-3 pt-3 border-t border-app flex items-center justify-between text-[11px] text-dim">
        <div className="flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-blue-400" />
          <span>UART / WebSockets Active</span>
        </div>
        <span>{logs.length} Total Events</span>
      </div>
    </GlassCard>
  );
}
