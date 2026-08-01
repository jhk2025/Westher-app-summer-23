import {
  CurrentWeatherData,
  DailyForecastItem,
  HourlyForecastItem,
  LocationSearchResult,
  UnitSystem,
  WeatherDataBundle,
} from '../types/weather';

// WMO Weather Interpretation Codes (WW)
export function getWmoWeatherInfo(code: number, isDay = true): {
  description: string;
  iconName: string;
  category: 'clear' | 'cloudy' | 'rain' | 'snow' | 'thunderstorm' | 'fog';
} {
  switch (code) {
    case 0:
      return { description: 'Clear Sky', iconName: isDay ? 'Sun' : 'Moon', category: 'clear' };
    case 1:
      return { description: 'Mainly Clear', iconName: isDay ? 'SunDim' : 'Moon', category: 'clear' };
    case 2:
      return { description: 'Partly Cloudy', iconName: isDay ? 'CloudSun' : 'CloudMoon', category: 'cloudy' };
    case 3:
      return { description: 'Overcast', iconName: 'Cloud', category: 'cloudy' };
    case 45:
      return { description: 'Foggy', iconName: 'CloudFog', category: 'fog' };
    case 48:
      return { description: 'Depositing Rime Fog', iconName: 'CloudFog', category: 'fog' };
    case 51:
      return { description: 'Light Drizzle', iconName: 'CloudDrizzle', category: 'rain' };
    case 53:
      return { description: 'Moderate Drizzle', iconName: 'CloudDrizzle', category: 'rain' };
    case 55:
      return { description: 'Dense Drizzle', iconName: 'CloudDrizzle', category: 'rain' };
    case 56:
      return { description: 'Light Freezing Drizzle', iconName: 'CloudHail', category: 'rain' };
    case 57:
      return { description: 'Dense Freezing Drizzle', iconName: 'CloudHail', category: 'rain' };
    case 61:
      return { description: 'Slight Rain', iconName: 'CloudRain', category: 'rain' };
    case 63:
      return { description: 'Moderate Rain', iconName: 'CloudRain', category: 'rain' };
    case 65:
      return { description: 'Heavy Rain', iconName: 'CloudRainWind', category: 'rain' };
    case 66:
      return { description: 'Light Freezing Rain', iconName: 'CloudHail', category: 'rain' };
    case 67:
      return { description: 'Heavy Freezing Rain', iconName: 'CloudHail', category: 'rain' };
    case 71:
      return { description: 'Slight Snow Fall', iconName: 'CloudSnow', category: 'snow' };
    case 73:
      return { description: 'Moderate Snow Fall', iconName: 'CloudSnow', category: 'snow' };
    case 75:
      return { description: 'Heavy Snow Fall', iconName: 'CloudSnow', category: 'snow' };
    case 77:
      return { description: 'Snow Grains', iconName: 'Snowflake', category: 'snow' };
    case 80:
      return { description: 'Slight Rain Showers', iconName: 'CloudRain', category: 'rain' };
    case 81:
      return { description: 'Moderate Rain Showers', iconName: 'CloudRain', category: 'rain' };
    case 82:
      return { description: 'Violent Rain Showers', iconName: 'CloudLightning', category: 'rain' };
    case 85:
      return { description: 'Slight Snow Showers', iconName: 'CloudSnow', category: 'snow' };
    case 86:
      return { description: 'Heavy Snow Showers', iconName: 'CloudSnow', category: 'snow' };
    case 95:
      return { description: 'Thunderstorm', iconName: 'CloudLightning', category: 'thunderstorm' };
    case 96:
      return { description: 'Thunderstorm with Slight Hail', iconName: 'CloudLightning', category: 'thunderstorm' };
    case 99:
      return { description: 'Thunderstorm with Heavy Hail', iconName: 'CloudLightning', category: 'thunderstorm' };
    default:
      return { description: 'Cloudy', iconName: 'Cloud', category: 'cloudy' };
  }
}

export function getWindDirectionText(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index] || 'N';
}

export function getUvIndexInfo(uv: number): {
  level: string;
  color: string;
  textColor: string;
  advice: string;
} {
  if (uv <= 2) {
    return {
      level: 'Low',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      advice: 'Minimal sun danger. Enjoy the outdoors safely.',
    };
  } else if (uv <= 5) {
    return {
      level: 'Moderate',
      color: 'bg-amber-500',
      textColor: 'text-amber-600 dark:text-amber-400',
      advice: 'Wear sunglasses and SPF 30+ sunscreen during midday hours.',
    };
  } else if (uv <= 7) {
    return {
      level: 'High',
      color: 'bg-orange-500',
      textColor: 'text-orange-600 dark:text-orange-400',
      advice: 'Seek shade during 10 AM - 4 PM. Wear hat, sunglasses, and sunscreen.',
    };
  } else if (uv <= 10) {
    return {
      level: 'Very High',
      color: 'bg-rose-500',
      textColor: 'text-rose-600 dark:text-rose-400',
      advice: 'Extra protection needed. Avoid sun exposure during peak hours.',
    };
  } else {
    return {
      level: 'Extreme',
      color: 'bg-purple-600',
      textColor: 'text-purple-600 dark:text-purple-400',
      advice: 'Avoid direct sun exposure. Reapply SPF 50+ frequently.',
    };
  }
}

