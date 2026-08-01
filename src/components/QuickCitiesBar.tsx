import React from 'react';
import { LocationSearchResult } from '../types/weather';

interface QuickCitiesBarProps {
  currentCityName: string;
  onSelectCity: (city: LocationSearchResult) => void;
}

const POPULAR_CITIES: LocationSearchResult[] = [
  { id: 201, name: 'Sylhet', latitude: 24.8949, longitude: 91.8687, country: 'Bangladesh', country_code: 'BD', admin1: 'Sylhet Division' },
  { id: 101, name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan', country_code: 'JP' },
  { id: 102, name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom', country_code: 'GB' },
  { id: 103, name: 'New York', latitude: 40.7128, longitude: -74.006, country: 'United States', country_code: 'US' },
  { id: 104, name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France', country_code: 'FR' },
  { id: 105, name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'Australia', country_code: 'AU' },
  { id: 106, name: 'Dubai', latitude: 25.2048, longitude: 55.2708, country: 'United Arab Emirates', country_code: 'AE' },
  { id: 107, name: 'Singapore', latitude: 1.3521, longitude: 103.8198, country: 'Singapore', country_code: 'SG' },
];

export const QuickCitiesBar: React.FC<QuickCitiesBarProps> = ({ currentCityName, onSelectCity }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar py-2">
      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-1">
        Popular:
      </span>
      {POPULAR_CITIES.map((city) => {
        const isSelected = currentCityName.toLowerCase() === city.name.toLowerCase();
        return (
          <button
            key={city.id}
            type="button"
            onClick={() => onSelectCity(city)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full shrink-0 transition-all border ${
              isSelected
                ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-500/30'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:border-sky-300 dark:hover:border-sky-600 hover:text-sky-600 dark:hover:text-sky-300'
            }`}
          >
            {city.name}
          </button>
        );
      })}
    </div>
  );
};
