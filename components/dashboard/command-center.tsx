'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Switch } from '@/components/ui/switch';
import { useSmartHome } from '@/lib/store/smart-home-context';
import {
  DoorClosed,
  DoorOpen,
  Lightbulb,
  Flame,
  Sliders,
  SunMedium,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwitchTileProps {
  icon: React.ReactNode;
  iconClassName: string;
  label: string;
  status: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  activeColor: 'blue' | 'amber' | 'emerald' | 'purple';
}

function SwitchTile({
  icon,
  iconClassName,
  label,
  status,
  checked,
  onCheckedChange,
  activeColor,
}: SwitchTileProps) {
  return (
    <div className="min-h-[3.25rem] p-2.5 rounded-xl bg-elevated flex items-start justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0 flex-1 pt-0.5">
        <div className={cn('p-1.5 rounded-md shrink-0 transition-colors', iconClassName)}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold text-secondary font-mono truncate leading-tight">{label}</div>
          <div className="text-[10px] font-mono text-muted truncate leading-tight">{status}</div>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        activeColor={activeColor}
        size="sm"
        className="shrink-0"
      />
    </div>
  );
}

export function CommandCenter() {
  const {
    deviceState,
    toggleBlind,
    toggleMainLighting,
    setLightingBrightness,
    toggleHvacPower,
    setHvacTargetTemp,
  } = useSmartHome();

  return (
    <GlassCard glowColor="blue" className="col-span-1 lg:col-span-1 flex flex-col gap-3">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-app font-mono leading-tight">
              Command Center
            </h3>
            <p className="text-[10px] text-muted font-mono leading-tight">
              GPIO &amp; actuator control
            </p>
          </div>
        </div>

      </div>

      {/* Switch Stack — single column for narrow panel */}
      <div className="grid grid-cols-1 gap-2 flex-1">
        <SwitchTile
          icon={deviceState.blind ? <DoorOpen className="w-3.5 h-3.5" /> : <DoorClosed className="w-3.5 h-3.5" />}
          iconClassName={
            deviceState.blind ? 'bg-blue-600/20 text-blue-400' : 'bg-elevated text-muted'
          }
          label="Door Lock"
          status={
            <>
              <span className={deviceState.blind ? 'text-blue-400 font-medium' : 'text-dim'}>
                {deviceState.blind ? 'LOCKED' : 'UNLOCKED'}
              </span>
            </>
          }
          checked={deviceState.blind}
          onCheckedChange={toggleBlind}
          activeColor="blue"
        />

        <SwitchTile
          icon={<Lightbulb className="w-3.5 h-3.5" />}
          iconClassName={
            deviceState.mainLighting ? 'bg-amber-500/20 text-amber-400' : 'bg-elevated text-muted'
          }
          label="Lights"
          status={
            <>
              Power:{' '}
              <span className={deviceState.mainLighting ? 'text-amber-400 font-medium' : 'text-dim'}>
                {deviceState.mainLighting ? `ON (${deviceState.lightingBrightness}%)` : 'OFF'}
              </span>
            </>
          }
          checked={deviceState.mainLighting}
          onCheckedChange={toggleMainLighting}
          activeColor="amber"
        />

      </div>

      {/* Auxiliary Controls — stacked for narrow column */}
      <div className="pt-2.5 border-t border-app grid grid-cols-1 gap-2">
        {/* Dimmer Slider */}
        <div className="p-2.5 rounded-xl bg-elevated min-h-[3.25rem] flex flex-col justify-center">
          <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
            <span className="text-secondary flex items-center gap-1 font-medium">
              <SunMedium className="w-3 h-3 text-yellow-400" />
              Brightness
            </span>
            <span className="text-yellow-400 font-semibold">{deviceState.lightingBrightness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            disabled={!deviceState.mainLighting}
            value={deviceState.lightingBrightness}
            onChange={(e) => setLightingBrightness(Number(e.target.value))}
            className="w-full h-1 bg-zinc-300 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-400 disabled:opacity-30"
          />
        </div>

        {/* HVAC Controller */}
        <div className="p-2.5 rounded-xl bg-elevated min-h-[3.25rem] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              onClick={toggleHvacPower}
              className={cn(
                'p-1.5 rounded-md text-xs font-mono transition-all shrink-0',
                deviceState.hvacPower
                  ? 'bg-rose-500/20 text-rose-400 font-semibold'
                  : 'bg-elevated text-dim'
              )}
            >
              <Flame className="w-3 h-3" />
            </button>
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-secondary font-medium leading-tight">AC Temp</div>
              <div className="text-[9px] font-mono text-muted leading-tight">
                {deviceState.hvacPower ? 'Active' : 'Standby'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setHvacTargetTemp(Math.max(16, deviceState.hvacTargetTemp - 1))}
              className="w-6 h-6 rounded-md bg-elevated dark:hover:bg-zinc-700 hover:bg-zinc-200 text-secondary font-bold font-mono text-[10px] flex items-center justify-center"
            >
              -
            </button>
            <span className="text-[10px] font-bold font-mono text-app w-7 text-center">
              {deviceState.hvacTargetTemp}°C
            </span>
            <button
              onClick={() => setHvacTargetTemp(Math.min(30, deviceState.hvacTargetTemp + 1))}
              className="w-6 h-6 rounded-md bg-elevated dark:hover:bg-zinc-700 hover:bg-zinc-200 text-secondary font-bold font-mono text-[10px] flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
