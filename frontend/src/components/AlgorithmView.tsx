import React from 'react';
import { RouteResult } from '../types';
import { Cpu, Sliders, CheckCircle, Zap, Activity } from 'lucide-react';

interface AlgorithmViewProps {
  bestRoute?: RouteResult; // computed by A*
  shortestRoute?: RouteResult; // computed by Dijkstra
  weights: { alpha: number; beta: number; gamma: number; delta: number };
  setWeights: React.Dispatch<React.SetStateAction<{ alpha: number; beta: number; gamma: number; delta: number }>>;
  onApplyWeights: () => void;
}

export const AlgorithmView: React.FC<AlgorithmViewProps> = ({
  bestRoute,
  shortestRoute,
  weights,
  setWeights,
  onApplyWeights
}) => {
  return (
    <div className="glass-panel rounded-2xl p-5 shadow-2xl border border-white/[0.08] flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Graph Routing Benchmark (A* vs Dijkstra)</span>
        </h3>
        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
          Real-time performance metrics computed natively by the C++17 routing engine on port 8080.
        </p>
      </div>

      {/* Algorithm Benchmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* A* Search Card */}
        <div className="bg-slate-900/80 border border-cyan-500/40 rounded-xl p-3.5 flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>A* Search (Optimal)</span>
            </span>
            <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border border-cyan-500/30">
              Heuristic
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-1">
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/[0.06]">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nodes Explored</div>
              <div className="text-base font-black text-white mt-0.5">{bestRoute?.nodes_expanded || 0}</div>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/[0.06]">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Runtime</div>
              <div className="text-base font-black text-emerald-400 mt-0.5">{bestRoute?.runtime_us || 0} <span className="text-[10px] text-slate-400 font-normal">µs</span></div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 leading-normal">
            Admissible Haversine distance heuristic guides priority queue towards destination.
          </div>
        </div>

        {/* Dijkstra Card */}
        <div className="bg-slate-900/80 border border-white/[0.08] rounded-xl p-3.5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dijkstra (Shortest)</span>
            </span>
            <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border border-slate-700">
              Uniform
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-1">
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/[0.06]">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nodes Explored</div>
              <div className="text-base font-black text-white mt-0.5">{shortestRoute?.nodes_expanded || 0}</div>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/[0.06]">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Runtime</div>
              <div className="text-base font-black text-emerald-400 mt-0.5">{shortestRoute?.runtime_us || 0} <span className="text-[10px] text-slate-400 font-normal">µs</span></div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 leading-normal">
            Binary min-heap priority queue expanding all reachable nodes uniformly by length.
          </div>
        </div>
      </div>

      {/* Cost Formula & Live Weight Sliders */}
      <div className="bg-slate-900/90 border border-white/[0.08] rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
          <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cost Weight Parameters</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
            <CheckCircle className="w-3 h-3" /> Live Graph Engine
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-300 bg-slate-950/80 p-2.5 rounded-xl border border-white/[0.06] text-center leading-relaxed">
          Cost(e) = <span className="text-cyan-400 font-bold">α</span>·Dist + <span className="text-cyan-300 font-bold">β</span>·Time + <span className="text-amber-400 font-bold">γ</span>·Traffic·Dist + <span className="text-rose-400 font-bold">δ</span>·RoadPenalty
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-1">
          {/* Alpha */}
          <div className="flex flex-col gap-1 bg-slate-950/40 p-2 rounded-lg border border-white/[0.04]">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>α (Distance Weight):</span>
              <span className="font-bold text-cyan-400 font-mono">{weights.alpha.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2.0"
              step="0.05"
              value={weights.alpha}
              onChange={(e) => setWeights({ ...weights, alpha: parseFloat(e.target.value) })}
              className="accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Beta */}
          <div className="flex flex-col gap-1 bg-slate-950/40 p-2 rounded-lg border border-white/[0.04]">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>β (Travel Time Weight):</span>
              <span className="font-bold text-cyan-400 font-mono">{weights.beta.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2.0"
              step="0.05"
              value={weights.beta}
              onChange={(e) => setWeights({ ...weights, beta: parseFloat(e.target.value) })}
              className="accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Gamma */}
          <div className="flex flex-col gap-1 bg-slate-950/40 p-2 rounded-lg border border-white/[0.04]">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>γ (Congestion Penalty):</span>
              <span className="font-bold text-amber-400 font-mono">{weights.gamma.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="3.0"
              step="0.1"
              value={weights.gamma}
              onChange={(e) => setWeights({ ...weights, gamma: parseFloat(e.target.value) })}
              className="accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Delta */}
          <div className="flex flex-col gap-1 bg-slate-950/40 p-2 rounded-lg border border-white/[0.04]">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>δ (Road Suitability):</span>
              <span className="font-bold text-rose-400 font-mono">{weights.delta.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2.0"
              step="0.05"
              value={weights.delta}
              onChange={(e) => setWeights({ ...weights, delta: parseFloat(e.target.value) })}
              className="accent-rose-500 cursor-pointer"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onApplyWeights}
          className="mt-1 py-2.5 px-4 shimmer-btn text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Apply Custom Weights & Re-optimize C++ Route</span>
        </button>
      </div>
    </div>
  );
};
