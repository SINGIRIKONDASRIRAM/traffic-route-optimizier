import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHistory, toggleSaveRoute, deleteHistoryItem } from '../api';
import { SavedRouteItem } from '../types';
import { Search, Bookmark, Trash2, RotateCcw, Footprints, Car, ArrowRight } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [items, setItems] = useState<SavedRouteItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await fetchHistory(50);
      setItems(data);
    } catch (e) {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleToggleSave = async (item: SavedRouteItem) => {
    const newState = !item.is_saved;
    setItems(items.map(i => i.id === item.id ? { ...i, is_saved: newState } : i));
    await toggleSaveRoute(item.id, newState);
  };

  const handleDelete = async (id: string) => {
    setItems(items.filter(i => i.id !== id));
    await deleteHistoryItem(id);
  };

  const handleRerun = (item: SavedRouteItem) => {
    navigate('/', {
      state: {
        from: item.start_location,
        to: item.destination,
        mode: item.transport_mode
      }
    });
  };

  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.start_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transport_mode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSaved = filterSavedOnly ? item.is_saved : true;
    return matchesSearch && matchesSaved;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Route Optimization History</h2>
          <p className="text-xs text-slate-400 mt-0.5">Review past calculated graph routes, favorite saved routes, and re-run optimizations.</p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by city or street..."
              className="bg-white/5 border border-white/10 text-xs text-white rounded-xl pl-9 pr-3 py-2 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 w-52 placeholder-slate-500 transition-all"
            />
          </div>

          <button
            type="button"
            onClick={() => setFilterSavedOnly(!filterSavedOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              filterSavedOnly
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm shadow-amber-500/20'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${filterSavedOnly ? 'fill-current' : ''}`} />
            <span>Saved Favorites</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin mb-3" />
          <span className="text-xs font-medium text-slate-400">Loading route history entries...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center text-slate-400 text-sm border border-white/10">
          <Bookmark className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <div className="font-semibold text-slate-300">No route history records found</div>
          <div className="text-xs text-slate-500 mt-1">Plan a new route from the Planner to log optimizations here.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col justify-between gap-3 hover:border-cyan-500/30 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-300">
                    {item.transport_mode === 'walking' ? (
                      <><Footprints className="w-3 h-3 text-emerald-400" /> Walking</>
                    ) : (
                      <><Car className="w-3 h-3 text-cyan-400" /> Car</>
                    )}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleSave(item)}
                      title={item.is_saved ? 'Unsave Route' : 'Save Favorite Route'}
                      className={`p-1.5 rounded-lg transition-all ${
                        item.is_saved ? 'text-amber-400 bg-amber-500/20' : 'text-slate-500 hover:text-amber-400 hover:bg-white/5'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      title="Delete History Item"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 pl-1 border-l-2 border-cyan-500/30">
                  <div className="text-xs font-bold text-white leading-snug pl-2 truncate">{item.start_location}</div>
                  <div className="text-xs font-bold text-slate-300 leading-snug pl-2 truncate">{item.destination}</div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-3 flex items-center justify-between text-xs text-slate-400">
                <div className="font-mono">
                  <span className="font-bold text-white">{Math.round(item.travel_time_s / 60)} min</span>
                  <span className="mx-1.5 text-slate-600">•</span>
                  <span>{(item.distance_m / 1000).toFixed(1)} km</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRerun(item)}
                  className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all group-hover:border-cyan-500/50"
                >
                  <RotateCcw className="w-3 h-3" /> Re-run
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

