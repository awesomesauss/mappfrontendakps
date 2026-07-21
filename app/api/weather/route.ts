import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'San Francisco';
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    // Return realistic mock weather dataset
    return NextResponse.json({
      city,
      temp: 22,
      condition: 'Partly Cloudy',
      humidity: 62,
      windSpeed: 14,
      high: 25,
      low: 17,
      isMock: true,
    });
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&units=metric&appid=${apiKey}`
    );
    if (!res.ok) {
      throw new Error('Weather API error');
    }
    const data = await res.json();
    return NextResponse.json({
      city: data.name,
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      high: Math.round(data.main.temp_max),
      low: Math.round(data.main.temp_min),
      isMock: false,
    });
  } catch {
    return NextResponse.json({
      city,
      temp: 21,
      condition: 'Clear Sky',
      humidity: 58,
      windSpeed: 10,
      high: 24,
      low: 16,
      isMock: true,
    });
  }
}
