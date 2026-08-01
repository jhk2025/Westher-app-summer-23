export type UnitSystem = 'metric' | 'imperial';

export interface LocationSearchResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

export interface CurrentWeatherData {
  cityName: string;
  country: string;
  countryCode: string;
  region?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  weatherCode: number;
  weatherDescription: string;
  isDay: boolean;
  
  // Specific requested metrics
  humidity: number; // %
  dewPoint: number; // °C
  uvIndex: number; // 0-11+
  windSpeed: number; // km/h or mph
  windDirection: number; // degrees 0-360
  windGusts: number;
  
  // Additional metrics
  pressure: number; // hPa
  visibility: number; // meters or km
  cloudCover: number; // %
  precipitation: number; // mm
  precipitationProbability: number; // %
  
  // Sun & Moon
  sunrise: string; // ISO string or time string
  sunset: string;
  
  // Air Quality
  aqi?: number; // US AQI
  pm2_5?: number;
  pm10?: number;
  o3?: number;
  no2?: number;
  so2?: number;
  usAqiLevel?: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
}

export interface HourlyForecastItem {
  time: string; // ISO
  formattedTime: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  weatherCode: number;
  weatherDescription: string;
  pop: number; // probability of precipitation %
  windSpeed: number;
  uvIndex: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string; // ISO string
  dayName: string;
  formattedDate: string;
  weatherCode: number;
  weatherDescription: string;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherDataBundle {
  current: CurrentWeatherData;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  fetchedAt: number;
}

export interface AiWeatherInsight {
  summary: string;
  outfitSuggestion: string;
  outdoorActivities: {
    activity: string;
    score: number; // 1-10
    reason: string;
  }[];
  healthTip: string;
  funFactOrCaution?: string;
}
