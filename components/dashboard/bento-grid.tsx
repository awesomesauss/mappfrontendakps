'use client';

import React from 'react';
import { useSmartHome } from '@/lib/store/smart-home-context';
import { SensorCard } from '@/components/dashboard/sensor-card';
import { LiveChart } from '@/components/dashboard/live-chart';
import { WeatherWidget } from '@/components/dashboard/weather-widget';
import { CommandCenter } from '@/components/dashboard/command-center';
import { AlertLog } from '@/components/dashboard/alert-log';

export function BentoGrid() {
  const { sensorData, sensorTrends, chartData } = useSmartHome();

  return (
    <div className="space-y-6">
      {/* Top Telemetry & Weather Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <SensorCard
          title="Indoor Temperature"
          value={sensorData.temperature}
          unit="°C"
          trend={sensorTrends.tempTrend}
          type="temp"
          updatedAt={sensorData.timestamp}
        />
        <SensorCard
          title="Relative Humidity"
          value={sensorData.humidity}
          unit="%"
          trend={sensorTrends.humTrend}
          type="humidity"
          updatedAt={sensorData.timestamp}
        />
        <SensorCard
          title="Power Consumption"
          value={sensorData.power}
          unit="kW"
          trend={sensorTrends.powerTrend}
          type="power"
          updatedAt={sensorData.timestamp}
        />
        <WeatherWidget />
      </div>

      {/* Main Core Controls & Telemetry Graph Grid — 3:1 split on large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
              <LiveChart data={chartData} />
              <CommandCenter />
      </div>

      {/* Bottom Event Log & Access Security Grid */}
      <div className="grid grid-cols-1 gap-5">
        <AlertLog />
      </div>
    </div>
  );
}
