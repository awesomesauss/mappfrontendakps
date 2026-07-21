'use client';

import React, { useState, useEffect } from 'react';
import { useSmartHome } from '@/lib/store/smart-home-context';
import {
  Activity,
  Database,
  Radio,
  Play,
  Pause,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeroHeader() {
  const {
    isMockMode,
    isSimulating,
    toggleMockMode,
    toggleSimulation,
  } = useSmartHome();

  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setTimeStr(new Date().toLocaleTimeString([], { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="mb-6 rounded-2xl bg-zinc-900/50 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Status */}
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-zinc-800/80 text-zinc-100 shadow-sm">
            <Home className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 font-sans">
                Aurora Smart Home
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live System
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Hardware Control Center & Sensor Telemetry
            </p>
          </div>
        </div>

        {/* Right Status Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* System Clock */}
          <div className="px-3.5 py-2 rounded-xl bg-zinc-950/60 text-right font-mono text-xs">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1 justify-end">
              <Radio className="w-3 h-3 text-blue-400" />
              Time
            </div>
            <div className="text-sm font-semibold text-zinc-200">
              {timeStr || '00:00:00'}
            </div>
          </div>

          {/* Mode Switcher Button */}
          <button
            onClick={toggleMockMode}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 text-xs font-mono transition-colors font-medium"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>{isMockMode ? 'Mock Hardware Mode' : 'Supabase Backend'}</span>
          </button>

          {/* Simulation Stream Button */}
          <button
            onClick={toggleSimulation}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 text-xs font-mono transition-colors font-medium"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isSimulating ? 'Pause Telemetry' : 'Resume Telemetry'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
