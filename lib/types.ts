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
  hvacPower: boolean;      // On / Off
  hvacTargetTemp: number;  // 16 - 30 °C
  smartMode: boolean;      // Smart Mode auto-automation On / Off
  securityArmState: boolean; // Armed / Disarmed
  fanPower: boolean;       // Fan: On / Off
  fanSpeed: number;        // Fan: 0 - 100%
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
  temperature: number;
  humidity: number;
  power: number;
}