export function getUsAqiInfo(aqi: number): {
  level: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  color: string;
  badgeBg: string;
  advice: string;
} {
  if (aqi <= 50) {
    return {
      level: 'Good',
      color: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:text-emerald-300 dark:border-emerald-700',
      advice: 'Air quality is satisfactory. Great day for outdoor activities!',
    };
  } else if (aqi <= 100) {
    return {
      level: 'Moderate',
      color: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-700 border-amber-300 dark:text-amber-300 dark:border-amber-700',
      advice: 'Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion.',
    };
  } else if (aqi <= 150) {
    return {
      level: 'Unhealthy for Sensitive Groups',
      color: 'text-orange-600 dark:text-orange-400',
      badgeBg: 'bg-orange-500/10 text-orange-700 border-orange-300 dark:text-orange-300 dark:border-orange-700',
      advice: 'Members of sensitive groups may experience health effects. General public unlikely to be affected.',
    };
  } else if (aqi <= 200) {
    return {
      level: 'Unhealthy',
      color: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-500/10 text-rose-700 border-rose-300 dark:text-rose-300 dark:border-rose-700',
      advice: 'Everyone may begin to experience health effects. Limit strenuous outdoor workouts.',
    };
  } else if (aqi <= 300) {
    return {
      level: 'Very Unhealthy',
      color: 'text-purple-600 dark:text-purple-400',
      badgeBg: 'bg-purple-500/10 text-purple-700 border-purple-300 dark:text-purple-300 dark:border-purple-700',
      advice: 'Health alert: risk of health effects for everyone. Stay indoors if possible.',
    };
  } else {
    return {
      level: 'Hazardous',
      color: 'text-red-700 dark:text-red-400',
      badgeBg: 'bg-red-500/10 text-red-800 border-red-300 dark:text-red-300 dark:border-red-700',
      advice: 'Emergency health conditions. Avoid all outdoor activity.',
    };
  }
}

export function convertTemperature(celsius: number, units: UnitSystem): number {
  if (units === 'imperial') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function convertWindSpeed(kmh: number, units: UnitSystem): { value: number; unit: string } {
  if (units === 'imperial') {
    return { value: Math.round(kmh * 0.621371), unit: 'mph' };
  }
  return { value: Math.round(kmh), unit: 'km/h' };
}

// Search locations by query string
export async function searchLocations(query: string): Promise<LocationSearchResult[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=8&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('Error searching locations:', err);
    return [];
  }
}

