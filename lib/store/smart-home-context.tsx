'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SensorData, DeviceState, AlertLog, TelemetryHistoryPoint } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

// Generate 24 hours of initial mock history
function generateInitialHistory(): TelemetryHistoryPoint[] {
  const points: TelemetryHistoryPoint[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Simulate diurnal temperature/power curve
    const hour = d.getHours();
    const tempBase = 22 + Math.sin((hour - 8) / 12 * Math.PI) * 4;
    const humidityBase = 55 - Math.sin((hour - 8) / 12 * Math.PI) * 10;
    const powerBase = 1.2 + (hour >= 18 && hour <= 23 ? 1.8 : hour >= 7 && hour <= 9 ? 1.2 : 0.4);

    points.push({
      time: hourLabel,
      temperature: Number((tempBase + (Math.random() * 0.8 - 0.4)).toFixed(1)),
      humidity: Number((humidityBase + (Math.random() * 2 - 1)).toFixed(1)),
      power: Number((powerBase + (Math.random() * 0.2 - 0.1)).toFixed(2)),
    });
  }
  return points;
}

const initialLogs: AlertLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toLocaleTimeString([], { hour12: false }),
    level: 'success',
    message: 'RFID Access Granted - Card #8A91 (Main Entrance)',
    category: 'rfid',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString([], { hour12: false }),
    level: 'info',
    message: 'Gate Servo closed automatically via auto-timer',
    category: 'control',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toLocaleTimeString([], { hour12: false }),
    level: 'warning',
    message: 'High Power Draw Detected (Peak 3.4kW)',
    category: 'sensor',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toLocaleTimeString([], { hour12: false }),
    level: 'info',
    message: 'System Boot Completed - Mock Hardware Engine Active',
    category: 'system',
  },
];

interface SmartHomeContextType {
  sensorData: SensorData;
  sensorTrends: { tempTrend: number; humTrend: number; powerTrend: number };
  telemetryHistory: TelemetryHistoryPoint[];
  deviceState: DeviceState;
  logs: AlertLog[];
  isMockMode: boolean;
  isSimulating: boolean;
  supabaseConnected: boolean;
  toggleGateServo: () => void;
  toggleMainLighting: () => void;
  setLightingBrightness: (val: number) => void;
  toggleHvacPower: () => void;
  setHvacTargetTemp: (val: number) => void;
  toggleSmartLock: () => void;
  toggleSecurityArm: () => void;
  triggerMockRfidScan: () => void;
  toggleMockMode: () => void;
  toggleSimulation: () => void;
  clearLogs: () => void;
}

const SmartHomeContext = createContext<SmartHomeContextType | undefined>(undefined);

