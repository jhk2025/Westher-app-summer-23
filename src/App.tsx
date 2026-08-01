import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { QuickCitiesBar } from './components/QuickCitiesBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { MetricsGrid } from './components/MetricsGrid';
import {
  LocationSearchResult,
  UnitSystem,
  WeatherDataBundle,
} from './types/weather';
import {
  fetchWeatherData,
  reverseGeocode,
} from './services/weatherService';
import { Cloud, AlertTriangle } from 'lucide-react';

const DEFAULT_CITY: LocationSearchResult = {
  id: 201,
  name: 'Sylhet',
  latitude: 24.8949,
  longitude: 91.8687,
  country: 'Bangladesh',
  country_code: 'BD',
  admin1: 'Sylhet Division',
};

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<LocationSearchResult>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<WeatherDataBundle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingGps, setIsLoadingGps] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Units state
  const [units, setUnits] = useState<UnitSystem>(() => {
    return (localStorage.getItem('aerocast_units') as UnitSystem) || 'metric';
  });

  // Persist units
  useEffect(() => {
    localStorage.setItem('aerocast_units', units);
  }, [units]);

  // Fetch weather data function
  const loadWeather = useCallback(
    async (loc: LocationSearchResult, showFullLoading = true) => {
      if (showFullLoading) setIsLoading(true);
      else setIsRefreshing(true);
      setErrorMsg(null);

      try {
        const bundle = await fetchWeatherData(loc.latitude, loc.longitude, {
          name: loc.name,
          country: loc.country,
          countryCode: loc.country_code,
          region: loc.admin1,
        });

        setWeatherData(bundle);
        setCurrentLocation(loc);
      } catch (err: any) {
        console.error('Failed to load weather:', err);
        setErrorMsg(err.message || 'Failed to retrieve live weather data');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  // Load weather on initial mount
  useEffect(() => {
    loadWeather(DEFAULT_CITY);
  }, [loadWeather]);

  // Use GPS location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoadingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const rev = await reverseGeocode(lat, lon);
          const gpsLoc: LocationSearchResult = {
            id: Date.now(),
            name: rev.name,
            latitude: lat,
            longitude: lon,
            country: rev.country,
            country_code: rev.countryCode,
          };
          await loadWeather(gpsLoc);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoadingGps(false);
        }
      },
      (err) => {
        console.warn('Geolocation permission denied or error:', err);
        setIsLoadingGps(false);
        setErrorMsg('Unable to retrieve current GPS location. Please check browser permissions.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        onSelectLocation={(loc) => loadWeather(loc)}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLoadingLocation={isLoadingGps}
        units={units}
        onToggleUnits={() => setUnits((u) => (u === 'metric' ? 'imperial' : 'metric'))}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Quick City Selector */}
        <QuickCitiesBar
          currentCityName={currentLocation.name}
          onSelectCity={(city) => loadWeather(city)}
        />

        {/* Error Banner if any */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => loadWeather(currentLocation)}
              className="px-3 py-1 rounded-xl bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 font-bold text-xs hover:bg-rose-200 transition-colors shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-sky-200 dark:border-sky-900 border-t-sky-500 animate-spin" />
              <Cloud className="w-6 h-6 text-sky-500 absolute inset-0 m-auto" />
            </div>
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
              Loading weather data for {currentLocation.name}...
            </p>
          </div>
        ) : weatherData ? (
          <div className="space-y-6 animate-fadeIn">
            {/* 1. City Name & Temperature Card */}
            <CurrentWeatherCard
              weather={weatherData.current}
              units={units}
              onRefresh={() => loadWeather(currentLocation, false)}
              isRefreshing={isRefreshing}
            />

            {/* 2. Core Metrics: Humidity, UV Index, Air Speed */}
            <MetricsGrid weather={weatherData.current} units={units} />
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-6 mt-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
          Summer-23 • Live Weather Telemetry
        </div>
      </footer>
    </div>
  );
}
