import React from 'react';
import { ModeComparisonItem, TransportMode } from '../types';
import { Footprints, Car, ArrowRight, Check } from 'lucide-react';

interface CompareModesViewProps {
  comparisonList: ModeComparisonItem[];
  activeMode: TransportMode;
  onSelectMode: (mode: TransportMode) => void;
  isLoading: boolean;
}

export const CompareModesView: React.FC<CompareModesViewProps> = ({
  comparisonList,
  activeMode,
  onSelectMode,
  isLoading
}) => {
  const getModeIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'walking': return <Footprints className="w-4 h-4 text-emerald-400" />;
      case 'car': 
      default:
        return <Car className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 shadow-2xl border border-white/[0.08] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-white">Transport Mode Comparison</h3>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            Multi-modal evaluation comparing Walking and Car routes using multi-objective graph scoring.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-slate-400 text-xs animate-pulse flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Computing parallel graph optimizations for Walking & Car...</span>
        </div>
      ) : comparisonList.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          Click &ldquo;Compare Modes&rdquo; to analyze routes across all transport modes simultaneously.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400 font-bold bg-slate-900/60 text-[11px] uppercase tracking-wider">
                <th className="p-3 rounded-l-xl">Mode</th>
                <th className="p-3">Distance</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Traffic</th>
                <th className="p-3">Cost</th>
                <th className="p-3 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {comparisonList.map((item, idx) => {
                const isSelected = item.mode === activeMode;
                return (
                  <tr
                    key={idx}
                    className={`border-b border-white/[0.04] transition-colors ${
                      isSelected ? 'bg-cyan-500/15 font-semibold text-white' : 'text-slate-300 hover:bg-white/[0.02]'
                    }`}
                  >
                    <td className="p-3 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 border border-white/[0.08] flex items-center justify-center">
                        {getModeIcon(item.mode)}
                      </div>
                      <span className="font-bold">{item.mode_label || item.mode}</span>
                    </td>
                    <td className="p-3 font-mono">{item.distance_km} km</td>
                    <td className="p-3 font-mono">{item.travel_time_min} min</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.traffic_level === 'Severe'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : item.traffic_level === 'High'
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : item.traffic_level === 'Moderate'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {item.traffic_level}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-cyan-400 font-bold">{item.cost.toFixed(2)}</td>
                    <td className="p-3">
                      {isSelected ? (
                        <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSelectMode(item.mode)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 rounded-lg transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                        >
                          <span>Select</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