export function SmartHomeProvider({ children }: { children: React.ReactNode }) {
  const [isMockMode, setIsMockMode] = useState<boolean>(!isSupabaseConfigured);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [supabaseConnected] = useState<boolean>(isSupabaseConfigured);

  const [deviceState, setDeviceState] = useState<DeviceState>({
    gateServo: false,
    mainLighting: true,
    lightingBrightness: 80,
    hvacPower: true,
    hvacTargetTemp: 22,
    smartLock: true,
    securityArmState: true,
  });

  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryHistoryPoint[]>(generateInitialHistory());
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 24.2,
    humidity: 52.4,
    power: 2.15,
    timestamp: new Date().toLocaleTimeString([], { hour12: false }),
  });

  const [sensorTrends] = useState({
    tempTrend: +0.4,
    humTrend: -1.2,
    powerTrend: +2.8,
  });

  const [logs, setLogs] = useState<AlertLog[]>(initialLogs);

  const addLog = useCallback((message: string, level: AlertLog['level'] = 'info', category: AlertLog['category'] = 'control') => {
    const newLog: AlertLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
      level,
      message,
      category,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  }, []);

  // Sync to Supabase if configured
  const updateDeviceState = useCallback(async (updater: (prev: DeviceState) => DeviceState, actionDescription: string) => {
    setDeviceState((prev) => {
      const next = updater(prev);
      if (supabaseConnected && supabase && !isMockMode) {
        // device_states columns are snake_case; DeviceState is camelCase, so map explicitly
        // instead of spreading -- a raw spread sends camelCase keys PostgREST doesn't
        // recognize and the upsert is rejected outright (silently, since there's no .catch()).
        supabase
          .from('device_states')
          .upsert([{
            id: 1,
            gate_servo: next.gateServo,
            main_lighting: next.mainLighting,
            lighting_brightness: next.lightingBrightness,
            hvac_power: next.hvacPower,
            hvac_target_temp: next.hvacTargetTemp,
            smart_lock: next.smartLock,
            security_arm_state: next.securityArmState,
            updated_at: new Date().toISOString(),
          }])
          .then(({ error }) => {
            if (error) console.error('[Supabase] device_states upsert failed:', error);
          });
      }
      return next;
    });
    addLog(actionDescription, 'info', 'control');
  }, [supabaseConnected, isMockMode, addLog]);

  const toggleGateServo = useCallback(() => {
    updateDeviceState(
      (prev) => ({ ...prev, gateServo: !prev.gateServo }),
      `Door Lock: ${!deviceState.gateServo ? 'LOCKED' : 'UNLOCKED'}`
    );
  }, [deviceState.gateServo, updateDeviceState]);

  const toggleMainLighting = useCallback(() => {
    updateDeviceState(
      (prev) => ({ ...prev, mainLighting: !prev.mainLighting }),
      `Main Lighting toggled: ${!deviceState.mainLighting ? 'ON (100% Lumens)' : 'OFF'}`
    );
  }, [deviceState.mainLighting, updateDeviceState]);

  const setLightingBrightness = useCallback((val: number) => {
    setDeviceState((prev) => ({ ...prev, lightingBrightness: val }));
  }, []);

  const toggleHvacPower = useCallback(() => {
    updateDeviceState(
      (prev) => ({ ...prev, hvacPower: !prev.hvacPower }),
      `HVAC Power toggled: ${!deviceState.hvacPower ? 'ACTIVATED' : 'SHUTDOWN'}`
    );
  }, [deviceState.hvacPower, updateDeviceState]);

  const setHvacTargetTemp = useCallback((val: number) => {
    setDeviceState((prev) => ({ ...prev, hvacTargetTemp: val }));
  }, []);

  const toggleSmartLock = useCallback(() => {
    updateDeviceState(
      (prev) => ({ ...prev, smartLock: !prev.smartLock }),
      `Smart Door Lock: ${!deviceState.smartLock ? 'LOCKED' : 'UNLOCKED'}`
    );
  }, [deviceState.smartLock, updateDeviceState]);

  const toggleSecurityArm = useCallback(() => {
    updateDeviceState(
      (prev) => ({ ...prev, securityArmState: !prev.securityArmState }),
      `Perimeter Security System: ${!deviceState.securityArmState ? 'ARMED (HIGH SECURITY)' : 'DISARMED'}`
    );
  }, [deviceState.securityArmState, updateDeviceState]);

  const triggerMockRfidScan = useCallback(() => {
    const cardId = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
    addLog(`RFID Access Granted - Keycard #${cardId} at Front Entrance`, 'success', 'rfid');
  }, [addLog]);

  const toggleMockMode = useCallback(() => {
    setIsMockMode((prev) => !prev);
    addLog(`Switched hardware mode to ${!isMockMode ? 'Mock Simulation' : 'Live Supabase Backend'}`, 'warning', 'system');
  }, [isMockMode, addLog]);

  const toggleSimulation = useCallback(() => {
    setIsSimulating((prev) => !prev);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Pull the real device_states row instead of starting from hardcoded defaults
  useEffect(() => {
    if (!supabaseConnected || !supabase || isMockMode) return;

    supabase
      .from('device_states')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setDeviceState({
          gateServo: data.gate_servo,
          mainLighting: data.main_lighting,
          lightingBrightness: data.lighting_brightness,
          hvacPower: data.hvac_power,
          hvacTargetTemp: data.hvac_target_temp,
          smartLock: data.smart_lock,
          securityArmState: data.security_arm_state,
        });
      });
  }, [supabaseConnected, isMockMode]);

  // Fetch + live-subscribe to real sensor telemetry from Supabase (STM32 -> relay -> here)
  useEffect(() => {
    if (!supabaseConnected || !supabase || isMockMode) return;
    const client = supabase;

    const toPoint = (row: {
      created_at: string;
      temperature: number;
      humidity: number;
      power: number;
    }): TelemetryHistoryPoint => ({
      time: new Date(row.created_at).toLocaleTimeString([], { hour12: false }),
      temperature: Number(row.temperature),
      humidity: Number(row.humidity),
      power: Number(row.power),
    });

    client
      .from('sensor_telemetry')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(24)
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        setTelemetryHistory([...data].reverse().map(toPoint));
        const latest = data[0];
        setSensorData({
          temperature: Number(latest.temperature),
          humidity: Number(latest.humidity),
          power: Number(latest.power),
          timestamp: new Date(latest.created_at).toLocaleTimeString([], { hour12: false }),
        });
      });

    const channel = client
      .channel('sensor_telemetry_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sensor_telemetry' },
        (payload) => {
          const row = payload.new as {
            created_at: string;
            temperature: number;
            humidity: number;
            power: number;
          };
          setSensorData({
            temperature: Number(row.temperature),
            humidity: Number(row.humidity),
            power: Number(row.power),
            timestamp: new Date(row.created_at).toLocaleTimeString([], { hour12: false }),
          });
          setTelemetryHistory((prev) => [...prev.slice(-23), toPoint(row)]);
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [supabaseConnected, isMockMode]);

  // Fetch + live-subscribe to real alert logs from Supabase (RFID scans, etc.)
  useEffect(() => {
    if (!supabaseConnected || !supabase || isMockMode) return;
    const client = supabase;

    client
      .from('alert_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!data) return;
        setLogs(
          data.map((row: AlertLog) => ({
            id: row.id,
            timestamp: new Date(row.timestamp).toLocaleTimeString([], { hour12: false }),
            level: row.level,
            message: row.message,
            category: row.category,
          }))
        );
      });

    const channel = client
      .channel('alert_logs_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alert_logs' },
        (payload) => {
          const row = payload.new as AlertLog;
          const newLog: AlertLog = {
            id: row.id,
            timestamp: new Date(row.timestamp).toLocaleTimeString([], { hour12: false }),
            level: row.level,
            message: row.message,
            category: row.category,
          };
          setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [supabaseConnected, isMockMode]);

  // Hardware Simulation Loop (Simulating STM32/ESP-01 Telemetry Stream every 3 seconds)
  useEffect(() => {
    if (!isSimulating) return;
    if (supabaseConnected && !isMockMode) return; // real hardware data is live -- don't fake it

    const interval = setInterval(() => {
      setSensorData((prev) => {
        const deltaTemp = (Math.random() * 0.4 - 0.2);
        const deltaHum = (Math.random() * 0.8 - 0.4);
        const deltaPower = (Math.random() * 0.1 - 0.05);

        const newTemp = Number((Math.max(18, Math.min(32, prev.temperature + deltaTemp))).toFixed(1));
        const newHum = Number((Math.max(30, Math.min(80, prev.humidity + deltaHum))).toFixed(1));
        const newPower = Number((Math.max(0.5, Math.min(5.0, prev.power + deltaPower))).toFixed(2));
        const newTime = new Date().toLocaleTimeString([], { hour12: false });

        // Trigger safety alert if temp spikes high
        if (newTemp > 29.5 && prev.temperature <= 29.5) {
          addLog(`High Temperature Warning: Sensor registered ${newTemp}°C`, 'warning', 'sensor');
        }

        return {
          temperature: newTemp,
          humidity: newHum,
          power: newPower,
          timestamp: newTime,
        };
      });

      // Update current hour in live telemetry graph
      setTelemetryHistory((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const updatedLast = {
          ...last,
          temperature: Number((last.temperature + (Math.random() * 0.2 - 0.1)).toFixed(1)),
          humidity: Number((last.humidity + (Math.random() * 0.4 - 0.2)).toFixed(1)),
          power: Number((last.power + (Math.random() * 0.05 - 0.025)).toFixed(2)),
        };
        return [...prev.slice(0, -1), updatedLast];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating, addLog]);

  return (
    <SmartHomeContext.Provider
      value={{
        sensorData,
        sensorTrends,
        telemetryHistory,
        deviceState,
        logs,
        isMockMode,
        isSimulating,
        supabaseConnected,
        toggleGateServo,
        toggleMainLighting,
        setLightingBrightness,
        toggleHvacPower,
        setHvacTargetTemp,
        toggleSmartLock,
        toggleSecurityArm,
        triggerMockRfidScan,
        toggleMockMode,
        toggleSimulation,
        clearLogs,
      }}
    >
      {children}
    </SmartHomeContext.Provider>
  );
}

export function useSmartHome() {
  const context = useContext(SmartHomeContext);
  if (!context) {
    throw new Error('useSmartHome must be used within a SmartHomeProvider');
  }
  return context;
}
