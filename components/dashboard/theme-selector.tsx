'use client';

import React, { useState } from 'react';
import { useTheme, ColorTheme } from '@/lib/store/theme-context';
import { Palette, X, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

const themes: { key: ColorTheme; label: string; color: string }[] = [
  { key: 'default', label: 'Default', color: '#60a5fa' },
  { key: 'baby-blue', label: 'Baby Blue', color: '#89CFF0' },
  { key: 'bubblegum-pink', label: 'Bubblegum', color: '#FFB6C1' },
  { key: 'hot-pink', label: 'Hot Pink', color: '#FF1493' },
  { key: 'thanos-purple', label: 'Thanos', color: '#9B30FF' },
  { key: 'gun-metal', label: 'Gun Metal', color: '#8C8C8C' },
  { key: 'rainbow', label: 'Rainbow', color: '#FFD700' },
];

export function ThemeSelector() {
  const { isDark, toggleTheme, colorTheme, setColorTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="bg-card border border-app rounded-xl p-3 shadow-2xl flex flex-col gap-1.5 min-w-[170px]">
          {themes.map((t) => (
            <button
              key={t.key}
              onClick={() => setColorTheme(t.key)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all text-left w-full',
                colorTheme === t.key
                  ? 'bg-elevated text-app font-semibold'
                  : 'text-muted hover:text-app hover:bg-elevated'
              )}
            >
              <span
                className="w-4 h-4 rounded-full border border-app shrink-0"
                style={{ backgroundColor: t.color }}
              />
              <span className="flex-1">{t.label}</span>
              {colorTheme === t.key && <span className="text-app">✓</span>}
            </button>
          ))}
          <div className="border-t border-app my-1" />
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all w-full text-muted hover:text-app hover:bg-elevated"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="p-2.5 rounded-xl bg-card border border-app shadow-lg text-muted hover:text-app transition-colors"
        title="Theme selector"
      >
        {open ? <X className="w-4 h-4" /> : <Palette className="w-4 h-4" />}
      </button>
    </div>
  );
}
