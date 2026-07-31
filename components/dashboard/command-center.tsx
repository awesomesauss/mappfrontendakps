'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Switch } from '@/components/ui/switch';
import { useSmartHome } from '@/lib/store/smart-home-context';
import {
  Blinds,
  Lightbulb,
  Fan,
  Lock,
  Unlock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwitchTileProps {
  icon: React.ReactNode;
  iconClassName: string;
  label: string;
  status: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  activeColor: 'blue' | 'amber' | 'emerald' | 'purple' | 'cyan';
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
          <div className="text-[11px] font-semibold text-secondary truncate leading-tight">{label}</div>
          <div className="text-[10px] text-muted truncate leading-tight">{status}</div>
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
    toggleFanPower,
    setFanSpeed,
    toggleDoorLock,
  } = useSmartHome();

  return (
    <GlassCard glowColor="blue" className="col-span-1 lg:col-span-1 flex flex-col gap-3">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
            <Fan className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-app leading-tight">
              Command Center
            </h3>
            <p className="text-[10px] text-muted leading-tight">
              GPIO & actuator control
            </p>
          </div>
        </div>
      </div>

      {/* Control Groups */}
      <div className="grid grid-cols-1 gap-2">
        {/* Curtain — simple on/off */}
                <div className="flex flex-col gap-2">
                  <SwitchTile
                    icon={<Blinds className="w-3.5 h-3.5" />}
                    iconClassName={
                      deviceState.blind ? 'bg-blue-600/20 text-blue-400' : 'bg-elevated text-muted'
                    }
                    label="Curtain"
                    status={
                      <>
                        <span className={deviceState.blind ? 'text-blue-400 font-medium' : 'text-dim'}>
                          {deviceState.blind ? 'OPEN' : 'CLOSED'}
                        </span>
                      </>
                    }
                    checked={deviceState.blind}
                    onCheckedChange={toggleBlind}
                    activeColor="blue"
                  />
                </div>

        {/* Door Lock — simple on/off, stacked below Curtain */}
        <div className="flex flex-col gap-2">
          <SwitchTile
            icon={deviceState.doorLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            iconClassName={
              deviceState.doorLocked ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
            }
            label="Door Lock"
            status={
              <>
                <span className={deviceState.doorLocked ? 'text-rose-400 font-medium' : 'text-emerald-400 font-medium'}>
                  {deviceState.doorLocked ? 'LOCKED' : 'UNLOCKED'}
                </span>
              </>
            }
            checked={deviceState.doorLocked}
            onCheckedChange={toggleDoorLock}
            activeColor="purple"
          />
        </div>

        {/* Fan + Fan Speed Slider */}
        <div className="flex flex-col gap-2">
          <SwitchTile
            icon={<Fan className="w-3.5 h-3.5" />}
            iconClassName={
              deviceState.fanPower ? 'bg-cyan-500/20 text-cyan-400' : 'bg-elevated text-muted'
            }
            label="Fan"
            status={
              <>
                <span className={deviceState.fanPower ? 'text-cyan-400 font-medium' : 'text-dim'}>
                  {deviceState.fanPower ? `ON (${deviceState.fanSpeed}%)` : 'OFF'}
                </span>
              </>
            }
            checked={deviceState.fanPower}
            onCheckedChange={toggleFanPower}
            activeColor="cyan"
          />
          {/* Fan Speed Slider */}
          <div className="p-2.5 rounded-xl bg-elevated flex flex-col justify-center">
            <div className="flex items-center justify-between text-[10px] mb-1.5">
              <span className="text-secondary flex items-center gap-1 font-medium">
                <Fan className="w-3 h-3 text-cyan-400" />
                Fan Speed
              </span>
              <span className="text-cyan-400 font-semibold">{deviceState.fanSpeed}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="25"
              disabled={!deviceState.fanPower}
              value={deviceState.fanSpeed}
              onChange={(e) => setFanSpeed(Number(e.target.value))}
              className="w-full h-1 bg-zinc-300 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-30"
            />
          </div>
        </div>

        {/* Lights + Brightness Slider */}
        <div className="flex flex-col gap-2">
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
          {/* Brightness Slider */}
          <div className="p-2.5 rounded-xl bg-elevated flex flex-col justify-center">
            <div className="flex items-center justify-between text-[10px] mb-1.5">
              <span className="text-secondary flex items-center gap-1 font-medium">
                <Lightbulb className="w-3 h-3 text-yellow-400" />
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
        </div>
      </div>
    </GlassCard>
  );
}