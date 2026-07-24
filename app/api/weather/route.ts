import { NextResponse } from 'next/server';

// data.gov.sg NEA 24-hour forecast — Singapore only, no API key required.
// x-api-key is optional and only raises the rate limit; omit it entirely.
const NEA_FORECAST_URL =
  'https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast';

export async function GET() {
  try {
    const res = await fetch(NEA_FORECAST_URL);
    if (!res.ok) {
      throw new Error('Weather API error');
    }
    const json = await res.json();
    const general = json.data.records[0].general;

    return NextResponse.json({
      city: 'Singapore',
      temp: Math.round((general.temperature.low + general.temperature.high) / 2),
      condition: general.forecast.text,
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
