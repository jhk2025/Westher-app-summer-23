import React from 'react';
import {
  Sun,
  SunDim,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudHail,
  CloudLightning,
  Snowflake,
  RefreshCw,
  Calendar,
  Clock,
  Thermometer,
} from 'lucide-react';
import { CurrentWeatherData, UnitSystem } from '../types/weather';
import { convertTemperature } from '../services/weatherService';

interface CurrentWeatherCardProps {
  weather: CurrentWeatherData;
  units: UnitSystem;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const getWeatherIconComponent = (iconName: string, className = 'w-12 h-12') => {
  switch (iconName) {
    case 'Sun':
      return <Sun className={`${className} text-amber-400 animate-spin-slow`} />;
    case 'SunDim':
      return <SunDim className={`${className} text-amber-300`} />;
    case 'Moon':
      return <Moon className={`${className} text-indigo-300`} />;
    case 'CloudSun':
      return <CloudSun className={`${className} text-sky-400`} />;
    case 'CloudMoon':
      return <CloudMoon className={`${className} text-indigo-400`} />;
    case 'Cloud':
      return <Cloud className={`${className} text-slate-400`} />;
    case 'CloudFog':
      return <CloudFog className={`${className} text-slate-300`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`${className} text-blue-400`} />;
    case 'CloudRain':
      return <CloudRain className={`${className} text-blue-500`} />;
    case 'CloudRainWind':
      return <CloudRainWind className={`${className} text-indigo-500`} />;
    case 'CloudHail':
      return <CloudHail className={`${className} text-teal-400`} />;
    case 'CloudSnow':
      return <CloudSnow className={`${className} text-sky-200`} />;
    case 'Snowflake':
      return <Snowflake className={`${className} text-sky-300`} />;
    case 'CloudLightning':
      return <CloudLightning className={`${className} text-yellow-400`} />;
    default:
      return <Cloud className={`${className} text-slate-400`} />;
  }
};

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  units,
  onRefresh,
  isRefreshing,
}) => {
  const displayTemp = convertTemperature(weather.temperature, units);
  const displayFeelsLike = convertTemperature(weather.feelsLike, units);

  // Determine dynamic backdrop gradient
  let backdropBg = 'from-sky-500 via-blue-600 to-indigo-700 text-white';
  if (!weather.isDay) {
    backdropBg = 'from-slate-900 via-indigo-950 to-slate-900 text-slate-100';
  } else if (weather.weatherCode >= 95) {
    backdropBg = 'from-slate-800 via-purple-900 to-slate-900 text-white';
  } else if (weather.weatherCode >= 61) {
    backdropBg = 'from-slate-700 via-blue-800 to-slate-900 text-white';
  } else if (weather.weatherCode >= 71) {
    backdropBg = 'from-blue-600 via-sky-700 to-indigo-900 text-white';
  } else if (weather.weatherCode === 0) {
    backdropBg = 'from-amber-500 via-sky-500 to-blue-600 text-white';
  }

  // Format local date and time
  const now = new Date();
  const dateStr = now.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div
      id="current-weather-card"
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${backdropBg} shadow-2xl transition-all duration-500`}
    >
      {/* Background Decorative Rings */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar: Location & Action Buttons */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="city-name-heading" className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {weather.cityName}
            </h2>
            {weather.countryCode && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md uppercase tracking-wide">
                {weather.countryCode}
              </span>
            )}
          </div>
          {weather.country && (
            <p className="text-sm font-medium opacity-90 mt-0.5">
              {[weather.region, weather.country].filter(Boolean).join(', ')}
            </p>
          )}

          <div className="flex items-center gap-4 mt-2 text-xs font-medium opacity-80">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {dateStr}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {timeStr}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            type="button"
            id="refresh-weather-button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 transition-all text-white disabled:opacity-50"
            title="Refresh Live Weather"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Temperature & Weather Display */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-6 pt-2">
        {/* Left Column: Temperature & Weather Tag */}
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-3">
            {getWeatherIconComponent(
              weather.isDay ? 'Sun' : 'Moon',
              'w-4 h-4'
            )}
            <span className="text-sm font-semibold tracking-wide">
              {weather.weatherDescription}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span id="temperature-display" className="text-6xl sm:text-8xl font-black tracking-tight leading-none">
              {displayTemp}°
            </span>
            <span className="text-xl sm:text-2xl font-bold opacity-80">
              {units === 'metric' ? 'C' : 'F'}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm font-medium opacity-90">
            <span className="flex items-center gap-1">
              <Thermometer className="w-4 h-4 opacity-80" />
              Feels like <strong className="font-bold">{displayFeelsLike}°</strong>
            </span>
          </div>
        </div>

        {/* Right Column: Dynamic Weather Visual Icon */}
        <div className="flex flex-col items-center md:items-end justify-center">
          <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col items-center justify-center text-center shadow-lg">
            {getWeatherIconComponent(
              weather.weatherDescription.includes('Clear')
                ? weather.isDay
                  ? 'Sun'
                  : 'Moon'
                : weather.weatherDescription.includes('Rain')
                ? 'CloudRain'
                : weather.weatherDescription.includes('Thunderstorm')
                ? 'CloudLightning'
                : weather.weatherDescription.includes('Snow')
                ? 'CloudSnow'
                : 'Cloud',
              'w-20 h-20 sm:w-24 sm:h-24'
            )}
            <p className="mt-2 text-xs font-medium tracking-wider uppercase opacity-80">
              {weather.isDay ? 'Daytime' : 'Nighttime'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
