import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Compass, Loader2, X } from 'lucide-react';
import { LocationSearchResult, UnitSystem } from '../types/weather';
import { searchLocations } from '../services/weatherService';

interface NavbarProps {
  onSelectLocation: (loc: LocationSearchResult) => void;
  onUseCurrentLocation: () => void;
  isLoadingLocation: boolean;
  units: UnitSystem;
  onToggleUnits: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectLocation,
  onUseCurrentLocation,
  isLoadingLocation,
  units,
  onToggleUnits,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchLocations(query);
      setResults(res);
      setIsSearching(false);
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: LocationSearchResult) => {
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* App Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-sky-700 dark:from-white dark:via-slate-100 dark:to-sky-400 bg-clip-text text-transparent leading-tight">
              Summer-23
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
              Weather Telemetry
            </p>
          </div>
        </div>

        {/* Search Bar with Auto-complete */}
        <div className="relative flex-1 max-w-md" ref={dropdownRef}>
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              id="city-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setIsOpen(true)}
              placeholder="Search city or country (e.g., Tokyo, Sylhet, London)..."
              className="w-full pl-10 pr-9 py-2 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {isSearching && (
              <Loader2 className="absolute right-3 w-4 h-4 text-sky-500 animate-spin" />
            )}
          </div>

          {/* Search Suggestions Dropdown */}
          {isOpen && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 divide-y divide-slate-100 dark:divide-slate-700/50">
              {results.map((loc) => (
                <button
                  key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                  type="button"
                  onClick={() => handleSelect(loc)}
                  className="w-full text-left px-4 py-3 hover:bg-sky-50 dark:hover:bg-slate-700/60 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {loc.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    {loc.latitude.toFixed(1)}°, {loc.longitude.toFixed(1)}°
                  </span>
                </button>
              ))}
            </div>
          )}

          {isOpen && !isSearching && results.length === 0 && query.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-400">
              No matching city found.
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Geolocation Button */}
          <button
            type="button"
            id="use-my-location-button"
            onClick={onUseCurrentLocation}
            disabled={isLoadingLocation}
            title="Use current GPS location"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50 border border-sky-200 dark:border-sky-800/60 rounded-xl transition-all disabled:opacity-50"
          >
            {isLoadingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
            ) : (
              <MapPin className="w-4 h-4 text-sky-500" />
            )}
            <span className="hidden sm:inline">Location</span>
          </button>

          {/* Unit Toggle (°C / °F) */}
          <button
            type="button"
            id="unit-toggle-button"
            onClick={onToggleUnits}
            className="px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all"
            title={`Switch to ${units === 'metric' ? 'Imperial (°F)' : 'Metric (°C)'}`}
          >
            {units === 'metric' ? '°C' : '°F'}
          </button>
        </div>
      </div>
    </header>
  );
};
