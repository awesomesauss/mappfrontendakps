export interface SensorData {
  temperature: number; // in Celsius
  humidity: number;    // in percentage
  power: number;       // in kW
  timestamp: string;
}

export interface DeviceState {
  blind: boolean;          // Curtain/Blind: Open / Closed
  mainLighting: boolean;   // On / Off
  lightingBrightness: number; // 0 - 100%
  smartLock: boolean;      // Smart Lock (legacy/compat): Locked / Unlocked
  securityArmState: boolean; // Armed / Disarmed
  fanPower: boolean;       // Fan: On / Off
  fanSpeed: number;        // Fan: 0 - 100%
  doorLocked: boolean;     // Door Lock: Locked / Unlocked (separate from smartLock/curtain)
  smartMode: boolean;      // Smart Mode: automations enabled / disabled
}

export interface AlertLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'critical' | 'success';
  message: string;
  category: 'rfid' | 'sensor' | 'control' | 'system';
}

export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  high: number;
  low: number;
  isMock?: boolean;
}

export interface TelemetryHistoryPoint {
  time: string;
  date: string;
  temperature: number;
  humidity: number;
  power: number;
}
