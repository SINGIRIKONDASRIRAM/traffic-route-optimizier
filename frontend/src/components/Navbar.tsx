import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navigation, LayoutDashboard, History, Cpu, Sparkles } from 'lucide-react';

interface NavbarProps {
  engineOnline?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ engineOnline = true }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/[0.08] px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3.5">
        <div className="relative group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-teal-300 p-[1px] shadow-lg shadow-cyan-500/25 transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-slate-950/80 rounded-[15px] flex items-center justify-center backdrop-blur-sm">
              <Navigation className="w-5 h-5 text-cyan-400 transform -rotate-45" />
            </div>
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75"></span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Traffic Route Optimizer
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
              <Sparkles className="w-2.5 h-2.5" />
              v2.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
            Multi-Objective C++17 Graph Routing &bull; Dijkstra &bull; A* Search
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/60 border border-white/[0.06] backdrop-blur-md">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`
          }
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Planner</span>
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`
          }
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Dashboard</span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`
          }
        >
          <History className="w-3.5 h-3.5" />
          <span className="hidden md:inline">History</span>
        </NavLink>
      </nav>

      {/* Engine Status Indicator */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 bg-slate-900/80 border border-white/[0.08] px-3 py-1.5 rounded-2xl text-xs font-semibold shadow-inner">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden lg:inline text-slate-400">Engine:</span>
          {engineOnline ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              C++ 8080
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Fallback
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
