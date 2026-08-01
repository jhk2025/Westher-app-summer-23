import React from 'react';
import { Droplets, Sun, Wind, Navigation } from 'lucide-react';
import { CurrentWeatherData, UnitSystem } from '../types/weather';
import {
  convertWindSpeed,
  getUvIndexInfo,
  getWindDirectionText,
} from '../services/weatherService';

interface MetricsGridProps {
  weather: CurrentWeatherData;
  units: UnitSystem;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ weather, units }) => {
  // Humidity level info
  const humidityLevel =
    weather.humidity < 30
      ? { label: 'Dry Air', color: 'text-amber-500', barBg: 'bg-amber-500' }
      : weather.humidity <= 60
      ? { label: 'Comfortable', color: 'text-emerald-500', barBg: 'bg-emerald-500' }
      : weather.humidity <= 80
      ? { label: 'Humid', color: 'text-sky-500', barBg: 'bg-sky-500' }
      : { label: 'Very Humid', color: 'text-indigo-500', barBg: 'bg-indigo-500' };

  // UV Info
  const uvInfo = getUvIndexInfo(weather.uvIndex);

  // Air Speed / Wind Info
  const windInfo = convertWindSpeed(weather.windSpeed, units);
  const windDirText = getWindDirectionText(weather.windDirection);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. HUMIDITY CARD */}
      <div id="metric-humidity-card" className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Humidity
              </span>
              <span className={`text-xs font-bold ${humidityLevel.color}`}>
                {humidityLevel.label}
              </span>
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
            {weather.humidity}%
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden my-2">
          <div
            className={`h-full ${humidityLevel.barBg} transition-all duration-500 rounded-full`}
            style={{ width: `${Math.min(100, Math.max(0, weather.humidity))}%` }}
          />
        </div>
      </div>

      {/* 2. UV INDEX CARD */}
      <div id="metric-uv-card" className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                UV Index
              </span>
              <span className={`text-xs font-bold ${uvInfo.textColor}`}>
                {uvInfo.level} Risk
              </span>
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
            {weather.uvIndex.toFixed(1)}
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden my-2">
          <div
            className={`h-full ${uvInfo.color} transition-all duration-500 rounded-full`}
            style={{ width: `${Math.min(100, (weather.uvIndex / 12) * 100)}%` }}
          />
        </div>
      </div>

      {/* 3. AIR SPEED (WIND SPEED) CARD */}
      <div id="metric-airspeed-card" className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Air Speed
              </span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {windDirText} ({weather.windDirection}°)
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {windInfo.value}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">
              {windInfo.unit}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
          <span className="flex items-center gap-1">
            <Navigation
              className="w-3.5 h-3.5 text-indigo-500"
              style={{ transform: `rotate(${weather.windDirection}deg)` }}
            />
            Direction: {windDirText}
          </span>
        </div>
      </div>
    </div>
  );
};
