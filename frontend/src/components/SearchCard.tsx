import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ArrowUpDown, Footprints, Car, Search, Crosshair, Loader2, Hash, Sparkles } from 'lucide-react';
import { TransportMode, LocationPoint } from '../types';
import { fetchAutocomplete } from '../api';

interface SearchCardProps {
  fromLocation: string;
  setFromLocation: (val: string) => void;
  toLocation: string;
  setToLocation: (val: string) => void;
  transportMode: TransportMode;
  setTransportMode: (mode: TransportMode) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const SearchCard: React.FC<SearchCardProps> = ({
  fromLocation,
  setFromLocation,
  toLocation,
  setToLocation,
  transportMode,
  setTransportMode,
  onSearch,
  isLoading
}) => {
  const [fromSuggestions, setFromSuggestions] = useState<LocationPoint[]>([]);
  const [toSuggestions, setToSuggestions] = useState<LocationPoint[]>([]);
  const [loadingFrom, setLoadingFrom] = useState(false);
  const [loadingTo, setLoadingTo] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [locating, setLocating] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  // Autocomplete debounce for "From"
  useEffect(() => {
    if (fromLocation.trim().length < 2) {
      setFromSuggestions([]);
      setLoadingFrom(false);
      return;
    }
    setLoadingFrom(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetchAutocomplete(fromLocation);
        setFromSuggestions(res);
      } catch (err) {
        setFromSuggestions([]);
      } finally {
        setLoadingFrom(false);
      }
    }, 180);
    return () => clearTimeout(timeout);
  }, [fromLocation]);

  // Autocomplete debounce for "To"
  useEffect(() => {
    if (toLocation.trim().length < 2) {
      setToSuggestions([]);
      setLoadingTo(false);
      return;
    }
    setLoadingTo(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetchAutocomplete(toLocation);
        setToSuggestions(res);
      } catch (err) {
        setToSuggestions([]);
      } finally {
        setLoadingTo(false);
      }
    }, 180);
    return () => clearTimeout(timeout);
  }, [toLocation]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) {
        setShowFromDropdown(false);
      }
      if (toRef.current && !toRef.current.contains(e.target as Node)) {
        setShowToDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 300);
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        if (lat < 6.0 || lat > 38.5 || lon < 68.0 || lon > 98.5) {
          alert('Current location detected is outside India. Please type an Indian location.');
          setLocating(false);
          return;
        }
        setFromLocation(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
        setLocating(false);
      },
      () => {
        alert('Could not access current location. Please type an Indian place or PIN code.');
        setLocating(false);
      }
    );
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/[0.09] flex flex-col gap-4 relative z-30 shadow-2xl">
      {/* Header Info Tag */}
      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 bg-slate-900/70 px-3.5 py-1.5 rounded-xl border border-white/[0.06]">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <span className="text-sm">🇮🇳</span>
          <span>India Nationwide</span>
        </div>
        <span className="text-slate-400 text-[10px] font-medium">All States, Cities & PIN Codes</span>
      </div>

      {/* Mode Selector Tabs (Walk & Car) */}
      <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/[0.06] shadow-inner">
        <button
          type="button"
          onClick={() => setTransportMode('walking')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
            transportMode === 'walking'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
          }`}
        >
          <Footprints className="w-4 h-4" />
          <span>Walk</span>
        </button>

        <button
          type="button"
          onClick={() => setTransportMode('car')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
            transportMode === 'car'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Car</span>
        </button>
      </div>

      {/* From Input */}
      <div className="relative" ref={fromRef}>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
          <label className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
            Start Location in India
          </label>
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
          >
            {locating ? <Loader2 className="w-3 h-3 animate-spin text-cyan-400" /> : <Crosshair className="w-3 h-3" />}
            <span>Use my location</span>
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={fromLocation}
            onChange={(e) => {
              setFromLocation(e.target.value);
              setShowFromDropdown(true);
            }}
            onFocus={() => setShowFromDropdown(true)}
            placeholder="Type any landmark or PIN code (e.g. Charminar, Connaught Place)"
            className="w-full bg-slate-900/90 border border-white/[0.08] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-xs sm:text-sm text-slate-100 rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-slate-500"
          />
          {loadingFrom && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          )}
        </div>

        {/* From Suggestions Dropdown */}
        {showFromDropdown && fromLocation.trim().length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900/95 backdrop-blur-xl border border-white/[0.12] rounded-xl shadow-2xl z-[9999] max-h-56 overflow-y-auto">
            {fromSuggestions.length > 0 ? (
              fromSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setFromLocation(item.name || `${item.lat}, ${item.lon}`);
                    setShowFromDropdown(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-200 flex items-center gap-2.5 border-b border-white/[0.04] last:border-0 transition-colors"
                >
                  {/^\d+/.test(item.name || '') ? (
                    <Hash className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                  <span className="truncate font-medium">{item.name}</span>
                </button>
              ))
            ) : !loadingFrom ? (
              <div className="px-3.5 py-2.5 text-xs text-slate-400">No matching places or PIN codes found in India.</div>
            ) : null}
          </div>
        )}
      </div>

      {/* Floating Swap Button */}
      <div className="flex justify-center -my-2.5 z-10">
        <button
          type="button"
          onClick={handleSwap}
          title="Swap Start and Destination"
          className={`p-2 rounded-full bg-slate-900 border border-white/[0.12] text-slate-300 hover:text-slate-950 hover:bg-cyan-400 transition-all duration-300 shadow-md ${
            isSwapping ? 'rotate-180 scale-110' : 'hover:scale-105'
          }`}
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Destination Input */}
      <div className="relative" ref={toRef}>
        <label className="text-xs font-semibold text-rose-400 mb-1.5 flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-rose-400 shadow-sm shadow-rose-400/50"></span>
          Destination in India
        </label>

        <div className="relative">
          <input
            type="text"
            value={toLocation}
            onChange={(e) => {
              setToLocation(e.target.value);
              setShowToDropdown(true);
            }}
            onFocus={() => setShowToDropdown(true)}
            placeholder="Type destination (e.g. Marina Beach, Mumbai Airport)"
            className="w-full bg-slate-900/90 border border-white/[0.08] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-xs sm:text-sm text-slate-100 rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-slate-500"
          />
          {loadingTo && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          )}
        </div>

        {/* To Suggestions Dropdown */}
        {showToDropdown && toLocation.trim().length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900/95 backdrop-blur-xl border border-white/[0.12] rounded-xl shadow-2xl z-[9999] max-h-56 overflow-y-auto">
            {toSuggestions.length > 0 ? (
              toSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setToLocation(item.name || `${item.lat}, ${item.lon}`);
                    setShowToDropdown(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-200 flex items-center gap-2.5 border-b border-white/[0.04] last:border-0 transition-colors"
                >
                  {/^\d+/.test(item.name || '') ? (
                    <Hash className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  )}
                  <span className="truncate font-medium">{item.name}</span>
                </button>
              ))
            ) : !loadingTo ? (
              <div className="px-3.5 py-2.5 text-xs text-slate-400">No matching destination found.</div>
            ) : null}
          </div>
        )}
      </div>

      {/* Find Best Route Button */}
      <button
        type="button"
        onClick={onSearch}
        disabled={isLoading}
        className="w-full mt-1 py-3 px-4 shimmer-btn text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Calculating Graph Routes...</span>
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            <span>Find Best Route</span>
          </>
        )}
      </button>
    </div>
  );
};