// Get city name from coordinates using reverse geocoding
export async function reverseGeocode(lat: number, lon: number): Promise<{ name: string; country: string; countryCode: string }> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(2)}&count=1&language=en&format=json`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const item = data.results[0];
        return {
          name: item.name,
          country: item.country || '',
          countryCode: item.country_code?.toUpperCase() || '',
        };
      }
    }
  } catch {
    // ignore, fall back
  }
  return { name: `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`, country: '', countryCode: '' };
}

// Fetch complete weather data for latitude and longitude
export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  locationInfo?: { name: string; country?: string; countryCode?: string; region?: string }
): Promise<WeatherDataBundle> {
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,dew_point_2m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

  const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;

  const [forecastRes, aqRes] = await Promise.allSettled([
    fetch(forecastUrl),
    fetch(airQualityUrl),
  ]);

  if (forecastRes.status === 'rejected' || !forecastRes.value.ok) {
    throw new Error('Failed to fetch weather forecast data');
  }

  const forecastData = await forecastRes.value.json();
  let aqData: any = null;
  if (aqRes.status === 'fulfilled' && aqRes.value.ok) {
    try {
      aqData = await aqRes.value.json();
    } catch {
      // air quality is optional
    }
  }

  // Parse current weather
  const cur = forecastData.current;
  const daily = forecastData.daily;
  const hourly = forecastData.hourly;

  const wmoInfo = getWmoWeatherInfo(cur.weather_code, cur.is_day === 1);

  // AQI info
  const usAqi = aqData?.current?.us_aqi;
  let aqiLevelInfo;
  if (typeof usAqi === 'number') {
    aqiLevelInfo = getUsAqiInfo(usAqi);
  }

  const current: CurrentWeatherData = {
    cityName: locationInfo?.name || 'Current Location',
    country: locationInfo?.country || '',
    countryCode: locationInfo?.countryCode || '',
    region: locationInfo?.region || '',
    latitude,
    longitude,
    timezone: forecastData.timezone || 'UTC',
    temperature: cur.temperature_2m,
    feelsLike: cur.apparent_temperature,
    tempMin: daily?.temperature_2m_min?.[0] ?? cur.temperature_2m,
    tempMax: daily?.temperature_2m_max?.[0] ?? cur.temperature_2m,
    weatherCode: cur.weather_code,
    weatherDescription: wmoInfo.description,
    isDay: cur.is_day === 1,
    
    // Core requested metrics
    humidity: cur.relative_humidity_2m,
    dewPoint: cur.dew_point_2m ?? 10,
    uvIndex: cur.uv_index ?? 0,
    windSpeed: cur.wind_speed_10m,
    windDirection: cur.wind_direction_10m,
    windGusts: cur.wind_gusts_10m ?? cur.wind_speed_10m,
    
    // Additional metrics
    pressure: cur.pressure_msl ?? cur.surface_pressure ?? 1013,
    visibility: hourly?.visibility?.[0] ? Math.round(hourly.visibility[0] / 1000) : 10,
    cloudCover: cur.cloud_cover ?? 0,
    precipitation: cur.precipitation ?? 0,
    precipitationProbability: daily?.precipitation_probability_max?.[0] ?? 0,
    
    sunrise: daily?.sunrise?.[0] || '',
    sunset: daily?.sunset?.[0] || '',
    
    aqi: typeof usAqi === 'number' ? Math.round(usAqi) : undefined,
    pm2_5: aqData?.current?.pm2_5,
    pm10: aqData?.current?.pm10,
    o3: aqData?.current?.ozone,
    no2: aqData?.current?.nitrogen_dioxide,
    so2: aqData?.current?.sulphur_dioxide,
    usAqiLevel: aqiLevelInfo?.level,
  };

  // Build hourly forecast (next 24 hours starting from current hour)
  const currentIsoHour = new Date().toISOString().slice(0, 13);
  let startIndex = hourly.time.findIndex((t: string) => t.startsWith(currentIsoHour));
  if (startIndex === -1) startIndex = 0;

  const hourlyItems: HourlyForecastItem[] = [];
  for (let i = startIndex; i < Math.min(startIndex + 24, hourly.time.length); i++) {
    const rawTime = hourly.time[i];
    const dateObj = new Date(rawTime);
    const formattedTime = dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const isD = hourly.is_day[i] === 1;
    const wInfo = getWmoWeatherInfo(hourly.weather_code[i], isD);

    hourlyItems.push({
      time: rawTime,
      formattedTime,
      temp: hourly.temperature_2m[i],
      feelsLike: hourly.apparent_temperature[i],
      humidity: hourly.relative_humidity_2m[i],
      weatherCode: hourly.weather_code[i],
      weatherDescription: wInfo.description,
      pop: hourly.precipitation_probability?.[i] ?? 0,
      windSpeed: hourly.wind_speed_10m[i],
      uvIndex: hourly.uv_index?.[i] ?? 0,
      isDay: isD,
    });
  }

  // Build 7-day daily forecast
  const dailyItems: DailyForecastItem[] = [];
  if (daily && daily.time) {
    for (let i = 0; i < Math.min(7, daily.time.length); i++) {
      const rawDate = daily.time[i];
      const dateObj = new Date(rawDate + 'T00:00:00');
      const isToday = i === 0;
      const dayName = isToday
        ? 'Today'
        : dateObj.toLocaleDateString([], { weekday: 'short' });
      const formattedDate = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
      const wInfo = getWmoWeatherInfo(daily.weather_code[i], true);

      dailyItems.push({
        date: rawDate,
        dayName,
        formattedDate,
        weatherCode: daily.weather_code[i],
        weatherDescription: wInfo.description,
        tempMax: daily.temperature_2m_max[i],
        tempMin: daily.temperature_2m_min[i],
        precipitationProbability: daily.precipitation_probability_max?.[i] ?? 0,
        precipitationSum: daily.precipitation_sum?.[i] ?? 0,
        windSpeedMax: daily.wind_speed_10m_max?.[i] ?? 0,
        uvIndexMax: daily.uv_index_max?.[i] ?? 0,
        sunrise: daily.sunrise?.[i] || '',
        sunset: daily.sunset?.[i] || '',
      });
    }
  }

  return {
    current,
    hourly: hourlyItems,
    daily: dailyItems,
    fetchedAt: Date.now(),
  };
}
