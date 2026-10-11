import React, { useState } from 'react';
import { RouteResult } from '../types';
import { Clock, Navigation, AlertTriangle, CheckCircle2, Zap, ArrowRight, ChevronDown, ChevronUp, Milestone, CornerUpLeft, CornerUpRight, RotateCcw, ArrowUp, Flag, MapPin, Compass } from 'lucide-react';

interface RouteDetailsPanelProps {
  activeRoute?: RouteResult;
  shortestRoute?: RouteResult;
  fastestRoute?: RouteResult;
  alternatives?: RouteResult[];
  reason?: string;
  warning?: string;
  dbPersisted?: boolean;
  routePreference: 'shortest' | 'fastest';
  setRoutePreference: (pref: 'shortest' | 'fastest') => void;
  onSelectRoute: (route: RouteResult) => void;
}

export const RouteDetailsPanel: React.FC<RouteDetailsPanelProps> = ({
  activeRoute,
  shortestRoute,
  fastestRoute,
  alternatives = [],
  reason,
  warning,
  dbPersisted,
  routePreference,
  setRoutePreference,
  onSelectRoute
}) => {
  const [showDirections, setShowDirections] = useState(true);

  if (!activeRoute) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3">
          <Navigation className="w-7 h-7 text-cyan-400 animate-pulse" />
        </div>
        <h3 className="text-base font-bold text-slate-200">No Route Selected</h3>
        <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
          Type start & destination locations in India and click &ldquo;Find Best Route&rdquo; to compute multi-objective graph paths.
        </p>
      </div>
    );
  }

  const distKm = (activeRoute.distance_m / 1000).toFixed(1);
  const timeMin = Math.round(activeRoute.travel_time_s / 60);
  const freeTimeMin = Math.round(activeRoute.free_flow_time_s / 60);
  const delayMin = Math.max(0, timeMin - freeTimeMin);

  const formattedTime = timeMin >= 60
    ? `${Math.floor(timeMin / 60)} hr ${timeMin % 60} min`
    : `${timeMin} min`;

  const getTrafficBadge = (level: string) => {
    switch (level) {
      case 'Severe':
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-500/15 text-rose-400 border border-rose-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            Severe Traffic
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1.5 bg-orange-500/15 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            High Traffic
          </span>
        );
      case 'Moderate':
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Moderate Traffic
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Low Traffic
          </span>
        );
    }
  };

  // Alternative candidates
  const otherCandidates = alternatives.filter(
    r => r.route_id !== activeRoute.route_id && Math.abs(r.distance_m - activeRoute.distance_m) > 10
  );

  return (
    <div className="flex flex-col gap-3.5 max-h-full overflow-y-auto pr-0.5">
      {/* 1. Preference Toggle Bar */}
      <div className="bg-slate-900/80 p-1 rounded-xl border border-white/[0.08] flex items-center shadow-inner">
        <button
          type="button"
          onClick={() => {
            setRoutePreference('shortest');
            if (shortestRoute) onSelectRoute(shortestRoute);
          }}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            routePreference === 'shortest'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Shortest Distance</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setRoutePreference('fastest');
            const target = fastestRoute || alternatives.find(a => a.is_fastest);
            if (target) onSelectRoute(target);
          }}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            routePreference === 'fastest'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Fastest (Traffic)</span>
        </button>
      </div>

      {/* 2. Primary Route Hero Card */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/[0.1] flex flex-col gap-3 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{activeRoute.is_shortest ? 'Shortest Route' : 'Optimal Best Route'}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1 tracking-tight">
              {formattedTime}
            </div>
          </div>
          <div>{getTrafficBadge(activeRoute.traffic_level)}</div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.08]">
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/[0.05]">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Distance</div>
            <div className="text-sm font-extrabold text-white mt-0.5">{distKm} <span className="text-[10px] text-slate-400 font-normal">km</span></div>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/[0.05]">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Free-flow</div>
            <div className="text-sm font-extrabold text-slate-200 mt-0.5">{freeTimeMin} <span className="text-[10px] text-slate-400 font-normal">min</span></div>
          </div>

          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/[0.05]">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Delay</div>
            <div className={`text-sm font-extrabold mt-0.5 ${delayMin > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              +{delayMin} <span className="text-[10px] text-slate-400 font-normal">min</span>
            </div>
          </div>
        </div>

        {/* Decision Rationale */}
        {reason && (
          <div className="text-xs text-slate-300 bg-slate-900/70 p-3 rounded-xl border border-white/[0.06] flex items-start gap-2 leading-relaxed">
            <span className="text-cyan-400 mt-0.5 font-bold">💡</span>
            <span>{reason}</span>
          </div>
        )}
      </div>

      {/* Warning banner if any */}
      {warning && (
        <div className="bg-amber-500/10 border border-amber-500/25 text-amber-300 p-3 rounded-xl text-xs flex items-start gap-2 shadow-sm">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{warning}</span>
        </div>
      )}

      {/* 3. Alternative Routes Section */}
      {otherCandidates.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Alternative Routes ({otherCandidates.length})
          </div>

          <div className="flex flex-col gap-2">
            {otherCandidates.map((alt, idx) => {
              const aDist = (alt.distance_m / 1000).toFixed(1);
              const aTime = Math.round(alt.travel_time_s / 60);
              const timeDiff = aTime - timeMin;

              return (
                <div
                  key={alt.route_id || idx}
                  onClick={() => onSelectRoute(alt)}
                  className="glass-card rounded-xl p-3.5 cursor-pointer flex items-center justify-between group hover:border-cyan-500/40"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {alt.name || `Route ${idx + 2}`}
                      </span>
                      {alt.is_fastest && (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Fastest
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{aTime} min</span>
                      <span>&bull;</span>
                      <span>{aDist} km</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="text-right text-[11px]">
                      {timeDiff < 0 ? (
                        <span className="text-emerald-400 font-bold">{Math.abs(timeDiff)} min faster</span>
                      ) : timeDiff > 0 ? (
                        <span className="text-slate-400">+{timeDiff} min</span>
                      ) : (
                        <span className="text-slate-400">Same time</span>
                      )}
                    </div>
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-800 text-slate-300 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shadow-sm">
                      Select
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Turn-by-Turn Road Directions */}
      {((activeRoute.instructions && activeRoute.instructions.length > 0) || (activeRoute.waypoints && activeRoute.waypoints.length > 0)) && (
        <div className="glass-panel rounded-xl overflow-hidden border border-white/[0.08] shadow-lg">
          <button
            type="button"
            onClick={() => setShowDirections(!showDirections)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white transition-colors bg-slate-900/40"
          >
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>
                Turn-by-Turn Road Directions ({activeRoute.instructions?.length || activeRoute.waypoints.length} steps)
              </span>
            </div>
            <div className="flex items-center gap-2 text-cyan-400 text-[11px] font-semibold">
              <span>{showDirections ? 'Hide Steps' : 'View Steps'}</span>
              {showDirections ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>

          {showDirections && (
            <div className="p-3 bg-slate-900/90 border-t border-white/[0.06] flex flex-col gap-2.5 max-h-72 overflow-y-auto">
              {activeRoute.instructions && activeRoute.instructions.length > 0 ? (
                activeRoute.instructions.map((inst, i) => {
                  const isDepart = inst.maneuver === 'DEPART' || inst.instructionType === 'LOCATION_DEPARTURE' || i === 0;
                  const isArrive = inst.maneuver === 'ARRIVE' || inst.instructionType === 'LOCATION_ARRIVAL' || i === activeRoute.instructions!.length - 1;
                  const isLeft = inst.maneuver?.includes('LEFT');
                  const isRight = inst.maneuver?.includes('RIGHT');
                  const isUturn = inst.maneuver?.includes('UTURN');
                  const isRoundabout = inst.maneuver?.includes('ROUNDABOUT');

                  // Distance on this segment before the next maneuver
                  const nextInst = activeRoute.instructions![i + 1];
                  const segDistM = nextInst ? Math.max(0, nextInst.routeOffsetInMeters - inst.routeOffsetInMeters) : 0;
                  const segDistFormatted = segDistM >= 1000 ? `${(segDistM / 1000).toFixed(1)} km` : `${segDistM} m`;

                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/80 border border-white/[0.05] hover:border-cyan-500/40 hover:bg-slate-900/60 transition-all shadow-sm"
                    >
                      {/* Turn Icon Badge */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-md ${
                        isDepart ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        isArrive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                        isUturn ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        isRoundabout ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' :
                        isLeft ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' :
                        isRight ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40' :
                        'bg-slate-800 text-slate-300 border border-white/[0.1]'
                      }`}>
                        {isDepart ? <MapPin className="w-4 h-4" /> :
                         isArrive ? <Flag className="w-4 h-4" /> :
                         isUturn ? <RotateCcw className="w-4 h-4 rotate-180" /> :
                         isRoundabout ? <RotateCcw className="w-4 h-4" /> :
                         isLeft ? <CornerUpLeft className="w-4 h-4" /> :
                         isRight ? <CornerUpRight className="w-4 h-4" /> :
                         <ArrowUp className="w-4 h-4" />}
                      </div>

                      {/* Direction Text, Distance & Badges */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-100 leading-snug">
                            {inst.message}
                          </span>
                          <span className="text-[10px] font-mono shrink-0 px-2 py-0.5 rounded-full font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                            {isDepart ? 'Start' : isArrive ? 'Arrive' : `Go ${segDistFormatted}`}
                          </span>
                        </div>

                        {/* Street & Road Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          {inst.street && (
                            <span className="text-[11px] font-medium text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                              <span className="truncate max-w-[200px]">{inst.street}</span>
                            </span>
                          )}

                          {inst.roadNumbers && inst.roadNumbers.map((rn, rIdx) => (
                            <span key={rIdx} className="text-[10px] font-bold text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30">
                              {rn}
                            </span>
                          ))}

                          {inst.roundaboutExitNumber && (
                            <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded border border-indigo-500/30">
                              Exit {inst.roundaboutExitNumber}
                            </span>
                          )}

                          {inst.signpostText && (
                            <span className="text-[10px] font-medium text-emerald-300 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/30">
                              ↗ {inst.signpostText}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Fallback waypoint turns */
                activeRoute.waypoints.map((wp, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-slate-200 p-2 rounded-xl bg-slate-950/70 border border-white/[0.04]">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 text-[11px] font-bold flex items-center justify-center shrink-0 border border-cyan-500/30">
                      {i + 1}
                    </span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-semibold truncate text-white">{wp.id || `Road Corridor Step #${i + 1}`}</span>
                      <span className="text-[10px] text-slate-400">Road Junction Checkpoint</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
