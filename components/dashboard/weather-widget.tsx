'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { WeatherData } from '@/lib/types';
import { CloudSun, CloudRain, Sun, Wind, Droplets, RefreshCw, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    city: 'Singapore',
    temp: 28,
    condition: 'Partly Cloudy',
    humidity: 75,
    windSpeed: 15,
    high: 31,
    low: 26,
    isMock: true,
  });
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/weather');
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch {
      // Keep existing mock fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower') || c.includes('thundery')) {
      return <CloudRain className="w-10 h-10 text-cyan-400" />;
    }
    if (c.includes('windy')) return <Wind className="w-10 h-10 text-cyan-400" />;
    if (c.includes('cloud') || c.includes('hazy') || c.includes('mist') || c.includes('fog')) {
      return <CloudSun className="w-10 h-10 text-amber-400" />;
    }
    return <Sun className="w-10 h-10 text-yellow-400" />;
  };

  return (
    <GlassCard glowColor="blue" className="flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-app">{weather.city}</span>
          {weather.isMock && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-elevated text-muted">
              MOCK API
            </span>
          )}
        </div>
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="p-1.5 rounded-lg bg-elevated dark:hover:bg-zinc-700 hover:bg-zinc-200 text-muted hover:text-app transition-all"
        >
          <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
        </button>
      </div>

      {/* Main Condition Display */}
      <div className="my-4 flex items-center justify-between">
        <div>
          <div className="text-4xl font-extrabold text-app tracking-tight">
            {weather.temp}°C
          </div>
          <p className="text-xs text-secondary font-medium mt-0.5">{weather.condition}</p>
        </div>

        <div className="p-3 rounded-2xl bg-elevated backdrop-blur-md">
          {getWeatherIcon(weather.condition)}
        </div>
      </div>

      {/* Weather Stats Grid */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-app text-xs">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-elevated">
          <Droplets className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-[10px] text-dim uppercase">Humidity</div>
            <div className="text-app font-semibold">{weather.humidity}%</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-elevated">
          <Wind className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-[10px] text-dim uppercase">Wind</div>
            <div className="text-app font-semibold">{weather.windSpeed} km/h</div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
