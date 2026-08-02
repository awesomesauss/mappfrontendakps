import { NextResponse } from 'next/server';

// data.gov.sg NEA real-time air temperature — Singapore only, no API key required
// Returns current readings from weather stations across Singapore
const NEA_AIR_TEMP_URL =
  'https://api-open.data.gov.sg/v2/real-time/api/air-temperature';

// data.gov.sg NEA 24-hour forecast — for condition, humidity, wind
const NEA_FORECAST_URL =
  'https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast';

export async function GET() {
  try {
    // Fetch current temperature from air-temperature endpoint
    const tempRes = await fetch(NEA_AIR_TEMP_URL);
    if (!tempRes.ok) throw new Error('Temp API error');
    const tempJson = await tempRes.json();

    // The air-temperature endpoint returns readings from multiple stations
    // under readings[0].data (each entry: { stationId, value })
    const readings: { value: number }[] = tempJson.data.readings?.[0]?.data ?? [];
    const avgTemp = readings.length
      ? readings.reduce((sum, r) => sum + r.value, 0) / readings.length
      : 28;
    const currentTemp = Math.round(avgTemp);

    // Fetch forecast for condition, humidity, wind
    const forecastRes = await fetch(NEA_FORECAST_URL);
    if (!forecastRes.ok) throw new Error('Forecast API error');
    const forecastJson = await forecastRes.json();
    const general = forecastJson.data.records[0].general;

    // Pick the forecast for the current 6-hour time period instead of the
    // blanket country-wide outlook (which is often stuck on "Thundery Showers")
    const now = new Date();
    const periods: { timePeriod?: { start: string; end: string }; regions?: Record<string, { text: string }> }[] =
      forecastJson.data.records[0].periods ?? [];
    const current = periods.find((p) => {
      if (!p.timePeriod) return false;
      return now >= new Date(p.timePeriod.start) && now < new Date(p.timePeriod.end);
    });
    const regionForecast = current?.regions?.central?.text ?? current?.regions?.south?.text;
    const condition = regionForecast ?? general.forecast.text;

    return NextResponse.json({
      city: 'Singapore',
      temp: currentTemp,
      condition,
      humidity: Math.round(
        (general.relativeHumidity.low + general.relativeHumidity.high) / 2
      ),
      windSpeed: Math.round((general.wind.speed.low + general.wind.speed.high) / 2),
      high: general.temperature.high,
      low: general.temperature.low,
      isMock: false,
    });
  } catch {
    return NextResponse.json({
      city: 'Singapore',
      temp: 28,
      condition: 'Partly Cloudy',
      humidity: 75,
      windSpeed: 15,
      high: 31,
      low: 26,
      isMock: true,
    });
  }
}
