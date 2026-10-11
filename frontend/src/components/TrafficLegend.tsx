import React from 'react';

export const TrafficLegend: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl px-4 py-2 text-xs font-semibold text-slate-200 border border-white/[0.1] shadow-2xl flex items-center gap-3.5 backdrop-blur-xl">
      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Traffic Flow</span>
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
        <span className="text-slate-300 font-medium">Low</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50"></span>
        <span className="text-slate-300 font-medium">Moderate</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shadow-sm shadow-orange-400/50"></span>
        <span className="text-slate-300 font-medium">High</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
        <span className="text-slate-300 font-medium">Severe</span>
      </div>
    </div>
  );
};
